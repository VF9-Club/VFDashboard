# Frontend State Management

## Overview
The frontend uses **Nano Stores** (`nanostores`) for lightweight, framework-agnostic state management. The central store is `vehicleStore`, which holds the "Digital Twin" state of the active vehicle, as well as the cache for all user vehicles.

## 1. Store Structure (`vehicleStore.ts`)
Location: `src/stores/vehicleStore.ts`

The `vehicleStore` is a mapped store containing:

### 1.1 Multi-Vehicle Context
*   `vehicles`: Array of all vehicle objects returned by the API (contains static info like `marketingName`, `vinCode`, `vehicleImage`).
*   `vehicleCache`: A Record (Map) where key=`vin` and value=`Partial<VehicleState>`. This caches the telemetry data for every vehicle the user has viewed, allowing instant switching.

### 1.2 Active Vehicle State (The "Digital Twin")
These fields represent the **currently selected** vehicle:
*   `vin`: Active VIN (Primary Key).
*   `marketingName`, `model`: Static vehicle attributes.
*   `battery_level`: HV Battery % (via `VEHICLE_STATUS_HV_BATTERY_SOC`).
*   `range`: Remaining kilometers.
*   `charging_status`: Charging boolean/enum.
*   `odometer`: Total distance driven.

### 1.3 Location & Environment
*   `latitude`, `longitude`: Current GPS position.
*   `location_address`: Reverse-geocoded address (added by Backend).
*   `outside_temp`: From Telemetry or Open-Meteo.
*   `inside_temp`: Cabin temperature.
*   `weather_code`: Weather condition code (for UI icons).
*   `pet_mode`, `camp_mode`: Boolean status for special modes.

### 1.4 Detailed Component Status
*   `tire_pressure_*`: Tire pressures (Bar/PSI).
*   `door_*`: Door open/closed boolean.
*   `trunk_status`, `hood_status`: Access point status.
*   `gear_position`: Current gear (P, R, N, D, S).
*   `warrantyExpirationDate`: Date string.

### 1.5 System Information
*   `firmware_version`: FOTA version.
*   `tbox_version`: Telematics box version.
*   `bms_version`, `mhu_version`: ECU Versions.
*   `service_alert`: Service due indicator.

## 2. State Flow

### 2.1 Initialization
1.  `DashboardController.jsx` mounts and calls `fetchVehicles()`.
2.  `fetchVehicles()` hits `/api/vehicles`, retrieves the list, and populates `vehicles` array in the store.
3.  It automatically calls `switchVehicle()` for the first VIN in the list.

### 2.2 Vehicle Switching (`switchVehicle(vin)`)
1.  User clicks arrow/dot in `DigitalTwin` component.
2.  `switchVehicle` looks up static info from `vehicles` array.
3.  It retrieves any existing telemetry from `vehicleCache[vin]`.
4.  It **merges** Static + Cached Telemetry -> `vehicleStore` (Active State).
5.  It triggers an immediate `fetchTelemetry(vin)` to get fresh data.

### 2.3 Telemetry Polling
1.  `fetchTelemetry(vin)` hits `/api/telemetry/{vin}` (BFF).
2.  The BFF retrieves data from VinFast + External Services (Weather/Geo).
3.  `updateVehicleData(data)` is called.
4.  **Crucially**, `updateVehicleData` updates **BOTH** the `vehicleCache[vin]` AND (if the VIN matches active) the `vehicleStore`.
5.  **Reactivity**: UI components re-render automatically.

## 3. Auth Store
Managed internally or via simple atoms/cookies (handled by `DashboardController` redirect logic on 401).

## 4. Best Practices
*   **Direct Access**: Use `vehicleStore.get()` for reading state inside functions (like `switchVehicle`).
*   **Reactive Access**: Use `useStore(vehicleStore)` in React components (`DigitalTwin`, `CarStatus`, etc.).
*   **Updates**: Always use `updateVehicleData()` helper to ensure cache consistency.
