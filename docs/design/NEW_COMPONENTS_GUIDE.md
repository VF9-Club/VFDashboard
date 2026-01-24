# VFDashboard 2.0 - New Components Guide

**Created:** January 2026
**Status:** Ready for Integration

---

## Quick Start

Để sử dụng giao diện mới với tất cả tính năng bổ sung, thay đổi import trong `index.astro`:

```jsx
// Thay đổi từ:
import DashboardApp from "../components/DashboardApp";

// Sang:
import DashboardAppV2 from "../components/DashboardAppV2";
```

---

## New Components Overview

### 1. Charging Map (`/components/charging/ChargingMap.jsx`)

**Mô tả:** Bản đồ hiển thị các trạm sạc VinFast gần vị trí xe.

**Props:**
- `isFullScreen` (boolean) - Chế độ toàn màn hình
- `onClose` (function) - Callback khi đóng

**Sử dụng:**
```jsx
import ChargingMap, { ChargingMapCompact } from "./charging/ChargingMap";

// Full version
<ChargingMap isFullScreen={true} onClose={handleClose} />

// Compact version (for dashboard)
<ChargingMapCompact onExpand={() => setShowFullMap(true)} />
```

**Features:**
- Hiển thị danh sách trạm sạc gần nhất
- Số cổng sạc available
- Loại connector (CCS2, CHAdeMO, Type 2)
- Công suất max (kW)
- Khoảng cách từ xe
- Nút điều hướng tới Google Maps

---

### 2. Charging History (`/components/charging/ChargingHistory.jsx`)

**Mô tả:** Lịch sử các lần sạc với thống kê chi tiết.

**Props:**
- `isFullScreen` (boolean)
- `onClose` (function)

**Sử dụng:**
```jsx
import ChargingHistory, { ChargingHistoryCompact } from "./charging/ChargingHistory";

<ChargingHistory isFullScreen={true} onClose={handleClose} />
```

**Features:**
- Danh sách sessions với ngày, giờ, địa điểm
- Số kWh đã sạc
- SOC trước/sau sạc
- Chi phí ước tính
- Filter theo week/month
- Thống kê tổng hợp

---

### 3. Trip History (`/components/trips/TripHistory.jsx`)

**Mô tả:** Lịch sử các chuyến đi với route và statistics.

**Props:**
- `isFullScreen` (boolean)
- `onClose` (function)

**Sử dụng:**
```jsx
import TripHistory, { TripHistoryCompact } from "./trips/TripHistory";

<TripHistory isFullScreen={true} onClose={handleClose} />
```

**Features:**
- Route visualization (điểm đi/đến)
- Quãng đường, thời gian
- Energy consumed
- Efficiency (Wh/km)
- Driving score

---

### 4. Energy Dashboard (`/components/energy/EnergyDashboard.jsx`)

**Mô tả:** Dashboard thống kê năng lượng tiêu thụ và sạc.

**Props:**
- `isFullScreen` (boolean)
- `onClose` (function)

**Sử dụng:**
```jsx
import EnergyDashboard, { EnergyDashboardCompact } from "./energy/EnergyDashboard";

<EnergyDashboard isFullScreen={true} onClose={handleClose} />
```

**Features:**
- Biểu đồ daily/weekly
- Total consumed vs charged
- Efficiency gauge
- CO₂ saved
- Cost estimation

---

### 5. Range Calculator (`/components/tools/RangeCalculator.jsx`)

**Mô tả:** Công cụ tính toán quãng đường ước tính dựa trên điều kiện.

**Props:**
- `isCompact` (boolean) - Compact mode
- `onExpand` (function) - Callback expand

**Sử dụng:**
```jsx
import RangeCalculator from "./tools/RangeCalculator";

// Full version
<RangeCalculator />

// Compact version
<RangeCalculator isCompact={true} onExpand={handleExpand} />
```

**Factors:**
- Speed (30-150 km/h)
- AC mode (off/eco/normal/max)
- Weather (sunny/cloudy/rain/cold)
- Terrain (flat/hilly/mountain)
- Load (light/normal/heavy/full)

---

### 6. Mobile Navigation V2 (`/components/MobileNavV2.jsx`)

**Mô tả:** Navigation bar mới với "More" menu.

**Props:**
- `activeTab` (string) - Tab hiện tại
- `onTabChange` (function) - Callback đổi tab
- `onScan` (function) - Callback scan
- `onOpenFeature` (function) - Callback mở feature

**Sử dụng:**
```jsx
import MobileNavV2 from "./MobileNavV2";

<MobileNavV2
  activeTab={activeTab}
  onTabChange={setActiveTab}
  onScan={handleScan}
  onOpenFeature={handleOpenFeature}
/>
```

**Tabs:**
- Vehicle (Digital Twin)
- Energy (Battery & Charging)
- Status (System Health)
- Location (Map)
- More (Bottom Sheet với extra features)

---

### 7. UI Components

#### StatCard (`/components/ui/StatCard.jsx`)

**Variants:** `blue`, `green`, `amber`, `gray`, `white`
**Sizes:** `sm`, `md`, `lg`

```jsx
import StatCard, { StatCardRow, StatCardMini } from "./ui/StatCard";

<StatCard
  label="Total Energy"
  value={184.8}
  unit="kWh"
  trend="+12%"
  variant="green"
  size="md"
  icon={<BoltIcon />}
/>
```

#### BottomSheet (`/components/ui/BottomSheet.jsx`)

```jsx
import BottomSheet from "./ui/BottomSheet";

<BottomSheet
  isOpen={showSheet}
  onClose={() => setShowSheet(false)}
  title="Select Option"
>
  {/* content */}
</BottomSheet>
```

---

## CSS Design Tokens

Các design tokens đã được thêm vào `global.css`:

```css
/* Sử dụng */
.my-card {
  @apply card-base;           /* White rounded card */
  @apply stat-card-blue;      /* Blue stat card */
  @apply btn-primary;         /* Primary button */
  @apply text-label;          /* Label typography */
  @apply animate-slide-up;    /* Animation */
}
```

**Available classes:**
- `.card-base`, `.card-elevated`, `.card-glass`
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-icon`
- `.stat-card`, `.stat-card-blue`, `.stat-card-green`, `.stat-card-amber`
- `.text-display`, `.text-heading`, `.text-label`, `.text-data`
- `.animate-fade-in`, `.animate-slide-up`, `.animate-scale-in`, `.animate-pulse-glow`
- `.glass`, `.glass-dark`
- `.custom-scrollbar`, `.scrollbar-hide`

---

## File Structure

```
src/components/
├── charging/
│   ├── ChargingMap.jsx        ✅ NEW
│   └── ChargingHistory.jsx    ✅ NEW
├── trips/
│   └── TripHistory.jsx        ✅ NEW
├── energy/
│   └── EnergyDashboard.jsx    ✅ NEW
├── tools/
│   └── RangeCalculator.jsx    ✅ NEW
├── ui/
│   ├── StatCard.jsx           ✅ NEW
│   └── BottomSheet.jsx        ✅ NEW
├── DashboardAppV2.jsx         ✅ NEW (Main entry)
├── MobileNavV2.jsx            ✅ NEW
└── index.js                   ✅ NEW (Exports)
```

---

## Migration Steps

### Step 1: Update imports in `index.astro`

```diff
- import DashboardApp from "../components/DashboardApp";
+ import DashboardAppV2 from "../components/DashboardAppV2";

// In the component:
- <DashboardApp client:load vin={vin} />
+ <DashboardAppV2 client:load vin={vin} />
```

### Step 2: Test on mobile & desktop

- Verify all tabs work correctly
- Test "More" menu opens bottom sheet
- Test each feature view opens/closes properly
- Verify no layout overflow issues

### Step 3: Connect to real APIs

Replace mock data in each component with actual API calls:

```jsx
// In ChargingMap.jsx
useEffect(() => {
  const fetchStations = async () => {
    const data = await api.searchChargingStations(lat, lng);
    setStations(data);
  };
  fetchStations();
}, [lat, lng]);
```

---

## Known Limitations

1. **Mock Data:** All new components use mock data. API integration required.
2. **Map:** Uses Google Maps embed (CORS-free but limited interaction)
3. **Charts:** Simple bar chart implementation. Consider Chart.js for advanced charts.
4. **Offline:** No offline support yet for new features.

---

## Next Steps

1. [ ] Integrate real API endpoints
2. [ ] Add pull-to-refresh
3. [ ] Implement data caching
4. [ ] Add chart library (Chart.js/Recharts)
5. [ ] PWA enhancements
6. [ ] Dark mode support

---

**Document maintained by:** VFDashboard Dev Team
