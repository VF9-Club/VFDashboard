## 2026-01-18 - Hardcoded X-HASH Secret
**Vulnerability:** A static secret key (`Vinfast@2025`) used for HMAC generation was hardcoded in `src/pages/api/proxy/[...path].js`.
**Learning:** Hardcoding secrets, even those considered "known" or "reverse-engineered" from public apps, violates security best practices and makes the code inflexible. It also sets a bad precedent for other developers.
**Prevention:** Strictly enforce the use of environment variables (`import.meta.env` or platform-specific context) for all secrets. Added `.env.example` to guide secure configuration.
