import React, { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { vehicleStore } from "../../stores/vehicleStore";
import {
  energyStore,
  fetchEnergyStats,
  setPeriod,
  efficiencyRating,
  treesEquivalent,
  estimatedCost,
} from "../../stores/energyStore";
import StatCard from "../ui/StatCard";

// Simple Bar Chart Component
function EnergyChart({ data, period }) {
  const maxValue = Math.max(...data.map(d => Math.max(d.consumed, d.charged)));

  return (
    <div className="h-48 flex items-end justify-between gap-2 px-2">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-1">
          {/* Bars Container */}
          <div className="w-full h-40 flex items-end justify-center gap-1">
            {/* Consumed Bar */}
            <div
              className="w-3 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm transition-all duration-500"
              style={{ height: `${(item.consumed / maxValue) * 100}%` }}
              title={`Consumed: ${item.consumed} kWh`}
            />
            {/* Charged Bar */}
            {item.charged > 0 && (
              <div
                className="w-3 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-sm transition-all duration-500"
                style={{ height: `${(item.charged / maxValue) * 100}%` }}
                title={`Charged: ${item.charged} kWh`}
              />
            )}
          </div>
          {/* Label */}
          <span className="text-[10px] font-bold text-gray-400">{item.date}</span>
        </div>
      ))}
    </div>
  );
}

// Efficiency Gauge Component
function EfficiencyGauge({ value, target = 250 }) {
  const percentage = Math.min((value / target) * 100, 100);
  const isGood = value < 230;
  const color = isGood ? "text-emerald-600" : value < 260 ? "text-blue-600" : "text-amber-600";
  const bgColor = isGood ? "stroke-emerald-500" : value < 260 ? "stroke-blue-500" : "stroke-amber-500";

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background */}
        <circle
          cx="50" cy="50" r="42"
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="8"
        />
        {/* Progress */}
        <circle
          cx="50" cy="50" r="42"
          fill="none"
          className={bgColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${percentage * 2.64} 264`}
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-black ${color}`}>{value}</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase">Wh/km</span>
      </div>
    </div>
  );
}

// Icons
const BoltIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const LeafIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

// Main EnergyDashboard Component
export default function EnergyDashboard({ isFullScreen = false, onClose }) {
  const vehicle = useStore(vehicleStore);
  const energy = useStore(energyStore);
  const rating = useStore(efficiencyRating);
  const trees = useStore(treesEquivalent);
  const cost = useStore(estimatedCost);

  // Fetch energy stats on mount
  useEffect(() => {
    fetchEnergyStats(energy.period);
  }, []);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  const handleRefresh = () => {
    fetchEnergyStats(energy.period, true);
  };

  const { totalConsumed, totalCharged, avgEfficiency, co2Saved, daily, loading, error, period } = energy;

  return (
    <div className={`flex flex-col h-full ${isFullScreen ? "fixed inset-0 z-50 bg-gray-50" : ""}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isFullScreen && onClose && (
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BoltIcon className="w-5 h-5 text-blue-600" />
                Energy Dashboard
              </h2>
              <p className="text-xs text-gray-500">Track your energy consumption</p>
            </div>
          </div>

          {/* Period Toggle */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {["week", "month"].map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                disabled={loading}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                  period === p
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                } disabled:opacity-50`}
              >
                {p === "week" ? "Week" : "Month"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-2 text-blue-600 font-medium hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {loading && daily.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium text-gray-600">Loading energy stats...</p>
          </div>
        ) : (
          <>
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
            <p className="text-blue-100 text-[10px] font-bold uppercase tracking-wider">Consumed</p>
            <p className="text-3xl font-black mt-1">{totalConsumed || 0}</p>
            <p className="text-blue-200 text-xs font-medium">kWh</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 text-white">
            <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-wider">Charged</p>
            <p className="text-3xl font-black mt-1">{totalCharged || 0}</p>
            <p className="text-emerald-200 text-xs font-medium">kWh</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Daily Breakdown</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-xs font-medium text-gray-500">Consumed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-gray-500">Charged</span>
              </div>
            </div>
          </div>
          <EnergyChart data={daily.length > 0 ? daily : []} period={period} />
        </div>

        {/* Efficiency Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5">
          <h3 className="font-bold text-gray-900 mb-4">Average Efficiency</h3>
          <div className="flex items-center gap-6">
            <EfficiencyGauge value={avgEfficiency || 0} />
            <div className="flex-1">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Your efficiency</span>
                    <span className="font-bold text-gray-900">{avgEfficiency || 0} Wh/km</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((250 - (avgEfficiency || 250)) / 100 * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {rating === "excellent" ? (
                    <span className="text-emerald-600 font-bold">Excellent!</span>
                  ) : rating === "good" ? (
                    <span className="text-blue-600 font-bold">Good!</span>
                  ) : rating === "average" ? (
                    <span className="text-amber-600 font-bold">Average</span>
                  ) : rating === "needs_improvement" ? (
                    <span className="text-red-600 font-bold">Needs improvement</span>
                  ) : (
                    <span className="text-gray-600 font-bold">No data</span>
                  )}{" "}
                  {avgEfficiency > 0 && `You're ${(avgEfficiency || 250) < 245 ? "more" : "less"} efficient than the average VF8 driver.`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-100 p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
              <span className="text-3xl">🌍</span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">CO₂ Saved</p>
              <p className="text-2xl font-black text-gray-900">{co2Saved || 0} <span className="text-sm font-medium text-gray-500">kg</span></p>
              <p className="text-sm text-gray-600 mt-1">
                Equivalent to planting <span className="font-bold text-emerald-600">{trees || 0}</span> trees 🌳
              </p>
            </div>
          </div>
        </div>

        {/* Cost Estimation */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5">
          <h3 className="font-bold text-gray-900 mb-3">Cost Estimation</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <p className="text-[10px] font-bold text-blue-600 uppercase">At Home (2,500₫/kWh)</p>
              <p className="text-xl font-black text-gray-900 mt-1">
                {((totalCharged || 0) * 2500).toLocaleString()}₫
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <p className="text-[10px] font-bold text-amber-600 uppercase">Public (3,000₫/kWh)</p>
              <p className="text-xl font-black text-gray-900 mt-1">
                {((totalCharged || 0) * 3000).toLocaleString()}₫
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            * Estimated based on average electricity rates
          </p>
        </div>
          </>
        )}
      </div>
    </div>
  );
}

// Compact version for dashboard
export function EnergyDashboardCompact({ onExpand }) {
  const energy = useStore(energyStore);
  const rating = useStore(efficiencyRating);

  // Fetch on mount if not already loaded
  useEffect(() => {
    if (energy.daily.length === 0 && !energy.loading) {
      fetchEnergyStats();
    }
  }, []);

  const { totalConsumed, totalCharged, avgEfficiency, loading } = energy;

  const getRatingLabel = () => {
    switch (rating) {
      case "excellent": return "Excellent";
      case "good": return "Good";
      case "average": return "Average";
      case "needs_improvement": return "Improve";
      default: return "No data";
    }
  };

  const getRatingColor = () => {
    switch (rating) {
      case "excellent": return "text-emerald-600";
      case "good": return "text-blue-600";
      case "average": return "text-amber-600";
      case "needs_improvement": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <BoltIcon className="w-5 h-5 text-blue-600" />
          Energy Stats
        </h3>
        <button
          onClick={onExpand}
          className="text-sm font-bold text-blue-600 hover:text-blue-700"
        >
          Details →
        </button>
      </div>

      {loading && energy.daily.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Mini Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <p className="text-[10px] font-bold text-blue-600 uppercase">Consumed</p>
              <p className="text-xl font-black text-gray-900">{totalConsumed || 0} <span className="text-xs text-gray-400">kWh</span></p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <p className="text-[10px] font-bold text-emerald-600 uppercase">Charged</p>
              <p className="text-xl font-black text-gray-900">{totalCharged || 0} <span className="text-xs text-gray-400">kWh</span></p>
            </div>
          </div>

          {/* Efficiency */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Efficiency</p>
              <p className={`text-lg font-black ${getRatingColor()}`}>{avgEfficiency || 0} Wh/km</p>
            </div>
            <div className={`flex items-center gap-1 ${getRatingColor()}`}>
              <LeafIcon className="w-5 h-5" />
              <span className="text-sm font-bold">{getRatingLabel()}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
