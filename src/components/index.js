/**
 * VFDashboard Components Index
 * Export all components for easy importing
 */

// Core Dashboard
export { default as DashboardApp } from "./DashboardApp";
export { default as DashboardAppV2 } from "./DashboardAppV2";
export { default as DashboardController } from "./DashboardController";

// Authentication
export { default as AuthGate } from "./AuthGate";
export { default as Login } from "./Login";

// Vehicle Display
export { default as VehicleHeader } from "./VehicleHeader";
export { default as DigitalTwin } from "./DigitalTwin";
export { default as CarStatus } from "./CarStatus";
export { default as SystemHealth } from "./SystemHealth";
export { EnvironmentCard, MapCard } from "./ControlGrid";

// Navigation
export { default as MobileNav } from "./MobileNav";
export { default as MobileNavV2 } from "./MobileNavV2";

// Drawers & Modals
export { default as TelemetryDrawer } from "./TelemetryDrawer";
export { default as AboutModal } from "./AboutModal";

// NEW: Charging Features
export { default as ChargingMap, ChargingMapCompact } from "./charging/ChargingMap";
export { default as ChargingHistory, ChargingHistoryCompact } from "./charging/ChargingHistory";

// NEW: Vehicle Info (Battery Leasing, Maintenance, Alerts)
export { default as VehicleInfo, VehicleInfoCompact } from "./vehicle/VehicleInfo";

// NEW: Tools
export { default as RangeCalculator } from "./tools/RangeCalculator";

// NEW: UI Components
export { default as StatCard, StatCardRow, StatCardMini } from "./ui/StatCard";
export { default as BottomSheet, BottomSheetTrigger } from "./ui/BottomSheet";
