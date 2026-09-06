# KreateKaro Pre Release Security Audit

**Remediation assessment: 6 September 2026. Branch: `security-audit`. Original baseline: `366f89f`; initial audit commit: `22db909`.** This report covers the current branch changes, local evidence and remaining release checks. It supersedes the original RED recommendation for the local implementation; it does not certify the unchanged public deployment.

## 1. Executive summary

**Overall launch status: AMBER — local remediation passed; public release is conditional.** All twelve original findings have code changes. Nine are fixed and verified within the local test scope; three are fixed but need manual release verification (KK-01, KK-03, KK-04). Zero findings remain without an implementation fix. The three pending findings remain unclosed for release. No finding was accepted as an unresolved risk or silently downgraded.

Original application severities remain **0 Critical, 3 High, 6 Medium and 3 Low**. These are historical finding severities, not twelve currently exploitable vulnerabilities. The separate final dependency scanner reports zero advisories. Automated local gates are GREEN for all three focused audits, with the scope and limitations below. A fully GREEN public-launch decision is not justified yet.

The user selected local validation only. No public account was created or changed, no remote database migration/backfill was run, and these changes were not deployed. Existing deployment, credentials, account history and provider configuration are not inferred from local success.

## 2. Scope

Audit 1 covers password storage, registration, email verification, sessions, Google identity and cloud-project authorization. Audit 2 covers request schemas, hostile content, custom assets, project import and shared-browser privacy. Audit 3 covers dependency/configuration changes, secret handling and HTTP security headers.

The baseline included 84 reachable commits and a pattern scan of 810 current/historical/build text objects. That scan found no confirmed committed secret; an ignored local environment file contained credentials. The full historical scan is baseline evidence, not a newly repeated guarantee. New reports are checked for exact local-secret-value exclusion. Only two baseline public GETs, homepage and signed-out `/api/auth/me`, were sampled. No new production probing was required for this local follow-up.

## 3. Architecture and security context

The app is a Vite-built React client with TanStack Router, Konva and BabylonJS. Cloudflare Pages serves the client and Pages Functions implement D1-backed APIs. Same-origin browser requests cross a server boundary where sessions and ownership are checked; browser-provided user IDs never establish authorization. Untrusted project and model data cross a separate client rendering boundary.

Passwords use versioned salted PBKDF2. Registration holds a pending password hash and keyed verification code in a challenge table; the current challenge is consumed in a transactional user mutation. OAuth uses Google subject identity, browser-bound state and PKCE. API middleware enforces method/origin policies and D1 rate limits. Private browser storage is initialized under an account ownership token before rendering.

| Route | Current protocol |
|---|---|
| `/api/auth/register` | POST JSON; neutral acknowledgement and pending verification challenge |
| `/api/auth/verify-otp` | POST JSON only; keyed code digest, expiry, attempt limits, one use |
| `/api/auth/login` | POST JSON; password verification and session creation |
| `/api/auth/google` | GET initiation/callback; state cookie, PKCE, subject identity |
| `/api/auth/me` | GET current account; DELETE revokes session |
| `/api/designs` | GET owned summaries; POST bounded design with atomic quota |
| `/api/designs/[id]` | GET, PUT, DELETE with server-side ownership checks |

There is no implemented password-reset endpoint and no server upload/conversion service in the reviewed code. Removed conversion packages do not represent a claim that such a production service was tested.

## 4. Methodology and evidence

Real handler code runs in synthetic Node SQLite tests and, separately, in an isolated Miniflare/workerd instance with an in-memory D1 database. Local email and Google responses are mocked; unexpected outbound worker requests are rejected. No local production database or real account fixtures are read. The browser smoke uses the actual production build, configured security headers, a fresh browser profile, synthetic account responses and a loopback server; external browser requests are blocked.

Tests cover regressions and bounded concurrency rather than load attacks. No password cracking, destructive parser bombs, real-address enumeration or provider abuse was performed. Unit mocks and local D1 do not prove production provider integration or CPU capacity.

## 5. Audit 1 results

**Local gate GREEN / PASS. Release assurance AMBER.** Password salts, work factor, wrong-password handling, legacy upgrades and bounded backfill passed. Account/IP limits, verification expiry, pre-registration password replacement, one-use verification and server-side logout passed. Cross-user CRUD and forged ownership attempts were rejected. Mocked Google identity, collision, state and PKCE checks passed, including actual local workerd exchange and state replay.

Real Google sign-in and email delivery are NOT TESTED. Target KDF CPU allowance, dormant password backfill and historical Google-linked account/session review are NOT TESTED. These gaps explain the three pending finding statuses and the release checklist.

## 6. Audit 2 results

**Local gate GREEN / PASS.** The unsafe SVG HTML insertion is removed. Project/API validation enforces object shape, size, depth, numeric and element budgets. Custom GLB checks reject externally linked, compressed, oversized and structurally unsafe fixtures before loading. Logo uploads have byte and raster-pixel budgets. D1 admitted ten of twelve concurrent cloud saves, enforcing the free-plan quota atomically.

Browser storage tests cover private blob cleanup, account changes, stale writes and explicit guest draft preservation. The built editor rendered a valid draft under CSP and removed private draft state on logout across two tabs. Full model-format fuzzing, every import/export variant, mobile browsers and multi-device behavior are NOT TESTED. Old unlabelled drafts are deliberately cleared on first secure initialization; export important drafts before rollout.

## 7. Audit 3 results

**Local gate GREEN / PASS. Deployment assurance AMBER.** Unused dependencies were removed, direct versions pinned, vulnerable packages updated and pnpm build-script policies made explicit. The final advisory scan reports zero across all severities, down from sixty baseline scanner entries. Scanner counts are separate from application findings and do not establish production exploitability.

API headers consistently prohibit caching and remove wildcard credentialed CORS. Static CSP and HSTS are configured, and unsafe methods require exact same-origin requests. The built-editor smoke observed zero CSP violations or page errors. Public CDN/header state, cloud secret settings, approved email sender, cloud permissions and production traffic limits are NOT TESTED in this follow-up.

## 8. Findings table

Statuses below describe local verification. Pending entries need the additional release checks specified in their details.

| ID | Original severity | Audit | Current status | Finding |
|---|---|---|---|---|
| KK-01 | HIGH | Audit 1 | FIXED BUT NEEDS MANUAL VERIFICATION | Passwords are too easy to crack if the database is exposed |
| KK-02 | HIGH | Audit 2 | FIXED AND VERIFIED | A malicious logo or project could run code in a customer's browser |
| KK-03 | HIGH | Audit 1 | FIXED BUT NEEDS MANUAL VERIFICATION | Google sign-in could incorrectly join two accounts |
| KK-04 | MEDIUM | Audit 1 | FIXED BUT NEEDS MANUAL VERIFICATION | Google login did not verify which browser started the request |
| KK-05 | MEDIUM | Audit 1 | FIXED AND VERIFIED | Expired login sessions and verification codes remained valid too long |
| KK-06 | MEDIUM | Audit 1 and 2 | FIXED AND VERIFIED | Repeated login and verification attempts lack application limits |
| KK-07 | MEDIUM | Audit 2 | FIXED AND VERIFIED | Project and asset inputs have insufficient validation and size limits |
| KK-08 | MEDIUM | Audit 3 | FIXED AND VERIFIED | Signing out leaves project data available on a shared browser |
| KK-09 | MEDIUM | Audit 3 | FIXED AND VERIFIED | The dependency tree needs security updates before development exposure |
| KK-10 | LOW | Audit 3 | FIXED AND VERIFIED | Private API responses did not explicitly prohibit caching |
| KK-11 | LOW | Audit 3 | FIXED AND VERIFIED | Production browser protections are incomplete |
| KK-12 | LOW | Audit 1 | FIXED AND VERIFIED | Registration reveals whether an email has an account |

## 9. Detailed findings

Original evidence is retained explicitly as baseline evidence. Original file references may refer to pre-remediation line numbers. Current files are listed separately.

### KK-01 Passwords are too easy to crack if the database is exposed

**HIGH | FIXED BUT NEEDS MANUAL VERIFICATION | CONFIRMED**

**Baseline location:** functions/_auth-utils.ts:5-15

**Baseline weakness:** Passwords use one unsalted SHA-256 digest. Equal passwords have equal stored hashes and each offline guess is inexpensive.

**Baseline evidence:** hashPassword calls crypto.subtle.digest once, without a salt or work factor. The synthetic identical-password test passes, documenting the insecure baseline.

**Plausible scenario:** An attacker who obtains a database copy can test common passwords offline rapidly. This requires database/hash exposure; no such exposure was demonstrated.

**Impact:** Customer account takeover and password-reuse harm become much more likely after a database incident. Technical impact is loss of password confidentiality, not a direct online authentication bypass.

**Current implementation files:** functions/_password.ts; functions/_password-migration.ts; functions/api/auth/login.ts

**Fix performed:** Versioned PBKDF2 HMAC SHA256 with 600000 iterations, random 16-byte salts and constant-time comparison. A SHA256 prehash preserves migration compatibility. Successful legacy login upgrades the stored record; a bounded administrative backfill helper also strengthens dormant records without plaintext passwords.

**Retest and remaining verification:** Unique salts, valid and wrong passwords, malformed parameters, bounded backfill and legacy login upgrade passed. Actual workerd KDF round-trip passed. Target account CPU allowance and production backfill remain NOT TESTED.


### KK-02 A malicious logo or project could run code in a customer's browser

**HIGH | FIXED AND VERIFIED | CONFIRMED**

**Baseline location:** src/components/editor/Properties.tsx:504-509; src/routes/editor.tsx:413-425

**Baseline weakness:** Raw uploaded SVG and imported element.svgData were passed to dangerouslySetInnerHTML. Upload accept filters do not remove active HTML/SVG content.

**Baseline evidence:** Rendering an SVG image element with an onerror handler and dispatching its error event set window.auditMarker to 1 before remediation. The same component test finds no active handler after remediation. Project import accepts supplied elements; cloud saves persist them.

**Plausible scenario:** A customer imports a project or uploads a logo supplied by someone else, then selects its 3D logo. An embedded event handler executes with the application's origin. Cross-user cloud IDOR is not necessary; a malicious file and user interaction are required.

**Impact:** Malicious browser code could read private designs or make authenticated API requests as the victim. HttpOnly prevents reading the session cookie directly but does not prevent same-origin authenticated requests.

**Current implementation files:** src/components/editor/Properties.tsx; src/lib/assetValidation.ts; src/routes/editor.tsx

**Fix performed:** SVG previews use image-only data URLs instead of raw HTML insertion. Logo sizes and raster dimensions are bounded before decoding. Imported projects are validated before entering editor state.

**Retest and remaining verification:** Actual Properties component regression passed: the harmless SVG event marker does not execute. The built editor renders an ordinary draft under enforced CSP. The complete malicious-file browser import path remains a staging check.


### KK-03 Google sign-in could incorrectly join two accounts

**HIGH | FIXED BUT NEEDS MANUAL VERIFICATION | CONFIRMED implementation; LIKELY end-to-end takeover paths**

**Baseline location:** functions/api/auth/google.ts:70-96 in baseline; current subject lookup and email-collision guard

**Baseline weakness:** The callback selected users by google_id OR email, trusted email without checking email_verified, and set the local account verified while retaining its password. This permits unsafe account merging and pre-registration takeover conditions.

**Baseline evidence:** A mocked Google profile with email_verified=false and another local account's email received a session in the baseline. Source shows existing password_hash is not cleared. After remediation an unverified profile is rejected and a verified new subject colliding with an unverified local account receives 409 without promoting it.

**Plausible scenario:** An attacker pre-registers a victim's email with an attacker-known password. The victim later uses Google sign-in; the old merge promotes that account and leaves the attacker's password usable. A separate risk is trusting a provider email as a stable identifier. These full external account sequences were not executed.

**Impact:** An attacker may retain access to the victim's newly verified account and designs. The core technical failure is promoting and linking identities without proof of control of the existing local account.

**Current implementation files:** functions/api/auth/google.ts; functions/api/auth/login.ts; functions/api/auth/verify-otp.ts

**Fix performed:** Google identity lookup uses the provider subject only. Unverified email profiles and collisions with local password accounts are rejected. Password login is disabled for Google-linked accounts, including records linked by the old flow. Verification promotes only the current registration challenge password.

**Retest and remaining verification:** Mocked provider tests reject unverified profiles and account collisions. New Google login passes in local workerd with a mocked provider. Real Google lifecycle and historical account/session review remain NOT TESTED.


### KK-04 Google login did not verify which browser started the request

**MEDIUM | FIXED BUT NEEDS MANUAL VERIFICATION | CONFIRMED**

**Baseline location:** functions/api/auth/google.ts:18-47 in baseline; current state-cookie guard

**Baseline weakness:** OAuth state was generated but not stored or compared. Callback URLs also trusted forwarded host and protocol headers.

**Baseline evidence:** A callback without state reached the mocked Google token endpoint. The fixed callback stops before exchange. Login initiation sets a random HttpOnly, Secure, SameSite=Lax state cookie and the callback compares it; success clears it. Forwarded-host test confirms the request URL origin is used.

**Plausible scenario:** An attacker can attempt login CSRF by sending their valid callback to another browser, causing the victim to work in the attacker's account. Real authorization-code delivery was not tested. Forwarded-host manipulation is a separate hardening concern constrained by Google's redirect allowlist.

**Impact:** A victim could save private work into an account the attacker controls. This is session swapping, not evidence of direct victim-account takeover.

**Current implementation files:** functions/api/auth/google.ts; migrations/0001_security.sql

**Fix performed:** OAuth state is bound to a Secure HttpOnly __Host cookie and an expiring one-use D1 challenge. PKCE binds the authorization code to its verifier. Duplicate callback parameters, mismatched cookies, replay and expired challenges are rejected.

**Retest and remaining verification:** Missing state, replay and expiration regressions passed. Actual local workerd token exchange checks the PKCE verifier and rejects reused state with a mocked provider. Real HTTPS Google redirect and browser cookie lifecycle remain NOT TESTED.


### KK-05 Expired login sessions and verification codes remained valid too long

**MEDIUM | FIXED AND VERIFIED | CONFIRMED**

**Baseline location:** functions/_auth-utils.ts:getSessionUser; functions/api/auth/verify-otp.ts:onRequestGet

**Baseline weakness:** ISO strings containing T were compared lexicographically with SQLite datetime strings containing a space. On the expiry date, T sorts after space regardless of time.

**Baseline evidence:** Records expired one minute earlier on the current UTC date were accepted: session returned its user, OTP returned 200. Both now fail the same tests. Future OTP succeeds once and sequential replay returns 400.

**Plausible scenario:** A previously acquired session or unused OTP can remain accepted after its intended expiry until the next UTC day, potentially almost 24 extra hours. No credential was acquired during testing.

**Impact:** Extended opportunity to use a stolen credential; the documented ten-minute OTP and thirty-day session deadlines were not enforced accurately.

**Current implementation files:** functions/_auth-utils.ts; functions/api/auth/verify-otp.ts

**Fix performed:** Session expiry uses normalized SQL datetime comparison. New registration and OAuth challenges use integer epoch expiry. Logout revokes the server session and verification consumes the challenge transactionally.

**Retest and remaining verification:** Expired sessions and codes rejected in regression tests. Actual D1 concurrent verification returns one success and one failure; logout invalidates the session. Real deployment expiry checks remain part of rollout.


### KK-06 Repeated login and verification attempts lack application limits

**MEDIUM | FIXED AND VERIFIED | CONFIRMED application gap; POTENTIAL deployed abuse pending edge-rule inspection**

**Baseline location:** functions/api/auth/login.ts; register.ts; verify-otp.ts; functions/_auth-utils.ts:generateOtp

**Baseline weakness:** No attempt counters, account/IP throttles, registration email budget or cooldowns exist in the inspected handlers/schema. Six-digit OTPs use Math.random. OTPs are transported in GET query strings and retained in plaintext.

**Baseline evidence:** Twelve local bad-password requests all returned 401 and wrote no throttling state. Static inspection finds no middleware or counters. A full 900,000-code search was deliberately not performed. Cloudflare dashboard rate rules were unavailable.

**Plausible scenario:** An attacker attempts common passwords, guesses verification codes for pre-registered addresses, or consumes email/database capacity through repeated registration. An OTP alone verifies email; it does not reset a password or directly create a session.

**Impact:** Account abuse, identity-verification bypass and service costs. Practical exploit speed depends on deployed controls that were not inspected.

**Current implementation files:** functions/_security.ts; functions/_verification.ts; functions/api/_middleware.ts; functions/api/auth/register.ts; migrations/0001_security.sql

**Fix performed:** Atomic shared D1 limits protect IPs and accounts, with bounded cleanup and Retry-After. Verification codes use rejection-sampled cryptographic randomness and keyed HMAC storage, POST JSON only, ten-minute expiry and one-use consumption. Registration sends through waitUntil and removes the exact challenge after delivery failure.

**Retest and remaining verification:** Attempt caps, counter reset, concurrent limits, missing-secret failure, expired/wrong codes and single-use verification passed. Local workerd registration and mocked email delivery passed. Provider delivery, sender configuration and production traffic capacity remain NOT TESTED.


### KK-07 Project and asset inputs have insufficient validation and size limits

**MEDIUM | FIXED AND VERIFIED | CONFIRMED validation gap; resource-exhaustion impact not load-tested**

**Baseline location:** functions/api/designs/index.ts:onRequestPost; [id].ts:onRequestPut; src/routes/editor.tsx:132,413; Sidebar.tsx:295

**Baseline weakness:** Design routes accept arbitrary config/elements JSON without depth, string, element-count or numeric limits. Request.json reads the body before any application size budget. Local model imports have no byte/header/resource budget; accept allows GLB and GLTF despite GLB-only guidance.

**Baseline evidence:** A synthetic authenticated create with config.width=-1 and elements={invalid:true} returned 201. File uploads are stored in global IndexedDB and passed as blob URLs to the browser loader. The ten-project cap uses separate count and insert queries, so it is not atomic.

**Plausible scenario:** A signed-in client stores malformed or costly project content; a user imports an oversized or malformed model. Platform limits may stop some requests, but are not a product-specific safety budget.

**Impact:** Broken projects, browser stalls, excess storage/request costs and inconsistent free-tier limits. No service crash, decompression bomb or cross-user availability attack was executed.

**Current implementation files:** shared/validation.ts; src/lib/assetValidation.ts; functions/api/designs/index.ts; functions/api/designs/[id].ts; src/routes/editor.tsx

**Fix performed:** Shared schema and complexity budgets validate API, project import and local draft hydration. Cloud quota is enforced in one atomic insert. Custom model import accepts bounded self-contained GLB only and checks embedded resources, geometry counts and graph structure; logo images have size and pixel limits.

**Retest and remaining verification:** Cross-user read/update/delete, forged ownership, malformed JSON, unknown fields, hostile object keys, oversized/nested inputs and unsafe asset fixtures rejected. Real local D1 admits exactly ten of twelve concurrent saves. Ordinary built-editor draft renders. Broad file-format fuzzing and the complete model export matrix remain NOT TESTED.


### KK-08 Signing out leaves project data available on a shared browser

**MEDIUM | FIXED AND VERIFIED | CONFIRMED by implementation; full browser account-switch workflow not tested**

**Baseline location:** src/routes/editor.tsx:57-62,281-289,851-853; src/lib/customAssetDB.ts

**Baseline weakness:** Logout removes the server session but does not clear or separate current design state, stall-config, stall-elements, custom asset metadata or IndexedDB blobs by account.

**Baseline evidence:** signOut only calls DELETE /api/auth/me; the logout callback only clears sessionUser. Editor initialization reads the same global browser keys for every account.

**Plausible scenario:** A second person uses the same browser profile after the first person signs out, then opens the editor. Previous locally persisted design content can remain visible.

**Impact:** Local confidentiality loss on shared devices. This is not cross-user cloud API access and does not imply remote access to another browser's storage.

**Current implementation files:** src/lib/workspacePrivacy.ts; src/lib/customAssetDB.ts; src/routes/editor.tsx

**Fix performed:** Account-labelled workspace initialization runs before private content mounts. Ownership tokens prevent stale writes; logout/account changes clear localStorage, IndexedDB and mounted editor state. Explicit guest sign-in may preserve the guest draft; unlabelled legacy drafts are cleared.

**Retest and remaining verification:** fake-indexeddb regressions verify blob cleanup, account switches and stale-write rejection. Isolated browser smoke test confirms private draft removal and authenticated-editor unmount in two tabs after logout. Important legacy drafts must be exported before rollout.


### KK-09 The dependency tree needs security updates before development exposure

**MEDIUM | FIXED AND VERIFIED | CONFIRMED vulnerable versions; deployed exploitability NOT ESTABLISHED**

**Baseline location:** package.json; pnpm-lock.yaml; pnpm-workspace.yaml

**Baseline weakness:** The locked development/build/asset toolchain contains known advisories. The scanner reports 60 entries: 1 critical, 20 high, 29 moderate, 10 low. These are scanner counts, not 60 application findings.

**Baseline evidence:** Vitest 3.2.4 is below 3.2.6 for GHSA-5xrq-8626-4rwp; exploitation requires UI/API/browser mode exposure. Audit tests use run mode. Vite 7.3.3 has Windows dev-server advisories fixed in 7.3.5. sharp 0.34.5/0.33.5 is in development paths. fflate comes through three-stdlib and types dependencies; the vulnerable unzipSync path was not found used by this application.

**Plausible scenario:** A vulnerable developer server or future asset-processing path is exposed to untrusted inputs. Pages static files and Workers handlers do not themselves expose Vitest or a Node conversion service.

**Impact:** Potential developer-machine file access/execution or parser availability issues under advisory-specific conditions. No Critical deployed application vulnerability is established by the scanner result.

**Current implementation files:** package.json; pnpm-lock.yaml; pnpm-workspace.yaml; vite.config.ts

**Fix performed:** Removed unused conversion, Supabase, Three and developer tooling dependencies. Updated supported direct/transitive packages, pinned direct versions and committed the reproducible pnpm lockfile. Build-script permissions are explicit. A narrow Undici 7.28.0 to 7.29.0 override closes the remaining advisory path.

**Retest and remaining verification:** Final pnpm audit reports zero Critical, High, Moderate, Low or informational advisories. All 31 tests, API type check, production build, local workerd and built-editor smoke passed. This is an advisory snapshot, not proof that dependencies contain no vulnerabilities.


### KK-10 Private API responses did not explicitly prohibit caching

**LOW | FIXED AND VERIFIED | CONFIRMED missing header; private cache leakage not demonstrated**

**Baseline location:** functions/_auth-utils.ts:json

**Baseline weakness:** JSON responses containing account and design data had no Cache-Control policy. A proxy or browser policy could retain sensitive responses unnecessarily.

**Baseline evidence:** Public GET /api/auth/me returned 200 with user:null and no Cache-Control. The local helper test also returned null for that header. No authenticated public response or actual shared-cache leak was tested; Cloudflare reported DYNAMIC.

**Plausible scenario:** Sensitive responses are retained under deployment or browser caching defaults rather than an explicit privacy rule.

**Impact:** Potential residual data disclosure, dependent on caching configuration.

**Current implementation files:** functions/_security.ts; functions/_auth-utils.ts; src/lib/authClient.ts

**Fix performed:** Private API success, error and redirect responses explicitly prohibit caching. Auth client fetches also request no-store. Unnecessary credentialed wildcard CORS was removed.

**Retest and remaining verification:** Response regressions and actual local middleware checks confirm no-store and absence of wildcard CORS. Deployment header inspection remains outstanding.


### KK-11 Production browser protections are incomplete

**LOW | FIXED AND VERIFIED | CONFIRMED sampled headers; INFORMATIONAL HARDENING impact**

**Baseline location:** public/_headers; functions/_auth-utils.ts:json

**Baseline weakness:** The homepage lacks Content-Security-Policy and Strict-Transport-Security in the sampled response. API Functions do not inherit the inspected static frame/MIME/referrer headers. Permissions-Policy is absent.

**Baseline evidence:** Homepage has X-Frame-Options SAMEORIGIN, nosniff and strict-origin-when-cross-origin. GET /api/auth/me lacks those headers and has wildcard CORS plus Allow-Credentials true. Browsers reject that wildcard credentialed combination; it is not evidence of cross-origin credential disclosure.

**Plausible scenario:** Missing defense-in-depth increases the consequences of a future injection or insecure navigation. No HTTPS downgrade or frame attack was demonstrated.

**Impact:** Reduced browser safeguards; the confirmed SVG issue is counted separately rather than inflated by missing CSP.

**Current implementation files:** public/_headers; public/theme-init.js; functions/_security.ts; functions/api/_middleware.ts; index.html

**Fix performed:** Enforced static CSP permits the required local editor resources and approved provider hosts without inline JavaScript. Theme initialization moved to an external file. API middleware applies consistent MIME, framing, referrer and permission headers. HSTS excludes preload and includeSubDomains. Unsafe API requests require exact same-origin Origin.

**Retest and remaining verification:** Origin forgery and method checks passed in local workerd. The built editor rendered under the configured CSP with zero recorded CSP violations or page errors. Real CDN headers, HTTPS policy and all supported browser/provider/model combinations remain NOT TESTED.


### KK-12 Registration reveals whether an email has an account

**LOW | FIXED AND VERIFIED | CONFIRMED by handler implementation**

**Baseline location:** functions/api/auth/register.ts:29-34

**Baseline weakness:** Registration responds with an explicit account-exists message and 409 for known addresses, distinct from the successful new-account response.

**Baseline evidence:** The existing-email branch returns 'An account with this email already exists'. Login uses a generic invalid-credentials error for absent users and bad passwords; the verification-specific response requires a correct password.

**Plausible scenario:** An observer submits candidate emails to learn whether they are registered. No real-address enumeration was performed.

**Impact:** Account membership privacy loss and improved targeting for phishing or password attacks.

**Current implementation files:** functions/api/auth/register.ts; src/components/editor/AuthModal.tsx

**Fix performed:** Known and unknown email registration requests receive the same neutral 202 acknowledgement. Password hashing occurs before the existence branch and email delivery is asynchronous. Shared limits constrain repeated requests.

**Retest and remaining verification:** Synthetic known/unknown response status and body are identical; no real-address enumeration occurred. This reduces obvious enumeration but does not claim mathematically indistinguishable timing.

## 10. Fixes performed

All twelve findings received implementation fixes. Additive `migrations/0001_security.sql` creates rate-limit and pending challenge tables; it does not drop users or designs. `functions/_password-migration.ts` provides a bounded compare-and-update helper for administrative backfill. It is not an exposed HTTP endpoint, and no production backfill was executed.

Deploy frontend and API together because verification changed from GET to POST and cloud lists now return summaries fetched separately for loading. Configure SECURITY_SECRET and an approved RESEND_FROM before release. The password migration and account/session review must target the intended database explicitly. See `RELEASE_STEPS.md` for the ordered procedure and recovery limitations.

Budgets are 1 MiB project JSON, 500 total elements, 100-metre space dimensions, 120-character design names, 10 cloud designs, 25 MiB self-contained uncompressed GLB, 256 KiB logos and bounded embedded image dimensions. These are intentional product restrictions. Compressed/external custom models require conversion before import.

## 11. Retest results

| Validation | Measured result | Evidence |
|---|---|---|
| Full automated suite | PASS, 31 tests across 5 files | `all-tests-final.txt` |
| API TypeScript | PASS, no diagnostics | `typecheck-final.txt` |
| Deployable Pages Functions bundle | PASS, compiled locally with Wrangler | `functions-build-final.txt` |
| Production frontend build | PASS; existing large-chunk warning remains | `build-final.txt` |
| Actual local workerd and D1 | PASS: KDF, middleware, single-use verification, login, atomic quota, logout, mocked OAuth PKCE/replay | `worker-retest.txt` |
| Built-editor browser smoke | PASS: valid draft, enforced CSP, no page errors, two-tab sign-out cleanup | `browser-retest.txt` |
| Final package advisories | PASS, all severity counts zero | `dependency-retest.json` |

The build completed in about six minutes on this host; bundle-size warnings are performance observations, not security findings. KDF host wall time is not billed production CPU. Test-only routes and mock credentials reside under `security-audit`, outside Pages Functions and public assets.

## 12. Known limitations and untested areas

NOT TESTED: real provider login/email delivery; target database migrations and password backfill; historical affected-account/session review; production CPU allowance, rate-limit tuning and traffic capacity; deployed authenticated workflows and CDN headers; cloud IAM/WAF/secrets/CI permissions; complete model import/export compatibility; password reset, backups, disaster recovery, monitoring and incident response. The browser smoke uses synthetic APIs, not real provider cookies. JSDOM SVG tests do not replace a full malicious-file browser workflow.

No production state changed. Local pass results cannot be presented as a GREEN certification of the existing public deployment. Dependency scans are time-specific. The baseline secret pattern scan has coverage limits and cannot rule out credentials shared elsewhere.

## 13. Deferred future security reviews

Deeper business-logic penetration testing, advanced file-format fuzzing, denial-of-service resilience, monitoring and incident response, backup/recovery exercises, cloud/build permissions and privacy obligations need a subsequent review. Password recovery requires a separately reviewed implementation. Repeat assessment after project sharing, payments or server-side conversion are added.

## 14. Final public launch recommendation

**AMBER.** Proceed to a controlled release validation stage; do not describe the public launch as fully cleared yet. The local implementation has no remaining unimplemented finding from this focused audit, but three findings remain pending manual assurance. A GREEN decision requires evidence for these release gates:

1. Apply the additive migration, configure secrets and approved sender, backfill legacy passwords, review previously Google-linked accounts and revoke affected old sessions using the controlled procedure. Verify the KDF against the target CPU allowance.
2. Run real Google and email lifecycle checks on HTTPS staging, including returning/new users, cancellation, account collisions, delivery failures and code expiry.
3. Deploy the reviewed frontend/API together and verify actual headers, two-account cloud operations, shared-browser cleanup and representative file imports/exports on supported browsers.

A security review reduces risk but cannot prove zero vulnerabilities. No current finding was marked safe merely to obtain a desired color.

## Supporting references

- [OWASP password storage guidance](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Cloudflare Workers Node crypto support](https://developers.cloudflare.com/workers/runtime-apis/nodejs/crypto/)
- [Google OpenID Connect](https://developers.google.com/identity/openid-connect/openid-connect)

## Evidence inventory

Current: `findings.json`, `all-tests-final.txt`, `typecheck-final.txt`, `build-final.txt`, `dependency-retest.json`, `worker-retest.txt`, `browser-retest.txt`, security test sources and `RELEASE_STEPS.md`. Historical: `baseline-findings.json`, `ORIGINAL_FINDINGS.md`, `baseline-tests.txt`, `dependency-audit-online.json`, `secret-scan.json` and the two public header samples. Earlier retest logs are historical; final logs above are authoritative.


## Document delivery verification

The stakeholder DOCX passed structural ZIP/XML, required-section, finding-count, page-number-field and exact local-secret-value exclusion checks. Visual pagination QA could not be completed: the packaged renderer lacked LibreOffice, and a Microsoft Word background render stalled and was stopped. The DOCX should be visually checked in Word before external circulation. No PDF/rendered pages are delivered.
