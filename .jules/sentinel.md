## 2026-01-18 - Hardcoded Secrets in Proxy

**Vulnerability:** Found `XHASH_SECRET_KEY` hardcoded in `src/pages/api/proxy/[...path].js`.
**Learning:** Developers sometimes hardcode secrets reverse-engineered from mobile apps directly into the codebase.
**Prevention:** Always use environment variables for secrets, even if they are technically "known" public secrets (like client-side API keys), to prevent repo leakage and allow rotation.
