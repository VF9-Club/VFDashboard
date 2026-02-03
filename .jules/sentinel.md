## 2026-02-03 - Hardcoded Secrets in API Proxy

**Vulnerability:** A critical API secret (`XHASH_SECRET_KEY`) used for HMAC signatures was hardcoded directly in `src/pages/api/proxy/[...path].js`.
**Learning:** The secret was likely hardcoded during the "reverse-engineering" phase and never moved to environment variables. Even "known" secrets (if extracted from public APKs) should not be committed to the repo to maintain security best practices and allow for rotation.
**Prevention:** Enforce environment variable usage for all cryptographic keys and sensitive configuration values. Use linting rules or pre-commit hooks to scan for potential secrets.
