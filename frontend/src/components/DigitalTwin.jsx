import React from "react";
import { useStore } from "@nanostores/react";
import { vehicleStore, switchVehicle } from "../stores/vehicleStore";
import { TIRE_PRESSURE, TEMPERATURE, GEARS } from "../constants/vehicle";

// Tire Pressure Card - Polished Visuals with Full Labels
const TireCard = ({ pressure, temp, label, positionClass }) => {
  const hasData = pressure !== null && pressure !== undefined;

  // Normalize Pressure to Bar
  let displayPressure = "--";
  if (hasData) {
    let val = pressure;
    if (val > 100) {
      // Assume kPa (e.g. 230) -> Bar
      val = val / 100;
    } else if (val > 8) {
      // Assume PSI (e.g. 35) -> Bar
      val = val / 14.5038;
    }
    // If < 8, assume default Bar
    displayPressure = Number(val).toFixed(1);
  }

  // Status Logic for Coloring (using Bar values)
  // Warning conditions: Pressure < LIMIT_LOW or > LIMIT_HIGH, OR Temp > LIMIT_HIGH
  const limitPressureLow = TIRE_PRESSURE.LIMIT_LOW;
  const limitPressureHigh = TIRE_PRESSURE.LIMIT_HIGH;
  const limitTempHigh = TEMPERATURE.LIMIT_HIGH;

  // HIDE BUBBLE IF NO DATA
  if (!hasData) return null;

  // We check raw converted value for warning logic
  const numericPressure = hasData ? Number(displayPressure) : null;
  const isWarning =
    hasData &&
    (numericPressure < limitPressureLow ||
      numericPressure > limitPressureHigh ||
      (temp && temp > limitTempHigh));

  // Dynamic Styles based on status
  // Normal: Green Safe Theme
  // Warning: Amber/Orange Theme
  const cardBg = isWarning
    ? "bg-amber-50/90 border-amber-200"
    : "bg-emerald-50/90 border-emerald-200";
  const textColor = isWarning ? "text-amber-600" : "text-emerald-700";
  const labelColor = isWarning ? "text-amber-600/70" : "text-emerald-600/70";
  const valueColor = isWarning ? "text-amber-600" : "text-emerald-600";
  const subTextColor = isWarning ? "text-amber-500" : "text-emerald-500";

  return (
    <div
      className={`absolute ${positionClass} ${cardBg} backdrop-blur-sm px-2 md:px-3 py-1.5 md:py-2.5 rounded-xl border shadow-sm flex flex-col gap-0 md:gap-0.5 w-[110px] md:w-[130px] transition-all hover:scale-105 hover:bg-white hover:border-gray-200 hover:shadow-md z-20`}
    >
      {/* Label - colored by status */}
      <span
        className={`text-[10px] uppercase ${labelColor} font-extrabold tracking-wider leading-none mb-1`}
      >
        {label}
      </span>

      {/* Stats Container */}
      <div className="flex flex-col">
        {/* Pressure Row */}
        <div className="flex items-baseline gap-1">
          <span
            className={`text-xl md:text-2xl font-black tracking-tighter ${valueColor}`}
          >
            {displayPressure}
          </span>
          <span className={`text-[10px] ${subTextColor} font-bold uppercase`}>
            {TIRE_PRESSURE.UNIT}
          </span>
        </div>

        {/* Temp Row */}
        {temp !== null && temp !== undefined && (
          <div className="flex items-center gap-1 -mt-0.5">
            <span className={`text-xs font-bold ${textColor}`}>{temp}</span>
            <span className={`text-[10px] ${subTextColor} font-medium`}>
              {TEMPERATURE.UNIT}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Warning Item Component
const WarningItem = ({ label }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg border border-red-100 animate-pulse">
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      ></path>
    </svg>
    <span className="text-xs font-bold">{label}</span>
  </div>
);

export default function DigitalTwin() {
  const data = useStore(vehicleStore);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const imgRef = React.useRef(null);

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
  if (data.door_fl || data.door_fr || data.door_rl || data.door_rr)
    warnings.push("Door Open");
  if (data.trunk_status) warnings.push("Trunk Open");
  if (data.hood_status) warnings.push("Hood Open");
  // Central Lock: false means UNLOCKED (Warning)
  if (data.central_lock_status === false || data.is_locked === false)
    warnings.push("Unlocked");

  return (
    <div className="relative w-full h-full min-h-[400px] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="relative flex-1 w-full flex items-center justify-center p-4">
        <div className="absolute top-4 md:top-6 left-4 md:left-8 z-10 flex flex-col">
          <h2 className="text-xl font-black text-gray-900 tracking-wide uppercase leading-none mb-2">
            {data.vin ? (
              data.customizedVehicleName || data.model || "VINFAST"
            ) : (
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
            )}
          </h2>

          <div className="flex flex-col gap-0.5 animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
            <div className="flex items-baseline gap-1">
              {data.vin ? (
                <>
                  <span
                    className={`text-lg font-bold leading-none ${data.odometer != null ? "text-gray-700" : "text-gray-300"}`}
                  >
                    {data.odometer !== undefined && data.odometer !== null
                      ? Number(data.odometer).toLocaleString()
                      : "N/A"}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    km
                  </span>
                </>
              ) : (
                <div className="h-5 w-20 bg-gray-200 animate-pulse rounded"></div>
              )}
            </div>
          </div>

          <div className="flex mt-2 pt-2 border-t border-gray-100 flex flex-col gap-0.5 animate-in fade-in slide-in-from-left-4 duration-700 delay-500">
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

        <div className="relative w-full max-w-[520px] aspect-[16/10] flex items-center justify-center mt-6 md:mt-0 translate-y-4 md:translate-y-28 group">
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
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30">
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
        </div>

        {/* Tire Cards */}
        {/* TL=FR, TR=RR, BL=FL, BR=RL */}

        <TireCard
          pressure={data.tire_pressure_fr}
          temp={data.tire_temp_fr}
          label="FRONT RIGHT"
          positionClass="top-[22%] left-[1%] md:left-[8%]"
        />
        <TireCard
          pressure={data.tire_pressure_rr}
          temp={data.tire_temp_rr}
          label="REAR RIGHT"
          positionClass="top-[22%] right-[1%] md:right-[8%]"
        />

        <TireCard
          pressure={data.tire_pressure_fl}
          temp={data.tire_temp_fl}
          label="FRONT LEFT"
          positionClass="bottom-[2%] left-[1%] md:left-[8%]"
        />
        <TireCard
          pressure={data.tire_pressure_rl}
          temp={data.tire_temp_rl}
          label="REAR LEFT"
          positionClass="bottom-[2%] right-[1%] md:right-[8%]"
        />
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
          <div className="w-px h-6 bg-gray-200 mx-1"></div>
          <span
            className={`text-base font-black transition-all duration-300 ${data.gear_position === GEARS.SPORT || data.gear_position === 5 ? "text-red-500 scale-125" : "text-gray-300 hover:text-gray-400"}`}
          >
            {GEARS.SPORT}
          </span>
        </div>

        {/* Warnings Section */}
        <div className="h-8 flex items-center justify-center w-full">
          {warnings.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {warnings.map((w, idx) => (
                <WarningItem key={idx} label={w} />
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
