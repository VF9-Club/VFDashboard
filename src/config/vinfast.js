import staticAliasMap from "./static_alias_map.json";

export const DEFAULT_REGION = "vn";

export const REGIONS = {
  us: {
    name: "United States",
    auth0_domain: "vinfast-us-prod.us.auth0.com",
    auth0_client_id: "xhGY7XKDFSk1Q22rxidvwujfz0EPAbUP",
    auth0_audience: "https://vinfast-us-prod.us.auth0.com/api/v2/",
    api_base: "https://mobile.connected-car.vinfastauto.us",
  },
  eu: {
    name: "Europe",
    auth0_domain: "vinfast-eu-prod.eu.auth0.com",
    auth0_client_id: "dxxtNkkhsPWW78x6s1BWQlmuCfLQrkze",
    auth0_audience: "https://vinfast-eu-prod.eu.auth0.com/api/v2/",
    api_base: "https://mobile.connected-car.vinfastauto.eu",
  },
  vn: {
    name: "Vietnam",
    auth0_domain: "vin3s.au.auth0.com",
    auth0_client_id: "jE5xt50qC7oIh1f32qMzA6hGznIU5mgH",
    auth0_audience: "https://vin3s.au.auth0.com/api/v2/",
    api_base: "https://mobile.connected-car.vinfast.vn",
  },
};

export const API_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "x-service-name": "CAPP",
  "x-app-version": "1.10.3",
  "x-device-platform": "VFDashBoard",
  "x-device-family": "Community",
  "x-device-os-version": "1.0",
  "x-device-locale": "en-US",
  "x-timezone": "Asia/Ho_Chi_Minh",
  "x-device-identifier": "vfdashboard-community-edition",
};

export const CORE_TELEMETRY_ALIASES = [
  "VEHICLE_STATUS_HV_BATTERY_SOC",
  "VEHICLE_STATUS_LV_BATTERY_SOC",
  "VEHICLE_STATUS_REMAINING_DISTANCE",
  "VEHICLE_STATUS_ODOMETER",
  "CHARGING_STATUS_CHARGING_STATUS",
  "CHARGING_STATUS_CHARGING_REMAINING_TIME",
  "CHARGE_CONTROL_CURRENT_TARGET_SOC",
  "VEHICLE_STATUS_IGNITION_STATUS",
  "VEHICLE_STATUS_GEAR_POSITION",
  "VEHICLE_STATUS_VEHICLE_SPEED",
  "VEHICLE_STATUS_HANDBRAKE_STATUS",
  "VEHICLE_STATUS_AMBIENT_TEMPERATURE",
  "CLIMATE_INFORMATION_DRIVER_TEMPERATURE",
  "VEHICLE_STATUS_FRONT_LEFT_TIRE_PRESSURE",
  "VEHICLE_STATUS_FRONT_RIGHT_TIRE_PRESSURE",
  "VEHICLE_STATUS_REAR_LEFT_TIRE_PRESSURE",
  "VEHICLE_STATUS_REAR_RIGHT_TIRE_PRESSURE",
  "DOOR_AJAR_FRONT_LEFT_DOOR_STATUS",
  "DOOR_AJAR_FRONT_RIGHT_DOOR_STATUS",
  "DOOR_AJAR_REAR_LEFT_DOOR_STATUS",
  "DOOR_AJAR_REAR_RIGHT_DOOR_STATUS",
  "DOOR_TRUNK_DOOR_STATUS",
  "REMOTE_CONTROL_DOOR_STATUS",
  "REMOTE_CONTROL_BONNET_CONTROL_STATUS",
  "REMOTE_CONTROL_WINDOW_STATUS",
  "REMOTE_CONTROL_CHARGE_PORT_STATUS",
  "REMOTE_CONTROL_CHARGE_PORT_STATUS",
  // Corrected Mappings from Legacy
  "VEHICLE_STATUS_FRONT_LEFT_TIRE_TEMPERATURE",
  "VEHICLE_STATUS_FRONT_RIGHT_TIRE_TEMPERATURE",
  "VEHICLE_STATUS_REAR_LEFT_TIRE_TEMPERATURE",
  "VEHICLE_STATUS_REAR_RIGHT_TIRE_TEMPERATURE",
  "PET_MODE_CONTROL_STATUS",
  "CAMP_MODE_CONTROL_STATUS",

  "VEHICLE_STATUS_LOCK_STATUS",
  "CLIMATE_INFORMATION_PASSENGER_TEMPERATURE",
  "CLIMATE_INFORMATION_DRIVER_AIR_BLOW_LEVEL", // Was CLIMATE_INFORMATION_FAN_SPEED
  "LOCATION_LATITUDE",
  "LOCATION_LONGITUDE",
  "VEHICLE_BEARING_DEGREE",
  "BMS_STATUS_STATE_OF_HEALTH", // FR-C-05
  "BMS_STATUS_BATTERY_TYPE",
  "BMS_STATUS_BATTERY_SERIAL_NUMBER",
  "BMS_STATUS_BATTERY_DECODED_MANUFACTURE_DATE",
  "VINFAST_VEHICLE_IDENTIFIER_VEHICLE_MANUFACTURER",

  // System Health / Vehicle Status
  "FIRMWARE_UPDATE_CURRENT_PKG_VERSION",
  "VERSION_INFO_TBOX_SOFTWARE_VERSION",
  "BMS_STATUS_THERMAL_RUNAWAY_WARNING",
  "CCARSERVICE_OBJECT_BOOKING_SERVICE_STATUS",
];

export const FALLBACK_TELEMETRY_RESOURCES = [
  "/34196/0/0",
  "/34196/0/1",
  "/34197/0/0",
  "/34197/0/1",
  "/34197/0/2",
  "/34193/0/0",
  "/34200/0/0",
  "/34200/0/1",
  "/34201/0/0",
  "/34202/0/0",
];

export const STATIC_ALIAS_MAP_EXPORT = staticAliasMap;
