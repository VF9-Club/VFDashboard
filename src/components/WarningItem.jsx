import React from "react";

// Warning Item Component with Tooltip (hover on desktop, tap on mobile)
const WarningItem = ({ label, detail }) => (
  <div className="relative group/warn">
    <button
      type="button"
      className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg border border-red-100 animate-pulse cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-300"
    >
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
    </button>
    {/* Tooltip - shows on hover (desktop) or focus (mobile tap) */}
    {detail && (
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-white rounded-lg shadow-lg border border-gray-200 text-xs text-gray-700 whitespace-nowrap opacity-0 invisible group-hover/warn:opacity-100 group-hover/warn:visible group-focus-within/warn:opacity-100 group-focus-within/warn:visible transition-all z-50">
        <div className="font-bold text-red-600 mb-1">{label}</div>
        <div className="text-gray-600">{detail}</div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-b border-r border-gray-200 rotate-45 -translate-y-1"></div>
      </div>
    )}
  </div>
);

export default WarningItem;
