export const prerender = false;

import { REGIONS, DEFAULT_REGION, API_HEADERS } from "../../../config/vinfast";
import crypto from 'crypto';

// X-HASH Secret Key (reverse-engineered from VinFast APK)
const XHASH_SECRET_KEY = 'Vinfast@2025';

/**
 * Generate X-HASH for VinFast API request
 * Algorithm: HMAC-SHA256(secretKey, message) -> Base64
 * Message format: method_path_vin_secretKey_timestamp (lowercase)
 */
function generateXHash(method, apiPath, vin, timestamp) {
  // Remove query string from path
  const pathWithoutQuery = apiPath.split('?')[0];

  // Ensure path starts with /
  const normalizedPath = pathWithoutQuery.startsWith('/') ? pathWithoutQuery : '/' + pathWithoutQuery;

  // Build message parts
  const parts = [method, normalizedPath];
  if (vin) {
    parts.push(vin);
  }
  parts.push(XHASH_SECRET_KEY);
  parts.push(String(timestamp));

  // Join with underscore and lowercase
  const message = parts.join('_').toLowerCase();

  // HMAC-SHA256
  const hmac = crypto.createHmac('sha256', XHASH_SECRET_KEY);
  hmac.update(message);

  // Base64 encode
  return hmac.digest('base64');
}


export const ALL = async ({ request, params, cookies }) => {
  const apiPath = params.path;
  const urlObj = new URL(request.url);
  const region = urlObj.searchParams.get("region") || DEFAULT_REGION;
  const regionConfig = REGIONS[region] || REGIONS[DEFAULT_REGION];

  // Strip internal params from query
  const targetSearchParams = new URLSearchParams(urlObj.search);
  targetSearchParams.delete("region");

  const searchStr = targetSearchParams.toString();
  const targetUrl = `${regionConfig.api_base}/${apiPath}${searchStr ? "?" + searchStr : ""}`;

  const clientHeaders = request.headers;

  // Forward Auth Header
  // Priority: 1. Authorization header from client (if manual override)
  // 2. Cookie 'access_token' (Secure Proxy Mode)
  let authHeader = clientHeaders.get("Authorization");
  const vinHeader = clientHeaders.get("x-vin-code");

  // Allow client to pass X-HASH and X-TIMESTAMP directly
  let xHash = clientHeaders.get("x-hash");
  let xTimestamp = clientHeaders.get("x-timestamp");

  if (!authHeader) {
      const cookieToken = cookies.get("access_token")?.value;
      if (cookieToken) {
          authHeader = `Bearer ${cookieToken}`;
      }
  }

  // Get request body for POST/PUT/PATCH
  let requestBody = null;
  if (request.method !== "GET" && request.method !== "HEAD") {
    requestBody = await request.text();
  }

  // If no X-HASH provided, generate it dynamically
  if (!xHash) {
    const timestamp = Date.now();
    xHash = generateXHash(request.method, apiPath, vinHeader, timestamp);
    xTimestamp = String(timestamp);
    console.log(`[Proxy] Generated X-HASH for ${request.method} /${apiPath}`);
  }

  const proxyHeaders = {
    ...API_HEADERS, // standard headers
    "Content-Type": "application/json",
  };

  if (authHeader) proxyHeaders["Authorization"] = authHeader;
  if (vinHeader) proxyHeaders["x-vin-code"] = vinHeader;

  // Add X-HASH and X-TIMESTAMP if available
  if (xHash) proxyHeaders["X-HASH"] = xHash;
  if (xTimestamp) proxyHeaders["X-TIMESTAMP"] = xTimestamp;

  const init = {
    method: request.method,
    headers: proxyHeaders,
  };

  if (requestBody) {
    init.body = requestBody;
  }

  try {
    const response = await fetch(targetUrl, init);
    const data = await response.text();

    // Add debug header to indicate if hash was used
    const responseHeaders = {
      "Content-Type": "application/json",
    };

    if (xHash) {
      responseHeaders["X-Hash-Source"] = "generated";
    }

    return new Response(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
