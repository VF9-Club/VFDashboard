require("dotenv").config();
const fastify = require("fastify")({ logger: true });
const cookie = require("@fastify/cookie");
const cors = require("@fastify/cors");
const { DEFAULT_REGION } = require("./lib/config");
const VinFastAPI = require("./lib/vinfast");
const SimpleCache = require("./lib/simpleCache");

// Cache initialization
const locationCache = new SimpleCache();
const weatherCache = new SimpleCache();

// Register Plugins
fastify.register(cookie, {
  secret: process.env.COOKIE_SECRET || "super-secret-key-dashboard-v1",
  hook: "onRequest",
});

fastify.register(cors, {
  origin: true, // Allow all origins for dev
  credentials: true,
});

// Rate Limiting
fastify.register(require("@fastify/rate-limit"), {
  max: 20, // Global limit (User requested 20)
  timeWindow: "1 minute",
});

// --- Routes ---

// Health Check
fastify.get("/health", async () => {
  return { status: "ok", service: "VinFast Dashboard BFF" };
});

// Login
fastify.post(
  "/api/login",
  {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: "1 minute",
      },
    },
  },
  async (request, reply) => {
    const { email, password, region } = request.body || {};
    if (!email || !password) {
      return reply.code(400).send({ error: "Email and password required" });
    }

    try {
      const api = new VinFastAPI(region || DEFAULT_REGION); // Default to Configured Region
      const tokens = await api.authenticate(email, password);

      // Fetch vehicles immediately to get VIN and UserID
      // This is needed because `authenticate` only gets tokens
      // And we need VIN for the session cookie
      await api.getVehicles();

      const cookieOptions = {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set true in Prod
        sameSite: "lax",
        maxAge: 7776000, // 90 days (Long sessions)
      };

      reply.setCookie("access_token", tokens.access_token, {
        ...cookieOptions,
        maxAge: 86400,
      }); // 1 day access
      reply.setCookie("refresh_token", tokens.refresh_token, cookieOptions);
      reply.setCookie("region", region || DEFAULT_REGION, cookieOptions);

      if (api.vin) reply.setCookie("vin", api.vin, cookieOptions);
      if (api.userId) reply.setCookie("user_id", api.userId, cookieOptions);

      return { success: true, message: "Logged in successfully" };
    } catch (err) {
      request.log.error(err);
      // Return valid generic message for Production security
      return reply.code(401).send({ error: "Invalid email or password." });
    }
  },
);

// Middleware helper to recreate API from cookie
const getAuthenticatedApi = (request) => {
  const accessToken = request.cookies.access_token;
  const refreshToken = request.cookies.refresh_token;
  const vin = request.cookies.vin;
  const userId = request.cookies.user_id;
  const region = request.cookies.region || DEFAULT_REGION;

  // We need at least a refresh token to attempt access
  if (!accessToken && !refreshToken) throw new Error("Unauthorized");

  const api = new VinFastAPI(region, {
    accessToken,
    refreshToken,
    vin,
    userId,
  });
  return api;
};

// Helper: Update cookies if tokens changed
const syncCookies = (reply, api) => {
  if (api.accessToken) {
    reply.setCookie("access_token", api.accessToken, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400,
    });
  }
  if (api.refreshToken) {
    reply.setCookie("refresh_token", api.refreshToken, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7776000,
    });
  }
};

// Get Vehicles
fastify.get(
  "/api/vehicles",
  {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: "1 minute",
      },
    },
  },
  async (request, reply) => {
    try {
      const api = getAuthenticatedApi(request);
      const vehicles = await api.getVehicles();
      syncCookies(reply, api);
      return { data: vehicles };
    } catch (err) {
      request.log.error(err);
      return reply
        .code(401)
        .send({ error: "Unauthorized or Failed to fetch vehicles" });
    }
  },
);

// Get User Profile
fastify.get(
  "/api/user",
  {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: "1 minute",
      },
    },
  },
  async (request, reply) => {
    try {
      const api = getAuthenticatedApi(request);
      const profile = await api.getUserProfile();
      syncCookies(reply, api);
      return { data: profile };
    } catch (err) {
      request.log.error(err);
      return reply.code(401).send({ error: "Failed to fetch user profile" });
    }
  },
);

// Helper: Reverse Geocoding (with caching)
const fetchLocationName = async (lat, lon) => {
  if (!lat || !lon) return null;

  // Round to 3 decimal places (~100m precision) for cache hit rate
  const rLat = Number(lat).toFixed(3);
  const rLon = Number(lon).toFixed(3);
  const cacheKey = `loc_${rLat}_${rLon}`;

  const cached = locationCache.get(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    // Nominatim requires a User-Agent
    const headers = { "User-Agent": "VFDashBoard/1.0 (vf9club.vn)" };
    const res = await fetch(url, { headers });
    if (res.ok) {
      const data = await res.json();
      // Construct address: "City, CountryCode"
      const a = data.address || {};
      const city = a.city || a.town || a.village || a.state || a.county;
      const country = (a.country_code || "").toUpperCase();

      const parts = [city, country].filter(Boolean);
      const result = parts.join(", ");

      locationCache.set(cacheKey, result, 86400); // Cache for 24 hours
      return result;
    }
  } catch {
    // console.log(`[${new Date().toISOString()}] Received telemetry update`);
  }
  return null;
};

// Helper: Fetch Weather (Open-Meteo)
const fetchWeather = async (lat, lon) => {
  if (!lat || !lon) return null;

  // Round to 3 decimal places (~100m precision) for cache hit rate
  const rLat = Number(lat).toFixed(3);
  const rLon = Number(lon).toFixed(3);
  const cacheKey = `weather_${rLat}_${rLon}`;

  const cached = weatherCache.get(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      weatherCache.set(cacheKey, data.current_weather, 1800); // Cache for 30 minutes
      return data.current_weather; // { temperature, weathercode, windspeed, ... }
    }
  } catch (e) {
    console.error("Weather fetch failed:", e.message);
  }
  return null;
};

// Get Telemetry
fastify.get(
  "/api/telemetry/:vin",
  {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: "1 minute",
      },
    },
  },
  async (request, reply) => {
    try {
      const api = getAuthenticatedApi(request);
      const { vin } = request.params;
      const { deep_scan } = request.query || {};

      const telemetry = await api.getTelemetry(vin, deep_scan === "true");

      if (telemetry.latitude && telemetry.longitude) {
        // Parallel fetch for speed
        const [address, weather] = await Promise.all([
          fetchLocationName(telemetry.latitude, telemetry.longitude),
          fetchWeather(telemetry.latitude, telemetry.longitude),
        ]);

        if (address) telemetry.location_address = address;
        if (weather) {
          telemetry.external_temp = weather.temperature;
          telemetry.weather_code = weather.weathercode;
        }
      }

      syncCookies(reply, api);
      return { data: telemetry };
    } catch (err) {
      request.log.error(err);
      console.error("Telemetry 500 Error:", err); // Explicit console log
      return reply
        .code(500)
        .send({ error: "Failed to fetch telemetry", details: err.message });
    }
  },
);

// Run the server
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
