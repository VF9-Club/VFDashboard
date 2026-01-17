## 2024-05-22 - Missing Caching Infrastructure
**Learning:** The backend makes external API calls (Nominatim, Open-Meteo) directly in the request path without caching, despite memory suggesting otherwise.
**Action:** Always verify existence of infrastructure code (like caching utils) before assuming it exists. Implemented `SimpleCache` with strict size limits to prevent memory leaks.
