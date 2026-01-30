## 2026-01-18 - Hardcoded API Secret
**Vulnerability:** A critical API secret `Vinfast@2025` was hardcoded in `src/pages/api/proxy/[...path].js`.
**Learning:** Hardcoded secrets in source code are easily exposed if the repo is public or compromised.
**Prevention:** Always use environment variables for secrets, even for internal tools. Added failing check for missing env var.
