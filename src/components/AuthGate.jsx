import { useStore } from "@nanostores/react";
import { vehicleStore } from "../stores/vehicleStore";

export default function AuthGate() {
  const { isInitialized, vin } = useStore(vehicleStore);

  // 1. Loading State (Not initialized yet or checking auth)
  if (!isInitialized || !vin) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 z-[9999]">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-gray-100 border-t-[#E82127] animate-spin shadow-inner"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/ev-icon.svg"
              className="w-10 h-10 object-contain"
              alt="EV Dashboard"
            />
          </div>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse">
            Authenticating
          </p>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-[#E82127] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1 h-1 bg-[#E82127] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1 h-1 bg-[#E82127] rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated: Render nothing (unblock the view)
  return null;
}
