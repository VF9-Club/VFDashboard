import React, { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { vehicleStore, fetchFullTelemetry } from "../stores/vehicleStore";
import {
  DEEP_SCAN_GROUPS,
  getSortedGroups,
  getGroupByAlias,
} from "../config/deepScanGroups";

// Icon component for groups
const GroupIcon = ({ icon }) => {
  const icons = {
    battery: (
      <svg
        className="w-4 h-4 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 8h16v8H4V8zm16 2h2v4h-2V10zM7 11h4v2H7v-2z"
        />
      </svg>
    ),
    "battery-low": (
      <svg
        className="w-4 h-4 text-yellow-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 8h16v8H4V8zm16 2h2v4h-2V10z"
        />
      </svg>
    ),
    bolt: (
      <svg
        className="w-4 h-4 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    car: (
      <svg
        className="w-4 h-4 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 17l4 4 4-4m-4-5v9M3 7l9-4 9 4M3 7l9 4 9-4M3 7v10l9 4 9-4V7"
        />
      </svg>
    ),
    tire: (
      <svg
        className="w-4 h-4 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="9" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" strokeWidth="2" />
      </svg>
    ),
    door: (
      <svg
        className="w-4 h-4 text-orange-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 3h18v18H3V3zm5 9h2"
        />
      </svg>
    ),
    window: (
      <svg
        className="w-4 h-4 text-cyan-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
        <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" />
        <line x1="12" y1="3" x2="12" y2="21" strokeWidth="2" />
      </svg>
    ),
    thermometer: (
      <svg
        className="w-4 h-4 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9V3m0 18a4 4 0 100-8 4 4 0 000 8zm0-8V9"
        />
      </svg>
    ),
    seat: (
      <svg
        className="w-4 h-4 text-purple-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 19h14M7 14l1-5h8l1 5M7 14v5m10-5v5"
        />
      </svg>
    ),
    location: (
      <svg
        className="w-4 h-4 text-red-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    star: (
      <svg
        className="w-4 h-4 text-yellow-500"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    lightbulb: (
      <svg
        className="w-4 h-4 text-yellow-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
    shield: (
      <svg
        className="w-4 h-4 text-red-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    warning: (
      <svg
        className="w-4 h-4 text-amber-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    route: (
      <svg
        className="w-4 h-4 text-indigo-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    ),
    cpu: (
      <svg
        className="w-4 h-4 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
        />
      </svg>
    ),
    microchip: (
      <svg
        className="w-4 h-4 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <rect x="6" y="6" width="12" height="12" rx="1" strokeWidth="2" />
        <path
          strokeLinecap="round"
          strokeWidth="2"
          d="M9 1v4m6-4v4M9 19v4m6-4v4M1 9h4m-4 6h4M19 9h4m-4 6h4"
        />
      </svg>
    ),
    "id-card": (
      <svg
        className="w-4 h-4 text-teal-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
        />
      </svg>
    ),
    wifi: (
      <svg
        className="w-4 h-4 text-blue-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
        />
      </svg>
    ),
    search: (
      <svg
        className="w-4 h-4 text-purple-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    ellipsis: (
      <svg
        className="w-4 h-4 text-gray-400"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="5" cy="12" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="19" cy="12" r="2" />
      </svg>
    ),
  };
  return icons[icon] || icons.ellipsis;
};

// Format value based on field config
const formatValue = (value, fieldConfig) => {
  if (value === null || value === undefined) return "N/A";

  if (fieldConfig) {
    const { format, enumMap, trueLabel, falseLabel, decimals, unit } =
      fieldConfig;

    if (format === "boolean") {
      const boolVal =
        value === true || value === 1 || value === "1" || value === "true";
      return boolVal ? trueLabel || "Yes" : falseLabel || "No";
    }

    if (format === "enum" && enumMap) {
      return enumMap[value] || String(value);
    }

    if (format === "number" && typeof decimals === "number") {
      return Number(value).toFixed(decimals);
    }

    if (format === "duration") {
      const mins = Number(value);
      if (mins >= 60) {
        const hours = Math.floor(mins / 60);
        const remainMins = mins % 60;
        return `${hours}h ${remainMins}m`;
      }
      return `${mins} min`;
    }

    if (format === "coordinate") {
      return Number(value).toFixed(decimals || 6);
    }
  }

  return String(value);
};

// Check warning/critical status
const getValueStatus = (value, fieldConfig) => {
  if (!fieldConfig) return "normal";

  const numVal = Number(value);
  const { warning, critical } = fieldConfig;

  if (critical) {
    if (critical.below !== undefined && numVal < critical.below)
      return "critical";
    if (critical.above !== undefined && numVal > critical.above)
      return "critical";
    if (
      critical.equals !== undefined &&
      (value === critical.equals || numVal === critical.equals)
    )
      return "critical";
  }

  if (warning) {
    if (warning.below !== undefined && numVal < warning.below) return "warning";
    if (warning.above !== undefined && numVal > warning.above) return "warning";
    if (
      warning.equals !== undefined &&
      (value === warning.equals || numVal === warning.equals)
    )
      return "warning";
  }

  return "normal";
};

export default function TelemetryDrawer({ isOpen, onClose }) {
  const vehicle = useStore(vehicleStore);
  const [searchTerm, setSearchTerm] = useState("");

  const data = vehicle.fullTelemetryData[vehicle.vin] || [];
  const aliases = vehicle.fullTelemetryAliases[vehicle.vin] || [];
  const timestamp = vehicle.fullTelemetryTimestamps[vehicle.vin];

  // Map raw data with alias metadata
  const mappedData = React.useMemo(() => {
    return data.map((item) => {
      // Find matching alias by objectId, instanceId, resourceId
      const parts = (item.deviceKey || "").split("_");
      // API Keys are strings (e.g. "34180") but deviceKey has padding (e.g. "34180")
      // To be safe, we parse int to remove leading zeros, then back to string
      const oid = String(parseInt(parts[0], 10));
      const iid = String(parseInt(parts[1], 10));
      const rid = String(parseInt(parts[2], 10));

      const meta = aliases.find(
        (a) =>
          String(a.devObjID) === oid &&
          String(a.devObjInstID || "0") === iid &&
          String(a.devRsrcID || "0") === rid,
      );

      // Improve name context
      let improvedName = meta?.name || null;
      const alias = meta?.alias || "";
      if (
        improvedName &&
        (improvedName.toLowerCase() === "status" ||
          improvedName.toLowerCase() === "door status" ||
          improvedName.toLowerCase() === "configuration json")
      ) {
        // Extract context from alias (e.g., CAMP_MODE_CONTROL_STATUS -> Camp Mode Status)
        const context = alias
          .split("_")
          .slice(0, -1)
          .map(
            (word) =>
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
          )
          .join(" ");
        improvedName = `${context} ${improvedName}`;
      }

      return {
        ...item,
        name: improvedName,
        units: meta?.units || null,
        alias: alias,
      };
    });
  }, [data, aliases]);

  // Filter logic
  const filteredData = React.useMemo(() => {
    const search = searchTerm.toLowerCase();
    return mappedData.filter((item) => {
      const deviceKey = (item.deviceKey || "").toLowerCase();
      const value = String(item.value || "").toLowerCase();
      const name = (item.name || "").toLowerCase();
      const alias = (item.alias || "").toLowerCase();
      return (
        deviceKey.includes(search) ||
        value.includes(search) ||
        name.includes(search) ||
        alias.includes(search)
      );
    });
  }, [mappedData, searchTerm]);

  // Grouping logic using DEEP_SCAN_GROUPS
  const groupedData = React.useMemo(() => {
    const groups = {};
    const sortedGroupConfigs = getSortedGroups();

    // Initialize groups from config
    sortedGroupConfigs.forEach((groupConfig) => {
      groups[groupConfig.id] = {
        id: groupConfig.id,
        label: groupConfig.label,
        icon: groupConfig.icon,
        description: groupConfig.description,
        priority: groupConfig.priority,
        items: [],
        fieldConfig: groupConfig.fields || [],
      };
    });

    // Add OTHERS group for unmatched items
    groups["others"] = {
      id: "others",
      label: "Other Parameters",
      icon: "ellipsis",
      priority: 800,
      items: [],
      fieldConfig: [],
    };

    filteredData.forEach((item) => {
      const alias = item.alias || "";
      let matchedGroup = null;

      // Try to find matching group by alias
      const groupConfig = getGroupByAlias(alias);
      if (groupConfig) {
        matchedGroup = groupConfig.id;
      } else {
        // Fallback: match by alias prefix patterns
        const prefixPatterns = {
          BATTERY_LEASING: "connectivity",
          BMS_STATUS: "battery_main",
          CAMP_MODE: "special_modes",
          PET_MODE: "special_modes",
          VALET_MODE: "special_modes",
          CAPP_PAIRING: "connectivity",
          CCARSERVICE: "connectivity",
          CHARGE_CONTROL: "charging",
          CHARGING_STATUS: "charging",
          CLIMATE_INFORMATION: "climate",
          CLIMATE_CONTROL: "climate",
          DATA_PRIVACY: "connectivity",
          DOOR_AJAR: "doors",
          DOOR_BONNET: "doors",
          DOOR_TRUNK: "doors",
          REMOTE_CONTROL_DOOR: "doors",
          REMOTE_CONTROL_WINDOW: "windows",
          REMOTE_CONTROL_CHARGE_PORT: "charging",
          LOCATION: "location",
          VEHICLE_STATUS_HV_BATTERY: "battery_main",
          VEHICLE_STATUS_LV_BATTERY: "battery_12v",
          VEHICLE_STATUS_REMAINING: "battery_main",
          VEHICLE_STATUS_FRONT_LEFT_TIRE: "tires",
          VEHICLE_STATUS_FRONT_RIGHT_TIRE: "tires",
          VEHICLE_STATUS_REAR_LEFT_TIRE: "tires",
          VEHICLE_STATUS_REAR_RIGHT_TIRE: "tires",
          VEHICLE_STATUS_AMBIENT: "climate",
          VEHICLE_STATUS_INTERIOR: "climate",
          VEHICLE_STATUS: "vehicle_general",
          VEHICLE_CRASH: "safety",
          VEHICLE_WARNINGS: "warnings",
          WINDOW: "windows",
          LIGHT_: "lights",
          TRIPS_INFORMATION: "trips",
          FIRMWARE: "firmware",
          ECUS_INFORMATION: "ecu_modules",
          VINFAST_VEHICLE: "identity",
          VERSION_INFO: "firmware",
        };

        for (const [prefix, groupId] of Object.entries(prefixPatterns)) {
          if (alias.startsWith(prefix)) {
            matchedGroup = groupId;
            break;
          }
        }
      }

      const targetGroup = matchedGroup || "others";
      if (groups[targetGroup]) {
        // Find field config for this item
        const fieldConfig = groups[targetGroup].fieldConfig.find((f) => {
          // Match by key patterns
          return alias.toLowerCase().includes(f.key.replace(/_/g, ""));
        });

        groups[targetGroup].items.push({
          ...item,
          fieldConfig: fieldConfig || null,
        });
      }
    });

    // Add Deep Scan: Service & Maintenance Data - placed near bottom (priority 900)
    if (vehicle.debugLog && vehicle.debugLog.length > 0) {
      const rawTelemetryData = data;

      const debugItems = vehicle.debugLog.map((r) => {
        const oid = String(r.devObjID);
        const iid = String(r.devObjInstID || "0");
        const rid = String(r.devRsrcID || "0");

        const matchingTelemetry = rawTelemetryData.find((item) => {
          if (!item.deviceKey) return false;
          const itemParts = item.deviceKey.split("_");
          const itemOid = String(parseInt(itemParts[0], 10));
          const itemIid = String(parseInt(itemParts[1], 10));
          const itemRid = String(parseInt(itemParts[2], 10));
          return itemOid === oid && itemIid === iid && itemRid === rid;
        });

        const actualValue = matchingTelemetry?.value ?? null;
        const hasData =
          actualValue !== null &&
          actualValue !== "" &&
          actualValue !== undefined;

        return {
          name: r.resourceName || r.alias || "Service Data",
          alias: r.alias,
          deviceKey: `${oid}/${iid}/${rid}`,
          value: hasData ? actualValue : null,
          units: r.units || null,
          isCandidate: !hasData,
        };
      });

      // Split into items with data and items without data
      const itemsWithData = debugItems.filter((item) => !item.isCandidate);
      const itemsWithoutData = debugItems.filter((item) => item.isCandidate);

      if (itemsWithData.length > 0) {
        groups["service_data"] = {
          id: "service_data",
          label: "Service & Maintenance",
          icon: "search",
          description: "Dữ liệu dịch vụ và bảo trì",
          priority: 900,
          items: itemsWithData,
          fieldConfig: [],
        };
      }

      if (itemsWithoutData.length > 0) {
        groups["no_data"] = {
          id: "no_data",
          label: "No Data Available",
          icon: "ellipsis",
          description: "Aliases không có dữ liệu trả về",
          priority: 1000,
          items: itemsWithoutData,
          fieldConfig: [],
        };
      }
    }

    // Also add items from main groups that have no value to "no_data" group
    Object.values(groups).forEach((group) => {
      if (group.id === "no_data" || group.id === "service_data") return;

      const noDataItems = group.items.filter(
        (item) =>
          item.value === null ||
          item.value === undefined ||
          item.value === "" ||
          item.value === "No data",
      );

      if (noDataItems.length > 0) {
        if (!groups["no_data"]) {
          groups["no_data"] = {
            id: "no_data",
            label: "No Data Available",
            icon: "ellipsis",
            description: "Aliases không có dữ liệu trả về",
            priority: 1000,
            items: [],
            fieldConfig: [],
          };
        }
        // Move no-data items to no_data group
        noDataItems.forEach((item) => {
          item.originalGroup = group.label;
        });
        groups["no_data"].items.push(...noDataItems);
        // Remove from original group
        group.items = group.items.filter(
          (item) =>
            item.value !== null &&
            item.value !== undefined &&
            item.value !== "" &&
            item.value !== "No data",
        );
      }
    });

    // Filter out empty groups and sort by priority
    return Object.values(groups)
      .filter((g) => g.items.length > 0)
      .sort((a, b) => {
        if (a.id === "debug_scan") return -1;
        if (b.id === "debug_scan") return 1;
        if (a.id === "others") return 1;
        if (b.id === "others") return -1;
        return (a.priority || 999) - (b.priority || 999);
      });
  }, [filteredData, vehicle.debugLog]);

  useEffect(() => {
    if (isOpen && !timestamp && !vehicle.isScanning) {
      fetchFullTelemetry(vehicle.vin);
    }
  }, [isOpen, vehicle.vin, timestamp]);

  const handleRefresh = () => {
    fetchFullTelemetry(vehicle.vin, true);
  };

  const handleExport = () => {
    const exportData = {
      vin: vehicle.vin,
      timestamp: new Date().toISOString(),
      data: mappedData,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vfdash_telemetry_${vehicle.vin}_${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col h-full animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
              Deep Scan
            </h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs font-mono text-gray-500 uppercase tracking-tight bg-white/70 px-1.5 py-0.5 rounded border border-gray-200">
                {vehicle.vin}
              </span>
              {timestamp && (
                <span className="text-[10px] text-gray-400">
                  {new Date(timestamp).toLocaleTimeString()}
                </span>
              )}
              {groupedData.length > 0 && (
                <span className="text-[10px] text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded font-bold">
                  {groupedData.length} groups
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Search & Actions */}
        <div className="px-6 py-3 border-b border-gray-100 flex gap-2 overflow-hidden shrink-0">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by key or value..."
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg text-sm transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            onClick={handleRefresh}
            disabled={vehicle.isScanning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-bold rounded-lg shadow-md transition-all active:scale-95"
          >
            <svg
              className={`w-4 h-4 ${vehicle.isScanning ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="hidden sm:inline">Full Scan</span>
          </button>
          <button
            onClick={handleExport}
            disabled={filteredData.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 disabled:bg-gray-100 text-indigo-600 disabled:text-gray-400 text-sm font-bold rounded-lg border border-indigo-100 transition-all active:scale-95"
            title="Export to JSON"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-0 custom-scrollbar bg-gray-50/30">
          {vehicle.isScanning ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                <svg
                  className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-gray-900 font-bold">
                  Deep Scanning Vehicle...
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Fetching all telemetry data from 19 categories
                </p>
                <p className="text-[10px] text-gray-400 mt-2">
                  Battery, Charging, Doors, Climate, Location, Safety...
                </p>
              </div>
            </div>
          ) : filteredData.length > 0 ? (
            <div className="bg-white">
              {groupedData.map((group, gIdx) => (
                <div key={gIdx} className="mb-4">
                  <div className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50 border-y border-gray-200 sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                      <GroupIcon icon={group.icon} />
                      <div>
                        <h3 className="text-xs font-black text-gray-700 uppercase tracking-widest leading-none">
                          {group.label}
                        </h3>
                        {group.description && (
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {group.description}
                          </p>
                        )}
                      </div>
                      <span className="ml-auto text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                        {group.items.length}
                      </span>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {group.items.map((item, idx) => {
                      const fieldConfig = item.fieldConfig;
                      const valueStatus = getValueStatus(
                        item.value,
                        fieldConfig,
                      );
                      const formattedValue = formatValue(
                        item.value,
                        fieldConfig,
                      );
                      const displayUnit = fieldConfig?.unit || item.units;

                      return (
                        <div
                          key={idx}
                          className={`px-6 py-4 transition-colors group/row overflow-hidden ${
                            valueStatus === "critical"
                              ? "bg-red-50 hover:bg-red-100/50"
                              : valueStatus === "warning"
                                ? "bg-amber-50 hover:bg-amber-100/50"
                                : "hover:bg-blue-50/30"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="min-w-0 flex-1">
                              <div className="flex-1 group/name flex items-center min-w-0">
                                {valueStatus !== "normal" && (
                                  <span
                                    className={`shrink-0 mr-2 ${
                                      valueStatus === "critical"
                                        ? "text-red-500"
                                        : "text-amber-500"
                                    }`}
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M12 2L1 21h22L12 2zm0 3.83L19.13 19H4.87L12 5.83zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z" />
                                    </svg>
                                  </span>
                                )}
                                <p className="text-sm font-bold text-gray-900 leading-tight truncate">
                                  {fieldConfig?.label ||
                                    item.name ||
                                    item.alias ||
                                    "Unknown Parameter"}
                                </p>
                                {displayUnit && (
                                  <span className="shrink-0 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded ml-2">
                                    {displayUnit}
                                  </span>
                                )}
                              </div>
                              <div className="mt-0.5 group/alias min-w-0">
                                <p className="text-[10px] font-mono font-medium text-gray-400 uppercase leading-none group-hover/row:text-blue-500 transition-colors truncate">
                                  {item.alias || item.deviceKey}
                                </p>
                              </div>
                              <div
                                className={`mt-2 text-sm font-semibold p-2 rounded border group/value ${
                                  item.isCandidate || item.value === "No data"
                                    ? "text-gray-400 bg-gray-50 border-dashed border-gray-200 italic"
                                    : valueStatus === "critical"
                                      ? "text-red-700 bg-red-100/50 border-red-200"
                                      : valueStatus === "warning"
                                        ? "text-amber-700 bg-amber-100/50 border-amber-200"
                                        : "text-gray-800 bg-gray-100/50 border-gray-100"
                                }`}
                              >
                                <span className="truncate block">
                                  {item.isCandidate ? (
                                    <span className="flex items-center gap-1">
                                      <svg
                                        className="w-3 h-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                      </svg>
                                      No telemetry data available
                                    </span>
                                  ) : (
                                    formattedValue
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <svg
                className="w-12 h-12 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="font-medium">
                {searchTerm ? "No results found" : "No telemetry data yet"}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 text-[10px] text-gray-500 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-bold">{filteredData.length} parameters</span>
            <span className="text-gray-300">|</span>
            <span>{groupedData.length} categories</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Critical
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              Warning
            </span>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.1);
        }
      `,
        }}
      />
    </div>
  );
}
