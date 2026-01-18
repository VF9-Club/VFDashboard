import { useStore } from "@nanostores/react";
import { vehicleStore } from "../stores/vehicleStore";
import { unitSystem } from "../stores/settingsStore";
import { formatDistance } from "../utils/unitConversions";

export default function CarStatus() {
  const data = useStore(vehicleStore);
  const currentUnitSystem = useStore(unitSystem);
  const { battery_level, charging_status } = data;
  // Normalize charging status (can be boolean or numeric 1=Charging)
  const isCharging = charging_status === 1 || charging_status === true;

  // Format range with current unit system
  const formattedRange = formatDistance(data.range, currentUnitSystem);

  const formatTime = (mins) => {
    if (!mins) return "--";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="h-full">
      {/* Battery Card (Energy) - Stacked Layout */}
      <div className="relative rounded-3xl bg-white p-5 shadow-sm border border-gray-100 flex flex-col h-[420px] justify-center">
        {/* Header */}
        <div className="w-full mb-4 px-1">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              {/* Energy Icon - Lightning */}
              <svg
                className="w-6 h-6 text-blue-600"
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
                      stroke="#f3f4f6"
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
                        <span className="text-3xl font-black text-gray-900 tracking-tighter leading-none">
                          {Number(battery_level).toFixed(0)}
                          <span className="text-sm align-top ml-0.5 text-gray-400">
                            %
                          </span>
                        </span>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                          SOC
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-black text-gray-200 tracking-tighter leading-none">
                        N/A
                      </span>
                    )}
                  </div>
                </div>

                {/* Battery Details - Shortened Labels */}
                {/* Battery Details - Shortened Labels (Fixed Height to prevent jump) */}
                <div className="flex flex-col items-center gap-1.5 w-full mt-1 min-h-[34px]">
                  {data.battery_serial || data.battery_manufacture_date ? (
                    <>
                      {data.battery_serial && (
                        <div className="flex flex-col items-center leading-none">
                          <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                            Batt. Serial
                          </span>
                          <span className="text-[9px] text-gray-600 font-bold font-mono tracking-wide">
                            {data.battery_serial}
                          </span>
                        </div>
                      )}
                      {data.battery_manufacture_date && (
                        <div className="flex flex-col items-center leading-none">
                          <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                            Batt. Date
                          </span>
                          <span className="text-[9px] text-gray-600 font-bold font-mono tracking-wide">
                            {data.battery_manufacture_date}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-1">
                      <span className="text-[8px] text-gray-300 font-bold uppercase tracking-wider">
                        SERIAL: N/A
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Specs Stack - NARROWER (110px) */}
              <div className="flex flex-col gap-3 w-[110px] justify-center flex-shrink-0">
                {/* Range */}
                <div className="bg-blue-50 px-2 py-3 rounded-2xl flex flex-col items-center justify-center text-center border border-blue-100 shadow-sm hover:scale-105 transition-transform">
                  <p className="text-blue-400 text-[8px] font-bold uppercase tracking-wider mb-0.5">
                    Est. Range
                  </p>
                  <p
                    className={`text-xl font-black leading-none ${formattedRange.value !== null ? "text-blue-600" : "text-gray-300"}`}
                  >
                    {formattedRange.value !== null ? formattedRange.value : "N/A"}{" "}
                    <span
                      className={`text-[10px] font-bold ${formattedRange.value !== null ? "text-blue-400" : "text-gray-300"}`}
                    >
                      {formattedRange.unit || ""}
                    </span>
                  </p>
                </div>

                {/* Health */}
                <div className="bg-gray-50 px-2 py-2.5 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-100">
                  <p className="text-gray-400 text-[8px] font-bold uppercase tracking-wider mb-0.5">
                    Health
                  </p>
                  <p
                    className={`text-base font-black leading-none ${data.soh_percentage !== null ? "text-emerald-600" : "text-gray-300"}`}
                  >
                    {data.soh_percentage !== null
                      ? `${data.soh_percentage}%`
                      : "N/A"}
                  </p>
                </div>

                {/* 12V Battery */}
                <div
                  className={`px-2 py-2.5 rounded-2xl flex flex-col items-center justify-center text-center border ${typeof data.battery_health_12v === "number" && data.battery_health_12v < 50 ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"}`}
                >
                  <p
                    className={`text-[8px] font-bold uppercase tracking-wider mb-0.5 ${typeof data.battery_health_12v === "number" && data.battery_health_12v < 50 ? "text-red-500" : "text-gray-400"}`}
                  >
                    12V Batt
                  </p>
                  <p
                    className={`text-base font-black leading-none ${typeof data.battery_health_12v === "number" && data.battery_health_12v < 50 ? "text-red-600" : typeof data.battery_health_12v === "number" ? "text-emerald-600" : "text-gray-300"}`}
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
          <div className="h-px w-full bg-gray-100 my-1"></div>

          {/* BOTTOM SECTION: Charging Info */}
          <div
            className={`grid grid-cols-3 gap-2 p-1 rounded-2xl transition-colors duration-300 ${isCharging ? "bg-blue-50/50" : "bg-transparent"}`}
          >
            {/* Status */}
            <div className="p-2 rounded-xl text-center bg-gray-50 border border-gray-100 flex flex-col justify-center min-h-[50px]">
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">
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
                    className="w-4 h-4 text-gray-400 mb-0.5"
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
                <span className="text-[8px] font-bold text-gray-500 leading-none">
                  {isCharging ? "Charging" : "Unplugged"}
                </span>
              </div>
            </div>

            {/* Target */}
            <div
              className={`p-2 rounded-xl text-center border flex flex-col justify-center min-h-[50px] ${isCharging ? "bg-white border-blue-100 shadow-sm" : "bg-gray-50 border-gray-100"}`}
            >
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Target
              </p>
              <div className="flex items-center justify-center">
                <span
                  className={`text-base font-black leading-none ${data.target_soc !== null ? "text-gray-900" : "text-gray-300"}`}
                >
                  {data.target_soc !== null ? `${data.target_soc}%` : "N/A"}
                </span>
              </div>
            </div>

            {/* Time Left */}
            <div
              className={`p-2 rounded-xl text-center border flex flex-col justify-center min-h-[50px] ${isCharging ? "bg-white border-blue-100 shadow-sm" : "bg-gray-50 border-gray-100"}`}
            >
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1 whitespace-nowrap">
                Time Left
              </p>
              <div className="flex items-center justify-center">
                <span
                  className={`text-base font-black leading-none whitespace-nowrap ${data.remaining_charging_time > 0 ? "text-gray-900" : "text-gray-300"}`}
                >
                  {data.remaining_charging_time > 0
                    ? formatTime(data.remaining_charging_time)
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
