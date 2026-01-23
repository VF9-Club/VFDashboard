# VinFast X-HASH Technical Documentation

**Version:** 4.0
**Updated:** January 24, 2026
**Status:** Resolved

---

## Overview

VinFast Connected Car API sử dụng X-HASH authentication header để bảo vệ các telemetry endpoints. Document này ghi lại algorithm đã được reverse engineer.

---

## X-HASH Specification

### Required Headers

| Header | Description | Example |
|--------|-------------|---------|
| `X-HASH` | HMAC-SHA256 signature (Base64) | `Xit6wzaC0Bpcsi6QTTT/dBY2hcN+jvHiKkEJu3EwNRI=` |
| `X-TIMESTAMP` | Unix timestamp (milliseconds) | `1769189217462` |
| `X-VIN-CODE` | Vehicle Identification Number | `RLLVXXXXXXXXXXXXX71` |
| `Authorization` | Bearer token from Auth0 login | `Bearer eyJhbG...` |

### Algorithm

```
message = lowercase(method + "_" + path + "_" + vin + "_" + secretKey + "_" + timestamp)
X-HASH = Base64(HMAC-SHA256(secretKey, message))
```

**Components:**
- `method`: HTTP method (GET, POST, etc.)
- `path`: API path without query string (e.g., `/ccaraccessmgmt/api/v1/telemetry/list_resource`)
- `vin`: Vehicle VIN code
- `secretKey`: Static secret key
- `timestamp`: X-TIMESTAMP value

**Example:**
```
Input:
  method = "POST"
  path = "/ccarcharging/api/v1/stations/search"
  vin = "RLLVXXXXXXXXXXXXX71"
  timestamp = "1769029742000"

Message (lowercase):
  "post_/ccarcharging/api/v1/stations/search_rllvxxxxxxxxxxxxx71_<secretKey>_1769029742000"

Output:
  X-HASH = "0ahe0CvpJnSyZH2BU1LxwA9Ytfa1qxW784Xc3Kvr4cU="
```

---

## Implementation

### JavaScript (Node.js)

```javascript
import crypto from 'crypto';

const SECRET_KEY = '<secret_key>';

function generateXHash(method, path, vin, timestamp) {
  // Remove query string
  const pathOnly = path.split('?')[0];

  // Ensure path starts with /
  const normalizedPath = pathOnly.startsWith('/') ? pathOnly : '/' + pathOnly;

  // Build message
  const parts = [method, normalizedPath];
  if (vin) parts.push(vin);
  parts.push(SECRET_KEY);
  parts.push(String(timestamp));

  const message = parts.join('_').toLowerCase();

  // HMAC-SHA256 + Base64
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(message);
  return hmac.digest('base64');
}

// Usage
const timestamp = Date.now();
const xHash = generateXHash('POST', '/api/v1/telemetry/list_resource', 'RLLVXXXXXXXXXXXXX71', timestamp);
```

### Python

```python
import hmac
import hashlib
import base64
import time

SECRET_KEY = '<secret_key>'

def generate_xhash(method: str, path: str, vin: str = None) -> tuple[str, str]:
    timestamp = str(int(time.time() * 1000))

    # Remove query string
    path_only = path.split('?')[0]
    if not path_only.startswith('/'):
        path_only = '/' + path_only

    # Build message
    parts = [method, path_only]
    if vin:
        parts.append(vin)
    parts.append(SECRET_KEY)
    parts.append(timestamp)

    message = '_'.join(parts).lower()

    # HMAC-SHA256 + Base64
    signature = hmac.new(
        SECRET_KEY.encode('utf-8'),
        message.encode('utf-8'),
        hashlib.sha256
    ).digest()

    x_hash = base64.b64encode(signature).decode('utf-8')
    return x_hash, timestamp
```

---

## API Endpoints

### Telemetry Data
```
POST /ccaraccessmgmt/api/v1/telemetry/list_resource
Body: [{"resourceId":"10","instanceId":"1","objectId":"34180"}, ...]
```

### Charging Stations
```
POST /ccarcharging/api/v1/stations/search
Body: {"latitude":21.209747,"longitude":105.793358,"excludeFavorite":false}
```

### User Vehicles
```
GET /ccarusermgnt/api/v1/user-vehicle
```

### Vehicle Ping
```
POST /api/v3.2/connected_car/app/ping
```

---

## Telemetry Object IDs

| Object ID | Resource ID | Description |
|-----------|-------------|-------------|
| 34180 | 10 | State of Charge (SOC) |
| 34181 | 7 | Estimated Range |
| 34183 | 1 | Charging Status |
| 34190 | * | Tire Pressure |
| 34191 | * | Door Status |

---

## Authentication Flow

1. User login via Auth0 (`vin3s.au.auth0.com`)
2. Receive `access_token` (JWT, ~24h expiry)
3. For each API request:
   - Generate timestamp
   - Generate X-HASH using algorithm above
   - Include headers: `Authorization`, `X-HASH`, `X-TIMESTAMP`, `X-VIN-CODE`

---

## Summary

| Item | Status |
|------|--------|
| Algorithm | HMAC-SHA256(key, message) → Base64 |
| Message format | `method_path_vin_key_timestamp` (lowercase) |
| Hash validity | ~10-30 seconds window |
| Implementation | VFDashboard proxy auto-generates |

---

**Note:** Secret key được giữ private trong source code. Dashboard tự động generate X-HASH cho mọi API request.
