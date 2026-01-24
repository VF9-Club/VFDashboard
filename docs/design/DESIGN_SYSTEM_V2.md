# VFDashboard 2.0 - Design System & UI Specification

**Version:** 2.0
**Date:** January 2026
**Status:** Design Specification

---

## 1. Design Philosophy

### Vision
Tạo ra một dashboard xe điện **premium**, **hiện đại**, lấy cảm hứng từ Tesla, Rivian, và Lucid nhưng mang đậm bản sắc VinFast.

### Core Principles
1. **Clarity First** - Thông tin quan trọng nhất luôn nổi bật
2. **Spatial Harmony** - Sử dụng không gian một cách thông minh
3. **Fluid Motion** - Animations mượt mà, có mục đích
4. **Touch-Friendly** - Tối ưu cho cả touch và mouse
5. **Accessibility** - Đảm bảo mọi người đều có thể sử dụng

---

## 2. Color System

### Brand Colors
```css
/* Primary - VinFast Blue */
--vf-blue-50: #eff6ff;
--vf-blue-100: #dbeafe;
--vf-blue-500: #3b82f6;
--vf-blue-600: #2563eb;
--vf-blue-700: #1d4ed8;

/* Accent - Electric Teal */
--vf-teal-400: #2dd4bf;
--vf-teal-500: #14b8a6;
--vf-teal-600: #0d9488;

/* Energy - Charging Green */
--vf-green-400: #4ade80;
--vf-green-500: #22c55e;
--vf-green-600: #16a34a;
```

### Semantic Colors
```css
/* Status */
--status-success: #10b981;  /* Emerald 500 */
--status-warning: #f59e0b;  /* Amber 500 */
--status-danger: #ef4444;   /* Red 500 */
--status-info: #3b82f6;     /* Blue 500 */

/* Surfaces */
--surface-primary: #ffffff;
--surface-secondary: #f8fafc;
--surface-tertiary: #f1f5f9;
--surface-elevated: rgba(255,255,255,0.8);

/* Text */
--text-primary: #0f172a;    /* Slate 900 */
--text-secondary: #475569;  /* Slate 600 */
--text-muted: #94a3b8;      /* Slate 400 */
--text-inverse: #ffffff;
```

### Dark Mode (Optional - Phase 2)
```css
--dark-surface-primary: #0f172a;
--dark-surface-secondary: #1e293b;
--dark-text-primary: #f8fafc;
```

---

## 3. Typography

### Font Stack
```css
/* Primary - Display & Headings */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Mono - Numbers & Data */
font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
```

### Type Scale
```css
/* Display */
.text-display-lg { font-size: 3.5rem; line-height: 1; font-weight: 900; }
.text-display-md { font-size: 2.5rem; line-height: 1.1; font-weight: 800; }

/* Headings */
.text-h1 { font-size: 1.875rem; line-height: 1.2; font-weight: 800; }
.text-h2 { font-size: 1.5rem; line-height: 1.25; font-weight: 700; }
.text-h3 { font-size: 1.25rem; line-height: 1.3; font-weight: 700; }
.text-h4 { font-size: 1rem; line-height: 1.4; font-weight: 600; }

/* Body */
.text-body-lg { font-size: 1rem; line-height: 1.5; }
.text-body-md { font-size: 0.875rem; line-height: 1.5; }
.text-body-sm { font-size: 0.75rem; line-height: 1.5; }

/* Labels */
.text-label-lg { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
.text-label-md { font-size: 0.625rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
.text-label-sm { font-size: 0.5rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; }

/* Data Display (Monospace) */
.text-data-xl { font-size: 2.5rem; font-weight: 900; font-family: mono; }
.text-data-lg { font-size: 1.5rem; font-weight: 800; font-family: mono; }
.text-data-md { font-size: 1rem; font-weight: 700; font-family: mono; }
```

---

## 4. Spacing System

### Base Unit: 4px
```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Component Spacing Guidelines
- **Cards**: padding 20-24px (p-5 to p-6)
- **Between cards**: gap 24px (gap-6)
- **Mobile cards**: padding 16-20px (p-4 to p-5)
- **Touch targets**: minimum 44x44px

---

## 5. Border Radius

```css
--radius-sm: 0.5rem;    /* 8px - Buttons, inputs */
--radius-md: 0.75rem;   /* 12px - Small cards */
--radius-lg: 1rem;      /* 16px - Medium cards */
--radius-xl: 1.5rem;    /* 24px - Large cards */
--radius-2xl: 2rem;     /* 32px - Hero sections */
--radius-full: 9999px;  /* Pills, avatars */
```

---

## 6. Shadows & Elevation

```css
/* Subtle - Cards at rest */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);

/* Default - Cards, buttons */
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

/* Elevated - Modals, dropdowns */
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

/* Prominent - Floating elements */
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

/* Glass effect */
--shadow-glass: 0 8px 32px rgb(0 0 0 / 0.12);
```

---

## 7. Animation & Motion

### Timing Functions
```css
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-snap: cubic-bezier(0.2, 0, 0, 1);
```

### Duration
```css
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-slower: 700ms;
```

### Standard Animations
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scale In */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Pulse Glow (for charging) */
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  50% { box-shadow: 0 0 20px 10px rgba(34, 197, 94, 0.2); }
}
```

---

## 8. Component Library

### 8.1 Cards

#### Base Card
```jsx
<div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
  {/* content */}
</div>
```

#### Glass Card (Mobile Nav, Floating)
```jsx
<div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-glass border border-white/50">
  {/* content */}
</div>
```

#### Stat Card
```jsx
<div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-4 border border-blue-100">
  <p className="text-label-md text-blue-600/70 mb-1">Label</p>
  <p className="text-data-lg text-blue-700">Value</p>
</div>
```

### 8.2 Buttons

#### Primary Button
```jsx
<button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95">
  Action
</button>
```

#### Secondary Button
```jsx
<button className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all active:scale-95">
  Action
</button>
```

#### Icon Button
```jsx
<button className="w-12 h-12 flex items-center justify-center bg-white hover:bg-gray-50 rounded-full border border-gray-200 shadow-sm transition-all active:scale-90">
  <Icon className="w-5 h-5" />
</button>
```

### 8.3 Navigation

#### Tab Bar Item
```jsx
<button className={`flex-1 flex flex-col items-center justify-center py-2 rounded-2xl transition-all ${
  active
    ? 'bg-blue-100/60 text-blue-600'
    : 'text-gray-500 hover:text-gray-700'
}`}>
  <Icon className="w-6 h-6 mb-1" />
  <span className="text-[10px] font-bold uppercase">{label}</span>
</button>
```

### 8.4 Data Display

#### Battery Gauge (Circular)
```jsx
<div className="relative w-32 h-32">
  <svg className="w-full h-full -rotate-90">
    <circle cx="50%" cy="50%" r="45%" stroke="#f3f4f6" strokeWidth="8" fill="none" />
    <circle
      cx="50%" cy="50%" r="45%"
      stroke={battery > 20 ? '#2563eb' : '#ef4444'}
      strokeWidth="8" fill="none"
      strokeDasharray="283"
      strokeDashoffset={283 - (283 * battery / 100)}
      strokeLinecap="round"
      className="transition-all duration-1000"
    />
  </svg>
  <div className="absolute inset-0 flex flex-col items-center justify-center">
    <span className="text-4xl font-black">{battery}%</span>
    <span className="text-label-sm text-gray-400">SOC</span>
  </div>
</div>
```

---

## 9. Layout Structure

### 9.1 Desktop Layout (≥1024px)

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER: Logo | Vehicle Name | VIN | Weather | Refresh | Profile   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────┐  ┌─────────────────────────────┐  ┌──────────┐       │
│  │          │  │                             │  │          │       │
│  │  ENERGY  │  │      DIGITAL TWIN           │  │ ENVIRON  │       │
│  │  CARD    │  │      (3D Vehicle)           │  │ CARD     │       │
│  │          │  │                             │  │          │       │
│  ├──────────┤  │   Tire Pressures overlay    │  ├──────────┤       │
│  │          │  │   Gear selector             │  │          │       │
│  │  SYSTEM  │  │   Warnings                  │  │   MAP    │       │
│  │  HEALTH  │  │                             │  │   CARD   │       │
│  │          │  │                             │  │          │       │
│  └──────────┘  └─────────────────────────────┘  └──────────┘       │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  QUICK ACTIONS: Charging Stations | Trips | Energy | More   │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Grid: 12 columns**
- Left Column: 3 cols (Energy + System Health)
- Center: 6 cols (Digital Twin)
- Right Column: 3 cols (Environment + Map)
- Quick Actions: Full width

### 9.2 Mobile Layout (<768px)

```
┌─────────────────────────────┐
│  HEADER (Compact)           │
│  Logo | Name | Avatar       │
├─────────────────────────────┤
│                             │
│  ╔═══════════════════════╗  │
│  ║                       ║  │
│  ║   SWIPEABLE CONTENT   ║  │
│  ║                       ║  │
│  ║   Tab 1: Vehicle      ║  │
│  ║   Tab 2: Energy       ║  │
│  ║   Tab 3: Status       ║  │
│  ║   Tab 4: Location     ║  │
│  ║   Tab 5: Charging ⭐   ║  │
│  ║   Tab 6: Trips ⭐      ║  │
│  ║                       ║  │
│  ╚═══════════════════════╝  │
│                             │
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │  BOTTOM NAV (Glass) │    │
│  │  🚗  ⚡  🛡️  📍  ➕  │    │
│  └─────────────────────────┘│
└─────────────────────────────┘
```

---

## 10. New Features - UI Components

### 10.1 Charging Stations Map

```jsx
// ChargingMap.jsx
<div className="relative h-full rounded-3xl overflow-hidden">
  {/* Map Background */}
  <div className="absolute inset-0 bg-gray-100">
    <Map center={vehicleLocation} zoom={13} />
  </div>

  {/* Station Markers */}
  {stations.map(station => (
    <StationMarker
      key={station.id}
      station={station}
      selected={selectedId === station.id}
    />
  ))}

  {/* Bottom Sheet - Station Details */}
  <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl p-4">
    <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

    <div className="flex items-start gap-4">
      {/* Station Icon */}
      <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
        <ChargingIcon className="w-8 h-8 text-green-600" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-gray-900 truncate">{station.name}</h3>
        <p className="text-sm text-gray-500">{station.address}</p>

        {/* Availability */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-bold text-green-600">
            {station.available}/{station.total} available
          </span>
          <span className="text-sm text-gray-400">•</span>
          <span className="text-sm text-gray-600">{station.distance} km</span>
        </div>

        {/* Connector Types */}
        <div className="flex gap-2 mt-3">
          {station.connectors.map(type => (
            <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Navigate Button */}
      <button className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
        <NavigateIcon className="w-6 h-6 text-white" />
      </button>
    </div>
  </div>
</div>
```

### 10.2 Charging History

```jsx
// ChargingHistory.jsx
<div className="space-y-4">
  {/* Summary Stats */}
  <div className="grid grid-cols-3 gap-3">
    <StatCard
      label="This Month"
      value={`${totalKwh} kWh`}
      trend="+12%"
      icon={<BoltIcon />}
    />
    <StatCard
      label="Sessions"
      value={sessionCount}
      icon={<PlugIcon />}
    />
    <StatCard
      label="Est. Cost"
      value={`${totalCost}₫`}
      icon={<WalletIcon />}
    />
  </div>

  {/* Sessions List */}
  <div className="space-y-2">
    {sessions.map(session => (
      <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4">
        {/* Date Column */}
        <div className="w-14 text-center">
          <p className="text-2xl font-black text-gray-900">{session.day}</p>
          <p className="text-xs font-bold text-gray-400 uppercase">{session.month}</p>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 truncate">{session.stationName}</p>
          <p className="text-sm text-gray-500">
            {session.startTime} - {session.endTime}
          </p>
        </div>

        {/* Energy */}
        <div className="text-right">
          <p className="text-lg font-bold text-green-600">+{session.kWh} kWh</p>
          <p className="text-xs text-gray-400">
            {session.startSoc}% → {session.endSoc}%
          </p>
        </div>
      </div>
    ))}
  </div>
</div>
```

### 10.3 Trip History

```jsx
// TripHistory.jsx
<div className="space-y-4">
  {/* Trip Card */}
  <div className="bg-white rounded-3xl p-5 border border-gray-100">
    {/* Route Visual */}
    <div className="flex items-center gap-3 mb-4">
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-blue-600" />
        <div className="w-0.5 h-10 bg-gray-200" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-gray-900">{trip.startLocation}</p>
        <div className="h-6" />
        <p className="text-sm font-bold text-gray-900">{trip.endLocation}</p>
      </div>
    </div>

    {/* Stats Row */}
    <div className="grid grid-cols-4 gap-2 pt-4 border-t border-gray-100">
      <div>
        <p className="text-xs text-gray-400 mb-1">Distance</p>
        <p className="text-sm font-bold text-gray-900">{trip.distance} km</p>
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">Duration</p>
        <p className="text-sm font-bold text-gray-900">{trip.duration}</p>
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">Energy</p>
        <p className="text-sm font-bold text-gray-900">{trip.energy} kWh</p>
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">Efficiency</p>
        <p className="text-sm font-bold text-green-600">{trip.efficiency} Wh/km</p>
      </div>
    </div>
  </div>
</div>
```

### 10.4 Energy Dashboard

```jsx
// EnergyDashboard.jsx
<div className="space-y-6">
  {/* Main Chart */}
  <div className="bg-white rounded-3xl p-5 border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-gray-900">Energy Consumption</h3>
      <div className="flex gap-2">
        {['Week', 'Month', 'Year'].map(period => (
          <button className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            activePeriod === period
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {period}
          </button>
        ))}
      </div>
    </div>

    {/* Chart Area */}
    <div className="h-48">
      <AreaChart data={energyData} />
    </div>

    {/* Legend */}
    <div className="flex items-center justify-center gap-6 mt-4">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-blue-500" />
        <span className="text-xs font-medium text-gray-600">Driving</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-xs font-medium text-gray-600">Charging</span>
      </div>
    </div>
  </div>

  {/* Stats Grid */}
  <div className="grid grid-cols-2 gap-4">
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
      <p className="text-blue-100 text-xs font-bold uppercase mb-1">Total Consumed</p>
      <p className="text-3xl font-black">{totalConsumed} kWh</p>
    </div>
    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white">
      <p className="text-green-100 text-xs font-bold uppercase mb-1">Total Charged</p>
      <p className="text-3xl font-black">{totalCharged} kWh</p>
    </div>
  </div>

  {/* Efficiency Card */}
  <div className="bg-white rounded-3xl p-5 border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Average Efficiency</p>
        <p className="text-2xl font-black text-gray-900">{avgEfficiency} <span className="text-sm font-medium text-gray-400">Wh/km</span></p>
      </div>
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
        <span className="text-2xl">🌱</span>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-gray-100">
      <p className="text-sm text-gray-600">
        <span className="text-emerald-600 font-bold">Great!</span> You're {percentBetter}% more efficient than average VF8 drivers.
      </p>
    </div>
  </div>
</div>
```

### 10.5 Range Calculator

```jsx
// RangeCalculator.jsx
<div className="bg-white rounded-3xl p-5 border border-gray-100">
  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
    <CalculatorIcon className="w-6 h-6 text-blue-600" />
    Range Calculator
  </h3>

  {/* Current Stats */}
  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl mb-6">
    <div>
      <p className="text-xs text-blue-600 font-bold uppercase mb-1">Current Range</p>
      <p className="text-3xl font-black text-blue-700">{currentRange} <span className="text-sm">km</span></p>
    </div>
    <div className="text-right">
      <p className="text-xs text-blue-600 font-bold uppercase mb-1">Battery</p>
      <p className="text-3xl font-black text-blue-700">{battery}%</p>
    </div>
  </div>

  {/* Adjustments */}
  <div className="space-y-4">
    {/* Speed */}
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">Avg. Speed</span>
        <span className="text-sm font-bold text-gray-900">{speed} km/h</span>
      </div>
      <input
        type="range"
        min="30" max="150"
        value={speed}
        className="w-full accent-blue-600"
      />
    </div>

    {/* AC */}
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
      <span className="text-sm font-medium text-gray-600">Air Conditioning</span>
      <Toggle checked={acOn} onChange={setAcOn} />
    </div>

    {/* Weather Impact */}
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-2">
        <WeatherIcon code={weatherCode} className="w-5 h-5" />
        <span className="text-sm font-medium text-gray-600">Weather Impact</span>
      </div>
      <span className="text-sm font-bold text-amber-600">-{weatherImpact}%</span>
    </div>
  </div>

  {/* Calculated Range */}
  <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white">
    <p className="text-emerald-100 text-xs font-bold uppercase mb-1">Estimated Range</p>
    <p className="text-4xl font-black">{estimatedRange} km</p>
    <p className="text-sm text-emerald-100 mt-1">Based on your settings and current conditions</p>
  </div>
</div>
```

---

## 11. Mobile Navigation - Enhanced

### New Tab Structure
```jsx
const tabs = [
  { id: 'vehicle', label: 'Vehicle', icon: CarIcon },
  { id: 'energy', label: 'Energy', icon: BoltIcon },
  { id: 'status', label: 'Status', icon: ShieldIcon },
  { id: 'location', label: 'Location', icon: MapIcon },
  { id: 'more', label: 'More', icon: GridIcon }, // Opens bottom sheet
];

// "More" bottom sheet options
const moreOptions = [
  { id: 'charging', label: 'Charging Stations', icon: ChargingIcon },
  { id: 'trips', label: 'Trip History', icon: RouteIcon },
  { id: 'stats', label: 'Energy Stats', icon: ChartIcon },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];
```

### Bottom Sheet for More Options
```jsx
<BottomSheet open={showMore} onClose={() => setShowMore(false)}>
  <div className="grid grid-cols-4 gap-4 p-4">
    {moreOptions.map(option => (
      <button
        key={option.id}
        onClick={() => navigateTo(option.id)}
        className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-gray-50 transition-colors"
      >
        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
          <option.icon className="w-7 h-7 text-blue-600" />
        </div>
        <span className="text-xs font-bold text-gray-700">{option.label}</span>
      </button>
    ))}
  </div>
</BottomSheet>
```

---

## 12. Responsive Breakpoints

```css
/* Mobile First */
@media (min-width: 640px)  { /* sm - Large phones */ }
@media (min-width: 768px)  { /* md - Tablets */ }
@media (min-width: 1024px) { /* lg - Small laptops */ }
@media (min-width: 1280px) { /* xl - Desktops */ }
@media (min-width: 1536px) { /* 2xl - Large screens */ }
```

### Key Responsive Changes

| Element | Mobile (<768) | Tablet (768-1024) | Desktop (≥1024) |
|---------|---------------|-------------------|-----------------|
| Layout | Single column, tabs | 2 columns | 3 columns, grid |
| Navigation | Bottom tab bar | Bottom tab bar | Sidebar/Header |
| Cards | Full width, stack | 2-up grid | Fixed positions |
| Font sizes | Base | +10% | +15% |
| Spacing | Compact | Normal | Generous |

---

## 13. Accessibility Guidelines

### Touch Targets
- Minimum 44x44px for all interactive elements
- 8px minimum spacing between targets

### Color Contrast
- Text: minimum 4.5:1 contrast ratio
- Large text (18px+): minimum 3:1 contrast ratio
- Icons with meaning: minimum 3:1 contrast ratio

### Focus States
```css
.focus-ring {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
```

### Screen Reader Support
- All images have alt text
- Icons have aria-labels
- Form inputs have labels
- Status changes are announced

---

## 14. Performance Guidelines

### Loading States
```jsx
// Skeleton loading
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
  <div className="h-4 bg-gray-200 rounded w-1/2" />
</div>
```

### Image Optimization
- Use WebP format
- Implement lazy loading
- Provide appropriate sizes via srcset

### Animation Performance
- Use transform and opacity only
- Avoid animating layout properties
- Use will-change sparingly

---

## 15. Implementation Priority

### Phase 1: Foundation
1. [ ] Update Design Tokens (colors, typography, spacing)
2. [ ] Refactor existing cards with new design system
3. [ ] Implement enhanced Mobile Navigation

### Phase 2: Core Features
4. [ ] Charging Stations Map
5. [ ] Charging History
6. [ ] Range Calculator

### Phase 3: Advanced Features
7. [ ] Trip History
8. [ ] Energy Dashboard
9. [ ] Notifications Center

### Phase 4: Polish
10. [ ] Dark Mode
11. [ ] Animations & Micro-interactions
12. [ ] PWA enhancements

---

**Document maintained by:** VFDashboard Design Team
**Last updated:** January 2026
