# VinFast X-HASH Reverse Engineering Report

**Date:** January 24, 2026
**Target:** VinFast Companion App v2.16.16 (iOS/Android)
**Objective:** Reverse engineer X-HASH authentication để VFDashboard hoạt động độc lập

---

## Phần 1: Các Biện Pháp và Quá Trình Tìm Secret Key

### Phase 1: Traffic Analysis (MITM Proxy)

**Công cụ:** mitmproxy

**Bước thực hiện:**
1. Setup mitmproxy trên port 8080
2. Cài certificate lên device iOS
3. Capture traffic từ VinFast app

**Kết quả:**
- Phát hiện headers: `X-HASH`, `X-TIMESTAMP`, `X-VIN-CODE`
- Hash format: Base64, 44 characters (256-bit = HMAC-SHA256)
- Hash thay đổi theo timestamp → time-based
- Hash khác nhau cho mỗi endpoint → path có trong input

**Hạn chế:** Chỉ capture được hash, không biết cách generate

---

### Phase 2: APK Decompilation

**Công cụ:** jadx (Android decompiler)

**Bước thực hiện:**
```bash
brew install jadx
jadx -d docs/jadx_output/ com.vinfast.companion_app/*.dex
```

**Files quan trọng tìm được:**
1. `TokenInterceptor.java` - OkHttp interceptor thêm X-HASH header
2. `SecurityUtils.java` - Cryptographic utilities
3. `HMACInterceptor.java` - HMAC signing logic

**Phát hiện từ code:**
```java
// TokenInterceptor.java - method c() (secret key generation)
byte[] bytes = String.valueOf(
    LocalDate.of(1993, 8, 8)
        .atStartOfDay(ZoneId.of("UTC"))
        .toInstant()
        .toEpochMilli()
).getBytes(Charsets.UTF_8);

// Repeat until >= 32 bytes
byte[] bArrD = new byte[0];
while (bArrD.length < 32) {
    bArrD = ArraysKt.D(bArrD, bytes);
}

// AES decrypt
byte[] secretKey = SecurityUtils.i(
    CollectionsKt.d1(ArraysKt.k1(bArrD, 32)),  // key = first 32 bytes
    "AHYhIZONK8ZR58s76Y/LEg==",                 // encrypted secret
    CollectionsKt.d1(ArraysKt.l1(bArrD, 16))   // iv = last 16 bytes
);
```

**Phát hiện message format:**
```java
// Build message parts
ArrayList arrayList = new ArrayList();
arrayList.add(request.method());           // HTTP method
arrayList.add(request.url().encodedPath()); // Path
if (vin != null) arrayList.add(vin);       // VIN (optional)
arrayList.add(secretKey);                   // Secret key
arrayList.add(timestamp);                   // Timestamp

// Join and lowercase
String message = CollectionsKt.A0(arrayList, "_", ...).toLowerCase();

// HMAC-SHA256 + Base64
String xHash = securityUtils.j(securityUtils.n(keyBytes, messageBytes));
```

---

### Phase 3: Secret Key Decryption

**Vấn đề:** Python decryption failed với padding errors

**Nguyên nhân:**
- Sai birth date milliseconds (timezone issue)
- Python: 744768000000 vs APK logs: 744854400000 (24h difference)

**Giải pháp:** Viết Java code để decrypt chính xác như APK

```java
// DecryptSecret.java
LocalDate birthDate = LocalDate.of(1993, 8, 8);
long birthDateMs = birthDate.atStartOfDay(ZoneId.of("UTC"))
    .toInstant().toEpochMilli();
// Result: 744768000000

String genKeyStr = String.valueOf(birthDateMs); // "744768000000"
while (genKeyStr.length() < 32) {
    genKeyStr += String.valueOf(birthDateMs);
}
// Result: "744768000000744768000000744768000000" (36 chars)

byte[] password = genKeyStr.substring(0, 32).getBytes(); // first 32
byte[] iv = genKeyStr.substring(genKeyStr.length() - 16).getBytes(); // last 16

// AES-CBC decrypt
Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
cipher.init(Cipher.DECRYPT_MODE,
    new SecretKeySpec(password, "AES"),
    new IvParameterSpec(iv));

byte[] decrypted = cipher.doFinal(Base64.getDecoder().decode("AHYhIZONK8ZR58s76Y/LEg=="));
// Result: "Vinfast@2025"
```

**Secret Key:** `Vinfast@2025`

---

### Phase 4: Verification

**Test với captured data:**
```python
method = "POST"
path = "/ccarcharging/api/v1/stations/search"
vin = "RLLVXXXXXXXXXXXXX71"  # Example VIN
timestamp = "1769029742000"
secret = "Vinfast@2025"

message = f"{method}_{path}_{vin}_{secret}_{timestamp}".lower()
# "post_/ccarcharging/api/v1/stations/search_rllvxxxxxxxxxxxxx71_vinfast@2025_1769029742000"

xhash = base64(hmac_sha256(secret, message))
# "0ahe0CvpJnSyZH2BU1LxwA9Ytfa1qxW784Xc3Kvr4cU="

# Match với captured hash từ proxy ✓
```

---

### Tổng kết Biện Pháp

| Phase | Công cụ | Mục đích | Kết quả |
|-------|---------|----------|---------|
| 1 | mitmproxy | Capture traffic | Xác định hash format, headers |
| 2 | jadx | Decompile APK | Tìm algorithm, encrypted secret |
| 3 | Java | Decrypt secret | `Vinfast@2025` |
| 4 | Python | Verify | Match 100% với captured hashes |

**Key insights:**
1. Birth date `1993-08-08` được dùng để generate AES key
2. Encrypted secret hardcoded trong APK
3. Message format: `method_path_vin_secret_timestamp` (lowercase)
4. HMAC-SHA256 + Base64 encoding

---

## Phần 2: API Endpoints Log

### Authentication

```
POST https://vin3s.au.auth0.com/oauth/token
Content-Type: application/json

Request:
{
  "client_id": "jE5xt50qC7oIh1f32qMzA6hGznIU5mgH",
  "grant_type": "password",
  "username": "<email>",
  "password": "<password>",
  "scope": "openid profile email offline_access",
  "audience": "https://mobile.connected-car.vinfast.vn"
}

Response:
{
  "access_token": "eyJhbG...",
  "refresh_token": "v1.M...",
  "id_token": "eyJhbG...",
  "token_type": "Bearer",
  "expires_in": 86400
}

Notes:
- Token expires in 24 hours
- Auth0 tenant: vin3s.au.auth0.com
- Client ID public (mobile app)
```

---

### User Vehicles

```
GET https://mobile.connected-car.vinfast.vn/ccarusermgnt/api/v1/user-vehicle

Headers:
  Authorization: Bearer <token>
  X-HASH: <generated>
  X-TIMESTAMP: <ms>

Response:
{
  "code": 200,
  "data": [
    {
      "vinNumber": "RLLVXXXXXXXXXXXXX71",
      "vehicleName": "VF 9",
      "modelCode": "VF9",
      "modelYear": "2024",
      "exteriorColor": "Neptune Blue",
      "interiorColor": "Black",
      "batteryCapacity": 123.0,
      "ownershipType": "OWNER",
      "subscriptionStatus": "ACTIVE"
    }
  ]
}

Notes:
- Trả về danh sách xe của user
- batteryCapacity = kWh
- subscriptionStatus: ACTIVE/EXPIRED/NONE
```

---

### Telemetry - List Resource (Primary)

```
POST https://mobile.connected-car.vinfast.vn/ccaraccessmgmt/api/v1/telemetry/list_resource

Headers:
  Authorization: Bearer <token>
  X-HASH: <generated>
  X-TIMESTAMP: <ms>
  X-VIN-CODE: <vin>

Request Body:
[
  {"resourceId": "10", "instanceId": "1", "objectId": "34180"},
  {"resourceId": "7", "instanceId": "1", "objectId": "34181"},
  {"resourceId": "1", "instanceId": "1", "objectId": "34183"},
  {"resourceId": "2", "instanceId": "1", "objectId": "34190"},
  {"resourceId": "3", "instanceId": "1", "objectId": "34190"},
  {"resourceId": "4", "instanceId": "1", "objectId": "34190"},
  {"resourceId": "5", "instanceId": "1", "objectId": "34190"}
]

Response:
{
  "code": 200,
  "data": [
    {
      "objectId": "34180",
      "resourceId": "10",
      "instanceId": "1",
      "resourceValue": "85",
      "timestamp": 1769029742000
    },
    {
      "objectId": "34181",
      "resourceId": "7",
      "instanceId": "1",
      "resourceValue": "320",
      "timestamp": 1769029742000
    }
  ]
}
```

**Object/Resource ID Reference:**

| objectId | resourceId | Description | Unit |
|----------|------------|-------------|------|
| 34180 | 10 | State of Charge (SOC) | % |
| 34181 | 7 | Estimated Range | km |
| 34183 | 1 | Charging Status | enum |
| 34190 | 2 | Front Left Tire Pressure | kPa |
| 34190 | 3 | Front Right Tire Pressure | kPa |
| 34190 | 4 | Rear Left Tire Pressure | kPa |
| 34190 | 5 | Rear Right Tire Pressure | kPa |
| 34191 | 1-4 | Door Status (FL/FR/RL/RR) | 0/1 |
| 34192 | 1 | Trunk Status | 0/1 |
| 34193 | 1 | Hood Status | 0/1 |
| 34194 | 1 | Window Status | 0/1 |
| 34195 | 1 | Lock Status | 0/1 |
| 34196 | 1 | Climate Status | 0/1 |
| 34197 | 1 | Odometer | km |
| 34198 | 1 | Location Latitude | degree |
| 34198 | 2 | Location Longitude | degree |

---

### Vehicle Ping

```
POST https://mobile.connected-car.vinfast.vn/api/v3.2/connected_car/app/ping

Headers:
  Authorization: Bearer <token>
  X-HASH: <generated>
  X-TIMESTAMP: <ms>
  X-VIN-CODE: <vin>
  X-SERVICE-NAME: CAPP
  X-APP-VERSION: 2.16.16

Request Body: (empty or {})

Response:
{
  "code": 200,
  "data": {
    "status": "ONLINE",
    "lastSeen": 1769029742000
  }
}

Notes:
- Kiểm tra xe online/offline
- Wake up xe từ sleep mode
```

---

### Charging Stations Search

```
POST https://mobile.connected-car.vinfast.vn/ccarcharging/api/v1/stations/search?page=0&size=20

Headers:
  Authorization: Bearer <token>
  X-HASH: <generated>
  X-TIMESTAMP: <ms>
  X-VIN-CODE: <vin>

Request Body:
{
  "latitude": 21.209747,
  "longitude": 105.793358,
  "excludeFavorite": false
}

Response:
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

Notes:
- Tìm trạm sạc gần vị trí
- maxPower = kW
- distance = km
```

---

### Remote Commands

```
POST https://mobile.connected-car.vinfast.vn/ccaraccessmgmt/api/v1/command/execute

Headers:
  Authorization: Bearer <token>
  X-HASH: <generated>
  X-TIMESTAMP: <ms>
  X-VIN-CODE: <vin>

Request Body:
{
  "commandType": "LOCK",  // or UNLOCK, CLIMATE_ON, CLIMATE_OFF, HORN, FLASH
  "parameters": {}
}

Response:
{
  "code": 200,
  "data": {
    "commandId": "cmd-12345",
    "status": "PENDING"
  }
}

Notes:
- Commands: LOCK, UNLOCK, CLIMATE_ON, CLIMATE_OFF, HORN, FLASH, TRUNK_OPEN
- Status: PENDING → EXECUTING → COMPLETED/FAILED
```

---

### Trip History

```
GET https://mobile.connected-car.vinfast.vn/ccarusermgnt/api/v1/trip-history?from=2026-01-01&to=2026-01-24

Headers:
  Authorization: Bearer <token>
  X-HASH: <generated>
  X-TIMESTAMP: <ms>
  X-VIN-CODE: <vin>

Response:
{
  "code": 200,
  "data": [
    {
      "tripId": "trip-001",
      "startTime": 1769000000000,
      "endTime": 1769003600000,
      "startLocation": {"lat": 21.0, "lng": 105.8},
      "endLocation": {"lat": 21.1, "lng": 105.9},
      "distance": 15.5,
      "duration": 3600,
      "energyConsumed": 3.2,
      "avgSpeed": 45
    }
  ]
}

Notes:
- distance = km
- duration = seconds
- energyConsumed = kWh
- avgSpeed = km/h
```

---

### Charging History

```
GET https://mobile.connected-car.vinfast.vn/ccarcharging/api/v1/sessions?page=0&size=20

Headers:
  Authorization: Bearer <token>
  X-HASH: <generated>
  X-TIMESTAMP: <ms>
  X-VIN-CODE: <vin>

Response:
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

Notes:
- energyCharged = kWh
- cost = local currency
```

---

## Phần 3: Khả Năng Khai Thác Thêm

### Đã xác nhận có thể lấy:
1. **Vehicle Info:** VIN, model, year, color, battery capacity
2. **Real-time Telemetry:** SOC, range, tire pressure, door/trunk/hood status
3. **Location:** GPS coordinates (latitude, longitude)
4. **Charging:** Station search, charging history, session details
5. **Trip History:** Routes, distance, energy consumption
6. **Remote Commands:** Lock/unlock, climate, horn, flash

### Cần explore thêm:
1. **Notifications API** - Push notification history
2. **Service/Maintenance API** - Service records
3. **OTA Updates API** - Software version info
4. **Energy Statistics** - Monthly/weekly consumption reports
5. **Geofence API** - Location alerts configuration

### Endpoints chưa test:
```
GET /ccarusermgnt/api/v1/notifications
GET /ccarusermgnt/api/v1/service-history
GET /ccarusermgnt/api/v1/software-version
GET /ccarusermgnt/api/v1/energy-stats
POST /ccarusermgnt/api/v1/geofence
```

---

## Kết Luận

**Thành công:**
- Reverse engineer X-HASH algorithm hoàn chỉnh
- VFDashboard có thể hoạt động độc lập
- Không cần proxy từ official app

**Secret Key Info:**
- Key: `Vinfast@2025`
- Derived from: Birth date 1993-08-08 → AES key → Decrypt hardcoded value
- Algorithm: HMAC-SHA256 + Base64

**Next Steps:**
1. Test các endpoint chưa explore
2. Document thêm Object/Resource IDs
3. Build complete API client library
