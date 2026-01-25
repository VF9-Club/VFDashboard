/**
 * Deep Scan Telemetry Groups Configuration
 * Tổng hợp và phân nhóm tất cả dữ liệu telemetry cho màn hình Deep Scan
 *
 * Version: 1.0
 * Date: January 25, 2026
 */

export const DEEP_SCAN_GROUPS = {
  // ========================================
  // 1. BATTERY & ENERGY
  // ========================================
  BATTERY_MAIN: {
    id: "battery_main",
    label: "High Voltage Battery",
    icon: "battery",
    description: "Pin cao áp chính của xe",
    priority: 1,
    aliases: [
      "VEHICLE_STATUS_HV_BATTERY_SOC",
      "VEHICLE_STATUS_REMAINING_DISTANCE",
      "BMS_STATUS_STATE_OF_HEALTH",
      "BMS_STATUS_BATTERY_TYPE",
      "BMS_STATUS_BATTERY_SERIAL_NUMBER",
      "BMS_STATUS_BATTERY_DECODED_MANUFACTURE_DATE",
      "BMS_STATUS_THERMAL_RUNAWAY_WARNING",
    ],
    fields: [
      {
        key: "battery_level",
        label: "State of Charge (SOC)",
        unit: "%",
        format: "number",
        warning: { below: 20 },
        critical: { below: 10 },
      },
      {
        key: "range",
        label: "Estimated Range",
        unit: "km",
        format: "number",
        warning: { below: 50 },
      },
      {
        key: "soh_percentage",
        label: "State of Health (SOH)",
        unit: "%",
        format: "number",
        warning: { below: 80 },
      },
      {
        key: "battery_type",
        label: "Battery Type",
        format: "string",
      },
      {
        key: "battery_serial",
        label: "Battery Serial Number",
        format: "string",
      },
      {
        key: "battery_manufacture_date",
        label: "Manufacture Date",
        format: "date",
      },
      {
        key: "thermal_warning",
        label: "Thermal Runaway Warning",
        format: "boolean",
        critical: { equals: true },
      },
    ],
  },

  BATTERY_12V: {
    id: "battery_12v",
    label: "12V Battery (LV)",
    icon: "battery-low",
    description: "Pin 12V phụ trợ",
    priority: 2,
    aliases: ["VEHICLE_STATUS_LV_BATTERY_SOC"],
    fields: [
      {
        key: "battery_health_12v",
        label: "12V Battery SOC",
        unit: "%",
        format: "number",
        warning: { below: 50 },
        critical: { below: 30 },
      },
    ],
  },

  // ========================================
  // 2. CHARGING
  // ========================================
  CHARGING: {
    id: "charging",
    label: "Charging Status",
    icon: "bolt",
    description: "Trạng thái sạc xe",
    priority: 3,
    aliases: [
      "CHARGING_STATUS_CHARGING_STATUS",
      "CHARGING_STATUS_CHARGING_REMAINING_TIME",
      "CHARGE_CONTROL_CURRENT_TARGET_SOC",
      "CHARGING_STATUS_TARGET_SOC_CONTROL",
      "CHARGING_STATUS_CURRENT_POWER",
      "CHARGING_STATUS_VOLTAGE",
      "CHARGING_STATUS_CURRENT",
      "REMOTE_CONTROL_CHARGE_PORT_STATUS",
    ],
    fields: [
      {
        key: "charging_status",
        label: "Charging Status",
        format: "enum",
        enumMap: {
          0: "Not Plugged",
          1: "Plugged - Not Charging",
          2: "Charging",
          3: "Charging Complete",
          4: "Charging Error",
        },
      },
      {
        key: "remaining_charging_time",
        label: "Time Remaining",
        unit: "mins",
        format: "duration",
      },
      {
        key: "target_soc",
        label: "Target SOC",
        unit: "%",
        format: "number",
      },
      {
        key: "charging_power",
        label: "Charging Power",
        unit: "kW",
        format: "number",
      },
      {
        key: "charging_voltage",
        label: "Charging Voltage",
        unit: "V",
        format: "number",
      },
      {
        key: "charging_current",
        label: "Charging Current",
        unit: "A",
        format: "number",
      },
      {
        key: "charge_port_status",
        label: "Charge Port",
        format: "enum",
        enumMap: { 0: "Closed", 1: "Open" },
      },
    ],
  },

  // ========================================
  // 3. VEHICLE STATUS
  // ========================================
  VEHICLE_GENERAL: {
    id: "vehicle_general",
    label: "Vehicle Status",
    icon: "car",
    description: "Trạng thái chung của xe",
    priority: 4,
    aliases: [
      "VEHICLE_STATUS_ODOMETER",
      "VEHICLE_STATUS_VEHICLE_SPEED",
      "VEHICLE_STATUS_GEAR_POSITION",
      "VEHICLE_STATUS_IGNITION_STATUS",
      "VEHICLE_STATUS_HANDBRAKE_STATUS",
      "VEHICLE_STATUS_CENTRAL_LOCK_STATUS",
      "VEHICLE_STATUS_VEHICLE_DRVICE_MODE",
      "VEHICLE_STATUS_BRAKE_REGEN_MODE",
      "VEHICLE_STATUS_BRAKE_POSITION",
      "VEHICLE_STATUS_ACCELERATOR_PEDAL_POSITION",
      "VEHICLE_STATUS_NUMBER_OF_PASSENGERS",
      "VEHICLE_STATUS_PARKING_DURATION",
    ],
    fields: [
      {
        key: "odometer",
        label: "Odometer",
        unit: "km",
        format: "number",
        decimals: 1,
      },
      {
        key: "speed",
        label: "Current Speed",
        unit: "km/h",
        format: "number",
      },
      {
        key: "gear_position",
        label: "Gear Position",
        format: "enum",
        enumMap: { 0: "P", 1: "R", 2: "N", 3: "D", 4: "S" },
      },
      {
        key: "ignition_status",
        label: "Ignition",
        format: "boolean",
        trueLabel: "ON",
        falseLabel: "OFF",
      },
      {
        key: "handbrake_status",
        label: "Handbrake",
        format: "boolean",
        trueLabel: "Engaged",
        falseLabel: "Released",
      },
      {
        key: "central_lock_status",
        label: "Central Lock",
        format: "boolean",
        trueLabel: "Locked",
        falseLabel: "Unlocked",
      },
      {
        key: "drive_mode",
        label: "Drive Mode",
        format: "enum",
        enumMap: { 0: "Eco", 1: "Normal", 2: "Sport" },
      },
      {
        key: "regen_mode",
        label: "Regen Braking",
        format: "enum",
        enumMap: { 0: "Off", 1: "Low", 2: "Medium", 3: "High" },
      },
      {
        key: "brake_position",
        label: "Brake Pedal",
        unit: "%",
        format: "number",
      },
      {
        key: "accelerator_position",
        label: "Accelerator Pedal",
        unit: "%",
        format: "number",
      },
      {
        key: "passengers",
        label: "Passengers Detected",
        format: "number",
      },
      {
        key: "parking_duration",
        label: "Parked Duration",
        format: "duration",
        unit: "mins",
      },
    ],
  },

  // ========================================
  // 4. TIRE PRESSURE (TPMS)
  // ========================================
  TIRES: {
    id: "tires",
    label: "Tire Pressure (TPMS)",
    icon: "tire",
    description: "Áp suất và nhiệt độ lốp",
    priority: 5,
    aliases: [
      "VEHICLE_STATUS_FRONT_LEFT_TIRE_PRESSURE",
      "VEHICLE_STATUS_FRONT_RIGHT_TIRE_PRESSURE",
      "VEHICLE_STATUS_REAR_LEFT_TIRE_PRESSURE",
      "VEHICLE_STATUS_REAR_RIGHT_TIRE_PRESSURE",
      "VEHICLE_STATUS_FRONT_LEFT_TIRE_TEMPERATURE",
      "VEHICLE_STATUS_FRONT_RIGHT_TIRE_TEMPERATURE",
      "VEHICLE_STATUS_REAR_LEFT_TIRE_TEMPERATURE",
      "VEHICLE_STATUS_REAR_RIGHT_TIRE_TEMPERATURE",
      "VEHICLE_WARNINGS_FRONT_LEFT_TIRE_PRESSURE_LOW_STATUS",
      "VEHICLE_WARNINGS_FRONT_RIGHT_TIRE_PRESSURE_LOW_STATUS",
      "VEHICLE_WARNINGS_REAR_LEFT_TIRE_PRESSURE_LOW_STATUS",
      "VEHICLE_WARNINGS_REAR_RIGHT_TIRE_PRESSURE_LOW_STATUS",
    ],
    fields: [
      {
        key: "tire_pressure_fl",
        label: "Front Left Pressure",
        unit: "bar",
        format: "number",
        decimals: 1,
        warning: { below: 2.2, above: 3.2 },
        critical: { below: 1.8 },
      },
      {
        key: "tire_pressure_fr",
        label: "Front Right Pressure",
        unit: "bar",
        format: "number",
        decimals: 1,
        warning: { below: 2.2, above: 3.2 },
        critical: { below: 1.8 },
      },
      {
        key: "tire_pressure_rl",
        label: "Rear Left Pressure",
        unit: "bar",
        format: "number",
        decimals: 1,
        warning: { below: 2.2, above: 3.2 },
        critical: { below: 1.8 },
      },
      {
        key: "tire_pressure_rr",
        label: "Rear Right Pressure",
        unit: "bar",
        format: "number",
        decimals: 1,
        warning: { below: 2.2, above: 3.2 },
        critical: { below: 1.8 },
      },
      {
        key: "tire_temp_fl",
        label: "Front Left Temperature",
        unit: "°C",
        format: "number",
        warning: { above: 60 },
        critical: { above: 80 },
      },
      {
        key: "tire_temp_fr",
        label: "Front Right Temperature",
        unit: "°C",
        format: "number",
        warning: { above: 60 },
        critical: { above: 80 },
      },
      {
        key: "tire_temp_rl",
        label: "Rear Left Temperature",
        unit: "°C",
        format: "number",
        warning: { above: 60 },
        critical: { above: 80 },
      },
      {
        key: "tire_temp_rr",
        label: "Rear Right Temperature",
        unit: "°C",
        format: "number",
        warning: { above: 60 },
        critical: { above: 80 },
      },
    ],
  },

  // ========================================
  // 5. DOORS & SECURITY
  // ========================================
  DOORS: {
    id: "doors",
    label: "Doors & Security",
    icon: "door",
    description: "Trạng thái cửa và bảo mật",
    priority: 6,
    aliases: [
      "DOOR_AJAR_FRONT_LEFT_DOOR_STATUS",
      "DOOR_AJAR_FRONT_RIGHT_DOOR_STATUS",
      "DOOR_AJAR_REAR_LEFT_DOOR_STATUS",
      "DOOR_AJAR_REAR_RIGHT_DOOR_STATUS",
      "DOOR_BONNET_DOOR_STATUS",
      "DOOR_TRUNK_DOOR_STATUS",
      "REMOTE_CONTROL_DOOR_STATUS",
      "VEHICLE_STATUS_LOCK_STATUS",
      "VEHICLE_WARNINGS_DOORS_TRUNK_OPENING_WARNING_STATUS",
      "VEHICLE_WARNINGS_TRUNK_OPENING_WARNING_STATUS",
      "VEHICLE_WARNINGS_BONNET_OPENING_WARNING_STATUS",
      "VEHICLE_WARNINGS_ANTI_THIEF_DECTECTION_ALARM_STATUS",
    ],
    fields: [
      {
        key: "door_fl",
        label: "Front Left Door",
        format: "boolean",
        trueLabel: "Open",
        falseLabel: "Closed",
        warning: { equals: true },
      },
      {
        key: "door_fr",
        label: "Front Right Door",
        format: "boolean",
        trueLabel: "Open",
        falseLabel: "Closed",
        warning: { equals: true },
      },
      {
        key: "door_rl",
        label: "Rear Left Door",
        format: "boolean",
        trueLabel: "Open",
        falseLabel: "Closed",
        warning: { equals: true },
      },
      {
        key: "door_rr",
        label: "Rear Right Door",
        format: "boolean",
        trueLabel: "Open",
        falseLabel: "Closed",
        warning: { equals: true },
      },
      {
        key: "hood_status",
        label: "Hood (Bonnet)",
        format: "boolean",
        trueLabel: "Open",
        falseLabel: "Closed",
        warning: { equals: true },
      },
      {
        key: "trunk_status",
        label: "Trunk",
        format: "boolean",
        trueLabel: "Open",
        falseLabel: "Closed",
        warning: { equals: true },
      },
      {
        key: "is_locked",
        label: "Vehicle Lock",
        format: "boolean",
        trueLabel: "Locked",
        falseLabel: "Unlocked",
      },
      {
        key: "anti_theft_alarm",
        label: "Anti-Theft Alarm",
        format: "boolean",
        trueLabel: "Triggered",
        falseLabel: "Normal",
        critical: { equals: true },
      },
    ],
  },

  // ========================================
  // 6. WINDOWS & SUNROOF
  // ========================================
  WINDOWS: {
    id: "windows",
    label: "Windows & Sunroof",
    icon: "window",
    description: "Trạng thái cửa kính và cửa sổ trời",
    priority: 7,
    aliases: [
      "REMOTE_CONTROL_WINDOW_STATUS",
      "WINDOW_FRONT_LEFT_STATUS",
      "WINDOW_FRONT_RIGHT_STATUS",
      "WINDOW_REAR_LEFT_STATUS",
      "WINDOW_REAR_RIGHT_STATUS",
      "WINDOW_SUNROOF_STATUS",
      "VEHICLE_WARNINGS_WINDOWS_OPENING_WARNING_STATUS",
      "VEHICLE_WARNINGS_SUNROOF_OPENING_WARNING_STATUS",
    ],
    fields: [
      {
        key: "window_status",
        label: "Windows Status",
        format: "enum",
        enumMap: { 0: "All Closed", 1: "Some Open", 2: "All Open" },
      },
      {
        key: "window_fl",
        label: "Front Left Window",
        format: "enum",
        enumMap: { 0: "Closed", 1: "Partial", 2: "Open" },
      },
      {
        key: "window_fr",
        label: "Front Right Window",
        format: "enum",
        enumMap: { 0: "Closed", 1: "Partial", 2: "Open" },
      },
      {
        key: "window_rl",
        label: "Rear Left Window",
        format: "enum",
        enumMap: { 0: "Closed", 1: "Partial", 2: "Open" },
      },
      {
        key: "window_rr",
        label: "Rear Right Window",
        format: "enum",
        enumMap: { 0: "Closed", 1: "Partial", 2: "Open" },
      },
      {
        key: "sunroof_status",
        label: "Sunroof",
        format: "enum",
        enumMap: { 0: "Closed", 1: "Tilted", 2: "Open" },
      },
    ],
  },

  // ========================================
  // 7. CLIMATE CONTROL
  // ========================================
  CLIMATE: {
    id: "climate",
    label: "Climate Control",
    icon: "thermometer",
    description: "Điều hòa và nhiệt độ",
    priority: 8,
    aliases: [
      "VEHICLE_STATUS_AMBIENT_TEMPERATURE",
      "VEHICLE_STATUS_INTERIOR_TEMPERATURE",
      "CLIMATE_INFORMATION_STATUS",
      "CLIMATE_INFORMATION_DRIVER_TEMPERATURE",
      "CLIMATE_INFORMATION_PASSENGER_TEMPERATURE",
      "CLIMATE_INFORMATION_DRIVER_AIR_BLOW_LEVEL",
      "CLIMATE_INFORMATION_DRIVER_AC_MODE",
      "CLIMATE_INFORMATION_FRONT_DEFROST",
      "CLIMATE_INFORMATION_MAX_AC",
      "CLIMATE_INFORMATION_RE_CIRCULATION",
      "CLIMATE_INFORMATION_DUAL_CLIMATE_SYNC",
      "CLIMATE_INFORMATION_IONLIZER",
    ],
    fields: [
      {
        key: "outside_temp",
        label: "Outside Temperature",
        unit: "°C",
        format: "number",
        decimals: 1,
      },
      {
        key: "inside_temp",
        label: "Cabin Temperature",
        unit: "°C",
        format: "number",
        decimals: 1,
      },
      {
        key: "climate_status",
        label: "A/C Status",
        format: "boolean",
        trueLabel: "ON",
        falseLabel: "OFF",
      },
      {
        key: "climate_driver_temp",
        label: "Driver Set Temp",
        unit: "°C",
        format: "number",
      },
      {
        key: "climate_passenger_temp",
        label: "Passenger Set Temp",
        unit: "°C",
        format: "number",
      },
      {
        key: "fan_speed",
        label: "Fan Speed",
        format: "enum",
        enumMap: {
          0: "Off",
          1: "1",
          2: "2",
          3: "3",
          4: "4",
          5: "5",
          6: "6",
          7: "Auto",
        },
      },
      {
        key: "ac_mode",
        label: "A/C Mode",
        format: "string",
      },
      {
        key: "defrost_front",
        label: "Front Defrost",
        format: "boolean",
        trueLabel: "ON",
        falseLabel: "OFF",
      },
      {
        key: "max_ac",
        label: "Max A/C",
        format: "boolean",
        trueLabel: "ON",
        falseLabel: "OFF",
      },
      {
        key: "recirculation",
        label: "Air Recirculation",
        format: "boolean",
        trueLabel: "ON",
        falseLabel: "OFF",
      },
      {
        key: "dual_climate_sync",
        label: "Dual Zone Sync",
        format: "boolean",
        trueLabel: "Synced",
        falseLabel: "Independent",
      },
      {
        key: "ionizer",
        label: "Ionizer",
        format: "boolean",
        trueLabel: "ON",
        falseLabel: "OFF",
      },
    ],
  },

  // ========================================
  // 8. SEAT CONTROLS
  // ========================================
  SEATS: {
    id: "seats",
    label: "Seat Controls",
    icon: "seat",
    description: "Ghế ngồi sưởi/làm mát",
    priority: 9,
    aliases: [
      "CLIMATE_INFORMATION_FRONT_LEFT_SEAT_HEATING",
      "CLIMATE_INFORMATION_FRONT_RIGHT_SEAT_HEATING",
      "CLIMATE_INFORMATION_FRONT_LEFT_SEAT_VENTILATION",
      "CLIMATE_INFORMATION_FRONT_RIGHT_SEAT_VENTILATION",
      "CLIMATE_INFORMATION_FRONT_LEFT_SEAT_COOLING",
      "CLIMATE_INFORMATION_FRONT_RIGHT_SEAT_COOLING",
      "CLIMATE_INFORMATION_REAR_LEFT_SEAT_HEATING",
      "CLIMATE_INFORMATION_REAR_RIGHT_SEAT_HEATING",
      "CLIMATE_INFORMATION_REAR_LEFT_SEAT_VENTILATION",
      "CLIMATE_INFORMATION_REAR_RIGHT_SEAT_VENTILATION",
      "CLIMATE_INFORMATION_REAR_LEFT_SEAT_COOLING",
      "CLIMATE_INFORMATION_REAR_RIGHT_SEAT_COOLING",
      "VEHICLE_STATUS_DRIVER_RECLINER_POSITION",
      "VEHICLE_STATUS_DRIVER_TILT_POSITION",
      "VEHICLE_STATUS_DRIVER_TRACK_POSITION",
      "VEHICLE_STATUS_DRIVER_HEIGHT_POSITION",
    ],
    fields: [
      {
        key: "seat_heat_fl",
        label: "Driver Seat Heating",
        format: "enum",
        enumMap: { 0: "Off", 1: "Low", 2: "Medium", 3: "High" },
      },
      {
        key: "seat_heat_fr",
        label: "Passenger Seat Heating",
        format: "enum",
        enumMap: { 0: "Off", 1: "Low", 2: "Medium", 3: "High" },
      },
      {
        key: "seat_vent_fl",
        label: "Driver Seat Ventilation",
        format: "enum",
        enumMap: { 0: "Off", 1: "Low", 2: "Medium", 3: "High" },
      },
      {
        key: "seat_vent_fr",
        label: "Passenger Seat Ventilation",
        format: "enum",
        enumMap: { 0: "Off", 1: "Low", 2: "Medium", 3: "High" },
      },
      {
        key: "seat_cool_fl",
        label: "Driver Seat Cooling",
        format: "enum",
        enumMap: { 0: "Off", 1: "Low", 2: "Medium", 3: "High" },
      },
      {
        key: "seat_cool_fr",
        label: "Passenger Seat Cooling",
        format: "enum",
        enumMap: { 0: "Off", 1: "Low", 2: "Medium", 3: "High" },
      },
      {
        key: "seat_heat_rl",
        label: "Rear Left Seat Heating",
        format: "enum",
        enumMap: { 0: "Off", 1: "Low", 2: "Medium", 3: "High" },
      },
      {
        key: "seat_heat_rr",
        label: "Rear Right Seat Heating",
        format: "enum",
        enumMap: { 0: "Off", 1: "Low", 2: "Medium", 3: "High" },
      },
    ],
  },

  // ========================================
  // 9. LOCATION & GPS
  // ========================================
  LOCATION: {
    id: "location",
    label: "Location & GPS",
    icon: "location",
    description: "Vị trí và GPS",
    priority: 10,
    aliases: [
      "LOCATION_LATITUDE",
      "LOCATION_LONGITUDE",
      "LOCATION_ALTITUDE",
      "LOCATION_VELOCITY",
      "LOCATION_BEARING_DEGREE",
      "LOCATION_GNSS_STATUS",
      "LOCATION_TIMESTAMP",
    ],
    fields: [
      {
        key: "latitude",
        label: "Latitude",
        format: "coordinate",
        decimals: 6,
      },
      {
        key: "longitude",
        label: "Longitude",
        format: "coordinate",
        decimals: 6,
      },
      {
        key: "altitude",
        label: "Altitude",
        unit: "m",
        format: "number",
      },
      {
        key: "heading",
        label: "Heading",
        unit: "°",
        format: "number",
      },
      {
        key: "gps_velocity",
        label: "GPS Speed",
        unit: "km/h",
        format: "number",
      },
      {
        key: "gps_status",
        label: "GPS Signal",
        format: "enum",
        enumMap: { 0: "No Fix", 1: "2D Fix", 2: "3D Fix" },
      },
      {
        key: "location_address",
        label: "Address",
        format: "string",
      },
    ],
  },

  // ========================================
  // 10. SPECIAL MODES
  // ========================================
  SPECIAL_MODES: {
    id: "special_modes",
    label: "Special Modes",
    icon: "star",
    description: "Chế độ đặc biệt",
    priority: 11,
    aliases: [
      "PET_MODE_CONTROL_STATUS",
      "CAMP_MODE_CONTROL_STATUS",
      "VALET_MODE_CONTROL_STATUS",
      "SENTRY_MODE_CONTROL_STATUS",
    ],
    fields: [
      {
        key: "pet_mode",
        label: "Pet Mode",
        format: "boolean",
        trueLabel: "Active",
        falseLabel: "Inactive",
      },
      {
        key: "camp_mode",
        label: "Camp Mode",
        format: "boolean",
        trueLabel: "Active",
        falseLabel: "Inactive",
      },
      {
        key: "valet_mode",
        label: "Valet Mode",
        format: "boolean",
        trueLabel: "Active",
        falseLabel: "Inactive",
      },
      {
        key: "sentry_mode",
        label: "Sentry Mode",
        format: "boolean",
        trueLabel: "Active",
        falseLabel: "Inactive",
      },
    ],
  },

  // ========================================
  // 11. LIGHTS
  // ========================================
  LIGHTS: {
    id: "lights",
    label: "Lights",
    icon: "lightbulb",
    description: "Hệ thống đèn",
    priority: 12,
    aliases: [
      "LIGHT_FRONT_FOG_LAMP_LIGHT_STATUS",
      "LIGHT_POSITION_LIGHT_LIGHT_STATUS",
      "LIGHT_INTERIOR_LIGHT_LIGHT_STATUS",
      "LIGHT_LOW_BEAM_LIGHT_LIGHT_STATUS",
      "LIGHT_HIGH_BEAM_LIGHT_LIGHT_STATUS",
      "LIGHT_TURNS_INDICATOR_LIGHT_LIGHT_STATUS",
      "LIGHT_BREAK_LIGHT_LIGHT_STATUS",
      "LIGHT_REAR_FOG_LIGHT_LIGHT_STATUS",
      "LIGHT_DAY_RUNNING_LIGHT_LIGHT_STATUS",
      "LIGHT_AUTO_HEADLIGHT_LIGHT_STATUS",
      "LIGHT_LICENSE_PLATE_LIGHT_LIGHT_STATUS",
      "LIGHT_FRONT_DIMMING_DOME_LIGHT_LIGHT_STATUS",
      "LIGHT_REAR_DIMMING_DOME_LIGHT_LIGHT_STATUS",
      "LIGHT_REVERT_LIGHT_LIGHT_STATUS",
    ],
    fields: [
      {
        key: "light_low_beam",
        label: "Low Beam",
        format: "boolean",
        trueLabel: "ON",
        falseLabel: "OFF",
      },
      {
        key: "light_high_beam",
        label: "High Beam",
        format: "boolean",
        trueLabel: "ON",
        falseLabel: "OFF",
      },
      {
        key: "light_fog_front",
        label: "Front Fog Lights",
        format: "boolean",
        trueLabel: "ON",
        falseLabel: "OFF",
      },
      {
        key: "light_fog_rear",
        label: "Rear Fog Lights",
        format: "boolean",
        trueLabel: "ON",
        falseLabel: "OFF",
      },
      {
        key: "light_drl",
        label: "Daytime Running Lights",
        format: "boolean",
        trueLabel: "ON",
        falseLabel: "OFF",
      },
      {
        key: "light_auto",
        label: "Auto Headlights",
        format: "boolean",
        trueLabel: "Enabled",
        falseLabel: "Disabled",
      },
      {
        key: "light_interior",
        label: "Interior Lights",
        format: "boolean",
        trueLabel: "ON",
        falseLabel: "OFF",
      },
      {
        key: "light_turn_indicator",
        label: "Turn Indicators",
        format: "enum",
        enumMap: { 0: "Off", 1: "Left", 2: "Right", 3: "Hazard" },
      },
      {
        key: "light_brake",
        label: "Brake Lights",
        format: "boolean",
        trueLabel: "ON",
        falseLabel: "OFF",
      },
      {
        key: "light_reverse",
        label: "Reverse Lights",
        format: "boolean",
        trueLabel: "ON",
        falseLabel: "OFF",
      },
    ],
  },

  // ========================================
  // 12. CRASH & SAFETY
  // ========================================
  SAFETY: {
    id: "safety",
    label: "Crash & Safety",
    icon: "shield",
    description: "An toàn và phát hiện va chạm",
    priority: 13,
    aliases: [
      "VEHICLE_CRASH_STATUS_FRONT_CRASH",
      "VEHICLE_CRASH_STATUS_REAR_CRASH",
      "VEHICLE_CRASH_STATUS_SIDE_LEFT_CRASH",
      "VEHICLE_CRASH_STATUS_SIDE_RIGHT_CRASH",
      "VEHICLE_CRASH_STATUS_ROLL_OVER_CRASH",
      "VEHICLE_CRASH_STATUS_ACTIVE_PEDESTRIAN_PROTECTION_CRASH",
      "VEHICLE_CRASH_STATUS_AIRBAG_DEPLOYED",
      "VEHICLE_CRASH_STATUS_E_CALL_ACTIVATED",
      "VEHICLE_CRASH_STATUS_GENERAL_CRASH_DETECTED",
      "VEHICLE_WARNINGS_CHILD_PRESENT_DETECTION_ALARM_STATUS",
      "VEHICLE_WARNINGS_CHILD_PET_PRESENT_DETECTION_ALARM_TO_BCM_STATUS",
    ],
    fields: [
      {
        key: "crash_front",
        label: "Front Crash",
        format: "boolean",
        trueLabel: "Detected",
        falseLabel: "None",
        critical: { equals: true },
      },
      {
        key: "crash_rear",
        label: "Rear Crash",
        format: "boolean",
        trueLabel: "Detected",
        falseLabel: "None",
        critical: { equals: true },
      },
      {
        key: "crash_left",
        label: "Left Side Crash",
        format: "boolean",
        trueLabel: "Detected",
        falseLabel: "None",
        critical: { equals: true },
      },
      {
        key: "crash_right",
        label: "Right Side Crash",
        format: "boolean",
        trueLabel: "Detected",
        falseLabel: "None",
        critical: { equals: true },
      },
      {
        key: "crash_rollover",
        label: "Rollover",
        format: "boolean",
        trueLabel: "Detected",
        falseLabel: "None",
        critical: { equals: true },
      },
      {
        key: "airbag_deployed",
        label: "Airbag Deployed",
        format: "boolean",
        trueLabel: "YES",
        falseLabel: "NO",
        critical: { equals: true },
      },
      {
        key: "ecall_activated",
        label: "eCall Activated",
        format: "boolean",
        trueLabel: "YES",
        falseLabel: "NO",
        critical: { equals: true },
      },
      {
        key: "child_detection",
        label: "Child Detection",
        format: "boolean",
        trueLabel: "Detected",
        falseLabel: "Clear",
        warning: { equals: true },
      },
    ],
  },

  // ========================================
  // 13. WARNINGS & ALERTS
  // ========================================
  WARNINGS: {
    id: "warnings",
    label: "Warnings & Alerts",
    icon: "warning",
    description: "Cảnh báo hệ thống",
    priority: 14,
    aliases: [
      "VEHICLE_WARNINGS_LOW_FUEL_BATTERY_WARNING_STATUS",
      "VEHICLE_WARNINGS_HV_BATTERY_LOW_SOC_WARNING_STATUS",
      "VEHICLE_WARNINGS_SPEED_LIMIT_WARNING_STATUS",
      "VEHICLE_WARNINGS_COOLANT_LEVEL_LOW_WARNING_STATUS",
      "VEHICLE_WARNINGS_CHARGE_LID_OPENING_WARNING_STATUS",
      "CCARSERVICE_OBJECT_BOOKING_SERVICE_STATUS",
    ],
    fields: [
      {
        key: "warning_low_battery",
        label: "Low Battery Warning",
        format: "boolean",
        trueLabel: "Active",
        falseLabel: "Normal",
        warning: { equals: true },
      },
      {
        key: "warning_hv_low_soc",
        label: "HV Battery Low SOC",
        format: "boolean",
        trueLabel: "Active",
        falseLabel: "Normal",
        warning: { equals: true },
      },
      {
        key: "warning_speed_limit",
        label: "Speed Limit Warning",
        format: "boolean",
        trueLabel: "Active",
        falseLabel: "Normal",
      },
      {
        key: "warning_coolant_low",
        label: "Low Coolant",
        format: "boolean",
        trueLabel: "Low",
        falseLabel: "Normal",
        warning: { equals: true },
      },
      {
        key: "warning_charge_lid",
        label: "Charge Lid Open",
        format: "boolean",
        trueLabel: "Open",
        falseLabel: "Closed",
      },
      {
        key: "service_alert",
        label: "Service Alert",
        format: "string",
      },
    ],
  },

  // ========================================
  // 14. TRIP INFORMATION
  // ========================================
  TRIPS: {
    id: "trips",
    label: "Trip Information",
    icon: "route",
    description: "Thông tin chuyến đi",
    priority: 15,
    aliases: [
      "TRIPS_INFORMATION_TRIP_A_DISTANCE",
      "TRIPS_INFORMATION_TRIP_A_AVERAGE_SPEED",
      "TRIPS_INFORMATION_TRIP_A_AVERAGE_POWER_CONSUMPTION_NON_VFE34",
      "TRIPS_INFORMATION_TRIP_B_DISTANCE",
      "TRIPS_INFORMATION_TRIP_B_AVERAGE_SPEED",
      "TRIPS_INFORMATION_TRIP_B_AVERAGE_POWER_CONSUMPTION_NON_VFE34",
      "TRIPS_INFORMATION_CURRENT_TRIP_DISTANCE",
      "TRIPS_INFORMATION_CURRENT_TRIP_AVERAGE_SPEED",
      "TRIPS_INFORMATION_CURRENT_TRIP_AVERAGE_POWER_CONSUMPTION_NON_VFE34",
    ],
    fields: [
      {
        key: "trip_a_distance",
        label: "Trip A Distance",
        unit: "km",
        format: "number",
        decimals: 1,
      },
      {
        key: "trip_a_avg_speed",
        label: "Trip A Avg Speed",
        unit: "km/h",
        format: "number",
      },
      {
        key: "trip_a_consumption",
        label: "Trip A Consumption",
        unit: "kWh/100km",
        format: "number",
        decimals: 1,
      },
      {
        key: "trip_b_distance",
        label: "Trip B Distance",
        unit: "km",
        format: "number",
        decimals: 1,
      },
      {
        key: "trip_b_avg_speed",
        label: "Trip B Avg Speed",
        unit: "km/h",
        format: "number",
      },
      {
        key: "trip_b_consumption",
        label: "Trip B Consumption",
        unit: "kWh/100km",
        format: "number",
        decimals: 1,
      },
      {
        key: "current_trip_distance",
        label: "Current Trip Distance",
        unit: "km",
        format: "number",
        decimals: 1,
      },
      {
        key: "current_trip_avg_speed",
        label: "Current Trip Avg Speed",
        unit: "km/h",
        format: "number",
      },
      {
        key: "current_trip_consumption",
        label: "Current Trip Consumption",
        unit: "kWh/100km",
        format: "number",
        decimals: 1,
      },
    ],
  },

  // ========================================
  // 15. FIRMWARE & ECU
  // ========================================
  FIRMWARE: {
    id: "firmware",
    label: "Firmware & ECU",
    icon: "cpu",
    description: "Phiên bản phần mềm và ECU",
    priority: 16,
    aliases: [
      "FIRMWARE_UPDATE_CURRENT_PKG_VERSION",
      "FIRMWARE_UPDATE_STATE",
      "FIRMWARE_UPDATE_TOTAL_OVERALL_PROGRESS",
      "VERSION_INFO_TBOX_SOFTWARE_VERSION",
    ],
    fields: [
      {
        key: "firmware_version",
        label: "Firmware Version",
        format: "string",
      },
      {
        key: "firmware_state",
        label: "Update State",
        format: "enum",
        enumMap: {
          0: "Idle",
          1: "Downloading",
          2: "Ready",
          3: "Installing",
          4: "Complete",
          5: "Error",
        },
      },
      {
        key: "firmware_progress",
        label: "Update Progress",
        unit: "%",
        format: "number",
      },
      {
        key: "tbox_version",
        label: "T-Box Version",
        format: "string",
      },
    ],
  },

  // ========================================
  // 16. ECU MODULES
  // ========================================
  ECU_MODULES: {
    id: "ecu_modules",
    label: "ECU Modules",
    icon: "microchip",
    description: "Thông tin các bộ điều khiển điện tử",
    priority: 17,
    aliases: [
      "ECUS_INFORMATION_MHU_SOFTWARE_VERSION",
      "ECUS_INFORMATION_MHU_HARDWARE_VERSION",
      "ECUS_INFORMATION_MHU_MANUFACTURE",
      "ECUS_INFORMATION_XGW_SOFTWARE_VERSION",
      "ECUS_INFORMATION_BCM_SOFTWARE_VERSION",
      "ECUS_INFORMATION_ACM_SOFTWARE_VERSION",
      "ECUS_INFORMATION_VCU_SOFTWARE_VERSION",
      "ECUS_INFORMATION_ETG_SOFTWARE_VERSION",
      "ECUS_INFORMATION_BMS_SOFTWARE_VERSION",
    ],
    fields: [
      {
        key: "ecu_mhu_sw",
        label: "MHU (Infotainment)",
        format: "string",
      },
      {
        key: "ecu_mhu_hw",
        label: "MHU Hardware",
        format: "string",
      },
      {
        key: "ecu_mhu_manufacturer",
        label: "MHU Manufacturer",
        format: "string",
      },
      {
        key: "ecu_xgw_sw",
        label: "XGW (Gateway)",
        format: "string",
      },
      {
        key: "ecu_bcm_sw",
        label: "BCM (Body Control)",
        format: "string",
      },
      {
        key: "ecu_acm_sw",
        label: "ACM (A/C Module)",
        format: "string",
      },
      {
        key: "ecu_vcu_sw",
        label: "VCU (Vehicle Control)",
        format: "string",
      },
      {
        key: "ecu_etg_sw",
        label: "ETG (E-Trans)",
        format: "string",
      },
      {
        key: "ecu_bms_sw",
        label: "BMS (Battery)",
        format: "string",
      },
    ],
  },

  // ========================================
  // 17. VEHICLE IDENTITY
  // ========================================
  IDENTITY: {
    id: "identity",
    label: "Vehicle Identity",
    icon: "id-card",
    description: "Thông tin định danh xe",
    priority: 18,
    aliases: [
      "VINFAST_VEHICLE_IDENTIFIER_VIN_NUMBER",
      "VINFAST_VEHICLE_IDENTIFIER_VEHICLE_MANUFACTURER",
      "VINFAST_VEHICLE_IDENTIFIER_MODEL_YEAR",
      "VINFAST_VEHICLE_IDENTIFIER_VEHICLE_NAME",
      "VINFAST_VEHICLE_IDENTIFIER_VEHICLE_OWNER",
      "VINFAST_VEHICLE_MASTER_INFO_VEHICLE_PLATFORM",
      "VINFAST_VEHICLE_MASTER_INFO_VEHICLE_CLASS",
      "VINFAST_VEHICLE_MASTER_INFO_ENGINE_TYPE",
      "VINFAST_VEHICLE_MASTER_INFO_VEHICLE_VARIANT",
      "VINFAST_VEHICLE_MASTER_INFO_MARKET_AREA",
      "VINFAST_VEHICLE_MASTER_INFO_MARKETING_NAME",
    ],
    fields: [
      {
        key: "vin_number",
        label: "VIN Number",
        format: "string",
      },
      {
        key: "manufacturer",
        label: "Manufacturer",
        format: "string",
      },
      {
        key: "model_year",
        label: "Model Year",
        format: "string",
      },
      {
        key: "vehicle_name",
        label: "Vehicle Name",
        format: "string",
      },
      {
        key: "owner_name",
        label: "Owner Name",
        format: "string",
      },
      {
        key: "platform",
        label: "Platform",
        format: "string",
      },
      {
        key: "vehicle_class",
        label: "Vehicle Class",
        format: "string",
      },
      {
        key: "engine_type",
        label: "Engine Type",
        format: "string",
      },
      {
        key: "variant",
        label: "Variant",
        format: "string",
      },
      {
        key: "market_area",
        label: "Market Area",
        format: "string",
      },
      {
        key: "marketing_name",
        label: "Marketing Name",
        format: "string",
      },
    ],
  },

  // ========================================
  // 18. CONNECTIVITY & SERVICES
  // ========================================
  CONNECTIVITY: {
    id: "connectivity",
    label: "Connectivity & Services",
    icon: "wifi",
    description: "Kết nối và dịch vụ",
    priority: 19,
    aliases: [
      "CAPP_PAIRING_STATUS",
      "CAPP_PAIRING_DEVICE_ID",
      "DATA_PRIVACY_SETTING",
      "BATTERY_LEASING_STATUS",
      "CCARSERVICE_OBJECT_SERVICE_STATUS",
    ],
    fields: [
      {
        key: "pairing_status",
        label: "App Pairing",
        format: "boolean",
        trueLabel: "Connected",
        falseLabel: "Not Connected",
      },
      {
        key: "device_id",
        label: "Paired Device ID",
        format: "string",
      },
      {
        key: "data_privacy",
        label: "Data Privacy",
        format: "enum",
        enumMap: { 0: "Off", 1: "Basic", 2: "Full" },
      },
      {
        key: "battery_leasing",
        label: "Battery Leasing",
        format: "boolean",
        trueLabel: "Active",
        falseLabel: "Inactive",
      },
      {
        key: "service_status",
        label: "Connected Service",
        format: "enum",
        enumMap: { 0: "Inactive", 1: "Active", 2: "Expired" },
      },
    ],
  },
};

// Helper: Get all groups sorted by priority
export const getSortedGroups = () => {
  return Object.values(DEEP_SCAN_GROUPS).sort(
    (a, b) => a.priority - b.priority,
  );
};

// Helper: Get group by alias
export const getGroupByAlias = (alias) => {
  for (const group of Object.values(DEEP_SCAN_GROUPS)) {
    if (group.aliases.includes(alias)) {
      return group;
    }
  }
  return null;
};

// Helper: Get all aliases
export const getAllAliases = () => {
  const aliases = [];
  for (const group of Object.values(DEEP_SCAN_GROUPS)) {
    aliases.push(...group.aliases);
  }
  return [...new Set(aliases)];
};

// Helper: Count total fields
export const getTotalFieldsCount = () => {
  let count = 0;
  for (const group of Object.values(DEEP_SCAN_GROUPS)) {
    count += group.fields.length;
  }
  return count;
};

// Summary
export const DEEP_SCAN_SUMMARY = {
  totalGroups: Object.keys(DEEP_SCAN_GROUPS).length,
  totalAliases: getAllAliases().length,
  totalFields: getTotalFieldsCount(),
  groups: Object.keys(DEEP_SCAN_GROUPS),
};

export default DEEP_SCAN_GROUPS;
