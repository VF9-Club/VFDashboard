import React, { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import {
  tripStore,
  fetchTrips,
  loadMoreTrips,
  hasMoreTrips,
  drivingScore,
} from "../../stores/tripStore";
import StatCard from "../ui/StatCard";

// Icons
const RouteIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const SpeedIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const LeafIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

// Daily Driving Card Component (renamed from TripCard since VinFast only provides daily summaries)
function DrivingDayCard({ trip }) {
  const formatDate = (date) => {
    if (!date) return "Unknown";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "Unknown";

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const formatDuration = (mins) => {
    if (!mins) return "--";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m} min`;
  };

  const getEfficiencyColor = (eff) => {
    if (!eff || eff === 0) return "text-gray-400 bg-gray-50";
    if (eff < 200) return "text-emerald-600 bg-emerald-50";
    if (eff < 250) return "text-blue-600 bg-blue-50";
    return "text-amber-600 bg-amber-50";
  };

  const getEfficiencyLabel = (eff) => {
    if (!eff || eff === 0) return "No data";
    if (eff < 200) return "Excellent";
    if (eff < 230) return "Good";
    if (eff < 260) return "Average";
    return "High";
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm transition-all">
      {/* Date Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <span className="text-lg">🚗</span>
          </div>
          <div>
            <span className="text-sm font-bold text-gray-900">
              {formatDate(trip.date)}
            </span>
            <p className="text-xs text-gray-500">Daily Summary</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getEfficiencyColor(trip.efficiency)}`}>
          {trip.efficiency > 0 ? `${trip.efficiency} Wh/km` : "--"}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mt-3">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-gray-900">{trip.distance}</p>
          <p className="text-[10px] text-gray-500 font-bold uppercase">km</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-blue-600">{trip.energyConsumed}</p>
          <p className="text-[10px] text-blue-600 font-bold uppercase">kWh</p>
        </div>
        <div className={`rounded-xl p-3 text-center ${trip.efficiency > 0 ? (trip.efficiency < 230 ? 'bg-emerald-50' : 'bg-amber-50') : 'bg-gray-50'}`}>
          <p className={`text-sm font-black ${trip.efficiency > 0 ? (trip.efficiency < 230 ? 'text-emerald-600' : 'text-amber-600') : 'text-gray-400'}`}>
            {getEfficiencyLabel(trip.efficiency)}
          </p>
          <p className="text-[10px] text-gray-500 font-bold uppercase">Efficiency</p>
        </div>
      </div>
    </div>
  );
}

// Main TripHistory Component
export default function TripHistory({ isFullScreen = false, onClose }) {
  const tripState = useStore(tripStore);
  const hasMore = useStore(hasMoreTrips);
  const score = useStore(drivingScore);
  const [filter, setFilter] = useState("all");

  // Fetch trips on mount
  useEffect(() => {
    fetchTrips();
  }, []);

  const { trips, loading, error, totalDistance, totalEnergy, avgEfficiency, tripCount } = tripState;

  const handleLoadMore = () => {
    loadMoreTrips();
  };

  const handleRefresh = () => {
    fetchTrips(null, null, 0, true);
  };

  return (
    <div className={`flex flex-col h-full ${isFullScreen ? "fixed inset-0 z-50 bg-gray-50" : ""}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
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
                <RouteIcon className="w-5 h-5 text-blue-600" />
                Driving History
              </h2>
              <p className="text-xs text-gray-500">{tripCount} days with driving</p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {["all", "week", "month"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  filter === f
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {f === "all" ? "All" : f === "week" ? "Week" : "Month"}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-2">
          <StatCard
            label="Distance"
            value={totalDistance || 0}
            unit="km"
            variant="blue"
            size="sm"
            icon={<RouteIcon />}
          />
          <StatCard
            label="Trips"
            value={tripCount || 0}
            variant="gray"
            size="sm"
          />
          <StatCard
            label="Energy"
            value={totalEnergy || 0}
            unit="kWh"
            variant="amber"
            size="sm"
            icon={<SpeedIcon />}
          />
          <StatCard
            label="Efficiency"
            value={avgEfficiency || 0}
            unit="Wh/km"
            variant="green"
            size="sm"
            icon={<LeafIcon />}
          />
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

      {/* Trips List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-gray-50">
        {loading && trips.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium text-gray-600">Loading trips...</p>
          </div>
        ) : trips.length === 0 && !error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RouteIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No driving data yet</p>
            <p className="text-sm text-gray-400 mt-1">Your daily driving summaries will appear here</p>
          </div>
        ) : (
          <>
            {trips.map((trip) => (
              <DrivingDayCard key={trip.id} trip={trip} />
            ))}
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="w-full py-3 text-center text-blue-600 font-bold hover:bg-blue-50 rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            )}
          </>
        )}
      </div>

      {/* Driving Score */}
      <div className="bg-white border-t border-gray-100 p-4">
        <div className={`rounded-2xl p-4 text-white ${
          score >= 85 ? "bg-gradient-to-r from-emerald-500 to-teal-500" :
          score >= 70 ? "bg-gradient-to-r from-blue-500 to-cyan-500" :
          "bg-gradient-to-r from-amber-500 to-orange-500"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs font-bold uppercase">Driving Score</p>
              <p className="text-3xl font-black mt-1">{score}<span className="text-lg">/100</span></p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">{score >= 85 ? "🌱" : score >= 70 ? "👍" : "💡"}</span>
            </div>
          </div>
          <p className="text-sm text-white/80 mt-2">
            {score >= 85 ? "Excellent! Your driving style is highly efficient." :
             score >= 70 ? "Good! You're driving efficiently." :
             "Keep improving your efficiency for better range."}
          </p>
        </div>
      </div>
    </div>
  );
}

// Compact version for dashboard
export function TripHistoryCompact({ onExpand }) {
  const tripState = useStore(tripStore);

  // Fetch on mount if not already loaded
  useEffect(() => {
    if (tripState.trips.length === 0 && !tripState.loading) {
      fetchTrips();
    }
  }, []);

  const recentTrip = tripState.trips[0];

  const formatDuration = (mins) => {
    if (!mins) return "--";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m} min`;
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <RouteIcon className="w-5 h-5 text-blue-600" />
          Recent Driving
        </h3>
        <button
          onClick={onExpand}
          className="text-sm font-bold text-blue-600 hover:text-blue-700"
        >
          View All →
        </button>
      </div>

      {tripState.loading && tripState.trips.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : recentTrip ? (
        <>
          {/* Date Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <span className="text-lg">🚗</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                {recentTrip.date ? new Date(recentTrip.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "Recent"}
              </p>
              <p className="text-xs text-gray-500">Daily Summary</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
            <div className="text-center">
              <p className="text-lg font-black text-gray-900">{recentTrip.distance || 0}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">km</p>
            </div>
            <div className="text-center border-x border-gray-100">
              <p className="text-lg font-black text-blue-600">{recentTrip.energyConsumed || 0}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">kWh</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-black text-emerald-600">{recentTrip.efficiency || "--"}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Wh/km</p>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">No driving data yet</p>
        </div>
      )}
    </div>
  );
}
