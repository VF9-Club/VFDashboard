## 2026-01-28 - Hardcoded Secrets in Serverless Functions

**Vulnerability:** Found a hardcoded "X-HASH" secret key (`[REDACTED]`) directly in `src/pages/api/proxy/[...path].js`.
**Learning:** Even if a secret is "reverse engineered" or shared, hardcoding it in the codebase exposes it to anyone with source access (including third-party tools or leaks).
**Prevention:** Always use environment variables for secrets (`import.meta.env` or `process.env`). In Astro Cloudflare adapter, ensure secrets are accessed via `context.locals.runtime.env` for runtime binding, with fallbacks for development. Also ensure error messages do not leak internal stack traces or details.
