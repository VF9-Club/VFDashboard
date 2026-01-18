import { useStore } from "@nanostores/react";
import { vehicleStore } from "../stores/vehicleStore";

export default function AuthGate({ children }) {
  const { isInitialized, vin } = useStore(vehicleStore);

  // If not initialized (first check hasn't finished), show loading screen
  if (!isInitialized) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 z-[9999]">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/logo.png"
              className="w-8 h-8 object-contain opacity-50"
              alt="Logo"
            />
          </div>
        </div>
        <p className="mt-4 text-xs font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">
          Authenticating...
        </p>
      </div>
    );
  }

  // If initialized but no VIN (meaning 401 or no vehicle), we still render children
  // because the index.astro logic or components handle their own empty states / redirects.
  // HOWEVER, the user specifically wants to avoid the dashboard flash.
  // If we don't have a VIN, we should probably stay in loading or redirect immediately.
  // The fetch logic in stores/vehicleStore.ts redirects on 401.

  if (!vin) {
    // Still show loading while waiting for redirect
    return <div className="fixed inset-0 bg-gray-50 z-[9999]"></div>;
  }

  return children;
}
