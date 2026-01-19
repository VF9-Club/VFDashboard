export const TELEMETRY_KEY_MAP = {
  // 4.1 Battery & Charging
  VEHICLE_STATUS_HV_BATTERY_SOC: "battery_level",
  VEHICLE_STATUS_REMAINING_DISTANCE: "range",
  BMS_STATUS_STATE_OF_HEALTH: "soh_percentage",
  CHARGING_STATUS_CHARGING_REMAINING_TIME: "remaining_charging_time",
  CHARGE_CONTROL_CURRENT_TARGET_SOC: "target_soc",
  CHARGING_STATUS_CHARGING_STATUS: "charging_status", // 0=Plug in, 1=Charging...
  VEHICLE_STATUS_LV_BATTERY_SOC: "battery_health_12v",
  BMS_STATUS_BATTERY_TYPE: "battery_type",
  BMS_STATUS_BATTERY_SERIAL_NUMBER: "battery_serial",
  BMS_STATUS_BATTERY_DECODED_MANUFACTURE_DATE: "battery_manufacture_date",
  VINFAST_VEHICLE_IDENTIFIER_VEHICLE_MANUFACTURER: "manufacturer",

  // 4.2 Vehicle
  VEHICLE_STATUS_ODOMETER: "odometer",
  VEHICLE_STATUS_GEAR_POSITION: "gear_position",
  VEHICLE_STATUS_VEHICLE_SPEED: "speed",

  // 4.3 Tires (Tech Ref Mapped)
  VEHICLE_STATUS_FRONT_LEFT_TIRE_PRESSURE: "tire_pressure_fl",
  VEHICLE_STATUS_FRONT_RIGHT_TIRE_PRESSURE: "tire_pressure_fr",
  VEHICLE_STATUS_REAR_LEFT_TIRE_PRESSURE: "tire_pressure_rl",
  VEHICLE_STATUS_REAR_RIGHT_TIRE_PRESSURE: "tire_pressure_rr",

  VEHICLE_STATUS_FRONT_LEFT_TIRE_TEMPERATURE: "tire_temp_fl",
  VEHICLE_STATUS_FRONT_RIGHT_TIRE_TEMPERATURE: "tire_temp_fr",
  VEHICLE_STATUS_REAR_LEFT_TIRE_TEMPERATURE: "tire_temp_rl",
  VEHICLE_STATUS_REAR_RIGHT_TIRE_TEMPERATURE: "tire_temp_rr",

  // 4.4 Location
  LOCATION_LATITUDE: "latitude",
  LOCATION_LONGITUDE: "longitude",
  LOCATION_BEARING_DEGREE: "heading",

  // 4.5 Climate
  VEHICLE_STATUS_AMBIENT_TEMPERATURE: "outside_temp",
  CLIMATE_INFORMATION_DRIVER_TEMPERATURE: "inside_temp",
  CLIMATE_INFORMATION_PASSENGER_TEMPERATURE: "climate_passenger_temp",
  CLIMATE_INFORMATION_DRIVER_AIR_BLOW_LEVEL: "fan_speed", // Mapped from correct alias
  CLIMATE_INFORMATION_FAN_SPEED: "fan_speed", // Keep for legacy safety

  // 5.1 Doors & Locks
  DOOR_AJAR_FRONT_LEFT_DOOR_STATUS: "door_fl",
  DOOR_AJAR_FRONT_RIGHT_DOOR_STATUS: "door_fr",
  DOOR_AJAR_REAR_LEFT_DOOR_STATUS: "door_rl",
  DOOR_AJAR_REAR_RIGHT_DOOR_STATUS: "door_rr",
  DOOR_TRUNK_DOOR_STATUS: "trunk_status",
  DOOR_BONNET_DOOR_STATUS: "hood_status",
  REMOTE_CONTROL_DOOR_STATUS: "is_locked",

  // 5.2 Modes
  PET_MODE_CONTROL_STATUS: "pet_mode",
  CAMP_MODE_CONTROL_STATUS: "camp_mode",
  VALET_MODE_CONTROL_STATUS: "valet_mode",

  // Additional from get-alias.json
  VEHICLE_STATUS_INTERIOR_TEMPERATURE: "inside_temp",
  VEHICLE_STATUS_IGNITION_STATUS: "ignition_status",

  // ECU Versions
  ECUS_BMS_SOFTWARE_VERSION: "bms_version",
  ECUS_GATEWAY_SOFTWARE_VERSION: "gateway_version",

  // ECU Information Modules
  ECUS_INFORMATION_HEAD_UNIT: "ecu_head_unit",
  ECUS_INFORMATION_AUDIO_AMPLIFIER: "ecu_audio_amp",
  ECUS_INFORMATION_CONNECTIVITY_MODULE: "ecu_connectivity",
  ECUS_INFORMATION_NAVIGATION_MODULE: "ecu_nav",
  ECUS_INFORMATION_DRIVER_MONITORING_SYSTEM_MODULE: "ecu_driver_monitoring",
  ECUS_INFORMATION_CAMERA_MODULE: "ecu_camera",
  ECUS_INFORMATION_LIGHTING_MODULE: "ecu_lighting",
  ECUS_INFORMATION_POWER_TAILGATE_MODULE: "ecu_tailgate",
  ECUS_INFORMATION_DOOR_CONTROL_MODULE: "ecu_door_control",
  ECUS_INFORMATION_SEAT_CONTROL_MODULE: "ecu_seat_control",

  // New Software Versions
  ECUS_INFORMATION_MHU_SOFTWARE_VERSION: "mhu_version",
  ECUS_INFORMATION_VCU_SOFTWARE_VERSION: "vcu_version",
  ECUS_INFORMATION_BCM_SOFTWARE_VERSION: "bcm_version",

  VEHICLE_STATUS_CENTRAL_LOCK_STATUS: "central_lock_status",

  // System Health / Vehicle Status
  FIRMWARE_UPDATE_CURRENT_PKG_VERSION: "firmware_version",
  VERSION_INFO_TBOX_SOFTWARE_VERSION: "tbox_version",
  BMS_STATUS_THERMAL_RUNAWAY_WARNING: "thermal_warning", // 0=Normal
  CCARSERVICE_OBJECT_BOOKING_SERVICE_STATUS: "service_alert",
};

export const PATH_MAP = {
  "/34183/1/7": "outside_temp",
  "/34207/1/1": "pet_mode",
  "/34206/1/1": "camp_mode",

  // Fallback Mappings (Inferred for SOH, T-Box, etc.)
  "/34196/0/1": "battery_serial",
  "/34197/0/0": "soh_percentage",
  "/34197/0/2": "battery_manufacture_date",
  "/34200/0/0": "tbox_version",
  "/34201/0/0": "firmware_version",
};

export const parseTelemetry = (rawData, pathToAlias) => {
  if (!rawData || !Array.isArray(rawData)) return {};

  const result = {};

  rawData.forEach((item) => {
    if (!item.deviceKey) return;

    // Reconstruct path 34183_00001_00009 -> /34183/1/9
    const parts = item.deviceKey.split("_");
    const oid = parseInt(parts[0], 10);
    const iid = parseInt(parts[1], 10);
    const rid = parseInt(parts[2], 10);
    const path = `/${oid}/${iid}/${rid}`;

    // Special Logic for Door Status (Object 10351, Resource 50)
    if (oid === 10351 && rid === 50) {
      let doorKey = null;
      switch (iid) {
        case 1:
          doorKey = "door_fr";
          break;
        case 2:
          doorKey = "door_fl";
          break;
        case 3:
          doorKey = "door_rr";
          break;
        case 4:
          doorKey = "door_rl";
          break;
        case 5:
          doorKey = "hood_status";
          break;
        case 6:
          doorKey = "trunk_status";
          break;
      }
      if (doorKey) {
        result[doorKey] = Number(item.value) === 1;
        return; // Skip normal mapping
      }
    }

    const alias = pathToAlias[path] || path;
    let friendlyKey = TELEMETRY_KEY_MAP[alias];
    if (!friendlyKey) friendlyKey = PATH_MAP[path];
    if (!friendlyKey) friendlyKey = alias;

    let val = item.value;
    if (!isNaN(val)) val = Number(val);

    // Logic Overrides
    if (friendlyKey === "is_locked") val = val == 1;
    if (friendlyKey === "central_lock_status") val = val == 1;

    if (friendlyKey && result[friendlyKey] === undefined) {
      result[friendlyKey] = val;
    }
  });

  return result;
};
