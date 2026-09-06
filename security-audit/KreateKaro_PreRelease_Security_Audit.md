# KreateKaro Pre Release Security Audit

**Date:** 6 September 2026 (Asia/Calcutta). **Baseline:** commit `366f89f` with a clean tracked working tree. **Assessment:** authorized AI-assisted focused pre-release review. **Target:** https://www.kreatekaro.co/ and the available local repository.

## 1. Executive summary

**RED — DO NOT PUBLICLY RELEASE YET.** Based on these three focused audits, KreateKaro / 3DM is not yet reasonably safe for an initial public release. The original application contained three High-severity findings: weak password storage, executable SVG previews, and unsafe Google account merging. Password storage remains open. The SVG fix passes a local component regression; OAuth fixes pass synthetic tests but require real staging-provider verification. No changes were deployed or committed.

The audit recorded **0 Critical, 3 High, 6 Medium and 3 Low application findings**. Of 12 findings, **3 are FIXED AND VERIFIED locally, 2 are FIXED BUT NEED MANUAL VERIFICATION, and 7 are OPEN**. Nine findings are therefore not fully closed if pending manual verification is included. Original severities are retained after fixes. There are no accepted/deferred or false-positive entries in the counted findings table.

Ownership checks are a positive result: actual handler SQL denied cross-user read/update/rename/delete and did not trust browser-supplied user_id. This does not remove the account security risks. Package-scanner severities are listed separately and are not counted as confirmed deployed vulnerabilities.

## 2. Scope

Reviewed authentication, sessions, Google OAuth, email verification, cloud-design APIs, browser imports/storage, source/configuration, package manifest and pnpm lockfile, available Git history and public response headers. The repository has 84 reachable commits. Pattern scanning inspected 810 current/historical/build text objects; exclusions and limitations are below.

Only two controlled public GET requests were performed directly: `/` and `/api/auth/me`, at approximately 06:08 UTC. An earlier web-fetch attempt failed. Public auth/me returned `200 {"user":null}`. No real account was created, accessed or modified. Google and email APIs were not sent test traffic. No destructive requests, load tests or malicious parser bombs were executed. External documentation/advisory lookups were read-only research.

## 3. Architecture and security context

The implementation is a Vite-built React SPA with TanStack Router, Konva and BabylonJS/Three-related libraries. Cloudflare Pages serves `dist`; Pages Functions under `functions/api` implement authentication and D1-backed storage. Documentation mentions TanStack Start, but the checked build is a client Vite build, not evidence of a separate Node SSR service.

Trust boundaries:

1. Untrusted browser requests and imported files cross into Functions and the client renderer respectively.
2. The session cookie is resolved server-side through D1 before cloud-design access.
3. D1 stores users, sessions, OTP codes and JSON design documents. Browser user IDs are not trusted for ownership.
4. Google token/user-info responses supply identity; matching an email is not proof of control of an existing local account.
5. Resend accepts outbound verification messages. Its response is currently ignored by registration, so delivery failure can strand an account.
6. localStorage and IndexedDB belong to the browser profile, not automatically to a signed-in account.
7. Build/development packages run on developer/CI machines; their advisories are not automatically reachable through Workers.

| Component | Implementation and observed behavior |
|---|---|
| Auth utilities | `functions/_auth-utils.ts`; password digest, UUID sessions, cookies, JSON helper, email sender |
| Register | `POST /api/auth/register`; creates unverified password user and verification OTP |
| Login | `POST /api/auth/login`; password and email_verified checks, new random session |
| Verification | `GET /api/auth/verify-otp?email=&code=`; ten-minute intended lifetime, used flag |
| Current account and logout | `GET /api/auth/me`, `DELETE /api/auth/me`; server lookup and session deletion |
| Google | `GET /api/auth/google`; OAuth initiation/callback, token exchange, user-info, session |
| Cloud design collection | `GET/POST /api/designs`; owned list/create, ten-design count check |
| Cloud design item | `GET/PUT/DELETE /api/designs/[id]`; every query binds authenticated user ID |
| Password reset/resend | No implemented route or frontend recovery flow located; schema/helper comments alone do not establish functionality |
| Custom models | `editor.tsx`, `Sidebar.tsx`, `customAssetDB.ts`, `Preview3D.tsx`; browser files -> IndexedDB/blob URLs -> loader |
| Design import/export | `editor.tsx`; JSON import and local/GLB export; `reportGenerator.ts` uses document library APIs |
| Configuration | `wrangler.toml`, `vite.config.ts`, `public/_headers`, `public/_redirects`, `.gitignore` |

No server upload/conversion endpoint was located. fbx2gltf, obj2gltf and gltf-pipeline are declared packages, not evidence of an internet-accessible converter. Script searches found no request-derived child-process execution. `sharp` and `puppeteer` are development dependencies. Browser asset/texture URLs can cause client-side external requests; no server-side request forgery path was identified in these handlers.

## 4. Methodology and evidence

Read all current Functions handlers and shared utilities, schema, auth client, configuration, storage and relevant import/render paths. Searched sources for SQL, dynamic evaluation, HTML sinks, process creation, environment access, browser storage and external fetches. Reviewed manifest/lockfile and pattern-scanned reachable historical text blobs without emitting secret values.

`security-audit/security.test.ts` imports real Functions and executes their actual SQL through Node SQLite with a small D1 API adapter. It is not a live D1 integration test: Cloudflare transaction/isolate semantics and deployment middleware are not reproduced. Google fetches are mocked. `svg.test.tsx` renders the actual Properties component into JSDOM and uses a harmless local event marker; it does not certify a full browser import flow.

Baseline: 11 checks, 6 expected security failures and 5 passes, retained in `baseline-tests.txt`. Final targeted suite: 15 passes. Full project suite: 20 passes, including the existing five consent tests. Tests documenting OPEN weaknesses intentionally assert observed insecure behavior (identical hashes, unthrottled attempts, accepted malformed schema); a green test runner is not a green security decision.

Production frontend builds completed before and after fixes. Backend TypeScript check passed using `tsc -p functions/tsconfig.json`; `git diff --check` passed (line-ending notices only). Network/Node sandbox failures were retried with approved escalation; the successful scanner result is `dependency-audit-online.json`, not the earlier failed audit file. No live server or browser penetration session was started.

## 5. Audit 1 results

Password hashes, account linking and OAuth state require attention as detailed below. Sessions use crypto.randomUUID-derived IDs, are generated on login, and have HttpOnly/Secure/SameSite=Lax/Path=/ cookies. Logout invalidation passed locally. No client-set session identifier is reused on login. Tokens are stored server-side in plaintext, which means a database read compromise also exposes active sessions; token hashing is future hardening.

OTP email matching and type are bound in SQL. Valid OTP sequential use succeeds once; sequential replay fails. Expiry is corrected locally. Concurrent verification can pass the separate read before both used-flag updates; verification is idempotent today, so this is documented without claiming a duplicate-money/token exploit. A future reset flow must use atomic consumption. Password reset, password-change session revocation and resend are **NOT TESTED / NOT IMPLEMENTED IN THE AVAILABLE ROUTES**.

Design ownership: cross-user GET and PUT return 404; DELETE returns 200 but leaves the other user's row untouched. List contains only the caller's designs. A forged create user_id is ignored. SQL metacharacters in an ID do not broaden access. Current-account identity comes only from the session. No BOLA finding was confirmed.

CSRF: SameSite=Lax and JSON APIs reduce ordinary cross-site cookie-bearing mutation risk. Origin/content-type enforcement is absent; same-site untrusted-subdomain behavior was not tested. Wildcard CORS with credentials is invalid in browsers and does not grant wildcard credentialed access. OAuth login CSRF was a separate confirmed issue, now patched locally. Unsupported methods and duplicate cookies/query parameters were inspected only at source level; deployed Pages fallback semantics are **NOT TESTED**.

## 6. Audit 2 results

All inspected D1 queries use bound values; no user-controlled SQL concatenation was found. The important active-content exception was raw SVG HTML insertion and is locally fixed. Other logo style injections are constant strings. `rootElement.innerHTML` is read, not used as an untrusted write. React text rendering and document-library text generation do not establish an XSS sink by themselves. No current request-derived eval, command execution or filesystem traversal path was found.

Design schemas and browser assets remain insufficiently bounded. Negative dimensions and object-valued elements were accepted in a controlled handler test. Very large/deep input, NaN/Infinity conversion behavior, duplicate JSON keys, unusual filenames and geometry/decompression limits were reviewed for missing controls but not exhaustively exercised. No prototype-pollution exploit was demonstrated; no deep merge gadget was located. Arbitrary JSON storage alone is not proof of prototype pollution.

Custom GLB/GLTF inputs are local browser assets, with a five-asset UI count but no file/geometry budget. No server-side converter, temporary-file or upload path exists in the inspected API. ZIP bombs and format fuzzing were deliberately not executed. Cloud create's non-atomic ten-project cap and list-with-full-JSON response should be fixed alongside request budgets, rather than counted as unrelated findings.

## 7. Audit 3 results

### Secrets

`.env` is ignored and contains keys named GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and RESEND_API_KEY. The scan identified an actual-format Google secret in ignored `.env:3`; its value is never included. No match for that secret class was found in the scoped reachable-history/build scan. This is not, by itself, evidence of a leaked credential. Rotate if this file was shared, published or exposed elsewhere; routine ignored local storage alone does not establish a rotation incident.

The committed `.env.example` contains only a public analytics identifier slot. Browser source uses VITE_GOOGLE_ANALYTICS_ID; the reviewed Functions obtain secrets from env bindings. Google client IDs, D1 database identifiers and analytics measurement IDs are public identifiers, not authentication secrets. No credential was tested against its provider. The scan is pattern-based, excludes large historical files above 2 MB and binary blobs, and does not cover unreachable/deleted Git objects, external logs or cloud secret stores. Nonmatching arbitrary secret formats may be missed.

### Dependencies

Successful pnpm advisory query: 60 advisory entries (1 critical, 20 high, 29 moderate, 10 low), captured with version paths and links. Practical finding KK-09 groups toolchain debt at Medium; no critical production exploit was validated. [Vitest advisory](https://github.com/advisories/GHSA-5xrq-8626-4rwp) applies to UI/API/browser exposure, not the run-only tests used here. [Vite advisory](https://github.com/advisories/GHSA-fx2h-pf6j-xcff) concerns the Windows development server. See dependency-summary.json for exact affected paths. DOMPurify advisories in the tool tree do not explain the original application XSS, which did not call a sanitizer at that sink.

The available scripts expose a Vite dev server and wrangler deployment command. No public development listener was tested or proven. `latest` dependency ranges and placeholder allowBuilds entries reduce reproducibility; lockfile regeneration/install-script policy needs explicit review. No malicious install script was identified, but all transitive package source/scripts were not audited. Package versions were not silently upgraded during this assessment.

### Deployment and browser data

Public `/` returned 200 with frame/MIME/referrer protections; CSP/HSTS/Permissions-Policy absent in the sampled response. `/api/auth/me` returned user:null, DYNAMIC cache status, wildcard CORS plus credentials and no explicit cache policy. Authenticated public caching and edge/WAF configuration are **NOT TESTED**. No deployment equivalence between current commit and live code is assumed.

Vite source maps are not enabled in configuration; no map publication was established. `.env` is not in public. Broad sensitive-file URL probing, private deployment logs, origin bypass, Cloudflare IAM, DNS/TLS configuration and CI/CD credentials were not tested. SPA fallback means a 200 alone would not prove source-file exposure. Local browser draft/asset data persists across logout (KK-08); session cookies are not stored in localStorage. Analytics loading is consent-controlled in the inspected component; deeper third-party-script behavior was not assessed.

## 8. Findings table

| ID | Severity | Finding | Status |
|---|---|---|---|
| KK-01 | HIGH | Passwords are too easy to crack if the database is exposed | OPEN |
| KK-02 | HIGH | A malicious logo or project could run code in a customer's browser | FIXED AND VERIFIED |
| KK-03 | HIGH | Google sign-in could incorrectly join two accounts | FIXED BUT NEEDS MANUAL VERIFICATION |
| KK-04 | MEDIUM | Google login did not verify which browser started the request | FIXED BUT NEEDS MANUAL VERIFICATION |
| KK-05 | MEDIUM | Expired login sessions and verification codes remained valid too long | FIXED AND VERIFIED |
| KK-06 | MEDIUM | Repeated login and verification attempts lack application limits | OPEN |
| KK-07 | MEDIUM | Project and asset inputs have insufficient validation and size limits | OPEN |
| KK-08 | MEDIUM | Signing out leaves project data available on a shared browser | OPEN |
| KK-09 | MEDIUM | The dependency tree needs security updates before development exposure | OPEN |
| KK-10 | LOW | Private API responses did not explicitly prohibit caching | FIXED AND VERIFIED |
| KK-11 | LOW | Production browser protections are incomplete | OPEN |
| KK-12 | LOW | Registration reveals whether an email has an account | OPEN |

## 9. Detailed findings

References with baseline line numbers refer to commit 366f89f, before remediation; function names identify current code.

### KK-01 Passwords are too easy to crack if the database is exposed

**Audit category:** Audit 1

**Severity:** HIGH

**Status:** OPEN

**Affected component:** functions/_auth-utils.ts:5-15

**What is wrong:** Passwords use one unsalted SHA-256 digest. Equal passwords have equal stored hashes and each offline guess is inexpensive.

**Evidence and observed behavior:** hashPassword calls crypto.subtle.digest once, without a salt or work factor. The synthetic identical-password test passes, documenting the insecure baseline.

**Attack scenario:** An attacker who obtains a database copy can test common passwords offline rapidly. This requires database/hash exposure; no such exposure was demonstrated.

**User business and technical impact:** Customer account takeover and password-reuse harm become much more likely after a database incident. Technical impact is loss of password confidentiality, not a direct online authentication bypass.

**Recommended fix and work performed:** Adopt a vetted, versioned password KDF with a per-user salt. Validate a Workers-compatible implementation and CPU budget in staging. For PBKDF2-HMAC-SHA256, use the current OWASP 600,000-or-more iteration guidance only after verifying runtime support; otherwise choose a suitable vetted alternative. Migrate legacy hashes after successful password verification, or require controlled resets. Do not replace hashes in place without a migration path. This was not implemented because deployed runtime limits, existing accounts and recovery facilities were unavailable.

**Confidence:** CONFIRMED

**Automatically validated:** Yes, identical-password test and implementation inspection; no real password cracking

**Retest instructions and expected behavior:** Verify equal passwords get different hashes; valid and invalid password behavior; legacy upgrade; no downgrade; deployed runtime cost; reset/session-revocation path.


### KK-02 A malicious logo or project could run code in a customer's browser

**Audit category:** Audit 2

**Severity:** HIGH

**Status:** FIXED AND VERIFIED

**Affected component:** src/components/editor/Properties.tsx:504-509; src/routes/editor.tsx:413-425

**What is wrong:** Raw uploaded SVG and imported element.svgData were passed to dangerouslySetInnerHTML. Upload accept filters do not remove active HTML/SVG content.

**Evidence and observed behavior:** Rendering an SVG image element with an onerror handler and dispatching its error event set window.auditMarker to 1 before remediation. The same component test finds no active handler after remediation. Project import accepts supplied elements; cloud saves persist them.

**Attack scenario:** A customer imports a project or uploads a logo supplied by someone else, then selects its 3D logo. An embedded event handler executes with the application's origin. Cross-user cloud IDOR is not necessary; a malicious file and user interaction are required.

**User business and technical impact:** Malicious browser code could read private designs or make authenticated API requests as the victim. HttpOnly prevents reading the session cookie directly but does not prevent same-origin authenticated requests.

**Recommended fix and work performed:** Implemented image-only SVG previews with an encoded SVG data URL in an img element. This removes the active HTML insertion boundary and works with existing SVG data. Other observed SVG consumers already use image/texture loading rather than HTML insertion. Retained the regression test.

**Confidence:** CONFIRMED

**Automatically validated:** Yes, actual Properties component rendered into JSDOM with a harmless event marker; full-browser import workflow not tested

**Retest instructions and expected behavior:** Run svg.test.tsx. In staging upload/import a harmless event-marker SVG, select the logo, reload a saved project and verify no marker runs. Confirm ordinary SVG/PNG/JPEG previews still work. Deploy the reviewed build.


### KK-03 Google sign-in could incorrectly join two accounts

**Audit category:** Audit 1

**Severity:** HIGH

**Status:** FIXED BUT NEEDS MANUAL VERIFICATION

**Affected component:** functions/api/auth/google.ts:70-96 in baseline; current subject lookup and email-collision guard

**What is wrong:** The callback selected users by google_id OR email, trusted email without checking email_verified, and set the local account verified while retaining its password. This permits unsafe account merging and pre-registration takeover conditions.

**Evidence and observed behavior:** A mocked Google profile with email_verified=false and another local account's email received a session in the baseline. Source shows existing password_hash is not cleared. After remediation an unverified profile is rejected and a verified new subject colliding with an unverified local account receives 409 without promoting it.

**Attack scenario:** An attacker pre-registers a victim's email with an attacker-known password. The victim later uses Google sign-in; the old merge promotes that account and leaves the attacker's password usable. A separate risk is trusting a provider email as a stable identifier. These full external account sequences were not executed.

**User business and technical impact:** An attacker may retain access to the victim's newly verified account and designs. The core technical failure is promoting and linking identities without proof of control of the existing local account.

**Recommended fix and work performed:** Implemented lookup by Google subject only, required a verified email for the profile, and rejected email collisions instead of silently linking. A future linking flow must require fresh authentication to the existing account. Existing linked accounts may need investigation; local code changes cannot undo historical compromises.

**Confidence:** CONFIRMED implementation; LIKELY end-to-end takeover paths

**Automatically validated:** Yes, mocked provider responses and real handler SQLite queries; real Google account lifecycle not tested

**Retest instructions and expected behavior:** Use controlled staging accounts for new Google signup, returning Google login, local-password email collision and pre-registration. Confirm collision cannot activate the old password. Review pre-existing linked accounts and revoke/reset affected credentials if the original flow was used.


### KK-04 Google login did not verify which browser started the request

**Audit category:** Audit 1

**Severity:** MEDIUM

**Status:** FIXED BUT NEEDS MANUAL VERIFICATION

**Affected component:** functions/api/auth/google.ts:18-47 in baseline; current state-cookie guard

**What is wrong:** OAuth state was generated but not stored or compared. Callback URLs also trusted forwarded host and protocol headers.

**Evidence and observed behavior:** A callback without state reached the mocked Google token endpoint. The fixed callback stops before exchange. Login initiation sets a random HttpOnly, Secure, SameSite=Lax state cookie and the callback compares it; success clears it. Forwarded-host test confirms the request URL origin is used.

**Attack scenario:** An attacker can attempt login CSRF by sending their valid callback to another browser, causing the victim to work in the attacker's account. Real authorization-code delivery was not tested. Forwarded-host manipulation is a separate hardening concern constrained by Google's redirect allowlist.

**User business and technical impact:** A victim could save private work into an account the attacker controls. This is session swapping, not evidence of direct victim-account takeover.

**Recommended fix and work performed:** Implemented browser-bound state check, ten-minute cookie lifetime, successful-use clearing and no-store OAuth redirects. Removed forwarded-header callback construction. Verify HTTPS proxy behavior and registered redirects in staging.

**Confidence:** CONFIRMED

**Automatically validated:** Yes, missing-state rejection, state cookie and trusted callback-origin tests; live OAuth not tested

**Retest instructions and expected behavior:** Complete real Google flow; reject missing/mismatched state; verify success clears state; reject code replay at provider; test cancellation and two tabs. Local HTTP Secure-cookie behavior and preview-domain redirects need configuration validation.


### KK-05 Expired login sessions and verification codes remained valid too long

**Audit category:** Audit 1

**Severity:** MEDIUM

**Status:** FIXED AND VERIFIED

**Affected component:** functions/_auth-utils.ts:getSessionUser; functions/api/auth/verify-otp.ts:onRequestGet

**What is wrong:** ISO strings containing T were compared lexicographically with SQLite datetime strings containing a space. On the expiry date, T sorts after space regardless of time.

**Evidence and observed behavior:** Records expired one minute earlier on the current UTC date were accepted: session returned its user, OTP returned 200. Both now fail the same tests. Future OTP succeeds once and sequential replay returns 400.

**Attack scenario:** A previously acquired session or unused OTP can remain accepted after its intended expiry until the next UTC day, potentially almost 24 extra hours. No credential was acquired during testing.

**User business and technical impact:** Extended opportunity to use a stolen credential; the documented ten-minute OTP and thirty-day session deadlines were not enforced accurately.

**Recommended fix and work performed:** Implemented julianday conversions on both sides of the comparisons. Existing ISO timestamps remain readable without a migration. Logout already deletes the session. Concurrent OTP use remains an idempotent race in the separate select/update flow and should be hardened with a conditional consume.

**Confidence:** CONFIRMED

**Automatically validated:** Yes, handler tests with real SQLite comparisons

**Retest instructions and expected behavior:** Run current, expired, future and malformed-timestamp cases against staging D1; test UTC midnight boundaries and logout. Sequential replay is covered locally; concurrent D1 transaction behavior is not certified.


### KK-06 Repeated login and verification attempts lack application limits

**Audit category:** Audit 1 and 2

**Severity:** MEDIUM

**Status:** OPEN

**Affected component:** functions/api/auth/login.ts; register.ts; verify-otp.ts; functions/_auth-utils.ts:generateOtp

**What is wrong:** No attempt counters, account/IP throttles, registration email budget or cooldowns exist in the inspected handlers/schema. Six-digit OTPs use Math.random. OTPs are transported in GET query strings and retained in plaintext.

**Evidence and observed behavior:** Twelve local bad-password requests all returned 401 and wrote no throttling state. Static inspection finds no middleware or counters. A full 900,000-code search was deliberately not performed. Cloudflare dashboard rate rules were unavailable.

**Attack scenario:** An attacker attempts common passwords, guesses verification codes for pre-registered addresses, or consumes email/database capacity through repeated registration. An OTP alone verifies email; it does not reset a password or directly create a session.

**User business and technical impact:** Account abuse, identity-verification bypass and service costs. Practical exploit speed depends on deployed controls that were not inspected.

**Recommended fix and work performed:** Add shared durable rate limiting by normalized account and trusted client IP, verification-attempt caps, resend/registration budgets and progressive backoff. Use crypto.getRandomValues with unbiased range selection, store keyed OTP digests, move verification to POST, and atomically consume codes. Document/test edge rules as defense in depth. Avoid process-local counters in Workers.

**Confidence:** CONFIRMED application gap; POTENTIAL deployed abuse pending edge-rule inspection

**Automatically validated:** Partly: 12 bounded synthetic failed logins; no brute-force or email-volume test

**Retest instructions and expected behavior:** With synthetic staging accounts, verify small allowed bursts followed by 429/cooldown, independent-user behavior, distributed requests, expiry, single-use under concurrency and email budget. Never stress the public service.


### KK-07 Project and asset inputs have insufficient validation and size limits

**Audit category:** Audit 2

**Severity:** MEDIUM

**Status:** OPEN

**Affected component:** functions/api/designs/index.ts:onRequestPost; [id].ts:onRequestPut; src/routes/editor.tsx:132,413; Sidebar.tsx:295

**What is wrong:** Design routes accept arbitrary config/elements JSON without depth, string, element-count or numeric limits. Request.json reads the body before any application size budget. Local model imports have no byte/header/resource budget; accept allows GLB and GLTF despite GLB-only guidance.

**Evidence and observed behavior:** A synthetic authenticated create with config.width=-1 and elements={invalid:true} returned 201. File uploads are stored in global IndexedDB and passed as blob URLs to the browser loader. The ten-project cap uses separate count and insert queries, so it is not atomic.

**Attack scenario:** A signed-in client stores malformed or costly project content; a user imports an oversized or malformed model. Platform limits may stop some requests, but are not a product-specific safety budget.

**User business and technical impact:** Broken projects, browser stalls, excess storage/request costs and inconsistent free-tier limits. No service crash, decompression bomb or cross-user availability attack was executed.

**Recommended fix and work performed:** Define a bounded runtime schema for create/update/import, reject unknown dangerous keys, require arrays and finite/ranged dimensions, cap name/JSON bytes/depth/element counts, bound asset size and decoded geometry, inspect GLB headers, and enforce quotas atomically. Return controlled 400/413 responses and paginate project summaries.

**Confidence:** CONFIRMED validation gap; resource-exhaustion impact not load-tested

**Automatically validated:** Partly: malformed design accepted by real handler and SQLite adapter

**Retest instructions and expected behavior:** Test wrong types, missing and duplicate fields, long strings, nested structures, malformed IDs, boundary byte counts and finite numeric ranges using small local fixtures. Test quota concurrency and rejected assets without intentionally exhausting resources.


### KK-08 Signing out leaves project data available on a shared browser

**Audit category:** Audit 3

**Severity:** MEDIUM

**Status:** OPEN

**Affected component:** src/routes/editor.tsx:57-62,281-289,851-853; src/lib/customAssetDB.ts

**What is wrong:** Logout removes the server session but does not clear or separate current design state, stall-config, stall-elements, custom asset metadata or IndexedDB blobs by account.

**Evidence and observed behavior:** signOut only calls DELETE /api/auth/me; the logout callback only clears sessionUser. Editor initialization reads the same global browser keys for every account.

**Attack scenario:** A second person uses the same browser profile after the first person signs out, then opens the editor. Previous locally persisted design content can remain visible.

**User business and technical impact:** Local confidentiality loss on shared devices. This is not cross-user cloud API access and does not imply remote access to another browser's storage.

**Recommended fix and work performed:** Choose and document the guest-draft policy; namespace authenticated storage by account and clear in-memory/private cached content on logout or account switch. Offer an explicit shared-device cleanup action covering IndexedDB and history. Preserve intentional guest drafts only with a clear ownership decision.

**Confidence:** CONFIRMED by implementation; full browser account-switch workflow not tested

**Automatically validated:** No; traced logout, initialization and persistence paths

**Retest instructions and expected behavior:** Create a private design and asset as A; sign out; reload and sign in as B using the same profile. Verify A's data is unavailable while intended guest-draft behavior remains correct.


### KK-09 The dependency tree needs security updates before development exposure

**Audit category:** Audit 3

**Severity:** MEDIUM

**Status:** OPEN

**Affected component:** package.json; pnpm-lock.yaml; pnpm-workspace.yaml

**What is wrong:** The locked development/build/asset toolchain contains known advisories. The scanner reports 60 entries: 1 critical, 20 high, 29 moderate, 10 low. These are scanner counts, not 60 application findings.

**Evidence and observed behavior:** Vitest 3.2.4 is below 3.2.6 for GHSA-5xrq-8626-4rwp; exploitation requires UI/API/browser mode exposure. Audit tests use run mode. Vite 7.3.3 has Windows dev-server advisories fixed in 7.3.5. sharp 0.34.5/0.33.5 is in development paths. fflate comes through three-stdlib and types dependencies; the vulnerable unzipSync path was not found used by this application.

**Attack scenario:** A vulnerable developer server or future asset-processing path is exposed to untrusted inputs. Pages static files and Workers handlers do not themselves expose Vitest or a Node conversion service.

**User business and technical impact:** Potential developer-machine file access/execution or parser availability issues under advisory-specific conditions. No Critical deployed application vulnerability is established by the scanner result.

**Recommended fix and work performed:** Update Vitest, Vite and Wrangler with compatible lockfile changes; review all remaining advisories by path. Remove unused production Supabase and conversion packages or move offline tooling to devDependencies. Pin intentional versions instead of latest, and replace placeholder pnpm allowBuilds values with explicit reviewed booleans. Do not mass-upgrade without build and import/export regression checks.

**Confidence:** CONFIRMED vulnerable versions; deployed exploitability NOT ESTABLISHED

**Automatically validated:** Yes, successful online pnpm audit; no advisory exploit executed

**Retest instructions and expected behavior:** Run pnpm audit against the updated lockfile, build/test, validate model imports/exports, and verify no dev UI/API listener is publicly exposed. Confirm each remaining advisory's reachability and owner.


### KK-10 Private API responses did not explicitly prohibit caching

**Audit category:** Audit 3

**Severity:** LOW

**Status:** FIXED AND VERIFIED

**Affected component:** functions/_auth-utils.ts:json

**What is wrong:** JSON responses containing account and design data had no Cache-Control policy. A proxy or browser policy could retain sensitive responses unnecessarily.

**Evidence and observed behavior:** Public GET /api/auth/me returned 200 with user:null and no Cache-Control. The local helper test also returned null for that header. No authenticated public response or actual shared-cache leak was tested; Cloudflare reported DYNAMIC.

**Attack scenario:** Sensitive responses are retained under deployment or browser caching defaults rather than an explicit privacy rule.

**User business and technical impact:** Potential residual data disclosure, dependent on caching configuration.

**Recommended fix and work performed:** Implemented Cache-Control: no-store in the shared JSON helper and successful/initiation OAuth responses. Production still requires deployment and header verification.

**Confidence:** CONFIRMED missing header; private cache leakage not demonstrated

**Automatically validated:** Yes, response helper test; public unauthenticated response observation

**Retest instructions and expected behavior:** After deployment inspect authenticated me/design success and error responses and OAuth redirects for no-store; confirm no sensitive cached response is served to another session.


### KK-11 Production browser protections are incomplete

**Audit category:** Audit 3

**Severity:** LOW

**Status:** OPEN

**Affected component:** public/_headers; functions/_auth-utils.ts:json

**What is wrong:** The homepage lacks Content-Security-Policy and Strict-Transport-Security in the sampled response. API Functions do not inherit the inspected static frame/MIME/referrer headers. Permissions-Policy is absent.

**Evidence and observed behavior:** Homepage has X-Frame-Options SAMEORIGIN, nosniff and strict-origin-when-cross-origin. GET /api/auth/me lacks those headers and has wildcard CORS plus Allow-Credentials true. Browsers reject that wildcard credentialed combination; it is not evidence of cross-origin credential disclosure.

**Attack scenario:** Missing defense-in-depth increases the consequences of a future injection or insecure navigation. No HTTPS downgrade or frame attack was demonstrated.

**User business and technical impact:** Reduced browser safeguards; the confirmed SVG issue is counted separately rather than inflated by missing CSP.

**Recommended fix and work performed:** Roll out a tested CSP, initially Report-Only if needed, suitable for WebGL workers/blob images and approved analytics; apply HSTS after verifying HTTPS/subdomain readiness. Add consistent Function headers and a minimal Permissions-Policy. Remove unnecessary CORS for same-origin APIs or use an exact reviewed origin allowlist; enforce Origin on unsafe requests.

**Confidence:** CONFIRMED sampled headers; INFORMATIONAL HARDENING impact

**Automatically validated:** Yes, two controlled public GET requests and source review

**Retest instructions and expected behavior:** Inspect deployed HTML and API headers, verify browser editor/assets/OAuth under CSP, check framing and HTTP-to-HTTPS behavior, and test cross-origin requests. HSTS includeSubDomains/preload require a separate domain readiness check.


### KK-12 Registration reveals whether an email has an account

**Audit category:** Audit 1

**Severity:** LOW

**Status:** OPEN

**Affected component:** functions/api/auth/register.ts:29-34

**What is wrong:** Registration responds with an explicit account-exists message and 409 for known addresses, distinct from the successful new-account response.

**Evidence and observed behavior:** The existing-email branch returns 'An account with this email already exists'. Login uses a generic invalid-credentials error for absent users and bad passwords; the verification-specific response requires a correct password.

**Attack scenario:** An observer submits candidate emails to learn whether they are registered. No real-address enumeration was performed.

**User business and technical impact:** Account membership privacy loss and improved targeting for phishing or password attacks.

**Recommended fix and work performed:** Return a consistent registration acknowledgement and carefully design recovery/resend handling with rate limits. Preserve meaningful guidance through email to the address owner. Avoid email delivery before input validation and handle send failures reliably.

**Confidence:** CONFIRMED by handler implementation

**Automatically validated:** No dedicated enumeration probe; static branch inspection

**Retest instructions and expected behavior:** Compare controlled known/unknown email response status, body and broad timing behavior without probing real customers.

## 10. Fixes performed

Original findings were saved in ORIGINAL_FINDINGS.md before editing four application files. KK-02 removed HTML insertion; KK-03 stopped implicit account merges and required verified provider email; KK-04 bound OAuth state and removed forwarded callback-origin trust; KK-05 normalized expiration comparison; KK-10 added no-store. Session-cookie parsing was additionally anchored to cookie boundaries as trivial hardening.

No password migration, schema migration, dependency upgrade, cloud configuration change, account modification, secret rotation or deployment occurred. All patches remain local and reviewable in Git. The new account-linking rule intentionally rejects email collisions; an explicit authenticated linking feature can be added later. Secure state-cookie behavior requires HTTPS staging validation. Password KDF work was left open because applying an unvalidated KDF in Workers or dropping legacy hashes could make login unusable.

## 11. Retest results

| Check | Result and limit |
|---|---|
| Baseline security checks | 6 failures / 5 passes, demonstrating original weaknesses |
| Final focused regression | 15 / 15 pass; some tests deliberately document open risks |
| Entire test suite | 20 / 20 pass, three files |
| Backend typecheck | Pass |
| Production frontend build | Pass before and after fixes; large bundle warning is not treated as a vulnerability |
| Whitespace diff check | Pass, line-ending notices only |
| Actual D1 / Google / Resend integration | NOT TESTED |
| Deployed fixes | NOT DEPLOYED; NOT TESTED |

Reproduce: `node node_modules/vitest/vitest.mjs run --config security-audit/vitest.config.ts`, `npm test`, `node node_modules/typescript/bin/tsc -p functions/tsconfig.json`, `npm run build`. Node 22.14 exposes experimental node:sqlite in the test adapter. Use a compatible supported Node environment. Baseline tests are historical evidence and should not be regenerated over their saved log after fixes.

## 12. Known limitations and untested areas

No authenticated public account session, deployed D1 binding or transaction behavior, actual Google authorization-code exchange, Google redirect registration, Resend delivery, password reset, production secret configuration, edge rate-limit rules, WAF, bot protection, or account-history remediation was tested. The audit used local synthetic data and two public read-only responses. JSDOM demonstrates an active event sink but is not a full supported-browser compatibility assessment. No stress, destructive file fuzzing, exhaustive malformed-input matrix or full infrastructure penetration test was performed. No claim of absolute absence of secrets, injection or authorization flaws is made.

## 13. Deferred future security reviews

After initial remediation, perform authenticated two-user staging penetration tests, business-logic/quotas/concurrency review, full import/export and file-format fuzzing in isolation, monitoring and alerting, session/OTP cleanup, incident response, backup/restore, Cloudflare IAM and CI/CD review, privacy/compliance and denial-of-service resilience. Repeat security review after launch and when major features, sharing, billing or server-side converters are added.

## 14. Final public launch recommendation

**RED — DO NOT PUBLICLY RELEASE YET.** The product has a sound ownership pattern, but safe password storage is still a High-severity blocker and authentication changes are not yet proven on staging. The current publicly reachable site has not received these patches.

Release gates:

1. Replace and safely migrate password hashes using a vetted KDF validated on the deployment runtime; review accounts previously auto-linked through Google.
2. Deploy the reviewed SVG/OAuth/expiry/cache changes to controlled staging and pass real Google, D1 and two-account import/save/logout regression tests before production rollout.
3. Establish tested shared login/OTP/email limits and bounded design/asset inputs; update exposed development tooling and resolve the release-relevant advisory paths.

The seven OPEN items should have owners and deadlines; the two pending OAuth items must receive provider-backed verification. Re-evaluate the launch decision after these gates. A later GREEN would mean no known Critical/High blockers in this focused scope, not that the software is completely secure.

## Supporting references

- [OWASP password storage guidance](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Cloudflare Workers Web Crypto](https://developers.cloudflare.com/workers/runtime-apis/web-crypto/)
- [Google OpenID Connect](https://developers.google.com/identity/openid-connect/openid-connect)
- [Google email authority caveats](https://developers.google.com/identity/sign-in/android/backend-auth?hl=en)
- Version-specific advisory URLs and dependency paths are retained in dependency-summary.json.

## Evidence inventory

`ORIGINAL_FINDINGS.md`, `findings.json`, `baseline-tests.txt`, `retest-results.txt`, `all-tests.txt`, `functions-typecheck.txt`, `build-before.txt`, `build-after.txt`, `dependency-audit-online.json`, `dependency-summary.json`, `secret-scan.json`, `public-home-headers.txt`, `public-api-headers.txt`, `public-api-body.txt`, `security.test.ts`, `svg.test.tsx` and `vitest.config.ts`. Secret results contain location/type metadata only. The stakeholder Word document intentionally omits exploit code and terminal logs.


## Document delivery verification

The stakeholder DOCX passed structural ZIP/XML, required-section, finding-count, page-number-field and exact local-secret-value exclusion checks. Visual pagination QA could not be completed: the packaged renderer lacked LibreOffice, and a Microsoft Word background render stalled and was stopped. The DOCX should be visually checked in Word before external circulation. No PDF/rendered pages are delivered.
