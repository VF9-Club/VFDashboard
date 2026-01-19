import { useStore } from "@nanostores/react";
import { vehicleStore } from "../stores/vehicleStore";
import { DEFAULT_LOCATION } from "../constants/vehicle";

// Weather Row Component
const WeatherRow = ({ label, value, icon, subValue }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700 last:border-0">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-gray-600">
        {icon}
      </div>
      <div>
        <span className="block text-sm font-bold text-gray-900 dark:text-gray-100">{value}</span>
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{label}</span>
      </div>
    </div>
    <div className="text-right">
      {subValue && (
        <span className="block text-xs font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded-md">
          {subValue}
        </span>
      )}
    </div>
  </div>
);

export function EnvironmentCard() {
  const v = useStore(vehicleStore);
  return (
    <div className="rounded-3xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full transition-colors">
      <div className="flex flex-col mb-4 gap-1">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
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
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
              />
            </svg>
            Environment
          </h3>
        </div>

        <div className="flex items-center gap-1.5 pl-1">
          <svg
            className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span
            className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate w-full"
            title={v.weather_address || v.location_address}
          >
            {v.weather_address || v.location_address ? (
              v.weather_address || v.location_address
            ) : v.isEnriching ? (
              <span className="animate-pulse">Loading location...</span>
            ) : (
              "Outside"
            )}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <WeatherRow
          label="Outside"
          value={
            v.outside_temp !== undefined && v.outside_temp !== null ? (
              `${v.outside_temp}°C`
            ) : v.isEnriching ? (
              <span className="animate-pulse">...</span>
            ) : (
              "N/A"
            )
          }
          subValue="Live"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
              ></path>
            </svg>
          }
        />

        <WeatherRow
          label="Cabin"
          value={
            v.inside_temp !== undefined && v.inside_temp !== null
              ? `${v.inside_temp}°C`
              : "N/A"
          }
          subValue={`Fan: ${v.fan_speed !== undefined && v.fan_speed !== null ? v.fan_speed : "N/A"}`}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              ></path>
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-600">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Pet Mode</span>
          <span
            className={`text-[10px] font-bold px-2 py-1 rounded-lg ${Number(v.pet_mode) === 1 ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300"}`}
          >
            {Number(v.pet_mode) === 1 ? "ON" : "OFF"}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-600">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Camp Mode</span>
          <span
            className={`text-[10px] font-bold px-2 py-1 rounded-lg ${Number(v.camp_mode) === 1 ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300"}`}
          >
            {Number(v.camp_mode) === 1 ? "ON" : "OFF"}
          </span>
        </div>
      </div>
    </div>
  );
}

export function MapCard() {
  const v = useStore(vehicleStore);
  const isDefaultLoc =
    Number(v.latitude) === DEFAULT_LOCATION.LATITUDE &&
    Number(v.longitude) === DEFAULT_LOCATION.LONGITUDE;
  const hasValidCoords = v.latitude && v.longitude && !isDefaultLoc;

  return (
    <div className="flex-1 rounded-3xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col min-h-0 md:min-h-[400px] h-full transition-colors">
      <div className="flex flex-col mb-4 gap-1 px-1">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
            <svg
              className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Vehicle Location
          </h3>
        </div>

        <div className="flex items-center gap-1.5 pl-1 overflow-hidden">
          <svg
            className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {hasValidCoords ? (
            <a
              href={`https://www.google.com/maps?q=${v.latitude},${v.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
              title={v.location_address || "Open in Google Maps"}
            >
              <span className="truncate">
                {v.location_address || "Locating..."}
              </span>
              <svg
                className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          ) : v.isEnriching ? (
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide animate-pulse">
              Locating...
            </span>
          ) : (
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Offline
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 bg-gray-100 dark:bg-gray-900 rounded-2xl relative overflow-hidden">
        {hasValidCoords ? (
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            title="Vehicle Location"
            src={`https://maps.google.com/maps?q=${v.latitude},${v.longitude}&z=15&output=embed&iwloc=`}
            className="absolute w-[150%] h-[150%] top-[-25%] left-[-25%] filter grayscale contrast-[1.1] opacity-90 dark:invert dark:contrast-[0.85] dark:opacity-80 mix-blend-multiply dark:mix-blend-normal transition-opacity duration-500"
            style={{ pointerEvents: "auto" }}
          ></iframe>
        ) : (
          /* Loading / No Signal State */
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 dark:border-t-blue-400 animate-spin mb-3"></div>
            <span className="text-xs font-bold uppercase tracking-wider">
              Đang xác định vị trí
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ControlGrid() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <EnvironmentCard />
      <MapCard />
    </div>
  );
}
