## 2025-02-20 - Hardcoded API Secret in Proxy
**Vulnerability:** A hardcoded HMAC secret key ("Vinfast@2025") was found in `src/pages/api/proxy/[...path].js`.
**Learning:** Secrets embedded in source code can be extracted even if the code is transpiled or if the repo is leaked.
**Prevention:** Always use environment variables for secrets. Use `import.meta.env` or platform-specific runtime environment objects (like `locals.runtime.env` in Cloudflare) to access them.
