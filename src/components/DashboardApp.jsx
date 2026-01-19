import React, { useState } from "react";
import { useStore } from "@nanostores/react";
import { vehicleStore, fetchFullTelemetry } from "../stores/vehicleStore";
import DashboardController from "./DashboardController";
import AuthGate from "./AuthGate";
import VehicleHeader from "./VehicleHeader";
import CarStatus from "./CarStatus";
import { EnvironmentCard, MapCard } from "./ControlGrid";
import DigitalTwin from "./DigitalTwin";
import SystemHealth from "./SystemHealth";
import MobileNav from "./MobileNav";
import TelemetryDrawer from "./TelemetryDrawer";

export default function DashboardApp({ vin: initialVin }) {
  const { isInitialized, vin } = useStore(vehicleStore);
  const [activeTab, setActiveTab] = useState("vehicle");
  const [isTelemetryDrawerOpen, setIsTelemetryDrawerOpen] = useState(false);

  const handleFullScan = async () => {
    if (vin) {
      await fetchFullTelemetry(vin, true);
    }
  };

  const handleOpenTelemetry = () => {
    setIsTelemetryDrawerOpen(true);
  };

  // While not initialized or no vin, show the AuthGate (which contains the spinner)
  if (!isInitialized || !vin) {
    return (
      <>
        <DashboardController vin={initialVin} />
        <AuthGate />
      </>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-[100dvh] z-0 md:static md:h-auto md:max-w-7xl md:min-w-[1280px] md:mx-auto p-4 md:space-y-6 pb-28 md:pb-4 animate-in fade-in duration-700 flex flex-col overflow-hidden md:overflow-visible">
      <DashboardController vin={initialVin} />

      <header className="flex-shrink-0 relative z-[60]">
        <VehicleHeader onOpenTelemetry={handleOpenTelemetry} />
      </header>

      <main className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-6 min-h-0">
        {/* LEFT COLUMN: Energy (Top) + Vehicle Status (Bottom) */}
        <div
          className={`md:col-span-3 flex flex-col gap-6 ${activeTab === "energy_env" || activeTab === "status" ? "flex-1" : "hidden md:flex"}`}
        >
          {/* Tab 2: Energy */}
          <div
            className={`${activeTab === "energy_env" ? "flex-1 block" : "hidden md:block"}`}
          >
            <CarStatus />
          </div>
          {/* Tab 3: Vehicle Status */}
          <div
            className={`${activeTab === "status" ? "flex-1 block" : "hidden md:flex md:flex-1 md:flex-col"}`}
          >
            <SystemHealth />
          </div>
        </div>

        {/* CENTER COLUMN: Digital Twin */}
        <div
          className={`md:col-span-6 relative bg-gray-800/10 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-sm overflow-hidden md:block flex-1 ${activeTab === "vehicle" ? "flex flex-col" : "hidden md:block"}`}
        >
          <DigitalTwin />
        </div>

        {/* RIGHT COLUMN: Environment (Top) + Location (Bottom) */}
        <div
          className={`md:col-span-3 flex flex-col ${activeTab === "location" ? "gap-0 md:gap-6 flex-1" : "gap-6 hidden md:flex"}`}
        >
          {/* Environment - PC Only */}
          <div className="hidden md:block">
            <EnvironmentCard />
          </div>
          {/* Tab 4: Location */}
          <div
            className={`${activeTab === "location" ? "flex-1 block" : "hidden md:flex md:flex-1 md:flex-col"}`}
          >
            <MapCard />
          </div>
        </div>
      </main>

      <MobileNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onScan={handleOpenTelemetry}
      />
      <TelemetryDrawer
        isOpen={isTelemetryDrawerOpen}
        onClose={() => setIsTelemetryDrawerOpen(false)}
      />
    </div>
  );
}
