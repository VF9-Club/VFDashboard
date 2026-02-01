# Sentinel's Journal

## 2026-01-20 - Hardcoded Secret in API Proxy

**Vulnerability:** Found `XHASH_SECRET_KEY = "Vinfast@2025"` hardcoded in `src/pages/api/proxy/[...path].js`.
**Learning:** Secrets should never be committed to source code, as they can be easily extracted.
**Prevention:** Use environment variables for all secrets and API keys. Use tools like `git-secrets` or pre-commit hooks to detect secrets.
