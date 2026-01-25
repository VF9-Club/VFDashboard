import React from "react";
import { TIRE_PRESSURE, TEMPERATURE } from "../constants/vehicle";

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

  // PC Styles (Lighter)
  const cardBgDesktop = isWarning
    ? "md:bg-amber-50/90 md:border-amber-200"
    : "md:bg-emerald-50/90 md:border-emerald-200";

  // Mobile Styles (Unified with PC as requested)
  const cardBgMobile = isWarning
    ? "bg-amber-50/90 border-amber-200"
    : "bg-emerald-50/90 border-emerald-200";

  // Text Colors
  const textColor = isWarning ? "text-amber-600" : "text-emerald-700";
  const labelColor = isWarning ? "text-amber-600/70" : "text-emerald-600/70";
  const valueColor = isWarning ? "text-amber-600" : "text-emerald-600";
  const subTextColor = isWarning ? "text-amber-500" : "text-emerald-500";

  return (
    <div
      className={`absolute ${positionClass} z-20 transition-all group-hover:scale-100`}
    >
      {/* PC: Card Style / Mobile: Glassmorphism Pill Style with Color */}
      <div
        className={`
        flex flex-col items-center md:items-start
        rounded-2xl md:rounded-xl 
        border md:border md:shadow-sm md:backdrop-blur-sm
        md:${cardBgDesktop}
        ${cardBgMobile} backdrop-blur-md shadow-sm
        px-1.5 py-1.5
        md:px-3 md:py-2.5
        gap-0 md:gap-0.5
        w-[85px] md:w-[130px]
        hover:scale-105 md:hover:bg-white md:hover:border-gray-200 md:hover:shadow-md transition-all
        md:bg-opacity-100
      `}
      >
        {/* Label: On Mobile, keep very small */}
        <span
          className={`text-[8px] md:text-[10px] uppercase ${labelColor} font-extrabold tracking-widest leading-none mb-0.5 md:mb-1 opacity-70 md:opacity-100`}
        >
          {label}
        </span>

        {/* Stats Container */}
        <div className="flex flex-col items-center md:items-start">
          {/* Pressure Row */}
          <div className="flex items-baseline gap-px md:gap-1">
            <span
              className={`text-lg md:text-2xl font-black tracking-tighter ${valueColor} drop-shadow-sm md:drop-shadow-none`}
            >
              {displayPressure}
            </span>
            <span
              className={`text-[9px] md:text-[10px] ${subTextColor} font-bold uppercase`}
            >
              {TIRE_PRESSURE.UNIT}
            </span>
          </div>

          {/* Temp Row */}
          {temp !== null && temp !== undefined && (
            <div className="flex items-center gap-0.5 md:gap-1 -mt-0.5 md:-mt-0.5">
              <span className={`text-[9px] md:text-xs font-bold ${textColor}`}>
                {temp}
              </span>
              <span
                className={`text-[8px] md:text-[10px] ${subTextColor} font-medium`}
              >
                {TEMPERATURE.UNIT}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TireCard;
