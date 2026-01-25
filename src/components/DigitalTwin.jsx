import React from "react";
import { useStore } from "@nanostores/react";
import { vehicleStore, switchVehicle } from "../stores/vehicleStore";
import { GEARS } from "../constants/vehicle";
import TireCard from "./TireCard";
import WarningItem from "./WarningItem";

// Helper to split Odometer into Integer and Decimal parts (No Rounding)
const formatOdometer = (value) => {
  if (value === undefined || value === null)
    return { integer: "N/A", decimal: "" };
  const strVal = String(value);
  const [intPart, decPart] = strVal.split(".");
  return {
    integer: Number(intPart).toLocaleString(),
    decimal: decPart ? `.${decPart}` : "",
  };
};

export default function DigitalTwin() {
  const data = useStore(vehicleStore);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const imgRef = React.useRef(null);

  const odo = formatOdometer(data.odometer);

  React.useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setImageLoaded(true);
    }
  }, [data.vin]); // Reset load state on VIN change if needed, though react keying might be better

  // Multi-Vehicle Logic
  const allVehicles = data.vehicles || [];
  const currentIndex = allVehicles.findIndex((v) => v.vinCode === data.vin);
  const hasMultipleVehicles = allVehicles.length > 1;

  const getCarImage = () => {
    // 1. Prefer API provided image
    if (data.vehicleImage) return data.vehicleImage;

    // 2. Fallback to model-based local assets
    const model = (data.marketingName || data.model || "").toUpperCase();
    if (model.includes("VF 3")) return "/vf3-iso.png";
    if (model.includes("VF 5")) return "/vf5-iso.png";
    if (model.includes("VF 6")) return "/vf6-iso.png";
    if (model.includes("VF 7")) return "/vf7-iso.png";
    if (model.includes("VF 8")) return "/vf8-iso.png";

    return null;
  };

  const carImageSrc = getCarImage();

  const warnings = [];

  // Door warnings with detail
  const openDoors = [];
  if (data.door_fl) openDoors.push("Front Left");
  if (data.door_fr) openDoors.push("Front Right");
  if (data.door_rl) openDoors.push("Rear Left");
  if (data.door_rr) openDoors.push("Rear Right");
  if (openDoors.length > 0) {
    warnings.push({
      label: "Door Open",
      detail: openDoors.join(", "),
    });
  }

  if (data.trunk_status) {
    warnings.push({
      label: "Trunk Open",
      detail: "Rear trunk is open",
    });
  }

  if (data.hood_status) {
    warnings.push({
      label: "Hood Open",
      detail: "Front hood is open",
    });
  }

  // Central Lock: false means UNLOCKED (Warning)
  if (data.central_lock_status === false || data.is_locked === false) {
    warnings.push({
      label: "Unlocked",
      detail: "Vehicle is not locked",
    });
  }

  return (
    <div className="relative w-full h-full min-h-[45vh] md:min-h-[400px] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-1">
      <div className="relative flex-1 w-full flex items-center justify-center p-2 md:p-4">
        {/* Header Section: Nickname, ODO, Details, Warranty */}
        <div className="absolute top-4 md:top-6 left-5 md:left-8 right-5 md:right-8 z-10 flex flex-col">
          {/* Row 1: Icon + Nickname (Left) | ODO (Right) */}
          <div className="flex items-center justify-between w-full">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 min-w-0">
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
              <span className="truncate">
                {data.vin ? (
                  data.customizedVehicleName || data.model
                ) : (
                  <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
                )}
              </span>
            </h3>

            {/* Odometer (Right) */}
            <div className="flex flex-col items-end leading-none shrink-0">
              <span className="text-[8px] md:text-[9px] font-bold text-blue-600 uppercase tracking-tighter mb-0.5">
                Odometer
              </span>
              <div className="flex items-baseline gap-1 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
                {data.vin &&
                data.odometer !== null &&
                data.odometer !== undefined ? (
                  <>
                    <span className="text-base md:text-xl font-mono font-extrabold text-gray-700 tabular-nums">
                      {odo.integer}
                      <span className="text-gray-400 text-sm">
                        {odo.decimal}
                      </span>
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      km
                    </span>
                  </>
                ) : (
                  <span className="text-base md:text-xl font-mono font-extrabold text-gray-300 animate-pulse tracking-widest">
                    ------
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Row 2: Vehicle Details (Tighter) */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] md:text-xs text-gray-500 font-medium animate-in fade-in slide-in-from-left-4 duration-700 delay-400">
            <span>{data.vehicleVariant}</span>
            <span className="text-gray-300">•</span>
            <span>{data.yearOfProduct}</span>

            {data.battery_type &&
              data.battery_type !== "--" &&
              data.battery_type.trim() !== "" && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="uppercase">{data.battery_type}</span>
                </>
              )}

            {/* Exterior Color */}
            <span className="text-gray-300 ml-1">•</span>
            <div className="flex items-center gap-1 group/ext">
              <span>{data.color}</span>
            </div>

            {/* Interior Color */}
            {data.interiorColor && (
              <>
                <span className="text-gray-300 ml-1">•</span>
                <div className="flex items-center gap-1 group/int">
                  <span>{data.interiorColor}</span>
                </div>
              </>
            )}
          </div>

          {/* Row 3: Warranty Section (Existing, with reduced mt) */}
          <div className="mt-1.5 pt-1.5 border-t border-gray-100 flex flex-col gap-0.5 animate-in fade-in slide-in-from-left-4 duration-700 delay-500">
            <p className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-wider">
              Warranty Expires
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-600 font-mono">
              <span
                className={!data.warrantyExpirationDate ? "text-gray-300" : ""}
              >
                {data.warrantyExpirationDate
                  ? new Date(data.warrantyExpirationDate).toLocaleDateString(
                      "vi-VN",
                    )
                  : "N/A"}
              </span>
              <span className="text-gray-300">|</span>
              <span className={!data.warrantyMileage ? "text-gray-300" : ""}>
                {data.warrantyMileage
                  ? `${Number(data.warrantyMileage).toLocaleString()} km`
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-[520px] aspect-[16/10] flex items-center justify-center mt-3 md:mt-0 translate-y-8 md:translate-y-20 scale-90 md:scale-100 group">
          {hasMultipleVehicles && (
            <>
              {/* Left Arrow */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 z-30 px-2">
                {currentIndex > 0 && (
                  <button
                    onClick={() =>
                      switchVehicle(allVehicles[currentIndex - 1].vinCode)
                    }
                    className="p-3 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 shadow-lg text-gray-400 hover:text-blue-600 hover:scale-110 active:scale-95 transition-all"
                    title="Previous Vehicle"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Right Arrow */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 z-30 px-2">
                {currentIndex < allVehicles.length - 1 && (
                  <button
                    onClick={() =>
                      switchVehicle(allVehicles[currentIndex + 1].vinCode)
                    }
                    className="p-3 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 shadow-lg text-gray-400 hover:text-blue-600 hover:scale-110 active:scale-95 transition-all"
                    title="Next Vehicle"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Pagination Dots */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30">
                {allVehicles.map((v, idx) => (
                  <button
                    key={v.vinCode}
                    onClick={() => switchVehicle(v.vinCode)}
                    className={`transition-all duration-300 rounded-full ${
                      idx === currentIndex
                        ? "w-6 h-1.5 bg-gray-800"
                        : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
                    }`}
                    title={
                      v.customizedVehicleName || v.vehicleName || "Vehicle"
                    }
                  />
                ))}
              </div>
            </>
          )}

          {/* Skeleton */}
          <div
            className={`absolute inset-0 bg-gray-100/50 rounded-2xl animate-pulse ${imageLoaded || !carImageSrc ? "hidden" : "block"}`}
          ></div>

          {carImageSrc && (
            <img
              ref={imgRef}
              src={carImageSrc}
              alt="Vehicle Isometric"
              className={`w-full h-full object-contain drop-shadow-2xl z-10 scale-105 transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
                setImageLoaded(true);
              }}
            />
          )}

          {/* Tire Cards - Now INSIDE the container for relative positioning */}
          <TireCard
            pressure={data.tire_pressure_fr}
            temp={data.tire_temp_fr}
            label="FRONT RIGHT"
            positionClass="top-[20%] left-[2%]"
          />
          <TireCard
            pressure={data.tire_pressure_rr}
            temp={data.tire_temp_rr}
            label="REAR RIGHT"
            positionClass="top-[20%] right-[2%]"
          />

          <TireCard
            pressure={data.tire_pressure_fl}
            temp={data.tire_temp_fl}
            label="FRONT LEFT"
            positionClass="bottom-[10%] left-[2%]"
          />
          <TireCard
            pressure={data.tire_pressure_rl}
            temp={data.tire_temp_rl}
            label="REAR LEFT"
            positionClass="bottom-[10%] right-[2%]"
          />
        </div>
      </div>

      {/* Bottom Controls Area */}
      <div className="h-auto w-full bg-white flex flex-col items-center justify-end pb-4 space-y-3 z-30">
        {/* Gear Selector */}
        <div className="bg-gray-50/80 backdrop-blur-md px-10 py-3.5 rounded-full flex items-center gap-8 border border-gray-200 shadow-[0_4px_20px_rgb(0,0,0,0.05)] relative z-30">
          {[GEARS.PARK, GEARS.REVERSE, GEARS.NEUTRAL, GEARS.DRIVE].map(
            (gear) => {
              // Normalize data gear (handle numbers or strings)
              const current = data.gear_position;
              // Generic Mapping attempt:
              // P: 'P', 1, 128
              // R: 'R', 2
              // N: 'N', 3
              // D: 'D', 4, 9 (Drive)
              let isActive = false;
              if (String(current) === gear) isActive = true;
              if (
                gear === "P" &&
                (current === 1 || current === 128 || current === 0)
              )
                isActive = true;
              if (gear === "R" && current === 2) isActive = true;
              if (gear === "N" && current === 3) isActive = true;
              if (gear === "D" && (current === 4 || current === 9))
                isActive = true;

              return (
                <span
                  key={gear}
                  className={`text-base font-black transition-all duration-300 ${isActive ? "text-blue-600 scale-125" : "text-gray-300 hover:text-gray-400"}`}
                >
                  {gear}
                </span>
              );
            },
          )}
        </div>

        {/* Warnings Section */}
        <div className="h-6 flex items-center justify-center w-full">
          {warnings.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {warnings.map((w, idx) => (
                <WarningItem key={idx} label={w.label} detail={w.detail} />
              ))}
            </div>
          ) : (
            /* Show nothing or minimal status when safe */
            <span className="text-[10px] font-bold text-green-600 flex items-center gap-1.5">
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Ready
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
