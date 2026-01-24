import React, { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import {
  chargingStore,
  fetchChargingSessions,
  loadMoreSessions,
  hasMoreSessions,
} from "../../stores/chargingStore";
import StatCard from "../ui/StatCard";

// Icons
const BoltIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const PlugIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18v-6m0 0V8m0 4h4m-4 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WalletIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

// Session Card Component
function SessionCard({ session }) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (date) => {
    if (!date) return { day: "--", month: "---" };
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return { day: "--", month: "---" };
    const day = d.getDate();
    const month = d.toLocaleString("en", { month: "short" }).toUpperCase();
    return { day, month };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount || 0) + "₫";
  };

  const formatDuration = (mins) => {
    if (!mins) return "--";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m} min`;
  };

  const { day, month } = formatDate(session.date);

  return (
    <div
      className={`bg-white rounded-2xl border transition-all ${
        expanded ? "border-blue-200 shadow-md" : "border-gray-100 hover:border-gray-200"
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 flex items-center gap-4"
      >
        {/* Date Column */}
        <div className="w-14 text-center flex-shrink-0">
          <p className="text-2xl font-black text-gray-900 leading-none">{day}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{month}</p>
        </div>

        {/* Divider */}
        <div className="w-px h-12 bg-gray-100" />

        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 truncate">{session.stationName}</p>
          <p className="text-sm text-gray-500 truncate">{session.stationAddress}</p>
          <p className="text-xs text-gray-400 mt-1">
            {session.startTime} - {session.endTime}
          </p>
        </div>

        {/* Energy & Cost */}
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold text-emerald-600">+{session.kWh} kWh</p>
          <p className="text-xs text-gray-400">
            {session.duration > 0 ? formatDuration(session.duration) : session.connectorType || "AC"}
          </p>
        </div>

        {/* Expand Icon */}
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 animate-fade-in">
          <div className="border-t border-gray-100 pt-4 grid grid-cols-4 gap-3">
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Connector</p>
              <p className="text-sm font-bold text-gray-700">{session.connectorType}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Max Power</p>
              <p className="text-sm font-bold text-gray-700">{session.maxPower} kW</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Duration</p>
              <p className="text-sm font-bold text-gray-700">
                {formatDuration(session.duration)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Cost</p>
              <p className="text-sm font-bold text-blue-600">{formatCurrency(session.cost)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main ChargingHistory Component
export default function ChargingHistory({ isFullScreen = false, onClose }) {
  const charging = useStore(chargingStore);
  const hasMore = useStore(hasMoreSessions);
  const [filter, setFilter] = useState("all"); // all, week, month

  // Fetch sessions on mount
  useEffect(() => {
    fetchChargingSessions();
  }, []);

  const { sessions: allSessions, sessionsLoading, sessionsError } = charging;

  // Filter sessions based on selected period
  const getFilteredSessions = () => {
    if (!allSessions || allSessions.length === 0) return [];
    if (filter === "all") return allSessions;

    const now = new Date();
    const cutoff = new Date();

    if (filter === "week") {
      cutoff.setDate(now.getDate() - 7);
    } else if (filter === "month") {
      cutoff.setMonth(now.getMonth() - 1);
    }

    return allSessions.filter(s => {
      if (!s.date) return false;
      const sessionDate = s.date instanceof Date ? s.date : new Date(s.date);
      return sessionDate >= cutoff;
    });
  };

  const sessions = getFilteredSessions();

  // Calculate stats from filtered sessions
  const totalKwh = sessions.reduce((sum, s) => sum + (s.kWh || 0), 0);
  const totalCost = sessions.reduce((sum, s) => sum + (s.cost || 0), 0);
  const sessionCount = sessions.length;
  const avgCostPerKwh = totalKwh > 0 ? Math.round(totalCost / totalKwh) : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount || 0);
  };

  const handleLoadMore = () => {
    loadMoreSessions();
  };

  const handleRefresh = () => {
    fetchChargingSessions(0, true);
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
              <h2 className="text-lg font-bold text-gray-900">Charging History</h2>
              <p className="text-xs text-gray-500">{sessionCount} sessions this month</p>
            </div>
          </div>

          {/* Filter Pills */}
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
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="Total Energy"
            value={totalKwh || 0}
            unit="kWh"
            variant="green"
            size="sm"
            icon={<BoltIcon />}
          />
          <StatCard
            label="Sessions"
            value={sessionCount || 0}
            variant="blue"
            size="sm"
            icon={<PlugIcon />}
          />
          <StatCard
            label="Total Cost"
            value={formatCurrency(totalCost || 0)}
            unit="₫"
            variant="amber"
            size="sm"
            icon={<WalletIcon />}
          />
        </div>
      </div>

      {/* Error State */}
      {sessionsError && (
        <div className="p-4 text-center">
          <p className="text-red-500 font-medium">{sessionsError}</p>
          <button
            onClick={handleRefresh}
            className="mt-2 text-blue-600 font-medium hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-gray-50">
        {sessionsLoading && sessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium text-gray-600">Loading sessions...</p>
          </div>
        ) : sessions.length === 0 && !sessionsError ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BoltIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No charging sessions yet</p>
            <p className="text-sm text-gray-400 mt-1">Your charging history will appear here</p>
          </div>
        ) : (
          <>
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={sessionsLoading}
                className="w-full py-3 text-center text-blue-600 font-bold hover:bg-blue-50 rounded-xl transition-colors disabled:opacity-50"
              >
                {sessionsLoading ? "Loading..." : "Load More"}
              </button>
            )}
          </>
        )}
      </div>

      {/* Bottom Summary */}
      <div className="bg-white border-t border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Average cost</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(avgCostPerKwh)}₫/kWh</p>
          </div>
          <button className="btn-primary text-sm">
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}

// Compact version for dashboard
export function ChargingHistoryCompact({ onExpand }) {
  const charging = useStore(chargingStore);

  // Fetch on mount if not already loaded
  useEffect(() => {
    if (charging.sessions.length === 0 && !charging.sessionsLoading) {
      fetchChargingSessions();
    }
  }, []);

  const recentSession = charging.sessions[0];
  const { totalKwh, sessionCount, totalCost } = charging;

  const formatDate = (date) => {
    if (!date) return { day: "--", month: "---" };
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return { day: "--", month: "---" };
    return {
      day: d.getDate(),
      month: d.toLocaleString("en", { month: "short" }).toUpperCase(),
    };
  };

  const formatCost = (amount) => {
    if (!amount) return "0";
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${Math.round(amount / 1000)}k`;
    return amount.toString();
  };

  const { day, month } = recentSession ? formatDate(recentSession.date) : { day: "--", month: "---" };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Recent Charge</h3>
        <button
          onClick={onExpand}
          className="text-sm font-bold text-blue-600 hover:text-blue-700"
        >
          History →
        </button>
      </div>

      {charging.sessionsLoading && charging.sessions.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : recentSession ? (
        <>
          <div className="flex items-center gap-4">
            {/* Date */}
            <div className="w-14 text-center flex-shrink-0">
              <p className="text-2xl font-black text-gray-900 leading-none">{day}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{month}</p>
            </div>

            <div className="w-px h-12 bg-gray-100" />

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 truncate text-sm">{recentSession.stationName}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-bold text-emerald-600">+{recentSession.kWh || 0} kWh</span>
                {recentSession.finalAmount === 0 ? (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">FREE</span>
                ) : (
                  <span className="text-sm text-gray-400">{recentSession.connectorType || "AC"}</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-lg font-black text-gray-900">{totalKwh || 0}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">kWh Total</p>
            </div>
            <div className="text-center border-x border-gray-100">
              <p className="text-lg font-black text-gray-900">{sessionCount || 0}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-black text-blue-600">{formatCost(totalCost)}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">₫ Cost</p>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">No charging sessions yet</p>
        </div>
      )}
    </div>
  );
}
