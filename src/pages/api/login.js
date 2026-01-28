export const prerender = false;

import { REGIONS } from "../../config/vinfast";

export const GET = async () => {
  return new Response(
    JSON.stringify({
      message: "Login API is active. Use POST to authenticate.",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const POST = async ({ request, cookies }) => {
  try {
    const { email, password, region, rememberMe } = await request.json();
    const regionConfig = REGIONS[region] || REGIONS["vn"];

    const url = `https://${regionConfig.auth0_domain}/oauth/token`;
    const payload = {
      client_id: regionConfig.auth0_client_id,
      audience: regionConfig.auth0_audience,
      grant_type: "password",
      scope: "offline_access openid profile email",
      username: email,
      password: password,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Set Cookies
    const cookieOptions = {
      path: "/",
      httpOnly: true,
      secure: true, // Requires HTTPS (or localhost)
      sameSite: "lax",
    };

    if (rememberMe) {
      cookieOptions.maxAge = 60 * 60 * 24 * 30; // 30 days
    }

    cookies.set("access_token", data.access_token, cookieOptions);
    if (data.refresh_token) {
      cookies.set("refresh_token", data.refresh_token, cookieOptions);
    }

    // Also save region to a non-httpOnly cookie for client-side usage if needed,
    // or we can rely on client-side state.
    // Let's store a secure session indicator or region preference.
    cookies.set("vf_region", region, {
      path: "/",
      httpOnly: false, // accessible to JS for UI
      secure: true,
      sameSite: "lax",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : undefined,
    });

    // Return success but NO TOKENS
    return new Response(JSON.stringify({ success: true, region }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
