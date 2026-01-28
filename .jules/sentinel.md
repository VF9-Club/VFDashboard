## 2026-01-20 - Hardcoded API Secrets
**Vulnerability:** A critical API secret (`XHASH_SECRET_KEY`) was hardcoded directly in `src/pages/api/proxy/[...path].js`.
**Learning:** Even "reverse-engineered" keys should be treated as secrets in the codebase to prevent accidental exposure and to allow for rotation/configuration changes without code deploys.
**Prevention:** Use environment variables (`context.locals.runtime.env` in Cloudflare, `import.meta.env` in Astro) and fail securely if they are missing.
