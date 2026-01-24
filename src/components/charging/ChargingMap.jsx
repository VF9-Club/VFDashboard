import React, { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { vehicleStore } from "../../stores/vehicleStore";
import {
  chargingStore,
  fetchChargingStations,
  selectStation,
} from "../../stores/chargingStore";
import BottomSheet from "../ui/BottomSheet";

// Icons
const ChargingIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const NavigateIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const RefreshIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// Station Card Component
function StationCard({ station, isSelected, onSelect, onNavigate }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "available": return "bg-emerald-500";
      case "busy": return "bg-amber-500";
      case "offline": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const getAvailabilityColor = (available, total) => {
    if (total === 0) return "text-gray-500";
    const ratio = available / total;
    if (ratio > 0.5) return "text-emerald-600";
    if (ratio > 0.2) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <button
      onClick={() => onSelect(station)}
      className={`w-full text-left p-4 rounded-2xl border transition-all ${
        isSelected
          ? "bg-blue-50 border-blue-200 shadow-md"
          : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Status Icon */}
        <div className="relative">
          <div className={`w-12 h-12 rounded-xl ${
            station.availableConnectors > 0 ? "bg-emerald-100" : "bg-amber-100"
          } flex items-center justify-center`}>
            <ChargingIcon className={`w-6 h-6 ${
              station.availableConnectors > 0 ? "text-emerald-600" : "text-amber-600"
            }`} />
          </div>
          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(station.status)} border-2 border-white`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 truncate">{station.name}</h4>
          <p className="text-sm text-gray-500 truncate mt-0.5">{station.address}</p>

          {/* Stats Row */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className={`text-sm font-bold ${getAvailabilityColor(station.availableConnectors, station.totalConnectors)}`}>
              {station.availableConnectors}/{station.totalConnectors} available
            </span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-600">{station.distance?.toFixed(1) || "?"} km</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-600">{station.maxPower} kW</span>
          </div>

          {/* Connector Types */}
          <div className="flex gap-1.5 mt-2">
            {(station.connectorTypes || []).map((type) => (
              <span
                key={type}
                className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-600 uppercase"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Navigate Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(station);
          }}
          className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center shadow-lg transition-all active:scale-95 flex-shrink-0"
          title="Navigate"
        >
          <NavigateIcon className="w-5 h-5 text-white" />
        </button>
      </div>
    </button>
  );
}

// Empty State Component
function EmptyState({ onRetry, loading }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ChargingIcon className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-500 font-medium">No charging stations found</p>
      <p className="text-sm text-gray-400 mt-1">Try a different location or check back later</p>
      <button
        onClick={onRetry}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Searching..." : "Search Again"}
      </button>
    </div>
  );
}

// Main ChargingMap Component
export default function ChargingMap({ isFullScreen = false, onClose }) {
  const vehicle = useStore(vehicleStore);
  const charging = useStore(chargingStore);
  const [showList, setShowList] = useState(true);

  // Get vehicle location
  const vehicleLat = vehicle.latitude || 21.0285;
  const vehicleLng = vehicle.longitude || 105.8542;

  // Fetch stations on mount
  useEffect(() => {
    if (vehicleLat && vehicleLng) {
      fetchChargingStations(vehicleLat, vehicleLng);
    }
  }, [vehicleLat, vehicleLng]);

  const handleNavigate = (station) => {
    const url = `https://www.google.com/maps/dir/${vehicleLat},${vehicleLng}/${station.latitude},${station.longitude}`;
    window.open(url, "_blank");
  };

  const handleRefresh = () => {
    fetchChargingStations(vehicleLat, vehicleLng, true);
  };

  const handleSelectStation = (station) => {
    selectStation(station);
  };

  const { stations, selectedStation, stationsLoading, stationsError } = charging;

  return (
    <div className={`flex flex-col h-full ${isFullScreen ? "fixed inset-0 z-50 bg-white" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
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
              <ChargingIcon className="w-5 h-5 text-green-600" />
              Charging Stations
            </h2>
            <p className="text-xs text-gray-500">
              {stationsLoading ? "Searching..." : `${stations.length} stations nearby`}
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={stationsLoading}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <RefreshIcon className={`w-5 h-5 text-gray-600 ${stationsLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-gray-100 min-h-[200px]">
        {/* Map Embed */}
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          title="Charging Stations Map"
          src={`https://maps.google.com/maps?q=${vehicleLat},${vehicleLng}&z=13&output=embed`}
          className="absolute inset-0 filter grayscale-[20%] contrast-[1.05]"
          style={{ pointerEvents: showList ? "none" : "auto" }}
        />

        {/* Vehicle Marker Overlay */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="relative">
            <div className="w-8 h-8 bg-blue-600 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-45" />
          </div>
        </div>

        {/* Toggle List Button */}
        <button
          onClick={() => setShowList(!showList)}
          className="absolute top-4 right-4 z-20 px-4 py-2 bg-white rounded-full shadow-lg border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
        >
          {showList ? "Show Map" : "Show List"}
        </button>

        {/* Loading Overlay */}
        {stationsLoading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-gray-600 mt-2">Finding stations...</p>
            </div>
          </div>
        )}
      </div>

      {/* Stations List */}
      {showList && (
        <div className="bg-white border-t border-gray-100 max-h-[50%] md:max-h-[40%] overflow-hidden flex flex-col">
          {stationsError ? (
            <div className="p-4 text-center">
              <p className="text-red-500 font-medium">{stationsError}</p>
              <button
                onClick={handleRefresh}
                className="mt-2 text-blue-600 font-medium hover:underline"
              >
                Try again
              </button>
            </div>
          ) : stations.length === 0 && !stationsLoading ? (
            <EmptyState onRetry={handleRefresh} loading={stationsLoading} />
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {stations.map((station) => (
                <StationCard
                  key={station.id}
                  station={station}
                  isSelected={selectedStation?.id === station.id}
                  onSelect={handleSelectStation}
                  onNavigate={handleNavigate}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected Station Detail Sheet (Mobile) */}
      {selectedStation && !showList && (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-5 animate-slide-up">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
          <StationCard
            station={selectedStation}
            isSelected={true}
            onSelect={() => {}}
            onNavigate={handleNavigate}
          />
        </div>
      )}
    </div>
  );
}

// Compact version for dashboard
export function ChargingMapCompact({ onExpand }) {
  const vehicle = useStore(vehicleStore);
  const charging = useStore(chargingStore);

  const vehicleLat = vehicle.latitude || 21.0285;
  const vehicleLng = vehicle.longitude || 105.8542;

  // Fetch on mount if not already fetched
  useEffect(() => {
    if (charging.stations.length === 0 && !charging.stationsLoading) {
      fetchChargingStations(vehicleLat, vehicleLng);
    }
  }, []);

  const availableCount = charging.stations.filter(s => s.availableConnectors > 0).length;
  const nearestDistance = charging.stations[0]?.distance?.toFixed(1) || "?";

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <ChargingIcon className="w-5 h-5 text-green-600" />
          Nearby Stations
        </h3>
        <button
          onClick={onExpand}
          className="text-sm font-bold text-blue-600 hover:text-blue-700"
        >
          View All →
        </button>
      </div>

      {/* Mini Map */}
      <div className="h-32 relative bg-gray-100">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          title="Nearby Stations"
          src={`https://maps.google.com/maps?q=${vehicleLat},${vehicleLng}&z=14&output=embed`}
          className="filter grayscale-[30%]"
          style={{ pointerEvents: "none" }}
        />
        {charging.stationsLoading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="p-4 grid grid-cols-3 gap-2">
        <div className="text-center">
          <p className="text-2xl font-black text-gray-900">{charging.stations.length}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase">Nearby</p>
        </div>
        <div className="text-center border-x border-gray-100">
          <p className="text-2xl font-black text-emerald-600">{availableCount}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase">Available</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-gray-900">{nearestDistance}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase">km</p>
        </div>
      </div>
    </div>
  );
}
