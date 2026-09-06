# Original findings recorded before remediation

Baseline: commit 366f89f, clean tracked working tree; assessed 6 September 2026.
The baseline security run is retained in baseline-tests.txt: 6 failed security assertions, 5 passed checks. Synthetic SQLite databases and mocked Google responses were used; no real account was modified.

| ID | Severity | Original problem | Evidence |
|---|---|---|---|
| KK-01 | HIGH | Unsalted single SHA-256 password storage | functions/_auth-utils.ts:5-15; identical-password hash test |
| KK-02 | HIGH | Uploaded/imported SVG becomes executable HTML | Properties.tsx:509, editor.tsx:421-425; actual rendered component event handler sets synthetic marker |
| KK-03 | HIGH | OAuth silently merges accounts by email and trusts unverified email | google.ts:70-91; mocked unverified email receives session; pre-registered password is retained on merge |
| KK-04 | MEDIUM | OAuth state generated but never bound or validated | google.ts:34-47; callback reaches mocked token service without state |
| KK-05 | MEDIUM | OTP and session expiry use incompatible timestamp strings | _auth-utils.ts:41, verify-otp.ts:28; expired records accepted on same UTC date |
| KK-06 | MEDIUM | No application login/OTP/registration throttling; OTP uses Math.random | all auth handlers; 12 bounded synthetic login attempts all receive 401, no attempt state |
| KK-07 | MEDIUM | No bounded design request schema or upload size budget | designs routes accept object elements and negative dimensions; editor.tsx:132 and Sidebar.tsx:297 |
| KK-08 | MEDIUM | Previous user's design persists after logout on shared browser | editor.tsx:57-62,281-289,851-853; customAssetDB global store; signOut only deletes server session |
| KK-09 | MEDIUM | Vulnerable development and asset-processing dependency tree | successful pnpm audit; 60 advisory entries, including critical Vitest UI advisory; deployed exploitability not established |
| KK-10 | LOW | Private API responses lack explicit no-store | _auth-utils.ts:69-80; local test and unauthenticated public response |
| KK-11 | LOW | Incomplete production response-header protections | public homepage lacks CSP/HSTS; Functions response lacks static security headers |
| KK-12 | LOW | Registration discloses whether an email is registered | register.ts:34; explicit 409 response |

No cross-user design read, modification, deletion, rename, SQL injection, or forged-owner create was demonstrated. No server-side upload/conversion endpoint or password reset implementation was located. No committed secret was identified by the scoped pattern scan of 810 current/historical/build objects; an ignored local OAuth secret exists in .env and was not printed. Edge rate-limit rules, deployed credentials, and authenticated public workflows are not inspected.

Planned bounded fixes: remove HTML SVG sink, reject implicit OAuth email linking and unverified identities, bind and check OAuth state, normalize expiry comparisons, apply private-response no-store. Password-hash migration needs a Cloudflare-supported KDF and CPU-budget validation; do not silently lock out existing users. Distributed abuse limits and request/asset budgets require separate schema/deployment work and remain open.
