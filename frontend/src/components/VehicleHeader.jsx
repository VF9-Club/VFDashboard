import React from "react";
import { useStore } from "@nanostores/react";
import { vehicleStore, fetchTelemetry } from "../stores/vehicleStore";

// Weather Icon (Dynamic WMO Codes)
const WeatherIcon = ({ temp, code }) => {
  // WMO Weather Codes:
  // 0: Clear sky
  // 1-3: Partly cloudy
  // 45,48: Fog
  // 51-67: Drizzle/Rain
  // 71-77: Snow
  // 80-82: Showers
  // 95-99: Thunderstorm

  let icon = (
    <svg
      className="w-5 h-5 text-blue-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      ></path>
    </svg>
  ); // Default Sun

  if (code !== undefined && code !== null) {
    if (code >= 1 && code <= 3) {
      // Cloud
      icon = (
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
          />
        </svg>
      );
    } else if (code >= 45 && code <= 48) {
      // Fog (Cloud + horizontal lines)
      icon = (
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z M10 20h4 M8 18h8"
          />
        </svg>
      );
    } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
      // Rain (Cloud + Drops)
      icon = (
        <svg
          className="w-5 h-5 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20 16.2A4.5 4.5 0 0017.5 8h-1.8A7 7 0 104 14.9 M16 22v-2 M12 22v-2 M8 22v-2"
          />
        </svg>
      );
    } else if (code >= 71 && code <= 77) {
      // Snow (Snowflake)
      icon = (
        <svg
          className="w-5 h-5 text-cyan-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3v18M3 12h18M7.5 7.5l9 9M16.5 7.5l-9 9"
          />
        </svg>
      );
    } else if (code >= 95) {
      // Thunder
      icon = (
        <svg
          className="w-5 h-5 text-amber-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      );
    }
  }

  return (
    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
      {icon}
      <span className="text-sm font-bold text-blue-700">
        {temp !== null && temp !== undefined ? `${temp}°C` : "N/A"}
      </span>
    </div>
  );
};

export default function VehicleHeader() {
  const vehicle = useStore(vehicleStore);

  const handleRefresh = () => {
    fetchTelemetry(vehicle.vin);
  };

  const handleLogout = async () => {
    try {
      await fetch(
        `${import.meta.env.PUBLIC_API_URL || "http://localhost:3000"}/api/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );
    } catch (e) {
      console.error("Logout failed", e);
    }
    window.location.href = "/login";
  };

  // Format Last Updated (Client-Side Only to avoid hydration mismatch)
  const [lastUpdatedTime, setLastUpdatedTime] = React.useState("--:--");

  React.useEffect(() => {
    if (vehicle.lastUpdated) {
      setLastUpdatedTime(
        new Date(vehicle.lastUpdated).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    } else {
      setLastUpdatedTime("N/A");
    }
  }, [vehicle.lastUpdated]);

  return (
    <div className="flex items-center justify-between py-2 mb-2">
      {/* Left: Branding & Model */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full overflow-hidden shadow-md border border-gray-100/50">
          <img
            src="/logo.png"
            alt="VF9 Club"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-none flex items-center gap-2">
            VinFast{" "}
            {!vehicle.vin ? (
              <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              vehicle.marketingName ||
              vehicle.model || (
                <span className="animate-pulse bg-gray-200 text-transparent rounded px-2">
                  VF9
                </span>
              )
            )}
          </h1>
          {!vehicle.vin ? (
            /* Skeleton Loader for Subtitle */
            <div className="flex items-center gap-2 w-full mt-1">
              <div className="h-3 w-32 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mt-1 md:mt-0">
              {/* VIN Badge */}
              <span
                className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded text-transform uppercase self-start md:self-auto"
                title={vehicle.vin}
              >
                {vehicle.vin}
              </span>

              {/* Desktop Separator */}
              <span className="hidden md:block h-1 w-1 rounded-full bg-gray-300"></span>

              {/* Other Info Group */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500 font-medium">
                  {vehicle.marketingName}
                </span>
                <span className="h-1 w-1 rounded-full bg-gray-300"></span>

                <span className="text-xs text-gray-500 font-medium">
                  {vehicle.vehicleVariant}
                </span>
                <span className="h-1 w-1 rounded-full bg-gray-300"></span>

                <span className="text-xs text-gray-500 font-medium">
                  {vehicle.yearOfProduct}
                </span>

                {vehicle.battery_type && vehicle.battery_type !== "--" && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                    <span className="text-xs text-gray-500 font-medium">
                      {vehicle.battery_type}
                    </span>
                  </>
                )}
                <span className="h-1 w-1 rounded-full bg-gray-300"></span>

                <span className="text-xs text-gray-500 font-medium">
                  {vehicle.color}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions & Context */}
      <div className="flex items-center gap-3">
        <WeatherIcon
          temp={vehicle.external_temp ?? vehicle.outside_temp}
          code={vehicle.weather_code}
        />

        {/* Last Updated & Refresh Group */}
        <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-full border border-gray-200 shadow-sm ml-1">
          {/* Refresh Button (Left) */}
          <button
            onClick={handleRefresh}
            disabled={vehicle.isRefreshing}
            title="Refresh Data"
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-white rounded-full transition-all active:scale-95"
          >
            <svg
              className={`w-4 h-4 ${vehicle.isRefreshing ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
          </button>

          {/* Time Display (Right) */}
          <div className="hidden md:flex flex-col items-start leading-none pr-1">
            <span className="text-[8px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">
              Updated
            </span>
            <span className="text-xs font-mono font-bold text-gray-600 tabular-nums leading-none">
              {lastUpdatedTime}
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-gray-200 mx-1"></div>

        {/* User Profile / Logout */}
        <div className="flex items-center gap-3 pl-1">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-gray-900 leading-none">
              {vehicle.user_name}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 font-medium tracking-wide">
              {vehicle.userVehicleType
                ? vehicle.userVehicleType
                    .replace("ROLE_", "")
                    .toLowerCase()
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())
                : ""}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="group flex items-center justify-center h-10 w-10 cursor-pointer"
            title="Logout"
          >
            <img
              src={
                vehicle.user_avatar
                  ? vehicle.user_avatar
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(vehicle.user_name || "VinFast User")}&background=0D8ABC&color=fff`
              }
              alt="User"
              className="h-10 w-10 rounded-full border-2 border-white shadow-sm group-hover:ring-2 group-hover:ring-offset-2 group-hover:ring-red-500 transition-all"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
