import React, { useState, useMemo } from "react";
import { useStore } from "@nanostores/react";
import { vehicleStore } from "../../stores/vehicleStore";

// Range calculation factors
const RANGE_FACTORS = {
  // Speed impact (km/h -> efficiency multiplier)
  speed: {
    30: 0.85,  // City driving, very efficient
    50: 0.90,  // Urban
    70: 0.95,  // Highway mild
    90: 1.00,  // Reference
    110: 1.10, // Highway fast
    130: 1.25, // Highway very fast
    150: 1.45, // Autobahn
  },
  // AC impact
  ac: {
    off: 0,
    eco: 0.05,  // 5% reduction
    normal: 0.08,
    max: 0.12,
  },
  // Weather impact
  weather: {
    sunny: 0,
    cloudy: 0.02,
    rain: 0.05,
    snow: 0.15,
    cold: 0.20, // Below 5°C
    hot: 0.10,  // Above 35°C
  },
  // Terrain
  terrain: {
    flat: 0,
    hilly: 0.10,
    mountain: 0.20,
  },
  // Load
  load: {
    light: -0.02, // Slight bonus
    normal: 0,
    heavy: 0.08,
    full: 0.15,
  },
};

// Icons
const CalculatorIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const SpeedIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

// Toggle Component
function Toggle({ checked, onChange, label }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
    >
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-blue-600" : "bg-gray-300"}`}>
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
    </button>
  );
}

// Slider Component
function Slider({ value, onChange, min, max, step = 1, label, unit, marks }) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className="text-sm font-bold text-gray-900">
          {value} {unit}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          style={{
            background: `linear-gradient(to right, #2563eb 0%, #2563eb ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
        />
        {marks && (
          <div className="flex justify-between mt-1 px-1">
            {marks.map((mark) => (
              <span key={mark} className="text-[10px] text-gray-400 font-medium">
                {mark}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Select Component
function Select({ value, onChange, options, label }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <div className="grid grid-cols-4 gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-2 py-2 rounded-lg text-xs font-bold transition-all ${
              value === opt.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Main RangeCalculator Component
export default function RangeCalculator({ isCompact = false, onExpand }) {
  const vehicle = useStore(vehicleStore);

  // Current vehicle data
  const currentBattery = vehicle.battery_level || 80;
  const currentRange = vehicle.range || 320;
  const batteryCapacity = 87.7; // kWh for VF8 (adjust based on model)

  // Calculator state
  const [speed, setSpeed] = useState(90);
  const [acMode, setAcMode] = useState("normal");
  const [weather, setWeather] = useState("sunny");
  const [terrain, setTerrain] = useState("flat");
  const [load, setLoad] = useState("normal");

  // Calculate estimated range
  const estimatedRange = useMemo(() => {
    // Base consumption (Wh/km at reference speed)
    const baseConsumption = 200; // Wh/km

    // Speed factor (interpolate between known values)
    const speeds = Object.keys(RANGE_FACTORS.speed).map(Number).sort((a, b) => a - b);
    let speedFactor = 1;
    for (let i = 0; i < speeds.length - 1; i++) {
      if (speed >= speeds[i] && speed <= speeds[i + 1]) {
        const ratio = (speed - speeds[i]) / (speeds[i + 1] - speeds[i]);
        speedFactor = RANGE_FACTORS.speed[speeds[i]] + ratio * (RANGE_FACTORS.speed[speeds[i + 1]] - RANGE_FACTORS.speed[speeds[i]]);
        break;
      }
    }
    if (speed <= speeds[0]) speedFactor = RANGE_FACTORS.speed[speeds[0]];
    if (speed >= speeds[speeds.length - 1]) speedFactor = RANGE_FACTORS.speed[speeds[speeds.length - 1]];

    // Other factors
    const acFactor = 1 + RANGE_FACTORS.ac[acMode];
    const weatherFactor = 1 + RANGE_FACTORS.weather[weather];
    const terrainFactor = 1 + RANGE_FACTORS.terrain[terrain];
    const loadFactor = 1 + RANGE_FACTORS.load[load];

    // Total consumption
    const totalConsumption = baseConsumption * speedFactor * acFactor * weatherFactor * terrainFactor * loadFactor;

    // Available energy (kWh)
    const availableEnergy = (currentBattery / 100) * batteryCapacity;

    // Estimated range (km)
    const range = Math.round((availableEnergy * 1000) / totalConsumption);

    return {
      range,
      consumption: Math.round(totalConsumption),
      factors: {
        speed: Math.round((speedFactor - 1) * 100),
        ac: Math.round(RANGE_FACTORS.ac[acMode] * 100),
        weather: Math.round(RANGE_FACTORS.weather[weather] * 100),
        terrain: Math.round(RANGE_FACTORS.terrain[terrain] * 100),
        load: Math.round(RANGE_FACTORS.load[load] * 100),
      },
    };
  }, [speed, acMode, weather, terrain, load, currentBattery]);

  // Compact version
  if (isCompact) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <CalculatorIcon className="w-5 h-5 text-blue-600" />
            Range Calculator
          </h3>
          <button
            onClick={onExpand}
            className="text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            Open →
          </button>
        </div>

        {/* Current Status */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
          <div>
            <p className="text-[10px] text-blue-600 font-bold uppercase">Current Range</p>
            <p className="text-3xl font-black text-blue-700">{currentRange} <span className="text-sm">km</span></p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-blue-600 font-bold uppercase">Battery</p>
            <p className="text-3xl font-black text-blue-700">{currentBattery}%</p>
          </div>
        </div>

        {/* Quick Estimate */}
        <div className="mt-4 p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white">
          <p className="text-emerald-100 text-[10px] font-bold uppercase">At {speed} km/h</p>
          <p className="text-3xl font-black">{estimatedRange.range} km</p>
        </div>
      </div>
    );
  }

  // Full version
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <CalculatorIcon className="w-6 h-6 text-blue-600" />
          Range Calculator
        </h3>
        <p className="text-sm text-gray-500 mt-1">Estimate your range based on driving conditions</p>
      </div>

      {/* Current Stats */}
      <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-blue-600 font-bold uppercase">Current Range</p>
            <p className="text-4xl font-black text-blue-700">{currentRange} <span className="text-lg font-bold">km</span></p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-blue-600 font-bold uppercase">Battery Level</p>
            <p className="text-4xl font-black text-blue-700">{currentBattery}<span className="text-lg font-bold">%</span></p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-5 space-y-5">
        {/* Speed */}
        <Slider
          label="Average Speed"
          value={speed}
          onChange={setSpeed}
          min={30}
          max={150}
          step={10}
          unit="km/h"
          marks={["30", "70", "110", "150"]}
        />

        {/* AC Mode */}
        <Select
          label="Air Conditioning"
          value={acMode}
          onChange={setAcMode}
          options={[
            { value: "off", label: "Off" },
            { value: "eco", label: "Eco" },
            { value: "normal", label: "Normal" },
            { value: "max", label: "Max" },
          ]}
        />

        {/* Weather */}
        <Select
          label="Weather Conditions"
          value={weather}
          onChange={setWeather}
          options={[
            { value: "sunny", label: "☀️ Sunny" },
            { value: "cloudy", label: "☁️ Cloudy" },
            { value: "rain", label: "🌧️ Rain" },
            { value: "cold", label: "❄️ Cold" },
          ]}
        />

        {/* Terrain */}
        <Select
          label="Terrain"
          value={terrain}
          onChange={setTerrain}
          options={[
            { value: "flat", label: "Flat" },
            { value: "hilly", label: "Hilly" },
            { value: "mountain", label: "Mountain" },
          ]}
        />

        {/* Load */}
        <Select
          label="Vehicle Load"
          value={load}
          onChange={setLoad}
          options={[
            { value: "light", label: "Light" },
            { value: "normal", label: "Normal" },
            { value: "heavy", label: "Heavy" },
            { value: "full", label: "Full" },
          ]}
        />
      </div>

      {/* Impact Breakdown */}
      <div className="px-5 pb-2">
        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Impact Factors</p>
        <div className="flex flex-wrap gap-2">
          {estimatedRange.factors.speed !== 0 && (
            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
              estimatedRange.factors.speed > 0 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
            }`}>
              Speed: {estimatedRange.factors.speed > 0 ? "+" : ""}{estimatedRange.factors.speed}%
            </span>
          )}
          {estimatedRange.factors.ac > 0 && (
            <span className="px-2 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-600">
              AC: -{estimatedRange.factors.ac}%
            </span>
          )}
          {estimatedRange.factors.weather > 0 && (
            <span className="px-2 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-600">
              Weather: -{estimatedRange.factors.weather}%
            </span>
          )}
          {estimatedRange.factors.terrain > 0 && (
            <span className="px-2 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-600">
              Terrain: -{estimatedRange.factors.terrain}%
            </span>
          )}
        </div>
      </div>

      {/* Result */}
      <div className="p-5">
        <div className="p-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-[10px] font-bold uppercase">Estimated Range</p>
              <p className="text-5xl font-black">{estimatedRange.range} <span className="text-xl">km</span></p>
            </div>
            <div className="text-right">
              <p className="text-emerald-100 text-[10px] font-bold uppercase">Efficiency</p>
              <p className="text-2xl font-black">{estimatedRange.consumption} <span className="text-sm">Wh/km</span></p>
            </div>
          </div>
          <p className="text-sm text-emerald-100 mt-3">
            Based on your settings and {currentBattery}% battery charge
          </p>
        </div>
      </div>
    </div>
  );
}
