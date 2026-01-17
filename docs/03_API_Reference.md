# VinFast Dashboard - API Reference
**Version:** 1.1  
**Status:** VALIDATED  
**Date:** Jan 2026

---

## 1. Overview
This document details the VinFast Connected Car API interactions via the **BFF (Backend-for-Frontend)** layer. The Node.js/Fastify backend acts as a proxy, handling authentication, caching, and data enhancement.

### Regional Configuration
| Region | API Base URL | Auth0 Domain | Client ID |
| :--- | :--- | :--- | :--- |
| **Vietnam (VN)** | `https://mobile.connected-car.vinfast.vn` | `vin3s.au.auth0.com` | `jE5xt50qC7oIh1f32qMzA6hGznIU5mgH` |
| **United States** | `https://mobile.connected-car.vinfastauto.us` | `vinfast-us-prod.us.auth0.com` | `xhGY7XKDFSk1Q22rxidvwujfz0EPAbUP` |
| **Europe (EU)** | `https://mobile.connected-car.vinfastauto.eu` | `vinfast-eu-prod.eu.auth0.com` | `dxxtNkkhsPWW78x6s1BWQlmuCfLQrkze` |

---

## 2. Authentication Flow
The API uses Auth0 standards. The BFF handles the `POST /api/login` request, exchanges credentials for tokens, and sets secure HTTP-Only cookies (`access_token`, `refresh_token`, `vin`, `user_id`).

### Key Endpoints
*   **Login**: `POST /api/login`
*   **Logout**: `POST /api/logout` (Clears cookies)

---

## 3. Core API Endpoints (BFF)

### 3.1 Get Vehicles
**Endpoint**: `/api/vehicles` (GET)
*   **Purpose**: Retrieve list of all vehicles linked to the user's account.
*   **Response**: JSON Array containing:
    *   `vinCode`: Vehicle Identification Number (ID).
    *   `marketingName`: e.g., "VF9 Plus".
    *   `vehicleImage`: URL to vehicle asset.
    *   `exteriorColor`: e.g., "Deep Ocean".
    *   `warrantyExpirationDate`, `warrantyMileage`.
*   **Optimization**: This is fetched once on app load and stored in `vehicleStore`.

### 3.2 Get User Profile
**Endpoint**: `/api/user` (GET)
*   **Purpose**: Retrieve User Name, Avatar, and Role.
*   **Response**: JSON object with `name`, `sub`, `picture`.

### 3.3 Get Telemetry (Deep Scan)
**Endpoint**: `/api/telemetry/{vin}` (GET)
*   **Query Params**: `?deep_scan=true` (forces fresh fetch from car).
*   **Purpose**: Retrieve real-time status.
*   **Enhancements**: The BFF automatically:
    *   Fetches **Weather** (Open-Meteo) based on vehicle coordinates.
    *   Fetches **Address** (Nominatim Reverse Geocoding) based on coordinates.
    *   Maps raw obscure resource IDs to friendly keys (e.g., `VEHICLE_STATUS_HV_BATTERY_SOC` -> `battery_level`).
*   **Response**: A flattened JSON object ready for UI consumption.

---

## 4. Control Limitations
> **IMPORTANT**: Remote Control Commands (Lock/Unlock, Climate Start) are **Read-Only**.

The dashboard can **display** lock status (`is_locked`) and climate status (`fan_speed`, `inside_temp`), but it cannot **change** them. Command signing requires a private key stored in the mobile app's keystore, which is not accessible to this web dashboard.
