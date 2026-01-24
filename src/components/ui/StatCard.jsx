import React from "react";

/**
 * StatCard - Reusable stat display component
 * @param {string} label - Small label above the value
 * @param {string|number} value - Main value to display
 * @param {string} unit - Optional unit (km, kWh, etc.)
 * @param {string} trend - Optional trend indicator (+12%, -5%)
 * @param {React.ReactNode} icon - Optional icon
 * @param {string} variant - Color variant: blue, green, amber, gray
 * @param {string} size - Size: sm, md, lg
 */
export default function StatCard({
  label,
  value,
  unit,
  trend,
  icon,
  variant = "gray",
  size = "md",
  className = "",
}) {
  const variants = {
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100/50",
      border: "border-blue-100",
      label: "text-blue-600/70",
      value: "text-blue-700",
      icon: "text-blue-500 bg-blue-100",
    },
    green: {
      bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50",
      border: "border-emerald-100",
      label: "text-emerald-600/70",
      value: "text-emerald-700",
      icon: "text-emerald-500 bg-emerald-100",
    },
    amber: {
      bg: "bg-gradient-to-br from-amber-50 to-amber-100/50",
      border: "border-amber-100",
      label: "text-amber-600/70",
      value: "text-amber-700",
      icon: "text-amber-500 bg-amber-100",
    },
    gray: {
      bg: "bg-gray-50",
      border: "border-gray-100",
      label: "text-gray-500",
      value: "text-gray-900",
      icon: "text-gray-500 bg-gray-100",
    },
    white: {
      bg: "bg-white",
      border: "border-gray-100",
      label: "text-gray-400",
      value: "text-gray-900",
      icon: "text-blue-500 bg-blue-50",
    },
  };

  const sizes = {
    sm: {
      padding: "p-3",
      labelText: "text-[8px]",
      valueText: "text-lg",
      unitText: "text-xs",
      iconSize: "w-8 h-8",
      iconInner: "w-4 h-4",
    },
    md: {
      padding: "p-4",
      labelText: "text-[10px]",
      valueText: "text-2xl",
      unitText: "text-sm",
      iconSize: "w-10 h-10",
      iconInner: "w-5 h-5",
    },
    lg: {
      padding: "p-5",
      labelText: "text-xs",
      valueText: "text-3xl",
      unitText: "text-base",
      iconSize: "w-12 h-12",
      iconInner: "w-6 h-6",
    },
  };

  const v = variants[variant];
  const s = sizes[size];

  return (
    <div
      className={`rounded-2xl border ${v.bg} ${v.border} ${s.padding} ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p
            className={`${s.labelText} font-bold uppercase tracking-wider ${v.label} mb-1`}
          >
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            <span className={`${s.valueText} font-black ${v.value} leading-none`}>
              {value ?? "N/A"}
            </span>
            {unit && (
              <span className={`${s.unitText} font-bold ${v.label}`}>{unit}</span>
            )}
          </div>
          {trend && (
            <p
              className={`mt-1 text-xs font-bold ${
                trend.startsWith("+") ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {trend}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={`${s.iconSize} rounded-xl ${v.icon} flex items-center justify-center flex-shrink-0`}
          >
            {React.cloneElement(icon, { className: s.iconInner })}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * StatCardRow - Horizontal stat display
 */
export function StatCardRow({ label, value, unit, icon, iconColor = "text-blue-500" }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        {icon && (
          <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center ${iconColor}`}>
            {icon}
          </div>
        )}
        <div>
          <span className="block text-sm font-bold text-gray-900">
            {value ?? "N/A"}{unit && <span className="text-gray-400 ml-1">{unit}</span>}
          </span>
          <span className="text-xs font-medium text-gray-400">{label}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * StatCardMini - Compact stat for grids
 */
export function StatCardMini({ label, value, unit, variant = "gray" }) {
  const variants = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-red-50 text-red-700 border-red-100",
    gray: "bg-gray-50 text-gray-700 border-gray-100",
  };

  return (
    <div className={`px-3 py-2 rounded-xl border text-center ${variants[variant]}`}>
      <p className="text-[8px] font-bold uppercase tracking-wider opacity-70 mb-0.5">
        {label}
      </p>
      <p className="text-base font-black leading-none">
        {value ?? "N/A"}
        {unit && <span className="text-xs font-bold opacity-70 ml-0.5">{unit}</span>}
      </p>
    </div>
  );
}
