# VinFast Connected Car API - Complete Documentation

**Version:** 1.0
**Date:** January 25, 2026
**Status:** COMPREHENSIVE
**Source:** Reverse Engineering + Source Code Analysis

---

## Mục Lục

1. [Tổng Quan](#1-tổng-quan)
2. [Authentication](#2-authentication)
3. [API Endpoints Đã Xác Nhận](#3-api-endpoints-đã-xác-nhận)
4. [API Endpoints Chưa Implement](#4-api-endpoints-chưa-implement)
5. [Telemetry Resources](#5-telemetry-resources)
6. [X-HASH Authentication](#6-x-hash-authentication)
7. [Region Configuration](#7-region-configuration)

---

## 1. Tổng Quan

### 1.1 Base URLs theo Region

| Region  | API Base URL                                  | Auth0 Domain                   |
| ------- | --------------------------------------------- | ------------------------------ |
| Vietnam | `https://mobile.connected-car.vinfast.vn`     | `vin3s.au.auth0.com`           |
| USA     | `https://mobile.connected-car.vinfastauto.us` | `vinfast-us-prod.us.auth0.com` |
| Europe  | `https://mobile.connected-car.vinfastauto.eu` | `vinfast-eu-prod.eu.auth0.com` |

### 1.2 Required Headers

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {access_token}
X-HASH: {generated_hmac}
X-TIMESTAMP: {unix_timestamp_ms}
X-VIN-CODE: {vehicle_vin}
x-service-name: CAPP
x-app-version: 1.10.3
x-device-platform: VFDashBoard
x-device-family: Community
x-device-locale: en-US
x-timezone: Asia/Ho_Chi_Minh
```

---

## 2. Authentication

### 2.1 Login (Password Grant)

```http
POST https://{auth0_domain}/oauth/token
Content-Type: application/json
```

**Request:**

```json
{
  "client_id": "{region_client_id}",
  "grant_type": "password",
  "username": "{email}",
  "password": "{password}",
  "scope": "openid profile email offline_access",
  "audience": "{api_base_url}"
}
```

**Response:**

```json
{
  "access_token": "eyJhbG...",
  "refresh_token": "v1.M...",
  "id_token": "eyJhbG...",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

**Auth0 Client IDs:**
| Region | Client ID |
| ------- | ---------------------------------- |
| Vietnam | `jE5xt50qC7oIh1f32qMzA6hGznIU5mgH` |
| USA | `xhGY7XKDFSk1Q22rxidvwujfz0EPAbUP` |
| Europe | `dxxtNkkhsPWW78x6s1BWQlmuCfLQrkze` |

### 2.2 Token Refresh

```http
POST https://{auth0_domain}/oauth/token
```

**Request:**

```json
{
  "client_id": "{region_client_id}",
  "grant_type": "refresh_token",
  "refresh_token": "{refresh_token}"
}
```

### 2.3 User Profile

```http
GET https://{auth0_domain}/userinfo
Authorization: Bearer {access_token}
```

---

## 3. API Endpoints Đã Xác Nhận

### 3.1 User & Vehicle Management

#### GET User Vehicles

```http
GET /ccarusermgnt/api/v1/user-vehicle
```

**Response:**

```json
{
  "code": 200,
  "data": [
    {
      "vinCode": "RLLVXXXXXXXXXXXXX71",
      "vinNumber": "RLLVXXXXXXXXXXXXX71",
      "vehicleName": "VF 9",
      "modelCode": "VF9",
      "modelYear": "2024",
      "exteriorColor": "Neptune Blue",
      "interiorColor": "Black",
      "batteryCapacity": 123.0,
      "ownershipType": "OWNER",
      "subscriptionStatus": "ACTIVE",
      "userId": "auth0|xxx"
    }
  ]
}
```

**Status:** ✅ Implemented

---

#### GET Vehicle Alias Mapping

```http
GET /modelmgmt/api/v2/vehicle-model/mobile-app/vehicle/get-alias?version=1.0
```

**Response:**

```json
{
  "code": 200,
  "data": {
    "resources": [
      {
        "alias": "VEHICLE_STATUS_HV_BATTERY_SOC",
        "objectId": "34183",
        "instanceId": "1",
        "resourceId": "9"
      }
    ]
  }
}
```

**Status:** ✅ Implemented

---

### 3.2 Telemetry

#### POST Telemetry Ping (Primary)

```http
POST /ccaraccessmgmt/api/v1/telemetry/app/ping
```

**Request:**

```json
[
  { "objectId": "34183", "instanceId": "1", "resourceId": "9" },
  { "objectId": "34183", "instanceId": "1", "resourceId": "11" },
  { "objectId": "6", "instanceId": "1", "resourceId": "0" }
]
```

**Response:**

```json
{
  "code": 200,
  "data": [
    {
      "deviceKey": "34183_00001_00009",
      "value": "85",
      "timestamp": 1769029742000
    }
  ]
}
```

**Status:** ✅ Implemented

---

#### POST Telemetry List Resource

```http
POST /ccaraccessmgmt/api/v1/telemetry/list_resource
```

**Request:**

```json
[
  { "resourceId": "10", "instanceId": "1", "objectId": "34180" },
  { "resourceId": "7", "instanceId": "1", "objectId": "34181" }
]
```

**Response:** Same format as `app/ping`

**Status:** ✅ Documented (Alternative endpoint)

---

### 3.3 Vehicle Wake Up

#### POST Vehicle Ping

```http
POST /api/v3.2/connected_car/app/ping
```

**Response:**

```json
{
  "code": 200,
  "data": {
    "status": "ONLINE",
    "lastSeen": 1769029742000
  }
}
```

**Purpose:** Wake up vehicle from sleep mode

**Status:** ⚠️ Documented, not implemented in dashboard

---

### 3.4 Charging

#### POST Search Charging Stations

```http
POST /ccarcharging/api/v1/stations/search?page=0&size=20
```

**Request:**

```json
{
  "latitude": 21.209747,
  "longitude": 105.793358,
  "excludeFavorite": false
}
```

**Response:**

```json
{
  "code": 200,
  "data": {
    "content": [
      {
        "stationId": "VN-HN-001",
        "stationName": "VinFast Mỹ Đình",
        "address": "...",
        "latitude": 21.028511,
        "longitude": 105.780833,
        "totalConnectors": 8,
        "availableConnectors": 5,
        "connectorTypes": ["CCS2", "CHAdeMO"],
        "maxPower": 150,
        "distance": 2.5
      }
    ],
    "totalElements": 45,
    "totalPages": 3
  }
}
```

**Status:** ⚠️ Documented, not implemented in dashboard

---

#### GET Charging Sessions History

```http
GET /ccarcharging/api/v1/sessions?page=0&size=20
```

**Response:**

```json
{
  "code": 200,
  "data": {
    "content": [
      {
        "sessionId": "sess-001",
        "stationName": "VinFast Mỹ Đình",
        "startTime": 1769000000000,
        "endTime": 1769003600000,
        "startSoc": 20,
        "endSoc": 80,
        "energyCharged": 65.5,
        "cost": 150000,
        "currency": "VND"
      }
    ]
  }
}
```

**Status:** ⚠️ Documented, not implemented in dashboard

---

### 3.5 Remote Commands

#### POST Execute Command

```http
POST /ccaraccessmgmt/api/v1/command/execute
```

**Request:**

```json
{
  "commandType": "LOCK",
  "parameters": {}
}
```

**Available Commands:**
| Command | Description |
| ------------- | -------------------------- |
| `LOCK` | Lock all doors |
| `UNLOCK` | Unlock all doors |
| `CLIMATE_ON` | Turn on AC |
| `CLIMATE_OFF` | Turn off AC |
| `HORN` | Honk horn |
| `FLASH` | Flash lights |
| `TRUNK_OPEN` | Open trunk |

**Response:**

```json
{
  "code": 200,
  "data": {
    "commandId": "cmd-12345",
    "status": "PENDING"
  }
}
```

**Note:** ⚠️ Requires PKI signing (not available in web dashboard)

**Status:** ❌ Read-Only (Dashboard cannot execute)

---

### 3.6 Trip History

#### GET Trip History

```http
GET /ccarusermgnt/api/v1/trip-history?from=2026-01-01&to=2026-01-24
```

**Response:**

```json
{
  "code": 200,
  "data": [
    {
      "tripId": "trip-001",
      "startTime": 1769000000000,
      "endTime": 1769003600000,
      "startLocation": { "lat": 21.0, "lng": 105.8 },
      "endLocation": { "lat": 21.1, "lng": 105.9 },
      "distance": 15.5,
      "duration": 3600,
      "energyConsumed": 3.2,
      "avgSpeed": 45
    }
  ]
}
```

**Status:** ⚠️ Documented, not implemented in dashboard

---

## 4. API Endpoints Chưa Implement

### 4.1 Notifications

```http
GET /ccarusermgnt/api/v1/notifications
GET /ccarusermgnt/api/v1/notifications?page=0&size=20
```

**Expected Response:**

```json
{
  "code": 200,
  "data": {
    "content": [
      {
        "notificationId": "notif-001",
        "type": "CHARGING_COMPLETE",
        "title": "Charging Complete",
        "message": "Your vehicle is fully charged",
        "timestamp": 1769000000000,
        "read": false
      }
    ]
  }
}
```

**Status:** 🔍 Needs verification

---

### 4.2 Service History

```http
GET /ccarusermgnt/api/v1/service-history
GET /ccarusermgnt/api/v1/service-appointments
```

**Expected Response:**

```json
{
  "code": 200,
  "data": [
    {
      "appointmentId": "apt-001",
      "serviceCenter": "VinFast Service Hanoi",
      "date": "2026-01-15",
      "status": "COMPLETED",
      "services": ["Oil Change", "Tire Rotation"]
    }
  ]
}
```

**Status:** 🔍 Needs verification

---

### 4.3 Software/OTA Updates

```http
GET /ccarusermgnt/api/v1/software-version
GET /ccarusermgnt/api/v1/ota-updates
```

**Status:** 🔍 Needs verification

---

### 4.4 Energy Statistics

```http
GET /ccarusermgnt/api/v1/energy-stats
GET /ccarusermgnt/api/v1/energy-stats?period=monthly
```

**Expected Response:**

```json
{
  "code": 200,
  "data": {
    "period": "2026-01",
    "totalDistance": 1500.5,
    "totalEnergy": 250.3,
    "avgConsumption": 16.7,
    "chargingSessions": 15
  }
}
```

**Status:** 🔍 Needs verification

---

### 4.5 Geofence Management

```http
GET /ccarusermgnt/api/v1/geofence
POST /ccarusermgnt/api/v1/geofence
DELETE /ccarusermgnt/api/v1/geofence/{id}
```

**Request (POST):**

```json
{
  "name": "Home",
  "latitude": 21.0,
  "longitude": 105.8,
  "radius": 500,
  "notifications": {
    "onEnter": true,
    "onExit": true
  }
}
```

**Status:** 🔍 Needs verification

---

### 4.6 Favorites (Charging Stations)

```http
GET /ccarcharging/api/v1/favorites
POST /ccarcharging/api/v1/favorites
DELETE /ccarcharging/api/v1/favorites/{stationId}
```

**Status:** 🔍 Needs verification

---

### 4.7 Scheduled Charging

```http
GET /ccarcharging/api/v1/schedule
POST /ccarcharging/api/v1/schedule
```

**Request (POST):**

```json
{
  "enabled": true,
  "startTime": "22:00",
  "endTime": "06:00",
  "targetSoc": 80,
  "daysOfWeek": ["MON", "TUE", "WED", "THU", "FRI"]
}
```

**Status:** 🔍 Needs verification

---

## 5. Telemetry Resources

### 5.1 Battery & Charging

| Alias                                         | Object | Inst | Rsrc | Description              | Unit |
| --------------------------------------------- | ------ | ---- | ---- | ------------------------ | ---- |
| `VEHICLE_STATUS_HV_BATTERY_SOC`               | 34183  | 1    | 9    | HV Battery %             | %    |
| `VEHICLE_STATUS_REMAINING_DISTANCE`           | 34183  | 1    | 11   | Estimated Range          | km   |
| `BMS_STATUS_STATE_OF_HEALTH`                  | 34220  | 1    | 1    | Battery SOH              | %    |
| `CHARGING_STATUS_CHARGING_STATUS`             | 34193  | 1    | 1    | Charging Status          | enum |
| `CHARGING_STATUS_CHARGING_REMAINING_TIME`     | 34193  | 1    | 7    | Time to Full             | mins |
| `CHARGE_CONTROL_CURRENT_TARGET_SOC`           | 34193  | 1    | 19   | Target SOC               | %    |
| `VEHICLE_STATUS_LV_BATTERY_SOC`               | 34183  | 1    | 5    | 12V Battery %            | %    |
| `BMS_STATUS_BATTERY_SERIAL_NUMBER`            | 34220  | 1    | 111  | Battery Serial           | str  |
| `BMS_STATUS_BATTERY_DECODED_MANUFACTURE_DATE` | 34220  | 1    | 112  | Battery Manufacture Date | str  |
| `BMS_STATUS_THERMAL_RUNAWAY_WARNING`          | 34220  | 1    | 50   | Thermal Warning          | bool |

### 5.2 Vehicle Status

| Alias                                | Object | Inst | Rsrc | Description   | Unit |
| ------------------------------------ | ------ | ---- | ---- | ------------- | ---- |
| `VEHICLE_STATUS_ODOMETER`            | 34183  | 1    | 3    | Odometer      | km   |
| `VEHICLE_STATUS_GEAR_POSITION`       | 34183  | 1    | 1    | Gear Position | enum |
| `VEHICLE_STATUS_VEHICLE_SPEED`       | 34183  | 1    | 2    | Speed         | km/h |
| `VEHICLE_STATUS_IGNITION_STATUS`     | 34183  | 1    | 10   | Ignition      | bool |
| `VEHICLE_STATUS_HANDBRAKE_STATUS`    | 34183  | 1    | 29   | Handbrake     | bool |
| `VEHICLE_STATUS_CENTRAL_LOCK_STATUS` | 34183  | 1    | 14   | Central Lock  | bool |
| `VEHICLE_STATUS_VEHICLE_DRVICE_MODE` | 34183  | 1    | 32   | Drive Mode    | enum |
| `VEHICLE_STATUS_BRAKE_REGEN_MODE`    | 34183  | 1    | 41   | Regen Mode    | enum |

### 5.3 Tires (TPMS)

| Alias                                         | Object | Inst | Rsrc | Description    | Unit |
| --------------------------------------------- | ------ | ---- | ---- | -------------- | ---- |
| `VEHICLE_STATUS_FRONT_LEFT_TIRE_PRESSURE`     | 34183  | 1    | 16   | FL Pressure    | bar  |
| `VEHICLE_STATUS_FRONT_RIGHT_TIRE_PRESSURE`    | 34183  | 1    | 17   | FR Pressure    | bar  |
| `VEHICLE_STATUS_REAR_LEFT_TIRE_PRESSURE`      | 34183  | 1    | 18   | RL Pressure    | bar  |
| `VEHICLE_STATUS_REAR_RIGHT_TIRE_PRESSURE`     | 34183  | 1    | 19   | RR Pressure    | bar  |
| `VEHICLE_STATUS_FRONT_LEFT_TIRE_TEMPERATURE`  | 34183  | 1    | 20   | FL Temperature | °C   |
| `VEHICLE_STATUS_FRONT_RIGHT_TIRE_TEMPERATURE` | 34183  | 1    | 21   | FR Temperature | °C   |
| `VEHICLE_STATUS_REAR_LEFT_TIRE_TEMPERATURE`   | 34183  | 1    | 22   | RL Temperature | °C   |
| `VEHICLE_STATUS_REAR_RIGHT_TIRE_TEMPERATURE`  | 34183  | 1    | 23   | RR Temperature | °C   |

### 5.4 Location

| Alias                     | Object | Inst | Rsrc | Description | Unit    |
| ------------------------- | ------ | ---- | ---- | ----------- | ------- |
| `LOCATION_LATITUDE`       | 6      | 1    | 0    | Latitude    | degrees |
| `LOCATION_LONGITUDE`      | 6      | 1    | 1    | Longitude   | degrees |
| `LOCATION_ALTITUDE`       | 6      | 1    | 2    | Altitude    | meters  |
| `LOCATION_VELOCITY`       | 6      | 1    | 4    | Velocity    | km/h    |
| `LOCATION_BEARING_DEGREE` | 6      | 1    | 11   | Heading     | degrees |
| `LOCATION_GNSS_STATUS`    | 6      | 1    | 10   | GPS Status  | enum    |

### 5.5 Doors & Security

| Alias                               | Object | Inst | Rsrc | Description | Value               |
| ----------------------------------- | ------ | ---- | ---- | ----------- | ------------------- |
| `DOOR_AJAR_FRONT_LEFT_DOOR_STATUS`  | 10351  | 2    | 50   | Front Left  | 0=Closed 1=Open     |
| `DOOR_AJAR_FRONT_RIGHT_DOOR_STATUS` | 10351  | 1    | 50   | Front Right | 0=Closed 1=Open     |
| `DOOR_AJAR_REAR_LEFT_DOOR_STATUS`   | 10351  | 4    | 50   | Rear Left   | 0=Closed 1=Open     |
| `DOOR_AJAR_REAR_RIGHT_DOOR_STATUS`  | 10351  | 3    | 50   | Rear Right  | 0=Closed 1=Open     |
| `DOOR_BONNET_DOOR_STATUS`           | 10351  | 5    | 50   | Hood        | 0=Closed 1=Open     |
| `DOOR_TRUNK_DOOR_STATUS`            | 10351  | 6    | 50   | Trunk       | 0=Closed 1=Open     |
| `REMOTE_CONTROL_DOOR_STATUS`        | 34213  | 1    | 3    | Lock Status | 0=Unlocked 1=Locked |

### 5.6 Climate

| Alias                                       | Object | Inst | Rsrc | Description      | Unit |
| ------------------------------------------- | ------ | ---- | ---- | ---------------- | ---- |
| `VEHICLE_STATUS_AMBIENT_TEMPERATURE`        | 34183  | 1    | 7    | Outside Temp     | °C   |
| `VEHICLE_STATUS_INTERIOR_TEMPERATURE`       | 34183  | 1    | 15   | Inside Temp      | °C   |
| `CLIMATE_INFORMATION_DRIVER_TEMPERATURE`    | 34184  | 1    | 6    | Driver Target    | °C   |
| `CLIMATE_INFORMATION_PASSENGER_TEMPERATURE` | 34184  | 1    | 7    | Passenger Target | °C   |
| `CLIMATE_INFORMATION_DRIVER_AIR_BLOW_LEVEL` | 34184  | 1    | 25   | Fan Speed        | 0-7  |
| `CLIMATE_INFORMATION_STATUS`                | 34184  | 1    | 4    | AC Status        | bool |
| `CLIMATE_INFORMATION_FRONT_DEFROST`         | 34184  | 1    | 9    | Defrost Status   | bool |

### 5.7 Special Modes

| Alias                       | Object | Inst | Rsrc | Description |
| --------------------------- | ------ | ---- | ---- | ----------- |
| `PET_MODE_CONTROL_STATUS`   | 34207  | 1    | 1    | Pet Mode    |
| `CAMP_MODE_CONTROL_STATUS`  | 34206  | 1    | 1    | Camp Mode   |
| `VALET_MODE_CONTROL_STATUS` | 34205  | 1    | 1    | Valet Mode  |

### 5.8 Lights

| Alias                                      | Object | Inst | Rsrc | Description      |
| ------------------------------------------ | ------ | ---- | ---- | ---------------- |
| `LIGHT_FRONT_FOG_LAMP_LIGHT_STATUS`        | 10350  | 1    | 2    | Front Fog Lights |
| `LIGHT_LOW_BEAM_LIGHT_LIGHT_STATUS`        | 10350  | 4    | 2    | Low Beam         |
| `LIGHT_HIGH_BEAM_LIGHT_LIGHT_STATUS`       | 10350  | 7    | 2    | High Beam        |
| `LIGHT_TURNS_INDICATOR_LIGHT_LIGHT_STATUS` | 10350  | 6    | 2    | Turn Signals     |
| `LIGHT_INTERIOR_LIGHT_LIGHT_STATUS`        | 10350  | 3    | 2    | Interior Lights  |
| `LIGHT_DAY_RUNNING_LIGHT_LIGHT_STATUS`     | 10350  | 10   | 2    | DRL              |

### 5.9 Crash Detection

| Alias                                   | Object | Inst | Rsrc | Description      |
| --------------------------------------- | ------ | ---- | ---- | ---------------- |
| `VEHICLE_CRASH_STATUS_FRONT_CRASH`      | 34185  | 1    | 4    | Front Crash      |
| `VEHICLE_CRASH_STATUS_REAR_CRASH`       | 34185  | 1    | 2    | Rear Crash       |
| `VEHICLE_CRASH_STATUS_SIDE_LEFT_CRASH`  | 34185  | 1    | 1    | Left Side Crash  |
| `VEHICLE_CRASH_STATUS_SIDE_RIGHT_CRASH` | 34185  | 1    | 3    | Right Side Crash |
| `VEHICLE_CRASH_STATUS_ROLL_OVER_CRASH`  | 34185  | 1    | 5    | Rollover         |
| `VEHICLE_CRASH_STATUS_AIRBAG_DEPLOYED`  | 34185  | 1    | 7    | Airbag Deployed  |
| `VEHICLE_CRASH_STATUS_E_CALL_ACTIVATED` | 34185  | 1    | 8    | E-Call Activated |

### 5.10 Seat Controls

| Alias                                             | Object | Inst | Rsrc | Description         |
| ------------------------------------------------- | ------ | ---- | ---- | ------------------- |
| `CLIMATE_INFORMATION_FRONT_LEFT_SEAT_HEATING`     | 34184  | 1    | 28   | Driver Seat Heat    |
| `CLIMATE_INFORMATION_FRONT_RIGHT_SEAT_HEATING`    | 34184  | 1    | 29   | Passenger Seat Heat |
| `CLIMATE_INFORMATION_FRONT_LEFT_SEAT_VENTILATION` | 34184  | 1    | 30   | Driver Seat Vent    |
| `CLIMATE_INFORMATION_FRONT_LEFT_SEAT_COOLING`     | 34184  | 1    | 37   | Driver Seat Cool    |
| `CLIMATE_INFORMATION_REAR_LEFT_SEAT_HEATING`      | 34184  | 1    | 33   | Rear Left Heat      |
| `CLIMATE_INFORMATION_REAR_RIGHT_SEAT_HEATING`     | 34184  | 1    | 34   | Rear Right Heat     |

### 5.11 ECU Information

| Alias                                   | Object | Inst | Rsrc | Description          |
| --------------------------------------- | ------ | ---- | ---- | -------------------- |
| `FIRMWARE_UPDATE_CURRENT_PKG_VERSION`   | 34201  | 0    | 0    | Firmware Version     |
| `VERSION_INFO_TBOX_SOFTWARE_VERSION`    | 34200  | 0    | 0    | T-Box Version        |
| `ECUS_BMS_SOFTWARE_VERSION`             | 34220  | var  | var  | BMS Version          |
| `ECUS_INFORMATION_MHU_SOFTWARE_VERSION` | 34220  | var  | var  | Media Head Unit      |
| `ECUS_INFORMATION_VCU_SOFTWARE_VERSION` | 34220  | var  | var  | Vehicle Control Unit |
| `ECUS_INFORMATION_BCM_SOFTWARE_VERSION` | 34220  | var  | var  | Body Control Module  |

---

## 6. X-HASH Authentication

### 6.1 Algorithm

```
message = lowercase(method + "_" + path + "_" + vin + "_" + secretKey + "_" + timestamp)
X-HASH = Base64(HMAC-SHA256(secretKey, message))
```

### 6.2 Secret Key

- **Key:** `Vinfast@2025`
- **Source:** Reverse engineered from VinFast APK (jadx decompilation)
- **Derivation:** AES-128-CBC decrypt of hardcoded encrypted value using birthdate-derived key

### 6.3 Example

```
Input:
  method = "POST"
  path = "/ccaraccessmgmt/api/v1/telemetry/app/ping"
  vin = "RLLVXXXXXXXXXXXXX71"
  timestamp = "1769029742000"

Message:
  "post_/ccaraccessmgmt/api/v1/telemetry/app/ping_rllvxxxxxxxxxxxxx71_vinfast@2025_1769029742000"

Output:
  X-HASH = "Xit6wzaC0Bpcsi6QTTT/dBY2hcN+jvHiKkEJu3EwNRI="
```

### 6.4 Implementation (JavaScript)

```javascript
import crypto from "crypto";

const SECRET_KEY = "Vinfast@2025";

function generateXHash(method, path, vin, timestamp) {
  const pathOnly = path.split("?")[0];
  const normalizedPath = pathOnly.startsWith("/") ? pathOnly : "/" + pathOnly;

  const parts = [method, normalizedPath];
  if (vin) parts.push(vin);
  parts.push(SECRET_KEY);
  parts.push(String(timestamp));

  const message = parts.join("_").toLowerCase();

  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(message);
  return hmac.digest("base64");
}
```

---

## 7. Region Configuration

### 7.1 Vietnam (Default)

```javascript
{
  name: "Vietnam",
  auth0_domain: "vin3s.au.auth0.com",
  auth0_client_id: "jE5xt50qC7oIh1f32qMzA6hGznIU5mgH",
  auth0_audience: "https://vin3s.au.auth0.com/api/v2/",
  api_base: "https://mobile.connected-car.vinfast.vn"
}
```

### 7.2 United States

```javascript
{
  name: "United States",
  auth0_domain: "vinfast-us-prod.us.auth0.com",
  auth0_client_id: "xhGY7XKDFSk1Q22rxidvwujfz0EPAbUP",
  auth0_audience: "https://vinfast-us-prod.us.auth0.com/api/v2/",
  api_base: "https://mobile.connected-car.vinfastauto.us"
}
```

### 7.3 Europe

```javascript
{
  name: "Europe",
  auth0_domain: "vinfast-eu-prod.eu.auth0.com",
  auth0_client_id: "dxxtNkkhsPWW78x6s1BWQlmuCfLQrkze",
  auth0_audience: "https://vinfast-eu-prod.eu.auth0.com/api/v2/",
  api_base: "https://mobile.connected-car.vinfastauto.eu"
}
```

---

## Tổng Kết

### APIs Đã Implement trong Dashboard

| API            | Endpoint                                      | Status |
| -------------- | --------------------------------------------- | ------ |
| Authentication | Auth0 OAuth                                   | ✅     |
| Token Refresh  | Auth0 OAuth                                   | ✅     |
| User Profile   | Auth0 /userinfo                               | ✅     |
| User Vehicles  | /ccarusermgnt/api/v1/user-vehicle             | ✅     |
| Alias Mapping  | /modelmgmt/api/v2/vehicle-model/.../get-alias | ✅     |
| Telemetry      | /ccaraccessmgmt/api/v1/telemetry/app/ping     | ✅     |

### APIs Có Thể Khai Thác Thêm

| API                | Endpoint                             | Priority |
| ------------------ | ------------------------------------ | -------- |
| Vehicle Wake       | /api/v3.2/connected_car/app/ping     | High     |
| Charging Stations  | /ccarcharging/api/v1/stations/search | Medium   |
| Charging History   | /ccarcharging/api/v1/sessions        | Medium   |
| Trip History       | /ccarusermgnt/api/v1/trip-history    | High     |
| Notifications      | /ccarusermgnt/api/v1/notifications   | Medium   |
| Service History    | /ccarusermgnt/api/v1/service-history | Low      |
| Energy Statistics  | /ccarusermgnt/api/v1/energy-stats    | Medium   |
| Geofence           | /ccarusermgnt/api/v1/geofence        | Low      |
| Scheduled Charging | /ccarcharging/api/v1/schedule        | Low      |

### APIs Read-Only (Không thể điều khiển)

| API              | Reason                               |
| ---------------- | ------------------------------------ |
| Remote Commands  | Requires PKI signing from mobile app |
| Climate Control  | Requires PKI signing from mobile app |
| Door Lock/Unlock | Requires PKI signing from mobile app |

---

**Document Generated:** January 25, 2026
**Source Files:**

- `src/config/vinfast.js`
- `src/services/api.js`
- `src/pages/api/proxy/[...path].js`
- `src/config/static_alias_map.json`
- `docs/api/REVERSE_ENGINEERING_REPORT.md`
