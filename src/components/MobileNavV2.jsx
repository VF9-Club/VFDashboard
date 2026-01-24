import React, { useState } from "react";
import BottomSheet from "./ui/BottomSheet";

// Icons as components
const CarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 512 512" fill="currentColor">
    <g transform="translate(0, 512) scale(0.1, -0.1)">
      <path d="M560 3586 c-132 -28 -185 -75 -359 -321 -208 -291 -201 -268 -201 -701 0 -361 3 -383 69 -470 58 -77 133 -109 311 -134 202 -29 185 -21 199 -84 14 -62 66 -155 119 -209 110 -113 277 -165 430 -133 141 29 269 125 328 246 l29 59 1115 0 1115 0 29 -59 c60 -123 201 -226 345 -250 253 -43 499 137 543 397 34 203 -77 409 -268 500 -69 33 -89 38 -172 41 -116 5 -198 -15 -280 -67 -116 -76 -195 -193 -214 -321 -6 -36 -12 -71 -14 -77 -5 -19 -2163 -19 -2168 0 -2 6 -8 41 -14 77 -19 128 -98 245 -214 321 -82 52 -164 72 -280 67 -82 -3 -103 -8 -168 -40 -41 -19 -94 -52 -117 -72 -55 -48 -115 -139 -137 -209 -21 -68 -13 -66 -196 -37 -69 11 -128 20 -132 20 -17 0 -82 67 -94 97 -10 23 -14 86 -14 228 l0 195 60 0 c48 0 63 4 80 22 22 24 26 58 10 88 -12 22 -61 40 -111 40 l-39 0 0 43 c1 23 9 65 18 93 20 58 264 406 317 453 43 37 120 61 198 61 52 0 58 -2 53 -17 -4 -10 -48 -89 -98 -177 -70 -122 -92 -170 -95 -205 -5 -56 19 -106 67 -138 l33 -23 1511 0 c867 0 1583 -4 1680 -10 308 -18 581 -60 788 -121 109 -32 268 -103 268 -119 0 -6 -27 -10 -60 -10 -68 0 -100 -21 -100 -66 0 -63 40 -84 161 -84 l79 0 0 -214 c0 -200 -1 -215 -20 -239 -13 -16 -35 -29 -58 -33 -88 -16 -113 -102 -41 -140 81 -41 228 49 259 160 8 29 11 119 8 292 l-3 249 -32 67 c-45 96 -101 152 -197 197 -235 112 -604 187 -1027 209 l-156 9 -319 203 c-176 112 -359 223 -409 246 -116 56 -239 91 -366 104 -149 15 -1977 12 -2049 -4z" />
    </g>
  </svg>
);

const BoltIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ShieldIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const MapIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const GridIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ChargingStationIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const RouteIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const ChartIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const CalculatorIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const ScanIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

// Nav Item Component
const NavItem = ({ id, label, icon: Icon, active, onClick, badge }) => (
  <button
    onClick={() => onClick(id)}
    className={`relative flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 rounded-2xl z-10 ${
      active ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
    }`}
  >
    {/* Active Background */}
    <div
      className={`absolute inset-1 transition-all duration-300 rounded-2xl ${
        active
          ? "bg-blue-100/60 scale-100 opacity-100"
          : "scale-75 opacity-0"
      }`}
    />

    {/* Icon */}
    <div className={`relative transition-all duration-300 ${active ? "scale-110" : ""}`}>
      <Icon className="w-6 h-6" />
      {badge && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </div>

    {/* Label */}
    <span
      className={`relative text-[9px] font-bold uppercase tracking-tight mt-1 transition-all duration-300 ${
        active ? "opacity-100" : "opacity-70"
      }`}
    >
      {label}
    </span>
  </button>
);

// More Menu Item Component
const MoreMenuItem = ({ id, label, icon: Icon, description, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors text-left group"
  >
    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
      <Icon className="w-6 h-6 text-blue-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-gray-900">{label}</p>
      {description && (
        <p className="text-sm text-gray-500 truncate">{description}</p>
      )}
    </div>
    <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

// Main Component
export default function MobileNavV2({ activeTab, onTabChange, onScan, onOpenFeature }) {
  const [showMore, setShowMore] = useState(false);

  // Main tabs
  const tabs = [
    { id: "vehicle", label: "Vehicle", icon: CarIcon },
    { id: "energy_env", label: "Energy", icon: BoltIcon },
    { id: "status", label: "Status", icon: ShieldIcon },
    { id: "location", label: "Location", icon: MapIcon },
    { id: "more", label: "More", icon: GridIcon },
  ];

  // More menu options
  const moreOptions = [
    {
      id: "charging",
      label: "Charging Stations",
      icon: ChargingStationIcon,
      description: "Find nearby charging stations",
    },
    {
      id: "history",
      label: "Charging History",
      icon: ChartIcon,
      description: "View past charging sessions",
    },
    {
      id: "services",
      label: "Vehicle Services",
      icon: ShieldIcon,
      description: "Battery, Maintenance, Alerts",
    },
    {
      id: "range",
      label: "Range Calculator",
      icon: CalculatorIcon,
      description: "Estimate your range",
    },
  ];

  const handleTabClick = (id) => {
    if (id === "more") {
      setShowMore(true);
    } else {
      onTabChange(id);
    }
  };

  const handleMoreSelect = (id) => {
    setShowMore(false);
    if (onOpenFeature) {
      onOpenFeature(id);
    }
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe safe-bottom">
        <div className="flex items-stretch gap-2 mb-2">
          {/* Main Tab Bar */}
          <div className="flex-1 flex bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-1 shadow-[0_-4px_30px_rgba(0,0,0,0.1)] h-16">
            {tabs.map((tab) => (
              <NavItem
                key={tab.id}
                {...tab}
                active={activeTab === tab.id && tab.id !== "more"}
                onClick={handleTabClick}
              />
            ))}
          </div>

          {/* Scan Button */}
          <button
            onClick={onScan}
            className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 backdrop-blur-xl rounded-2xl shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
            title="Full Scan"
          >
            <ScanIcon className="w-7 h-7 text-white" />
          </button>
        </div>
      </div>

      {/* More Options Bottom Sheet */}
      <BottomSheet
        isOpen={showMore}
        onClose={() => setShowMore(false)}
        title="More Features"
      >
        <div className="space-y-2">
          {moreOptions.map((option) => (
            <MoreMenuItem
              key={option.id}
              {...option}
              onClick={handleMoreSelect}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Quick Actions
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setShowMore(false);
                onScan?.();
              }}
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white"
            >
              <ScanIcon className="w-6 h-6" />
              <div className="text-left">
                <p className="font-bold">Deep Scan</p>
                <p className="text-xs text-indigo-200">Full telemetry</p>
              </div>
            </button>
            <button
              onClick={() => handleMoreSelect("range")}
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white"
            >
              <CalculatorIcon className="w-6 h-6" />
              <div className="text-left">
                <p className="font-bold">Range Calc</p>
                <p className="text-xs text-emerald-200">Plan your trip</p>
              </div>
            </button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
