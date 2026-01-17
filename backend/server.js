require("dotenv").config();
const fastify = require("fastify")({
  logger: true,
  trustProxy: true, // Required for Render/Cloud Proxies to forward Headers correctly
});
const cookie = require("@fastify/cookie");
const cors = require("@fastify/cors");
const { DEFAULT_REGION } = require("./lib/config");
const VinFastAPI = require("./lib/vinfast");

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
      try {
        await api.getVehicles();
      } catch (vehErr) {
        request.log.error(vehErr);
        // If getting vehicles fails, we still might be "logged in" but unusable.
        // For now, treat as login failure or return specific error?
        // Let's log it and fail the login process for safety.
        console.error("Login succeeded but getVehicles failed:", vehErr);
        throw new Error("Failed to retrieve vehicle data");
      }

      const cookieOptions = {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set true in Prod
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
      // But verify if it was a vehicle fetch error
      if (err.message === "Failed to retrieve vehicle data") {
        return reply
          .code(502)
          .send({ error: "Login successful but failed to load profile." });
      }
      return reply.code(401).send({ error: "Invalid email or password." });
    }
  },
);

// Logout
fastify.post("/api/logout", async (request, reply) => {
  const cookieOptions = {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  reply.clearCookie("access_token", cookieOptions);
  reply.clearCookie("refresh_token", cookieOptions);
  reply.clearCookie("vin", cookieOptions);
  reply.clearCookie("user_id", cookieOptions);
  reply.clearCookie("region", cookieOptions);

  return { success: true };
});

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
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 86400,
    });
  }
  if (api.refreshToken) {
    reply.setCookie("refresh_token", api.refreshToken, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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

// Helper: Strip administrative prefixes (Thành phố, Tỉnh, Quận, etc.)
const stripPrefix = (str) => {
  if (!str) return str;
  return str.replace(/^(Thành phố|Tỉnh|Quận|Huyện|Xã|Phường)\s+/gi, "").trim();
};

// Helper: Reverse Geocoding (Simple Cache-less for demo)
const fetchLocationName = async (lat, lon) => {
  if (!lat || !lon) return null;
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    // Nominatim requires a User-Agent
    const headers = { "User-Agent": "VFDashBoard/1.0 (vf9club.vn)" };
    const res = await fetch(url, { headers });
    if (res.ok) {
      const data = await res.json();
      const a = data.address || {};

      const rawDistrict = a.city_district || a.district || a.county;
      const rawCity = a.city || a.town || a.village || a.state || a.province;

      const district = stripPrefix(rawDistrict);
      const city = stripPrefix(rawCity);
      const country = (a.country_code || "VN").toUpperCase();

      return {
        location_address: [district, city, country].filter(Boolean).join(", "),
        weather_address: [city, country].filter(Boolean).join(", "),
      };
    }
  } catch {
    // console.log(`[${new Date().toISOString()}] Received telemetry update`);
  }
  return null;
};

// Helper: Fetch Weather (Open-Meteo)
const fetchWeather = async (lat, lon) => {
  if (!lat || !lon) return null;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
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
        const [geoData, weather] = await Promise.all([
          fetchLocationName(telemetry.latitude, telemetry.longitude),
          fetchWeather(telemetry.latitude, telemetry.longitude),
        ]);

        if (geoData) {
          telemetry.location_address = geoData.location_address;
          telemetry.weather_address = geoData.weather_address;
        }
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
