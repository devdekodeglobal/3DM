-- Apply to an existing database before deploying the security release.
-- Additive tables; legacy sessions/OTP codes remain intact for controlled rollout.
CREATE TABLE IF NOT EXISTS security_limits (
  id TEXT PRIMARY KEY,
  hits INTEGER NOT NULL,
  reset_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_security_limits_reset ON security_limits(reset_at);
CREATE TABLE IF NOT EXISTS registration_challenges (
  email TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  code_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_registration_expiry ON registration_challenges(expires_at);
CREATE TABLE IF NOT EXISTS oauth_challenges (
  id TEXT PRIMARY KEY,
  verifier TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_oauth_expiry ON oauth_challenges(expires_at);
