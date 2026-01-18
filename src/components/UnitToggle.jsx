import { useStore } from "@nanostores/react";
import { unitSystem, toggleUnitSystem } from "../stores/settingsStore";
import { UNIT_SYSTEMS } from "../utils/unitConversions";

export default function UnitToggle() {
  const currentSystem = useStore(unitSystem);
  const isMetric = currentSystem === UNIT_SYSTEMS.METRIC;

  return (
    <button
      onClick={toggleUnitSystem}
      className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm hover:bg-white hover:border-gray-300 transition-all active:scale-95"
      title={`Switch to ${isMetric ? 'Imperial' : 'Metric'} units`}
    >
      <svg
        className="w-4 h-4 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
      <span className="text-xs font-bold text-gray-600">
        {isMetric ? 'Metric' : 'Imperial'}
      </span>
    </button>
  );
}
