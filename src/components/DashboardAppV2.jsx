import React, { useState } from "react";
import { useStore } from "@nanostores/react";
import { vehicleStore, fetchFullTelemetry } from "../stores/vehicleStore";

// Existing components
import DashboardController from "./DashboardController";
import AuthGate from "./AuthGate";
import VehicleHeader from "./VehicleHeader";
import CarStatus from "./CarStatus";
import { EnvironmentCard, MapCard } from "./ControlGrid";
import DigitalTwin from "./DigitalTwin";
import SystemHealth from "./SystemHealth";
import TelemetryDrawer from "./TelemetryDrawer";

// New components
import MobileNavV2 from "./MobileNavV2";
import ChargingMap from "./charging/ChargingMap";
import ChargingHistory, { ChargingHistoryCompact } from "./charging/ChargingHistory";
import VehicleInfo from "./vehicle/VehicleInfo";
import RangeCalculator from "./tools/RangeCalculator";
import BottomSheet from "./ui/BottomSheet";

// Feature Views for full-screen mode
const FeatureViews = {
  charging: ChargingMap,
  history: ChargingHistory,
  services: ({ onClose }) => (
    <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Vehicle Services</h2>
            <p className="text-xs text-gray-500">Battery, Maintenance & Alerts</p>
          </div>
        </div>
        <VehicleInfo />
      </div>
    </div>
  ),
  range: ({ onClose }) => (
    <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
      <div className="p-4">
        <button
          onClick={onClose}
          className="mb-4 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <RangeCalculator />
      </div>
    </div>
  ),
};

export default function DashboardAppV2({ vin: initialVin }) {
  const { isInitialized, vin } = useStore(vehicleStore);
  const [activeTab, setActiveTab] = useState("vehicle");
  const [isTelemetryDrawerOpen, setIsTelemetryDrawerOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);

  const handleFullScan = async () => {
    if (vin) {
      await fetchFullTelemetry(vin, true);
    }
  };

  const handleOpenTelemetry = () => {
    setIsTelemetryDrawerOpen(true);
  };

  const handleOpenFeature = (featureId) => {
    setActiveFeature(featureId);
  };

  const handleCloseFeature = () => {
    setActiveFeature(null);
  };

  // While not initialized or no vin, show the AuthGate
  if (!isInitialized || !vin) {
    return (
      <>
        <DashboardController vin={initialVin} />
        <AuthGate />
      </>
    );
  }

  // Render active feature view
  const FeatureComponent = activeFeature ? FeatureViews[activeFeature] : null;

  return (
    <div className="fixed inset-0 w-full h-[100dvh] z-0 md:static md:h-auto md:max-w-7xl md:min-w-[1280px] md:mx-auto p-4 md:space-y-6 pb-28 md:pb-4 animate-in fade-in duration-700 flex flex-col overflow-hidden md:overflow-visible">
      <DashboardController vin={initialVin} />

      {/* Header */}
      <header className="flex-shrink-0 relative z-[60]">
        <VehicleHeader onOpenTelemetry={handleOpenTelemetry} />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-6 min-h-0 overflow-hidden">
        {/* ===== LEFT COLUMN (Desktop) ===== */}
        <div
          className={`md:col-span-3 flex flex-col gap-4 md:gap-6 ${
            activeTab === "energy_env" || activeTab === "status"
              ? "flex-1"
              : "hidden md:flex"
          }`}
        >
          {/* Energy Card */}
          <div
            className={`${
              activeTab === "energy_env" ? "flex-1 block" : "hidden md:block"
            }`}
          >
            <CarStatus />
          </div>

          {/* System Health */}
          <div
            className={`${
              activeTab === "status"
                ? "flex-1 block"
                : "hidden md:flex md:flex-1 md:flex-col"
            }`}
          >
            <SystemHealth />
          </div>
        </div>

        {/* ===== CENTER COLUMN (Digital Twin) ===== */}
        <div
          className={`md:col-span-6 relative bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden md:block flex-1 ${
            activeTab === "vehicle" ? "flex flex-col" : "hidden md:block"
          }`}
        >
          <DigitalTwin />
        </div>

        {/* ===== RIGHT COLUMN (Desktop) ===== */}
        <div
          className={`md:col-span-3 flex flex-col ${
            activeTab === "location"
              ? "gap-0 md:gap-4 flex-1"
              : "gap-4 hidden md:flex"
          }`}
        >
          {/* Environment - Desktop Only */}
          <div className="hidden md:block">
            <EnvironmentCard />
          </div>

          {/* Location/Map */}
          <div
            className={`${
              activeTab === "location"
                ? "flex-1 block"
                : "hidden md:flex md:flex-1 md:flex-col"
            }`}
          >
            <MapCard />
          </div>
        </div>
      </main>

      {/* ===== QUICK ACTIONS ROW (Desktop Only) ===== */}
      <div className="hidden md:grid md:grid-cols-3 gap-4 mt-2">
        {/* Charging Stations Quick Card */}
        <button
          onClick={() => handleOpenFeature("charging")}
          className="group bg-white rounded-2xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-900">Charging Stations</p>
              <p className="text-xs text-gray-500">Find nearby stations</p>
            </div>
          </div>
        </button>

        {/* Charging History Quick Card */}
        <button
          onClick={() => handleOpenFeature("history")}
          className="group bg-white rounded-2xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-900">Charging History</p>
              <p className="text-xs text-gray-500">View past sessions</p>
            </div>
          </div>
        </button>

        {/* Vehicle Services Quick Card */}
        <button
          onClick={() => handleOpenFeature("services")}
          className="group bg-white rounded-2xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-900">Services</p>
              <p className="text-xs text-gray-500">Battery, Maintenance</p>
            </div>
          </div>
        </button>
      </div>

      {/* Mobile Navigation */}
      <MobileNavV2
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onScan={handleOpenTelemetry}
        onOpenFeature={handleOpenFeature}
      />

      {/* Telemetry Drawer */}
      <TelemetryDrawer
        isOpen={isTelemetryDrawerOpen}
        onClose={() => setIsTelemetryDrawerOpen(false)}
      />

      {/* Feature Full-Screen Views */}
      {FeatureComponent && (
        <FeatureComponent
          isFullScreen={true}
          onClose={handleCloseFeature}
        />
      )}
    </div>
  );
}
