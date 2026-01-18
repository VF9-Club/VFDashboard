import {
  REGIONS,
  DEFAULT_REGION,
  CORE_TELEMETRY_ALIASES,
  FALLBACK_TELEMETRY_RESOURCES,
} from "../config/vinfast";
import staticAliasMap from "../config/static_alias_map.json";
import { parseTelemetry } from "../utils/telemetryMapper";

class VinFastAPI {
  constructor() {
    this.region = DEFAULT_REGION;
    this.regionConfig = REGIONS[DEFAULT_REGION];
    this.accessToken = null;
    this.refreshToken = null;
    this.vin = null;
    this.userId = null;
    this.aliasMappings = staticAliasMap;

    // Load session on init
    this.restoreSession();
  }

  setRegion(region) {
    this.region = region;
    this.regionConfig = REGIONS[region] || REGIONS[DEFAULT_REGION];
  }

  saveSession() {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(
        "vf_session",
        JSON.stringify({
          accessToken: this.accessToken,
          refreshToken: this.refreshToken,
          vin: this.vin,
          userId: this.userId,
          region: this.region,
          timestamp: Date.now(),
        }),
      );
    } catch (e) {
      // localStorage not available
    }
  }

  restoreSession() {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return;
    try {
      const raw = localStorage.getItem("vf_session");
      if (raw) {
        const data = JSON.parse(raw);
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
        this.vin = data.vin;
        this.userId = data.userId;
        if (data.region) this.setRegion(data.region);
      }
    } catch (e) {
      console.error("Failed to restore session", e);
    }
  }

  clearSession() {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return;
    try {
      localStorage.removeItem("vf_session");
    } catch (e) {
      // localStorage not available
    }
    this.accessToken = null;
    this.refreshToken = null;
    this.vin = null;
    this.userId = null;
  }

  _getHeaders() {
    if (!this.accessToken) {
      throw new Error("No access token available");
    }
    // Mobile App Headers (simplified for browser CORS if needed, but keeping standard for now)
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${this.accessToken}`,
      "x-service-name": "CAPP",
      "x-app-version": "1.10.3",
      "x-device-platform": "VFDashBoard",
      "x-device-family": "Community",
      "x-device-os-version": "1.0",
      "x-device-locale": "en-US",
      "x-timezone": "Asia/Ho_Chi_Minh",
      "x-device-identifier": "vfdashboard-community-edition",
    };
    if (this.vin) headers["x-vin-code"] = this.vin;
    if (this.userId) headers["x-player-identifier"] = this.userId;
    return headers;
  }

  async authenticate(email, password, region = "vn") {
    this.setRegion(region);
    // Use local proxy
    const url = `/api/login`;
    const payload = {
      email,
      password,
      region: this.region,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `Authentication failed: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;

      this.saveSession();

      // Immediately fetch user profile to get User ID if possible,
      // but usually getVehicles is better for that.
      return {
        access_token: this.accessToken,
        refresh_token: this.refreshToken,
      };
    } catch (error) {
      console.error("Auth Error:", error);
      throw error;
    }
  }

  async refreshAccessToken() {
    if (!this.refreshToken) return false;

    // TODO: Implement Refresh Proxy if needed.
    // For now, logging out is safer than complex refresh logic without a dedicated endpoint which we haven't built yet.
    // Ideally we add /api/refresh.
    console.warn("Token Refresh not fully implemented via Proxy. Logging out.");
    this.clearSession();
    return false;
  }

  async _fetchWithRetry(url, options = {}) {
    // Inject headers
    options.headers = options.headers || this._getHeaders();

    let response = await fetch(url, options);

    if (response.status === 401) {
      console.warn("Received 401. Trying to refresh token...");
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        // Update header with new token
        options.headers.Authorization = `Bearer ${this.accessToken}`;
        response = await fetch(url, options);
      } else {
        // Refresh failed, likely session expired
        window.location.href = "/login";
        throw new Error("Session expired");
      }
    }
    return response;
  }

  async getVehicles() {
    // Proxy user-vehicle
    // Original: ${this.regionConfig.api_base}/ccarusermgnt/api/v1/user-vehicle
    const proxyPath = `ccarusermgnt/api/v1/user-vehicle`;
    const url = `/api/proxy/${proxyPath}?region=${this.region}`;

    const response = await this._fetchWithRetry(url);
    if (!response.ok) throw new Error("Failed to fetch vehicles");

    const json = await response.json();

    if (json.data && json.data.length > 0) {
      // Auto-select first vehicle
      this.vin = json.data[0].vinCode;
      this.userId = json.data[0].userId;
      this.saveSession();
    }
    return json.data || [];
  }

  async getUserProfile() {
    // User Info is on Auth0, not API Base.
    // We need a separate proxy logic OR just hit it directly if it allows CORS (Auth0 /userinfo usually supports CORS).
    // Let's try direct first for standard OIDC, if fails we proxy.
    // Update: userinfo almost always CORS enabled if properly configured.
    // If we MUST proxy, we need a special case in our generic proxy or a new route.
    // Let's stick to direct for now, and fallback later if needed.

    const url = `https://${this.regionConfig.auth0_domain}/userinfo`;
    const response = await this._fetchWithRetry(url, {
      headers: { Authorization: `Bearer ${this.accessToken}` }, // Override standard headers
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.status}`);
    }

    return await response.json();
  }

  // --- External Integrations (Weather/Map) ---

  async fetchLocationName(lat, lon) {
    if (!lat || !lon) return null;
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
      // Nominatim requires a User-Agent, browsers send one automatically but let's be polite if possible
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const a = data.address || {};
        const strip = (s) =>
          s
            ? s
                .replace(/^(Thành phố|Tỉnh|Quận|Huyện|Xã|Phường)\s+/gi, "")
                .trim()
            : s;

        const rawDistrict = a.city_district || a.district || a.county;
        const rawCity = a.city || a.town || a.village || a.state || a.province;

        return {
          location_address: [
            strip(rawDistrict),
            strip(rawCity),
            (a.country_code || "VN").toUpperCase(),
          ]
            .filter(Boolean)
            .join(", "),
          weather_address: [
            strip(rawCity),
            (a.country_code || "VN").toUpperCase(),
          ]
            .filter(Boolean)
            .join(", "),
        };
      }
    } catch (e) {
      console.warn("Location fetch failed", e);
    }
    return null;
  }

  async fetchWeather(lat, lon) {
    if (!lat || !lon) return null;
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return data.current_weather;
      }
    } catch (e) {
      console.warn("Weather fetch failed", e);
    }
    return null;
  }

  async getTelemetry(vin) {
    if (vin) {
      this.vin = vin;
      this.saveSession();
    }
    if (!this.vin) throw new Error("VIN is required");

    const requestObjects = [];
    const pathToAlias = {};

    // Build Request List
    CORE_TELEMETRY_ALIASES.forEach((alias) => {
      if (this.aliasMappings[alias]) {
        const m = this.aliasMappings[alias];
        requestObjects.push({
          objectId: m.objectId,
          instanceId: m.instanceId,
          resourceId: m.resourceId,
        });
        const path = `/${m.objectId}/${m.instanceId}/${m.resourceId}`;
        pathToAlias[path] = alias;
      }
    });

    FALLBACK_TELEMETRY_RESOURCES.forEach((path) => {
      const parts = path.split("/").filter((p) => p);
      if (parts.length === 3) {
        // Deduplicate
        const exists = requestObjects.find(
          (r) =>
            r.objectId == parts[0] &&
            r.instanceId == parts[1] &&
            r.resourceId == parts[2],
        );
        if (!exists) {
          requestObjects.push({
            objectId: parts[0],
            instanceId: parts[1],
            resourceId: parts[2],
          });
        }
      }
    });

    const proxyPath = `ccaraccessmgmt/api/v1/telemetry/app/ping`;
    const url = `/api/proxy/${proxyPath}?region=${this.region}`;

    const response = await this._fetchWithRetry(url, {
      method: "POST",
      body: JSON.stringify(requestObjects),
    });

    if (!response.ok)
      throw new Error(`Telemetry fetch failed: ${response.status}`);

    const json = await response.json();
    const parsed = parseTelemetry(json.data, pathToAlias);

    // Enrich with Location/Weather if coordinates exist
    if (parsed.latitude && parsed.longitude) {
      // Fire and forget / parallel promise to not block UI?
      // For simplicity, let's await them or return them as raw promises if store handles it.
      // Let's await for a coherent state update.
      const [geo, weather] = await Promise.all([
        this.fetchLocationName(parsed.latitude, parsed.longitude),
        this.fetchWeather(parsed.latitude, parsed.longitude),
      ]);

      if (geo) {
        parsed.location_address = geo.location_address;
        parsed.weather_address = geo.weather_address;
      }
      if (weather) {
        parsed.outside_temp = weather.temperature; // Override/Fallback
        parsed.weather_code = weather.weathercode;
      }
    }

    return parsed;
  }
}

export const api = new VinFastAPI();
