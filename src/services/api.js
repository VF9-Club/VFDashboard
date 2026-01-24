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
        let errorMessage = "An unexpected error occurred. Please try again.";
        try {
          const errorData = await response.json();
          // Use message from server if it's safe/clean, otherwise fallback based on status
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // JSON parse failed, stick to status mapping
        }

        if (response.status === 401) {
          errorMessage =
            "Incorrect email or password. Please check your credentials.";
        } else if (response.status === 403) {
          errorMessage =
            "Access denied. Your account may be locked or restricted.";
        } else if (response.status === 429) {
          errorMessage = "Too many attempts. Please try again later.";
        } else if (response.status >= 500) {
          errorMessage = "VinFast server error. Please try again later.";
        }

        throw new Error(errorMessage);
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

  // --- Full Telemetry Methods ---

  async getAliases(vin, version = "1.0") {
    if (vin) this.vin = vin;
    if (!this.vin) throw new Error("VIN is required");

    const proxyPath = `modelmgmt/api/v2/vehicle-model/mobile-app/vehicle/get-alias`;
    const url = `/api/proxy/${proxyPath}?region=${this.region}&version=${version}`;

    const response = await this._fetchWithRetry(url);
    if (!response.ok) throw new Error("Failed to fetch aliases");

    const json = await response.json();
    let resources = [];

    // Robust parsing logic
    if (json.data && json.data.resources) {
      resources = json.data.resources;
    } else if (json.data && json.data.data && json.data.data.resources) {
      resources = json.data.data.resources;
    } else if (Array.isArray(json.data)) {
      resources = json.data;
    } else if (Array.isArray(json.resources)) {
      resources = json.resources;
    } else if (Array.isArray(json)) {
      resources = json;
    }

    if (resources.length === 0) {
      console.warn("getAliases: No resources found in response:", json);
      // Handle business-logic 401 (sometimes in body with 200 OK)
      if (json.code === 401000 || json.message?.includes("expired")) {
        this.clearSession();
        window.location.href = "/login";
        throw new Error("Session expired (API Code 401000)");
      }
    }

    return resources;
  }

  async getRawTelemetry(vin, requestObjects) {
    if (vin) this.vin = vin;
    if (!this.vin) throw new Error("VIN is required");

    if (!requestObjects || requestObjects.length === 0) return [];

    const proxyPath = `ccaraccessmgmt/api/v1/telemetry/app/ping`;
    const url = `/api/proxy/${proxyPath}?region=${this.region}`;

    const response = await this._fetchWithRetry(url, {
      method: "POST",
      body: JSON.stringify(requestObjects),
    });

    if (!response.ok)
      throw new Error(`Raw Telemetry fetch failed: ${response.status}`);

    const json = await response.json();
    return json.data || [];
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

  // ============================================
  // CHARGING STATIONS API
  // ============================================

  /**
   * Search for nearby charging stations
   * @param {number} latitude - Current latitude
   * @param {number} longitude - Current longitude
   * @param {number} page - Page number (0-indexed)
   * @param {number} size - Page size
   * @returns {Promise<Array>} List of charging stations
   */
  async searchChargingStations(latitude, longitude, page = 0, size = 20) {
    if (!this.vin) throw new Error("VIN is required");

    const proxyPath = `ccarcharging/api/v1/stations/search`;
    const url = `/api/proxy/${proxyPath}?region=${this.region}&page=${page}&size=${size}`;

    const body = {
      latitude,
      longitude,
      excludeFavorite: false,
    };

    try {
      const response = await this._fetchWithRetry(url, {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.warn(`Charging stations search failed: ${response.status}`);
        return [];
      }

      const json = await response.json();

      // Parse response - adjust based on actual API response structure
      if (json.data && Array.isArray(json.data.content)) {
        return json.data.content.map(this._parseChargingStation);
      } else if (json.data && Array.isArray(json.data)) {
        return json.data.map(this._parseChargingStation);
      } else if (Array.isArray(json.content)) {
        return json.content.map(this._parseChargingStation);
      }

      return [];
    } catch (e) {
      console.error("Error fetching charging stations:", e);
      return [];
    }
  }

  /**
   * Parse charging station data from API response
   * Based on actual VinFast API structure from Charles capture
   * Returns format compatible with chargingStore.ChargingStation interface
   */
  _parseChargingStation(station) {
    // Parse connectors with power info
    const connectors = station.connectors || [];

    // Calculate totals from connectors
    const totalConnectors = connectors.reduce((sum, c) => sum + (c.total || 0), 0) || station.totalEvse || 0;
    const availableConnectors = connectors.reduce((sum, c) => sum + (c.count || 0), 0) || station.numberOfAvailableEvse || 0;

    // Extract connector types (convert power to type string)
    const connectorTypes = connectors.map(c => {
      const powerKw = c.type ? c.type / 1000 : 0;
      if (powerKw >= 50) return "DC";
      if (powerKw >= 22) return "AC Type 2";
      return "AC";
    }).filter((v, i, a) => a.indexOf(v) === i); // unique

    // Calculate max power from connectors (in kW)
    const maxPowerWatts = Math.max(...connectors.map(c => c.type || 0), 0);
    const maxPower = maxPowerWatts / 1000;

    // Map status to expected enum
    let status = "available";
    if (station.depotStatus === "AllBusy" || availableConnectors === 0) {
      status = "busy";
    } else if (station.depotStatus === "Offline" || !station.isInWorkingTime) {
      status = "offline";
    }

    return {
      // Required by chargingStore.ChargingStation interface
      id: station.locationId || station.id,
      name: station.stationName || "VinFast Charging",
      address: station.stationAddress || "",
      latitude: station.latitude,
      longitude: station.longitude,
      distance: station.distance || 0,
      totalConnectors,
      availableConnectors,
      connectorTypes: connectorTypes.length > 0 ? connectorTypes : ["AC"],
      maxPower: maxPower || 11,
      status,
      operatingHours: station.workingTimeDescription || "24/7",
      amenities: [],

      // Extended data from new API
      locationId: station.locationId,
      province: station.province,
      provinceCode: station.provinceCode,
      district: station.district,
      districtCode: station.districtCode,
      depotStatus: station.depotStatus,
      isPublic: station.isPublic || false,
      isFreeParking: station.isFreeParking || false,
      isInWorkingTime: station.isInWorkingTime !== false,
      images: (station.images || []).map(img => img.url || img.thumbnail),
      favorite: station.favorite || false,
      reservationId: station.reservationId,
      connectors: connectors.map(c => ({
        type: c.type,
        powerKw: c.type ? c.type / 1000 : 0,
        status: c.status,
        available: c.count || 0,
        total: c.total || 0,
      })),
    };
  }

  // ============================================
  // CHARGING SESSIONS (HISTORY) API
  // ============================================

  /**
   * Get charging sessions history
   * Uses POST /ccarcharging/api/v1/charging-sessions/search with orderStatus filter
   * @param {number} page - Page number (ignored, kept for backward compatibility)
   * @param {number} size - Page size (ignored, kept for backward compatibility)
   * @param {Array<number>} orderStatus - Status codes: 3=COMPLETED, 5=CANCELLED, 7=ERROR
   * @returns {Promise<Object>} Charging sessions with pagination info
   */
  async getChargingSessions(page = 0, size = 20, orderStatus = [3, 5, 7]) {
    if (!this.vin) throw new Error("VIN is required");

    const proxyPath = `ccarcharging/api/v1/charging-sessions/search`;
    const url = `/api/proxy/${proxyPath}?region=${this.region}`;

    const body = { orderStatus };

    try {
      const response = await this._fetchWithRetry(url, {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.warn(`Charging sessions fetch failed: ${response.status}`);
        return { sessions: [], total: 0, page, size };
      }

      const json = await response.json();

      // Parse response - API returns array directly in data
      let sessions = [];
      if (json.data && Array.isArray(json.data)) {
        sessions = json.data.map(this._parseChargingSession);
      }

      return { sessions, total: sessions.length, page, size };
    } catch (e) {
      console.error("Error fetching charging sessions:", e);
      return { sessions: [], total: 0, page, size };
    }
  }

  /**
   * Parse charging session data from API response
   * Based on actual VinFast API structure from Charles capture
   * Returns format compatible with chargingStore.ChargingSession interface
   */
  _parseChargingSession(session) {
    const startTime = session.startChargeTime ? new Date(session.startChargeTime) : null;
    const endTime = session.endChargeTime ? new Date(session.endChargeTime) : null;

    // Calculate cost - use finalAmount (after discount) or amount
    const cost = session.finalAmount || session.amount || 0;
    const kWh = parseFloat(session.totalKWCharged) || 0;

    // Get price per kWh from items if available
    let maxPower = 0;
    let connectorType = "AC";
    if (session.items && session.items.length > 0) {
      const item = session.items[0];
      // Estimate connector type from price (DC typically > 4000 VND/kWh)
      if (item.price > 4000) {
        connectorType = "DC";
        maxPower = 150; // Assume DC fast charger
      } else {
        connectorType = "AC";
        maxPower = 11; // Assume AC charger
      }
    }

    return {
      // Required by chargingStore.ChargingSession
      id: session.id,
      stationName: session.chargingStationName || "VinFast Charging",
      stationAddress: session.chargingStationAddress || "",
      date: startTime,
      startTime: startTime ? startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }) : null,
      endTime: endTime ? endTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }) : null,
      startSoc: 0, // Not provided by API
      endSoc: 0,   // Not provided by API
      kWh,
      cost,
      currency: "VND",
      connectorType,
      maxPower,
      duration: startTime && endTime ? Math.round((endTime - startTime) / 60000) : 0,

      // Extended data from new API
      locationId: session.locationId,
      province: session.province,
      district: session.district,
      amount: session.amount || 0,
      discount: session.discount || 0,
      finalAmount: session.finalAmount || 0,
      status: session.status || (session.orderStatus === 3 ? "COMPLETED" : "UNKNOWN"),
      orderStatus: session.orderStatus,
      vehicleId: session.vehicleId,
      promotions: (session.promotions || []).map(promo => ({
        name: promo.name,
        description: promo.description,
        discount: promo.discount || 0,
      })),
    };
  }

  // ============================================
  // TRIP HISTORY API
  // ============================================

  /**
   * Get trip history - uses driving-trend API since VinFast doesn't have dedicated trip history
   * Converts daily driving data into trip-like entries
   * @param {string} from - Start date (YYYY-MM-DD) - ignored, uses driving-trend data
   * @param {string} to - End date (YYYY-MM-DD) - ignored, uses driving-trend data
   * @param {number} page - Page number
   * @param {number} size - Page size
   * @returns {Promise<Object>} Trip history with pagination
   */
  async getTripHistory(from = null, to = null, page = 0, size = 20) {
    if (!this.vin) throw new Error("VIN is required");

    try {
      // Use driving-trend API since there's no dedicated trip history API
      const drivingTrend = await this.getDrivingTrend();

      if (!drivingTrend || !drivingTrend.days) {
        console.warn("No driving trend data available for trip history");
        return { trips: [], total: 0, page, size };
      }

      // Convert daily data to trip-like entries
      // Filter days with actual driving (distance > 0)
      const daysWithDriving = drivingTrend.days
        .filter(d => d.distance > 0)
        .sort((a, b) => b.time - a.time); // Sort by date descending

      const total = daysWithDriving.length;

      // Paginate
      const startIdx = page * size;
      const endIdx = startIdx + size;
      const paginatedDays = daysWithDriving.slice(startIdx, endIdx);

      // Convert to trip format
      const trips = paginatedDays.map((day, index) => {
        const date = new Date(day.time * 1000);
        const distance = day.distance || 0;
        const energyConsumed = day.fuel || 0; // 'fuel' is energy for EV
        const efficiency = distance > 0 ? Math.round((energyConsumed * 1000) / distance) : 0;

        // Estimate duration based on average speed (assume 30 km/h average in city)
        const avgSpeed = 30;
        const duration = distance > 0 ? Math.round((distance / avgSpeed) * 60) : 0;

        return {
          id: `trip-${day.time}`,
          date,
          startLocation: "Daily Summary",
          endLocation: `${distance.toFixed(1)} km driven`,
          startCoords: { lat: 0, lng: 0 },
          endCoords: { lat: 0, lng: 0 },
          distance: Math.round(distance * 10) / 10,
          duration,
          energyConsumed: Math.round(energyConsumed * 10) / 10,
          avgSpeed,
          maxSpeed: 0,
          startSoc: 0,
          endSoc: 0,
          efficiency,
        };
      });

      return { trips, total, page, size };
    } catch (e) {
      console.error("Error fetching trip history:", e);
      return { trips: [], total: 0, page, size };
    }
  }

  /**
   * Parse trip data (kept for backward compatibility if real trip API becomes available)
   */
  _parseTripData(trip) {
    const startTime = trip.startTime ? new Date(trip.startTime) : null;
    const endTime = trip.endTime ? new Date(trip.endTime) : null;

    return {
      id: trip.tripId || trip.id,
      date: startTime,
      startLocation: trip.startLocation || trip.startAddress || "Unknown",
      endLocation: trip.endLocation || trip.endAddress || "Unknown",
      startCoords: {
        lat: trip.startLatitude || trip.startLat,
        lng: trip.startLongitude || trip.startLng || trip.startLon,
      },
      endCoords: {
        lat: trip.endLatitude || trip.endLat,
        lng: trip.endLongitude || trip.endLng || trip.endLon,
      },
      distance: trip.distance || trip.totalDistance || 0,
      duration: trip.duration || (startTime && endTime ? Math.round((endTime - startTime) / 60000) : 0),
      energyConsumed: trip.energyConsumed || trip.energy || 0,
      avgSpeed: trip.avgSpeed || trip.averageSpeed || 0,
      maxSpeed: trip.maxSpeed || 0,
      startSoc: trip.startSoc || trip.socStart || 0,
      endSoc: trip.endSoc || trip.socEnd || 0,
      efficiency: trip.efficiency || (trip.distance > 0 && trip.energyConsumed > 0
        ? Math.round((trip.energyConsumed * 1000) / trip.distance)
        : 0),
    };
  }

  // ============================================
  // DRIVING TREND / ENERGY STATISTICS API
  // ============================================

  /**
   * Get driving trend info from VinFast API
   * Uses GET /ccaraccessmgmt/api/v1/c-app/driving-trend/info
   * Returns daily driving statistics (distance, fuel/energy consumption)
   * @returns {Promise<Object>} Driving trend data with daily breakdown
   */
  async getDrivingTrend() {
    if (!this.vin) throw new Error("VIN is required");

    const proxyPath = `ccaraccessmgmt/api/v1/c-app/driving-trend/info`;
    const url = `/api/proxy/${proxyPath}?region=${this.region}`;

    try {
      console.log("[API] Fetching driving trend from:", url);
      const response = await this._fetchWithRetry(url);

      if (!response.ok) {
        console.warn(`[API] Driving trend fetch failed: ${response.status}`);
        return null;
      }

      const json = await response.json();
      console.log("[API] Driving trend response:", json.code, json.message, "days:", json.data?.days?.length || 0);

      if (json.code !== 200000) {
        console.warn("[API] Driving trend API error:", json.message);
        return null;
      }

      return json.data || null;
    } catch (e) {
      console.error("[API] Error fetching driving trend:", e);
      return null;
    }
  }

  /**
   * Get energy statistics - uses real VinFast driving-trend API + charging sessions
   * @param {string} period - "week" or "month"
   * @returns {Promise<Object>} Energy statistics
   */
  async getEnergyStats(period = "week") {
    if (!this.vin) throw new Error("VIN is required");

    try {
      // Fetch both driving trend and charging sessions
      const [drivingTrend, chargingData] = await Promise.all([
        this.getDrivingTrend(),
        this.getChargingSessions(0, 100),
      ]);

      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      // Calculate period cutoff
      const now = Date.now();
      const periodDays = period === "week" ? 7 : 30;
      const cutoffTime = now - (periodDays * 24 * 60 * 60 * 1000);
      const cutoffTimeSec = cutoffTime / 1000;

      // Process driving trend data
      let totalDistance = 0;
      let totalConsumed = 0;
      let tripCount = 0;
      let dailyData = [];

      if (drivingTrend && drivingTrend.days) {
        const filteredDays = drivingTrend.days.filter(d => d.time >= cutoffTimeSec);
        totalDistance = filteredDays.reduce((sum, d) => sum + (d.distance || 0), 0);
        totalConsumed = filteredDays.reduce((sum, d) => sum + (d.fuel || 0), 0);
        tripCount = filteredDays.filter(d => d.distance > 0).length;

        dailyData = filteredDays.slice(-7).map(d => {
          const date = new Date(d.time * 1000);
          return {
            date: dayNames[date.getDay()],
            fullDate: date.toISOString().split("T")[0],
            consumed: Math.round(d.fuel * 10) / 10,
            charged: 0, // Will be filled from charging sessions
          };
        });
      }

      // Process charging sessions
      const sessions = chargingData.sessions || [];
      const filteredSessions = sessions.filter(s => {
        if (!s.date) return false;
        return new Date(s.date).getTime() >= cutoffTime;
      });

      const totalCharged = filteredSessions.reduce((sum, s) => sum + (s.kWh || 0), 0);
      const sessionCount = filteredSessions.length;

      // Add charging data to daily breakdown
      filteredSessions.forEach(s => {
        if (!s.date) return;
        const sessionDate = new Date(s.date).toISOString().split("T")[0];
        const dayEntry = dailyData.find(d => d.fullDate === sessionDate);
        if (dayEntry) {
          dayEntry.charged += s.kWh || 0;
        }
      });

      // Round charged values
      dailyData.forEach(d => {
        d.charged = Math.round(d.charged * 10) / 10;
      });

      // Average efficiency (Wh/km for display, or kWh/100km)
      const avgEfficiency = totalDistance > 0
        ? Math.round((totalConsumed * 1000) / totalDistance)
        : 0;

      // CO2 saved (compared to gasoline car ~120g CO2/km)
      const co2Saved = Math.round(totalDistance * 0.12);

      return {
        totalConsumed: Math.round(totalConsumed * 10) / 10,
        totalCharged: Math.round(totalCharged * 10) / 10,
        totalDistance: Math.round(totalDistance * 10) / 10,
        avgEfficiency,
        co2Saved,
        tripCount,
        sessionCount,
        daily: dailyData,
      };
    } catch (e) {
      console.error("Error calculating energy stats:", e);
      return this._getEmptyEnergyStats();
    }
  }

  /**
   * Return empty energy stats object
   */
  _getEmptyEnergyStats() {
    return {
      totalConsumed: 0,
      totalCharged: 0,
      totalDistance: 0,
      avgEfficiency: 0,
      co2Saved: 0,
      tripCount: 0,
      sessionCount: 0,
      daily: [],
    };
  }

  // ============================================
  // BATTERY LEASING API
  // ============================================

  /**
   * Get battery leasing information
   * Uses GET /ccarcharging/api/v3/battery-leasing/info
   * @returns {Promise<Object>} Battery leasing details
   */
  async getBatteryLeasingInfo() {
    if (!this.vin) throw new Error("VIN is required");

    const proxyPath = `ccarcharging/api/v3/battery-leasing/info`;
    const url = `/api/proxy/${proxyPath}?region=${this.region}`;

    try {
      const response = await this._fetchWithRetry(url);
      if (!response.ok) {
        console.warn(`Battery leasing info fetch failed: ${response.status}`);
        return null;
      }

      const json = await response.json();
      const data = json.data;

      if (!data) return null;

      return {
        month: data.month,
        year: data.year,
        actualKm: data.actualKm || 0,
        cost: data.cost || 0,
        lastUpdateTimestamp: data.lastUpdateTimestamp,
        initOdo: data.initOdo || 0,
        endOdo: data.endOdo || 0,
        contractNo: data.contractNo,
        isBatteryOwner: data.isBatteryOwner || false,
        isSubContract: data.isSubContract || false,
        isFree: data.isFree || false,
        canRequestPackage: data.canRequestPackage || false,
        paymentVerify: data.paymentVerify || false,
        targetSoc: data.targetSoc || { block: false, target: 0 },
        package: data.package ? {
          id: data.package.id,
          name: data.package.name,
          packageType: data.package.packageType,
          packageTypeName: data.package.packageTypeName,
          limitKm: data.package.limitKm || 0,
          price: data.package.price || 0,
          minCost: data.package.minCost || 0,
          currentPackage: data.package.currentPackage || false,
          comments: data.package.comments || [],
        } : null,
        debt: data.debt,
      };
    } catch (e) {
      console.error("Error fetching battery leasing info:", e);
      return null;
    }
  }

  // ============================================
  // MAINTENANCE API
  // ============================================

  /**
   * Get next maintenance schedule
   * Uses GET /ccarbookingservice/api/v1/c-app/next-maintenance
   * @returns {Promise<Object>} Next maintenance info
   */
  async getNextMaintenance() {
    if (!this.vin) throw new Error("VIN is required");

    const proxyPath = `ccarbookingservice/api/v1/c-app/next-maintenance`;
    const url = `/api/proxy/${proxyPath}?region=${this.region}`;

    try {
      const response = await this._fetchWithRetry(url);
      if (!response.ok) {
        console.warn(`Next maintenance fetch failed: ${response.status}`);
        return null;
      }

      const json = await response.json();
      const data = json.data;

      if (!data) return null;

      return {
        vinNumber: data.vinNumber,
        nextMileage: parseFloat(data.nextMileage) || 0,
        unitDistance: data.unitDistance || "Km",
        nextDateBasedOnOdo: data.nextDateMaintainceBasedOnOdo
          ? new Date(data.nextDateMaintainceBasedOnOdo)
          : null,
        nextDateBasedOnBU: data.nextDateMaintainceBasedOnBU
          ? new Date(data.nextDateMaintainceBasedOnBU)
          : null,
        nextDateTimestamp: data.nextDateMaintaince,
        showOnHomeScreen: data.showOnHomeScreen || false,
      };
    } catch (e) {
      console.error("Error fetching next maintenance:", e);
      return null;
    }
  }

  // ============================================
  // VEHICLE ALERTS / DIAGNOSTICS API
  // ============================================

  /**
   * Get vehicle alerts and diagnostics
   * Uses GET /ccar-diagnostic/api/v1/c-app/telltales/alert-dashboard
   * @returns {Promise<Array>} List of alert categories
   */
  async getVehicleAlerts() {
    if (!this.vin) throw new Error("VIN is required");

    const proxyPath = `ccar-diagnostic/api/v1/c-app/telltales/alert-dashboard`;
    const url = `/api/proxy/${proxyPath}?region=${this.region}`;

    try {
      const response = await this._fetchWithRetry(url);
      if (!response.ok) {
        console.warn(`Vehicle alerts fetch failed: ${response.status}`);
        return [];
      }

      const json = await response.json();
      const data = json.data || [];

      return data.map(category => ({
        categoryName: category.categoryName,
        categoryType: category.categoryType, // RSA, BOOKING, SELF_FIX
        alertCount: category.alertNo || 0,
        alerts: category.alerts || [],
      }));
    } catch (e) {
      console.error("Error fetching vehicle alerts:", e);
      return [];
    }
  }

  // ============================================
  // VF POINTS / VOUCHERS API
  // ============================================

  /**
   * Get VF Points and voucher information
   * Uses GET /ccarreferral/api/v1/capp/vouchers/vf-point
   * @returns {Promise<Object>} VF Points info
   */
  async getVFPoints() {
    const proxyPath = `ccarreferral/api/v1/capp/vouchers/vf-point`;
    const url = `/api/proxy/${proxyPath}?region=${this.region}`;

    try {
      const response = await this._fetchWithRetry(url);
      if (!response.ok) {
        console.warn(`VF Points fetch failed: ${response.status}`);
        return null;
      }

      const json = await response.json();
      const data = json.data;

      if (!data) return null;

      return {
        vpoint: data.vpoint || 0,
        membership: data.membership,
        membershipCode: data.membershipCode,
        linkedVinclub: data.linkedVinclub || false,
        vinclubUrl: data.vinclubUrl,
        canUseVfpoint: data.canUseVfpoint || false,
        isExpiredVFCashOut: data.isExpiredVFCashOut || false,
        cashOutDueDate: data.cashOutDueDate,
      };
    } catch (e) {
      console.error("Error fetching VF Points:", e);
      return null;
    }
  }

  // ============================================
  // CHARGING STATION DETAILS API
  // ============================================

  /**
   * Get detailed info for specific charging stations
   * Uses POST /ccarcharging/api/v1/stations/location-info
   * @param {Array<string>} locationIds - Array of location IDs
   * @returns {Promise<Array>} Detailed station info
   */
  async getChargingStationDetails(locationIds) {
    if (!this.vin) throw new Error("VIN is required");
    if (!locationIds || locationIds.length === 0) return [];

    const proxyPath = `ccarcharging/api/v1/stations/location-info`;
    const url = `/api/proxy/${proxyPath}?region=${this.region}`;

    const body = { locationIds };

    try {
      const response = await this._fetchWithRetry(url, {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.warn(`Station details fetch failed: ${response.status}`);
        return [];
      }

      const json = await response.json();
      const data = json.data || [];

      return data.map(station => ({
        locationId: station.locationId,
        stationName: station.stationName,
        stationAddress: station.stationAddress,
        latitude: station.latitude,
        longitude: station.longitude,
        province: station.province,
        provinceCode: station.provinceCode,
        district: station.district,
        districtCode: station.districtCode,
        isPublic: station.isPublic || false,
        isFreeParking: station.isFreeParking || false,
        isInWorkingTime: station.isInWorkingTime || false,
        workingTimeDescription: station.workingTimeDescription || "24/7",
        depotStatus: station.depotStatus, // Available, AllBusy, etc.
        totalEvse: station.totalEvse || 0,
        availableEvse: station.numberOfAvailableEvse || 0,
        connectors: (station.connectors || []).map(c => ({
          type: c.type, // Power in Watts (11000 = 11kW)
          status: c.status,
          count: c.count,
          total: c.total,
        })),
        images: (station.images || []).map(img => img.url),
        favorite: station.favorite || false,
        reservationId: station.reservationId,
      }));
    } catch (e) {
      console.error("Error fetching station details:", e);
      return [];
    }
  }

  // ============================================
  // FAVORITE LOCATIONS API
  // ============================================

  /**
   * Get user's favorite locations
   * Uses GET /ccarusermgnt/api/v1/location-favorite
   * @returns {Promise<Array>} List of favorite locations
   */
  async getFavoriteLocations() {
    const proxyPath = `ccarusermgnt/api/v1/location-favorite`;
    const url = `/api/proxy/${proxyPath}?region=${this.region}`;

    try {
      const response = await this._fetchWithRetry(url);
      if (!response.ok) {
        console.warn(`Favorite locations fetch failed: ${response.status}`);
        return [];
      }

      const json = await response.json();
      const data = json.data || [];

      return data.map(loc => ({
        id: loc.id,
        title: loc.title,
        address: loc.address,
        latitude: parseFloat(loc.lat) || 0,
        longitude: parseFloat(loc.lng) || 0,
        favoriteType: loc.favoriteType, // HOME, WORK, OTHER
        vinfastId: loc.vinfastId, // VinFast location ID if it's a VF location
        nickname: loc.nickname,
      }));
    } catch (e) {
      console.error("Error fetching favorite locations:", e);
      return [];
    }
  }

  // ============================================
  // ROADSIDE ASSISTANCE (RSA) API
  // ============================================

  /**
   * Get RSA (Roadside Assistance) info
   * Uses GET /vfrsa/api/c-app/rsa/info
   * @returns {Promise<Object>} RSA request info
   */
  async getRSAInfo() {
    if (!this.vin) throw new Error("VIN is required");

    const proxyPath = `vfrsa/api/c-app/rsa/info`;
    const url = `/api/proxy/${proxyPath}?region=${this.region}`;

    try {
      const response = await this._fetchWithRetry(url);
      if (!response.ok) {
        console.warn(`RSA info fetch failed: ${response.status}`);
        return null;
      }

      const json = await response.json();
      const data = json.data;

      if (!data) return null;

      return {
        vinCode: data.vinCode,
        requestCode: data.requestCode,
        state: data.state, // RSA_REQUESTED, etc.
        vinfastServiceHotline: data.vinfastServiceHotline,
        rescueCenterHotline: data.rescueCenterHotline,
        pickUpLocation: {
          lat: data.pickUpLocationLat,
          lng: data.pickUpLocationLng,
          note: data.pickUpLocationNoted,
        },
        name: data.name,
        phoneNumber: data.phoneNumber,
        licensePlate: data.licensePlate,
        isTowed: data.isTowed || false,
        carServiceList: data.carServiceList || [],
        createdTime: data.createdTime,
        images: data.imageList || [],
      };
    } catch (e) {
      console.error("Error fetching RSA info:", e);
      return null;
    }
  }

  /**
   * Get available RSA car services
   * Uses GET /vfrsa/api/c-app/rsa/car-services
   * @returns {Promise<Object>} Map of service codes to descriptions
   */
  async getRSACarServices() {
    if (!this.vin) throw new Error("VIN is required");

    const proxyPath = `vfrsa/api/c-app/rsa/car-services`;
    const url = `/api/proxy/${proxyPath}?region=${this.region}`;

    try {
      const response = await this._fetchWithRetry(url);
      if (!response.ok) {
        console.warn(`RSA car services fetch failed: ${response.status}`);
        return {};
      }

      const json = await response.json();
      return json.data || {};
    } catch (e) {
      console.error("Error fetching RSA car services:", e);
      return {};
    }
  }

  // ============================================
  // SET PRIMARY VEHICLE API
  // ============================================

  /**
   * Set primary vehicle
   * Uses PUT /ccarusermgnt/api/v1/user-vehicle/set-primary-vehicle
   * @param {string} vinCode - VIN code of the vehicle to set as primary
   * @returns {Promise<boolean>} Success status
   */
  async setPrimaryVehicle(vinCode) {
    const proxyPath = `ccarusermgnt/api/v1/user-vehicle/set-primary-vehicle`;
    const url = `/api/proxy/${proxyPath}?region=${this.region}`;

    const body = { vinCode };

    try {
      const response = await this._fetchWithRetry(url, {
        method: "PUT",
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.warn(`Set primary vehicle failed: ${response.status}`);
        return false;
      }

      // Update local state
      this.vin = vinCode;
      this.saveSession();

      return true;
    } catch (e) {
      console.error("Error setting primary vehicle:", e);
      return false;
    }
  }

  // ============================================
  // NOTIFICATION API
  // ============================================

  /**
   * Check if user has unread notifications
   * Uses GET /notimgmt/api/v1/notimgmt/users/app/is-unread
   * @returns {Promise<boolean>} Has unread notifications
   */
  async hasUnreadNotifications() {
    const proxyPath = `notimgmt/api/v1/notimgmt/users/app/is-unread`;
    const url = `/api/proxy/${proxyPath}?region=${this.region}`;

    try {
      const response = await this._fetchWithRetry(url);
      if (!response.ok) {
        return false;
      }

      const json = await response.json();
      return json.data === true;
    } catch (e) {
      console.error("Error checking notifications:", e);
      return false;
    }
  }

  // ============================================
  // TELEMETRY (Existing)
  // ============================================

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
      try {
        // Create a timeout promise
        const timeout = new Promise((resolve) =>
          setTimeout(() => resolve([null, null]), 2000),
        );

        // Race between data fetch and timeout
        const [geo, weather] = await Promise.race([
          Promise.all([
            this.fetchLocationName(parsed.latitude, parsed.longitude),
            this.fetchWeather(parsed.latitude, parsed.longitude),
          ]),
          timeout,
        ]);

        if (geo) {
          parsed.location_address = geo.location_address;
          parsed.weather_address = geo.weather_address;
        }
        if (weather) {
          parsed.weather_outside_temp = weather.temperature;
          parsed.weather_code = weather.weathercode;
        }
      } catch (e) {
        console.warn("External enrichment failed or timed out", e);
        // Continue without enrichment
      }
    }

    return parsed;
  }
}

export const api = new VinFastAPI();
