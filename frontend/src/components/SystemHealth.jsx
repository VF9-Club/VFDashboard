import { useStore } from "@nanostores/react";
import { vehicleStore } from "../stores/vehicleStore";
import { TIRE_PRESSURE, VEHICLE_STATUS_LABELS } from "../constants/vehicle";

export default function SystemHealth() {
  const data = useStore(vehicleStore);

  // Helpers (Unified Theme Colors)
  const getTireStatus = () => {
    const {
      tire_pressure_fl,
      tire_pressure_fr,
      tire_pressure_rl,
      tire_pressure_rr,
    } = data;
    if (!tire_pressure_fl && !tire_pressure_fr)
      return {
        status: "No Data",
        color: "text-gray-400",
        bg: "bg-gray-100",
        iconColor: "text-gray-400",
      };

    const tires = [
      tire_pressure_fl,
      tire_pressure_fr,
      tire_pressure_rl,
      tire_pressure_rr,
    ];
    const lowTires = tires.filter(
      (p) => typeof p === "number" && p < TIRE_PRESSURE.CRITICAL_LOW,
    );

    if (lowTires.length > 0)
      return {
        status: "Low Pressure",
        color: "text-red-700",
        bg: "bg-red-50",
        iconColor: "text-red-500",
      };
    return {
      status: "All OK",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    };
  };

  const getDoorStatus = () => {
    const { door_fl, door_fr, door_rl, door_rr, trunk_status, hood_status } =
      data;

    // Check if we have ANY data (if all undefined, assume No Data)
    if (
      door_fl === undefined &&
      door_fr === undefined &&
      door_rl === undefined &&
      door_rr === undefined &&
      trunk_status === undefined &&
      hood_status === undefined
    ) {
      return {
        status: "--",
        color: "text-gray-400",
        bg: "bg-gray-100",
        iconColor: "text-gray-400",
      };
    }

    const openDoors = [];
    if (door_fl) openDoors.push("Driver");
    if (door_fr) openDoors.push("Pass");
    if (door_rl) openDoors.push("RL");
    if (door_rr) openDoors.push("RR");
    if (trunk_status) openDoors.push("Trunk");
    if (hood_status) openDoors.push("Hood");

    if (openDoors.length > 0)
      return {
        status: `${openDoors.join(", ")} Open`,
        color: "text-amber-700",
        bg: "bg-amber-50",
        iconColor: "text-amber-500",
      };
    return {
      status: "All Closed",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    };
  };

  const getSafetyStatus = () => {
    if (data.thermal_warning === undefined || data.thermal_warning === null) {
      return {
        status: "--",
        color: "text-gray-400",
        bg: "bg-gray-100",
        iconColor: "text-gray-400",
      };
    }

    if (Number(data.thermal_warning) === 1) {
      return {
        status: "Thermal Warning",
        color: "text-red-700",
        bg: "bg-red-50",
        iconColor: "text-red-600",
      };
    }
    return {
      status: "System Normal",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    };
  };

  const getServiceStatus = () => {
    if (data.service_alert === undefined || data.service_alert === null) {
      return {
        status: "--",
        color: "text-gray-400",
        bg: "bg-gray-100",
        iconColor: "text-gray-400",
      };
    }

    if (data.service_alert && data.service_alert != 0) {
      return {
        status: "Service Due",
        color: "text-blue-700",
        bg: "bg-blue-50",
        iconColor: "text-blue-500",
      };
    }
    return {
      status: "No Alerts",
      color: "text-gray-500",
      bg: "bg-gray-50",
      iconColor: "text-gray-400",
    };
  };

  const tire = getTireStatus();
  const door = getDoorStatus();
  const safety = getSafetyStatus();
  const service = getServiceStatus();

  const items = [
    {
      label: VEHICLE_STATUS_LABELS.TIRES,
      value: tire.status,
      bg: tire.bg,
      txt: tire.color,
      icon: "tire",
      iconColor: tire.iconColor,
    },
    {
      label: VEHICLE_STATUS_LABELS.DOORS,
      value: door.status,
      bg: door.bg,
      txt: door.color,
      icon: "door",
      iconColor: door.iconColor,
    },
    {
      label: VEHICLE_STATUS_LABELS.SAFETY,
      value: safety.status,
      bg: safety.bg,
      txt: safety.color,
      icon: "shield",
      iconColor: safety.iconColor,
    },
    {
      label: VEHICLE_STATUS_LABELS.SERVICE,
      value: service.status,
      bg: service.bg,
      txt: service.color,
      icon: "tool",
      iconColor: service.iconColor,
    },
    {
      label: VEHICLE_STATUS_LABELS.FIRMWARE,
      value:
        data.firmware_version && data.firmware_version !== "--"
          ? data.firmware_version
          : "N/A",
      bg: "bg-gray-50",
      txt: "text-gray-600",
      icon: "chip",
      iconColor: "text-indigo-500",
    },
    {
      label: VEHICLE_STATUS_LABELS.TBOX,
      value:
        data.tbox_version && data.tbox_version !== "--"
          ? data.tbox_version
          : "N/A",
      bg: "bg-gray-50",
      txt: "text-gray-600",
      icon: "wifi",
      iconColor: "text-blue-500",
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case "tire":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "door":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
            />
          </svg>
        );
      case "shield":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        );
      case "tool":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        );
      case "chip":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            />
          </svg>
        );
      case "wifi":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 min-h-[400px] md:h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Vehicle Status
      </h3>

      <div className="space-y-2 flex-1 md:overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[32px_1fr_auto] gap-2 items-center pb-2 border-b border-gray-50 last:border-0 last:pb-0"
          >
            <div
              className={`h-8 w-8 rounded-xl flex items-center justify-center border border-gray-50/50 ${item.bg} ${item.iconColor}`}
            >
              {getIcon(item.icon)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight whitespace-nowrap">
                {item.label}
              </p>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-1 rounded-md w-[100px] text-center truncate shadow-sm ${item.bg} ${item.txt}`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
