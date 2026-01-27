## 2026-01-18 - Hardcoded Secrets with Legacy Fallbacks

**Vulnerability:** Found a hardcoded "X-HASH" secret key in `src/pages/api/proxy/[...path].js` which is used for API request signing.
**Learning:** Legacy projects often contain hardcoded secrets that cannot be immediately removed without breaking the application in environments where environment variables are not yet configured.
**Prevention:** Use a "Priority Resolution" pattern: `Env Var > Legacy Fallback`. Rename the hardcoded secret to `DEFAULT_...` or `LEGACY_...` and log a warning when it is used. This allows for immediate security improvement (support for Env Vars) and gradual migration (removing the fallback later).
