## 2025-02-23 - Hardcoded Shared Secrets
**Vulnerability:** The codebase contained a hardcoded `XHASH_SECRET_KEY` ("Vinfast@2025") used for signing API requests.
**Learning:** This key appears to be a static key reverse-engineered from the mobile app, making it effectively public knowledge in the context of this API integration.
**Prevention:** While moved to `VINFAST_XHASH_SECRET` environment variable for best practice, the hardcoded value was retained as a fallback to preventing breaking the app for users who haven't updated their environment config. Future "secrets" that are actually shared protocol constants should be documented as such, distinguishing them from true private keys.
