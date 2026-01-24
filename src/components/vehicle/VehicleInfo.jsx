import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

// Icons
const BatteryIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 6h1a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h1m10 0V4a1 1 0 00-1-1H9a1 1 0 00-1 1v2m10 0H8" />
  </svg>
);

const WrenchIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const AlertIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

// Battery Leasing Card
function BatteryLeasingCard({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 text-gray-400">
          <BatteryIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Battery Leasing</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">No data available</p>
      </div>
    );
  }

  const { actualKm, cost, package: pkg, month, year, isBatteryOwner } = data;

  if (isBatteryOwner) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-4">
        <div className="flex items-center gap-2 text-emerald-600 mb-2">
          <BatteryIcon className="w-5 h-5" />
          <span className="text-sm font-bold">Battery Ownership</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckIcon className="w-6 h-6 text-emerald-500" />
          <span className="text-lg font-bold text-gray-900">You own the battery</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-blue-600">
          <BatteryIcon className="w-5 h-5" />
          <span className="text-sm font-bold">Battery Leasing</span>
        </div>
        <span className="text-xs text-gray-500">{month}/{year}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] text-gray-500 font-bold uppercase">This Month</p>
          <p className="text-2xl font-black text-gray-900">{Math.round(actualKm).toLocaleString()}</p>
          <p className="text-xs text-gray-500">km driven</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 font-bold uppercase">Estimated Cost</p>
          <p className="text-2xl font-black text-blue-600">{Math.round(cost / 1000)}K</p>
          <p className="text-xs text-gray-500">VND</p>
        </div>
      </div>

      {pkg && (
        <div className="mt-3 pt-3 border-t border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">Package: {pkg.name || pkg.packageTypeName}</span>
            {pkg.limitKm > 0 && (
              <span className="text-xs text-blue-600 font-bold">{pkg.limitKm.toLocaleString()} km limit</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Maintenance Card
function MaintenanceCard({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 text-gray-400">
          <WrenchIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Maintenance</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">No data available</p>
      </div>
    );
  }

  const { nextMileage, nextDateBasedOnOdo, unitDistance } = data;

  const formatDate = (date) => {
    if (!date) return "Not scheduled";
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const getDaysUntil = (date) => {
    if (!date) return null;
    const d = date instanceof Date ? date : new Date(date);
    const diff = d.getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysUntil = getDaysUntil(nextDateBasedOnOdo);
  const isUrgent = daysUntil !== null && daysUntil <= 30;

  return (
    <div className={`rounded-2xl border p-4 ${isUrgent ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100' : 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-100'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center gap-2 ${isUrgent ? 'text-amber-600' : 'text-gray-600'}`}>
          <WrenchIcon className="w-5 h-5" />
          <span className="text-sm font-bold">Next Maintenance</span>
        </div>
        {isUrgent && (
          <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full">SOON</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] text-gray-500 font-bold uppercase">At Mileage</p>
          <p className="text-2xl font-black text-gray-900">{Math.round(nextMileage).toLocaleString()}</p>
          <p className="text-xs text-gray-500">{unitDistance || 'km'}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 font-bold uppercase">Estimated Date</p>
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <p className="text-sm font-bold text-gray-900">{formatDate(nextDateBasedOnOdo)}</p>
          </div>
          {daysUntil !== null && (
            <p className={`text-xs ${isUrgent ? 'text-amber-600 font-bold' : 'text-gray-500'}`}>
              {daysUntil > 0 ? `${daysUntil} days away` : 'Overdue'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Alerts Card
function AlertsCard({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
        <div className="h-6 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  const totalAlerts = data ? data.reduce((sum, cat) => sum + (cat.alertCount || 0), 0) : 0;

  if (totalAlerts === 0) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <CheckIcon className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">All Clear</p>
            <p className="text-xs text-gray-500">No active alerts</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-red-600">
          <AlertIcon className="w-5 h-5" />
          <span className="text-sm font-bold">Vehicle Alerts</span>
        </div>
        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">{totalAlerts}</span>
      </div>

      <div className="space-y-2">
        {data && data.filter(cat => cat.alertCount > 0).map((cat, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
            <span className="text-xs font-medium text-gray-700">{cat.categoryName}</span>
            <span className="text-xs font-bold text-red-600">{cat.alertCount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main VehicleInfo Component
export default function VehicleInfo() {
  const [batteryLeasing, setBatteryLeasing] = useState(null);
  const [maintenance, setMaintenance] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [leasingData, maintenanceData, alertsData] = await Promise.all([
          api.getBatteryLeasingInfo().catch(e => { console.error("Battery leasing error:", e); return null; }),
          api.getNextMaintenance().catch(e => { console.error("Maintenance error:", e); return null; }),
          api.getVehicleAlerts().catch(e => { console.error("Alerts error:", e); return null; }),
        ]);

        console.log("[VehicleInfo] Loaded:", { leasingData, maintenanceData, alertsData });

        setBatteryLeasing(leasingData);
        setMaintenance(maintenanceData);
        setAlerts(alertsData);
      } catch (e) {
        console.error("Error fetching vehicle info:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-3">
      <BatteryLeasingCard data={batteryLeasing} loading={loading} />
      <MaintenanceCard data={maintenance} loading={loading} />
      <AlertsCard data={alerts} loading={loading} />
    </div>
  );
}

// Compact version for sidebar
export function VehicleInfoCompact() {
  const [maintenance, setMaintenance] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [maintenanceData, alertsData] = await Promise.all([
          api.getNextMaintenance().catch(() => null),
          api.getVehicleAlerts().catch(() => null),
        ]);
        setMaintenance(maintenanceData);
        setAlerts(alertsData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalAlerts = alerts ? alerts.reduce((sum, cat) => sum + (cat.alertCount || 0), 0) : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 mb-3">Vehicle Status</h3>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-8 bg-gray-100 rounded"></div>
          <div className="h-8 bg-gray-100 rounded"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Alerts Status */}
          <div className={`flex items-center justify-between p-2 rounded-lg ${totalAlerts > 0 ? 'bg-red-50' : 'bg-emerald-50'}`}>
            <div className="flex items-center gap-2">
              {totalAlerts > 0 ? (
                <AlertIcon className="w-4 h-4 text-red-500" />
              ) : (
                <CheckIcon className="w-4 h-4 text-emerald-500" />
              )}
              <span className="text-xs font-medium text-gray-700">Alerts</span>
            </div>
            <span className={`text-xs font-bold ${totalAlerts > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {totalAlerts > 0 ? totalAlerts : 'Clear'}
            </span>
          </div>

          {/* Maintenance Status */}
          {maintenance && (
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <WrenchIcon className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-700">Service</span>
              </div>
              <span className="text-xs font-bold text-gray-900">
                @ {Math.round(maintenance.nextMileage).toLocaleString()} km
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
