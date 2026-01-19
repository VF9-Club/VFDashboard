import { useStore } from "@nanostores/react";
import { vehicleStore } from "../stores/vehicleStore";

export default function CarStatus() {
  const data = useStore(vehicleStore);
  const { battery_level, charging_status } = data;
  // Normalize charging status (can be boolean or numeric 1=Charging)
  const isCharging = charging_status === 1 || charging_status === true;

  const formatTime = (mins) => {
    if (!mins) return "--";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  // Weather Icon Logic for Mobile Component
  const getWeatherIcon = (code) => {
    if (code === undefined || code === null) return null;
    if (code >= 1 && code <= 3) {
      return (
        <svg
          className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
      return (
        <svg
          className="w-4 h-4 text-gray-400 dark:text-gray-500"
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
      return (
        <svg
          className="w-4 h-4 text-blue-600"
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
      return (
        <svg
          className="w-4 h-4 text-cyan-300"
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
      return (
        <svg
          className="w-4 h-4 text-amber-500"
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
    // Default Sun
    return (
      <svg
        className="w-4 h-4 text-amber-400"
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
    );
  };

  return (
    <div className="h-full">
      {/* Battery Card (Energy) - Stacked Layout */}
      <div className="relative rounded-3xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col flex-1 min-h-[420px] md:h-[420px] justify-center transition-colors">
        {/* Header */}
        <div className="w-full mb-4 px-1">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {/* Energy Icon - Lightning */}
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
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
              Energy
            </h3>
            <div className="flex items-center gap-2">
              {isCharging && (
                <span className="text-green-500 animate-pulse text-lg">⚡</span>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT WRAPPER - Centered Vertically */}
        <div className="flex flex-col gap-4">
          {/* TOP SECTION: Battery Info */}
          <div className="flex flex-col items-center justify-center space-y-2 pb-2">
            {/* Circular Progress + Range Grid */}
            <div className="flex items-center justify-center w-full gap-6">
              {/* Circular Chart Column */}
              <div className="flex flex-col items-center gap-3">
                {/* SOC Circle - Size w-28 */}
                <div className="relative w-28 h-28 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      className="stroke-gray-100 dark:stroke-gray-700"
                      strokeWidth="8"
                      fill="none"
                    />
                    {battery_level !== null && (
                      <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        stroke={battery_level > 20 ? "#2563eb" : "#ef4444"} // Blue-600 normal, Red-500 low
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray="250"
                        strokeDashoffset={
                          250 - (250 * (Number(battery_level) || 0)) / 100
                        }
                        strokeLinecap="round"
                        pathLength="250"
                        className="transition-all duration-1000 ease-out"
                      />
                    )}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {battery_level !== null ? (
                      <>
                        <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                          {Number(battery_level).toFixed(0)}
                          <span className="text-sm align-top ml-0.5 text-gray-400 dark:text-gray-500">
                            %
                          </span>
                        </span>
                        <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                          SOC
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-black text-gray-200 dark:text-gray-700 tracking-tighter leading-none">
                        N/A
                      </span>
                    )}
                  </div>
                </div>

                {/* Battery Details - Shortened Labels (Fixed Height to prevent jump) */}
                <div className="flex flex-col items-center gap-1.5 w-full mt-1 min-h-[34px]">
                  {data.battery_serial || data.battery_manufacture_date ? (
                    <>
                      {data.battery_serial && (
                        <div className="flex flex-col items-center leading-none">
                          <span className="text-[8px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-0.5">
                            Batt. Serial
                          </span>
                          <span className="text-[9px] text-gray-600 dark:text-gray-300 font-bold font-mono tracking-wide">
                            {data.battery_serial}
                          </span>
                        </div>
                      )}
                      {data.battery_manufacture_date && (
                        <div className="flex flex-col items-center leading-none">
                          <span className="text-[8px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-0.5">
                            Batt. Date
                          </span>
                          <span className="text-[9px] text-gray-600 dark:text-gray-300 font-bold font-mono tracking-wide">
                            {data.battery_manufacture_date}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-1">
                      <span className="text-[8px] text-gray-300 dark:text-gray-700 font-bold uppercase tracking-wider">
                        SERIAL: N/A
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Specs Stack - NARROWER (110px) */}
              <div className="flex flex-col gap-3 w-[110px] justify-center flex-shrink-0">
                {/* Range */}
                <div className="bg-blue-50 dark:bg-blue-900/20 px-2 py-3 rounded-2xl flex flex-col items-center justify-center text-center border border-blue-100 dark:border-blue-800/50 shadow-sm hover:scale-105 transition-transform">
                  <p className="text-blue-400 text-[8px] font-bold uppercase tracking-wider mb-0.5">
                    Est. Range
                  </p>
                  <p
                    className={`text-xl font-black leading-none ${data.range !== null ? "text-blue-600 dark:text-blue-400" : "text-gray-300 dark:text-gray-600"}`}
                  >
                    {data.range !== null ? data.range : "N/A"}{" "}
                    <span
                      className={`text-[10px] font-bold ${data.range !== null ? "text-blue-400 dark:text-blue-300" : "text-gray-300 dark:text-gray-600"}`}
                    >
                      {data.range !== null ? "km" : ""}
                    </span>
                  </p>
                </div>

                {/* Health */}
                <div className="bg-gray-50 dark:bg-gray-700/50 px-2 py-2.5 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-100 dark:border-gray-600">
                  <p className="text-gray-400 dark:text-gray-500 text-[8px] font-bold uppercase tracking-wider mb-0.5">
                    Health
                  </p>
                  <p
                    className={`text-base font-black leading-none ${data.soh_percentage !== null ? "text-emerald-600 dark:text-emerald-400" : "text-gray-300 dark:text-gray-600"}`}
                  >
                    {data.soh_percentage !== null
                      ? `${data.soh_percentage}%`
                      : "N/A"}
                  </p>
                </div>

                {/* 12V Battery */}
                <div
                  className={`px-2 py-2.5 rounded-2xl flex flex-col items-center justify-center text-center border ${typeof data.battery_health_12v === "number" && data.battery_health_12v < 50 ? "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800" : "bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-600"}`}
                >
                  <p
                    className={`text-[8px] font-bold uppercase tracking-wider mb-0.5 ${typeof data.battery_health_12v === "number" && data.battery_health_12v < 50 ? "text-red-500" : "text-gray-400 dark:text-gray-500"}`}
                  >
                    12V Batt
                  </p>
                  <p
                    className={`text-base font-black leading-none ${typeof data.battery_health_12v === "number" && data.battery_health_12v < 50 ? "text-red-600 dark:text-red-400" : typeof data.battery_health_12v === "number" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-300 dark:text-gray-600"}`}
                  >
                    {typeof data.battery_health_12v === "number"
                      ? `${data.battery_health_12v}%`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="h-px w-full bg-gray-100 dark:bg-gray-700 my-1"></div>

          {/* BOTTOM SECTION: Charging Info */}
          <div
            className={`grid grid-cols-3 gap-2 p-1 rounded-2xl transition-colors duration-300 ${isCharging ? "bg-blue-50/50 dark:bg-blue-900/10" : "bg-transparent"}`}
          >
            {/* Status */}
            <div className="p-2 rounded-xl text-center bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 flex flex-col justify-center min-h-[60px]">
              <p className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                Status
              </p>
              <div className="flex flex-col items-center justify-center">
                {isCharging ? (
                  <svg
                    className="w-4 h-4 text-blue-500 animate-pulse mb-0.5"
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
                ) : (
                  <svg
                    className="w-4 h-4 text-gray-400 dark:text-gray-500 mb-0.5"
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
                )}
                <span className="text-[8px] font-bold text-gray-500 dark:text-gray-300 leading-none">
                  {isCharging ? "Charging" : "Unplugged"}
                </span>
              </div>
            </div>

            {/* Target */}
            <div
              className={`p-2 rounded-xl text-center border flex flex-col justify-center min-h-[60px] ${isCharging ? "bg-white dark:bg-gray-700 border-blue-100 dark:border-blue-900 shadow-sm" : "bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-600"}`}
            >
              <p className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                Target
              </p>
              <div className="flex items-center justify-center">
                <span
                  className={`text-base font-black leading-none ${data.target_soc !== null ? "text-gray-900 dark:text-white" : "text-gray-300 dark:text-gray-600"}`}
                >
                  {data.target_soc !== null ? `${data.target_soc}%` : "N/A"}
                </span>
              </div>
            </div>

            {/* Time Left */}
            <div
              className={`p-2 rounded-xl text-center border flex flex-col justify-center min-h-[60px] ${isCharging ? "bg-white dark:bg-gray-700 border-blue-100 dark:border-blue-900 shadow-sm" : "bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-600"}`}
            >
              <p className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 whitespace-nowrap">
                Time Left
              </p>
              <div className="flex items-center justify-center">
                <span
                  className={`text-base font-black leading-none whitespace-nowrap ${data.remaining_charging_time > 0 ? "text-gray-900 dark:text-white" : "text-gray-300 dark:text-gray-600"}`}
                >
                  {data.remaining_charging_time > 0
                    ? formatTime(data.remaining_charging_time)
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* MOBILE ONLY: Environment Section */}
          <div className="md:hidden flex flex-col gap-4">
            {/* Divider between Charging and Climate */}
            <div className="h-px w-full bg-gray-100 my-1"></div>

            <div className="grid grid-cols-3 gap-2 p-1">
              {/* Outside Temperature */}
              <div className="p-2 rounded-xl text-center bg-gray-50 border border-gray-100 flex flex-col justify-center min-h-[60px]">
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Outside
                </p>
                <div className="flex items-center justify-center gap-1.5">
                  {getWeatherIcon(data.weather_code)}
                  <span className="text-base font-black text-gray-700 leading-none">
                    {data.outside_temp !== null &&
                    data.outside_temp !== undefined
                      ? `${data.outside_temp}°`
                      : "--°"}
                  </span>
                </div>
              </div>

              {/* Cabin Temperature */}
              <div className="p-2 rounded-xl text-center bg-gray-50 border border-gray-100 flex flex-col justify-center min-h-[60px]">
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Cabin
                </p>
                <span className="text-base font-black text-gray-700 leading-none">
                  {data.inside_temp !== null && data.inside_temp !== undefined
                    ? `${data.inside_temp}°C`
                    : "--°C"}
                </span>
              </div>

              {/* Fan Speed */}
              <div
                className={`p-2 rounded-xl text-center border flex flex-col justify-center min-h-[60px] ${(data.fan_speed ?? 0) > 0 ? "bg-blue-50/50 border-blue-100 shadow-sm" : "bg-gray-50 border-gray-100"}`}
              >
                <p
                  className={`text-[8px] font-bold uppercase tracking-wider mb-1 ${(data.fan_speed ?? 0) > 0 ? "text-blue-400" : "text-gray-400"}`}
                >
                  Fan
                </p>
                <div className="flex items-center justify-center gap-1">
                  {(data.fan_speed ?? 0) > 0 ? (
                    <>
                      <svg
                        className="w-5 h-5 text-blue-600 animate-spin"
                        style={{ animationDuration: "3s" }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
                      </svg>
                      <span className="text-base font-black text-blue-600 leading-none">
                        {data.fan_speed}
                      </span>
                    </>
                  ) : (
                    <span className="text-base font-black text-gray-400 leading-none uppercase">
                      Off
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
