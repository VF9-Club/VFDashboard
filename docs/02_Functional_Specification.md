# VinFast Dashboard - Functional Specification
**Version:** 1.1  
**Status:** UPDATED  
**Date:** Jan 2026

---

## 1. UI/UX Design Overview

### 1.1 Design Philosophy: "Clean Card-Based"
The design adopts a **Neumorphism / Soft UI** aesthetic with a modular "Bento Grid" layout. It emphasizes clarity, organization, and a premium feel appropriate for high-tech EV monitoring.

**Reference Visual Style**:
*(Refer to `assets/dashboard_preview.png` for visual style orientation)*

### 1.2 Core Layout Structure
*   **Theme**: Light/Clean (Soft shadows, Rounded Corners 24px).
*   **Grid System**: 3-Column Layout on Desktop, Vertical Stack on Mobile.
    *   **Left Column**: Energy & System Health.
    *   **Center Column**: Digital Twin (Visualizer).
    *   **Right Column**: Environment Controls & Location Map.
*   **Information Portals**: Replacing generic controls with detailed, read-only status cards.

---

## 2. Functional Modules & Requirements

### Module A: Header & User Context
**Goal**: Identify the User, Vehicle, and Context.
*   **FR-A-01**: Display "VinFast [Vehicle Name]" and User Avatar.
*   **FR-A-02**: Display User Role/Type (e.g., "Primary Owner").
*   **FR-A-03**: Display current local Weather (Icon + Temp) and "Last Updated" timestamp.
*   **FR-A-04 (Updates)**: "Refresh" button to trigger immediate telemetry poll.

### Module B: Central Car Status (The "Digital Twin")
**Visual**: Top-down view or Isometric view of the specific vehicle model.
*   **FR-B-01**: Show custom vehicle nickname or Model Name.
*   **FR-B-02 (Tires)**: Display 4 callout cards for Tire Pressure (Bar/PSI) and Temperature (C).
*   **FR-B-03 (Doors)**: Visual warning indicators if Doors, Trunk, or Hood are open.
*   **FR-B-04 (Odometer)**: Display current total distance (km).
*   **FR-B-05 (Warranty)**: Display Warranty Expiration Date and Mileage Limit.
*   **FR-B-06 (Gear)**: Visual Gear Selector (P, R, N, D, S) indicating current position.
*   **FR-B-07 (Multi-Vehicle)**: Left/Right arrows and pagination dots to switch between vehicles if multiple are linked to the account.

### Module C: Energy & Charging
**Goal**: Detailed Battery Management.
*   **FR-C-01**: **Circular Progress Chart** showing High Voltage Battery %.
*   **FR-C-02**: Display Estimated Range (Description: `364 km`).
*   **FR-C-03 (Charging)**: 
    *   Status: "Charging" vs "Unplugged".
    *   Target SOC: Limit set by user.
    *   Time Left: Remaining time to target.
*   **FR-C-04**: Display 12V Battery Health Status (%).
*   **FR-C-05**: Display Battery SOH (State of Health) %.
*   **FR-C-06**: Display Battery Metadata (Serial Number, Manufacture Date).

### Module D: Environment & Location
**Goal**: Cabin Comfort and Tracking.
*   **FR-D-01 (Weather)**: List Outside and Inside Temperatures.
*   **FR-D-02 (Climate)**: Display Fan Speed status.
*   **FR-D-03 (Modes)**: Status indicators for **Pet Mode** and **Camp Mode**.
*   **FR-D-04 (Location)**: Live Google Maps embed showing current vehicle position (Latitude/Longitude) with custom marker.
*   **FR-D-05**: Display Reverse-Geocoded Address (City, Country).

### Module E: System Health Portal
**Goal**: Detailed Technical Monitoring.
*   **FR-E-01**: Status List for key subsystems:
    *   **Tires**: "All OK" vs "Low Pressure".
    *   **Doors**: "All Closed" vs "Driver Open".
    *   **Safety**: "System Normal" vs "Thermal Warning".
    *   **Service**: "No Alerts" vs "Service Due".
*   **FR-E-02**: Firmware Version display.
*   **FR-E-03**: T-Box Version display.

### Module F: Multi-Vehicle Management
**Goal**: Seamless switching for users with fleets or multiple cars.
*   **FR-F-01**: Store list of all linked vehicles on initial load.
*   **FR-F-02**: Cache telemetry data per VIN to allow instant switching without re-fetching.
*   **FR-F-03**: Update Header and Digital Twin assets (Image, Name) dynamically when vehicle changes.

---

## 3. User Interactions & Micro-animations
*   **Interaction-01 (Alerts)**: Cards with Warnings (e.g., Low Tire Pressure, Open Door) must highlight Red/Orange.
*   **Interaction-02 (Hover Effects)**: Cards should "lift" slightly and glow when hovered.
*   **Interaction-03 (Vehicle Switch)**: Smooth transition of vehicle image and data when using arrows/dots.
*   **Interaction-04 (Loading States)**: Use **Skeleton Screens** with a shimmering wave effect during initial data fetch.
*   **Interaction-05 (Read-Only)**: The dashboard is ensuring a Read-Only experience for safety.

---

## 4. Technical Integration

### 4.1 API Mapping (BFF)
*   **Login**: `POST /api/login` (Auth0 integration).
*   **Get Vehicles**: `GET /api/vehicles` (Returns list of vehicles).
*   **Get Telemetry**: `GET /api/telemetry/{vin}` (Polled every hour or on demand).
*   **Get User**: `GET /api/user` (Profile info).

### 4.2 State Management
*   **Store**: `nanostores` (vehicleStore).
*   **Caching**: `vehicleCache` map stores state for every VIN fetched to avoid redundant network calls.
