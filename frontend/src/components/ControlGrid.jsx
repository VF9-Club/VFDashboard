import { useStore } from "@nanostores/react";
import { vehicleStore } from "../stores/vehicleStore";
import { DEFAULT_LOCATION } from "../constants/vehicle";

// Weather Row Component
const WeatherRow = ({ label, value, icon, subValue }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-blue-600 shadow-sm border border-gray-100">
        {icon}
      </div>
      <div>
        <span className="block text-sm font-bold text-gray-900">{value}</span>
        <span className="text-xs font-medium text-gray-400">{label}</span>
      </div>
    </div>
    <div className="text-right">
      {subValue && (
        <span className="block text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
          {subValue}
        </span>
      )}
    </div>
  </div>
);

export default function ControlGrid() {
  const v = useStore(vehicleStore);

  const isDefaultLoc =
    Number(v.latitude) === DEFAULT_LOCATION.LATITUDE &&
    Number(v.longitude) === DEFAULT_LOCATION.LONGITUDE;
  const hasValidCoords = v.latitude && v.longitude && !isDefaultLoc;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Weather & Environment Card */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100 flex flex-col">
        <div className="flex flex-col mb-4 gap-1">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
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
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
              Environment
            </h3>
          </div>

          <div className="flex items-center gap-1.5 pl-1">
            <svg
              className="w-3 h-3 text-gray-400 flex-shrink-0"
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
              className="text-[10px] font-bold text-gray-500 uppercase tracking-wide truncate w-full"
              title={v.weather_address || v.location_address}
            >
              {v.weather_address || v.location_address || "Outside"}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <WeatherRow
            label="Outside"
            value={
              v.outside_temp !== undefined && v.outside_temp !== null
                ? `${v.outside_temp}°C`
                : "N/A"
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

        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-xs font-bold text-gray-500">Pet Mode</span>
            <span
              className={`text-[10px] font-bold px-2 py-1 rounded-lg ${Number(v.pet_mode) === 1 ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-gray-200 text-gray-500"}`}
            >
              {Number(v.pet_mode) === 1 ? "ON" : "OFF"}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-xs font-bold text-gray-500">Camp Mode</span>
            <span
              className={`text-[10px] font-bold px-2 py-1 rounded-lg ${Number(v.camp_mode) === 1 ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-gray-200 text-gray-500"}`}
            >
              {Number(v.camp_mode) === 1 ? "ON" : "OFF"}
            </span>
          </div>
        </div>
      </div>

      {/* Map Card */}
      <div className="flex-1 rounded-3xl bg-white p-2 shadow-sm border border-gray-100 min-h-[250px] flex flex-col">
        <div className="flex flex-col mb-2 gap-1 px-4 py-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
              <svg
                className="w-6 h-6 text-blue-600 flex-shrink-0"
                viewBox="0 0 512 512"
                fill="currentColor"
              >
                <g transform="translate(0, 512) scale(0.1, -0.1)">
                  <path d="M560 3586 c-132 -28 -185 -75 -359 -321 -208 -291 -201 -268 -201 -701 0 -361 3 -383 69 -470 58 -77 133 -109 311 -134 202 -29 185 -21 199 -84 14 -62 66 -155 119 -209 110 -113 277 -165 430 -133 141 29 269 125 328 246 l29 59 1115 0 1115 0 29 -59 c60 -123 201 -226 345 -250 253 -43 499 137 543 397 34 203 -77 409 -268 500 -69 33 -89 38 -172 41 -116 5 -198 -15 -280 -67 -116 -76 -195 -193 -214 -321 -6 -36 -12 -71 -14 -77 -5 -19 -2163 -19 -2168 0 -2 6 -8 41 -14 77 -19 128 -98 245 -214 321 -82 52 -164 72 -280 67 -82 -3 -103 -8 -168 -40 -41 -19 -94 -52 -117 -72 -55 -48 -115 -139 -137 -209 -21 -68 -13 -66 -196 -37 -69 11 -128 20 -132 20 -17 0 -82 67 -94 97 -10 23 -14 86 -14 228 l0 195 60 0 c48 0 63 4 80 22 22 24 26 58 10 88 -12 22 -61 40 -111 40 l-39 0 0 43 c1 23 9 65 18 93 20 58 264 406 317 453 43 37 120 61 198 61 52 0 58 -2 53 -17 -4 -10 -48 -89 -98 -177 -70 -122 -92 -170 -95 -205 -5 -56 19 -106 67 -138 l33 -23 1511 0 c867 0 1583 -4 1680 -10 308 -18 581 -60 788 -121 109 -32 268 -103 268 -119 0 -6 -27 -10 -60 -10 -68 0 -100 -21 -100 -66 0 -63 40 -84 161 -84 l79 0 0 -214 c0 -200 -1 -215 -20 -239 -13 -16 -35 -29 -58 -33 -88 -16 -113 -102 -41 -140 81 -41 228 49 259 160 8 29 11 119 8 292 l-3 249 -32 67 c-45 96 -101 152 -197 197 -235 112 -604 187 -1027 209 l-156 9 -319 203 c-176 112 -359 223 -409 246 -116 56 -239 91 -366 104 -149 15 -1977 12 -2049 -4z m800 -341 l0 -205 -335 0 -336 0 12 23 c7 12 59 104 116 205 l105 182 219 0 219 0 0 -205z m842 15 c14 -102 27 -193 27 -202 1 -17 -23 -18 -359 -18 l-360 0 0 198 c0 109 3 202 7 205 4 4 153 6 332 5 l326 -3 27 -185z m528 157 c52 -14 125 -38 161 -55 54 -24 351 -206 489 -299 l35 -23 -516 0 -516 0 -26 188 c-15 103 -27 196 -27 206 0 18 7 19 153 13 112 -5 177 -12 247 -30z m-1541 -1132 c115 -63 176 -174 169 -305 -16 -272 -334 -402 -541 -221 -20 18 -51 63 -69 99 -28 57 -33 77 -33 142 0 65 5 85 33 142 37 76 93 128 169 159 75 30 200 23 272 -16z m3091 16 c110 -42 192 -149 207 -269 18 -159 -101 -319 -264 -352 -134 -28 -285 47 -350 174 -37 72 -43 180 -14 257 35 91 107 162 200 195 55 20 162 17 221 -5z" />
                  <path d="M989 2053 c-67 -65 -79 -81 -79 -110 0 -42 30 -73 72 -73 26 0 45 13 110 78 87 87 96 115 53 157 -42 43 -68 34 -156 -52z" />
                  <path d="M4055 2105 c-43 -42 -34 -70 53 -157 65 -65 84 -78 110 -78 42 0 72 31 72 73 0 29 -12 45 -79 110 -88 86 -114 95 -156 52z" />
                  <path d="M1705 2290 c-25 -28 -23 -76 4 -103 l22 -22 870 0 871 0 25 29 c27 31 25 66 -4 99 -15 16 -71 17 -893 17 -866 0 -877 0 -895 -20z" />
                </g>
              </svg>
              Vehicle Location
            </h3>
          </div>

          <div className="flex items-center gap-1.5 pl-1 overflow-hidden">
            <svg
              className="w-3 h-3 text-gray-400 flex-shrink-0"
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
                className="text-[10px] font-bold text-gray-500 uppercase tracking-wide truncate flex items-center gap-1 hover:text-blue-600 transition-all group"
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
            ) : (
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                Offline
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 bg-gray-100 rounded-2xl relative overflow-hidden">
          {hasValidCoords ? (
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              title="Vehicle Location"
              src={`https://maps.google.com/maps?q=${v.latitude},${v.longitude}&z=15&output=embed&iwloc=near`}
              className="absolute w-[150%] h-[150%] top-[-25%] left-[-25%] filter grayscale contrast-[1.1] opacity-90 mix-blend-multiply transition-opacity duration-500"
              style={{ pointerEvents: "auto" }}
            ></iframe>
          ) : (
            /* Loading / No Signal State */
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
              <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin mb-3"></div>
              <span className="text-xs font-bold uppercase tracking-wider">
                Đang xác định vị trí
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
