# Deep Scan Telemetry Groups

**Version:** 1.0
**Date:** January 25, 2026

Tài liệu này tổng hợp tất cả dữ liệu Telemetry được chia nhóm cho màn hình Deep Scan.

---

## Tổng Quan

| Thông tin       | Giá trị |
| --------------- | ------- |
| Tổng số nhóm    | 19      |
| Tổng số aliases | 150+    |
| Tổng số fields  | 120+    |

---

## 1. High Voltage Battery (Pin Cao Áp)

**Icon:** battery | **Priority:** 1

| Field                      | Label                   | Unit | Warning | Critical |
| -------------------------- | ----------------------- | ---- | ------- | -------- |
| `battery_level`            | State of Charge (SOC)   | %    | <20%    | <10%     |
| `range`                    | Estimated Range         | km   | <50km   | -        |
| `soh_percentage`           | State of Health (SOH)   | %    | <80%    | -        |
| `battery_type`             | Battery Type            | -    | -       | -        |
| `battery_serial`           | Battery Serial Number   | -    | -       | -        |
| `battery_manufacture_date` | Manufacture Date        | -    | -       | -        |
| `thermal_warning`          | Thermal Runaway Warning | -    | -       | =true    |

---

## 2. 12V Battery (Pin 12V Phụ Trợ)

**Icon:** battery-low | **Priority:** 2

| Field                | Label           | Unit | Warning | Critical |
| -------------------- | --------------- | ---- | ------- | -------- |
| `battery_health_12v` | 12V Battery SOC | %    | <50%    | <30%     |

---

## 3. Charging Status (Trạng Thái Sạc)

**Icon:** bolt | **Priority:** 3

| Field                     | Label            | Unit | Values                                                    |
| ------------------------- | ---------------- | ---- | --------------------------------------------------------- |
| `charging_status`         | Charging Status  | -    | 0=Not Plugged, 1=Plugged, 2=Charging, 3=Complete, 4=Error |
| `remaining_charging_time` | Time Remaining   | mins | -                                                         |
| `target_soc`              | Target SOC       | %    | -                                                         |
| `charging_power`          | Charging Power   | kW   | -                                                         |
| `charging_voltage`        | Charging Voltage | V    | -                                                         |
| `charging_current`        | Charging Current | A    | -                                                         |
| `charge_port_status`      | Charge Port      | -    | 0=Closed, 1=Open                                          |

---

## 4. Vehicle Status (Trạng Thái Xe)

**Icon:** car | **Priority:** 4

| Field                  | Label               | Unit | Values                 |
| ---------------------- | ------------------- | ---- | ---------------------- |
| `odometer`             | Odometer            | km   | -                      |
| `speed`                | Current Speed       | km/h | -                      |
| `gear_position`        | Gear Position       | -    | P, R, N, D, S          |
| `ignition_status`      | Ignition            | -    | ON/OFF                 |
| `handbrake_status`     | Handbrake           | -    | Engaged/Released       |
| `central_lock_status`  | Central Lock        | -    | Locked/Unlocked        |
| `drive_mode`           | Drive Mode          | -    | Eco, Normal, Sport     |
| `regen_mode`           | Regen Braking       | -    | Off, Low, Medium, High |
| `brake_position`       | Brake Pedal         | %    | -                      |
| `accelerator_position` | Accelerator Pedal   | %    | -                      |
| `passengers`           | Passengers Detected | -    | -                      |
| `parking_duration`     | Parked Duration     | mins | -                      |

---

## 5. Tire Pressure (TPMS)

**Icon:** tire | **Priority:** 5

| Field              | Label                   | Unit | Warning      | Critical |
| ------------------ | ----------------------- | ---- | ------------ | -------- |
| `tire_pressure_fl` | Front Left Pressure     | bar  | <2.2 or >3.2 | <1.8     |
| `tire_pressure_fr` | Front Right Pressure    | bar  | <2.2 or >3.2 | <1.8     |
| `tire_pressure_rl` | Rear Left Pressure      | bar  | <2.2 or >3.2 | <1.8     |
| `tire_pressure_rr` | Rear Right Pressure     | bar  | <2.2 or >3.2 | <1.8     |
| `tire_temp_fl`     | Front Left Temperature  | °C   | >60°C        | >80°C    |
| `tire_temp_fr`     | Front Right Temperature | °C   | >60°C        | >80°C    |
| `tire_temp_rl`     | Rear Left Temperature   | °C   | >60°C        | >80°C    |
| `tire_temp_rr`     | Rear Right Temperature  | °C   | >60°C        | >80°C    |

---

## 6. Doors & Security (Cửa & Bảo Mật)

**Icon:** door | **Priority:** 6

| Field              | Label            | Values           | Warning               |
| ------------------ | ---------------- | ---------------- | --------------------- |
| `door_fl`          | Front Left Door  | Open/Closed      | =Open                 |
| `door_fr`          | Front Right Door | Open/Closed      | =Open                 |
| `door_rl`          | Rear Left Door   | Open/Closed      | =Open                 |
| `door_rr`          | Rear Right Door  | Open/Closed      | =Open                 |
| `hood_status`      | Hood (Bonnet)    | Open/Closed      | =Open                 |
| `trunk_status`     | Trunk            | Open/Closed      | =Open                 |
| `is_locked`        | Vehicle Lock     | Locked/Unlocked  | -                     |
| `anti_theft_alarm` | Anti-Theft Alarm | Normal/Triggered | Critical if Triggered |

---

## 7. Windows & Sunroof (Cửa Kính)

**Icon:** window | **Priority:** 7

| Field            | Label              | Values                          |
| ---------------- | ------------------ | ------------------------------- |
| `window_status`  | Windows Status     | All Closed, Some Open, All Open |
| `window_fl`      | Front Left Window  | Closed, Partial, Open           |
| `window_fr`      | Front Right Window | Closed, Partial, Open           |
| `window_rl`      | Rear Left Window   | Closed, Partial, Open           |
| `window_rr`      | Rear Right Window  | Closed, Partial, Open           |
| `sunroof_status` | Sunroof            | Closed, Tilted, Open            |

---

## 8. Climate Control (Điều Hòa)

**Icon:** thermometer | **Priority:** 8

| Field                    | Label               | Unit               |
| ------------------------ | ------------------- | ------------------ |
| `outside_temp`           | Outside Temperature | °C                 |
| `inside_temp`            | Cabin Temperature   | °C                 |
| `climate_status`         | A/C Status          | ON/OFF             |
| `climate_driver_temp`    | Driver Set Temp     | °C                 |
| `climate_passenger_temp` | Passenger Set Temp  | °C                 |
| `fan_speed`              | Fan Speed           | 0-7, Auto          |
| `ac_mode`                | A/C Mode            | -                  |
| `defrost_front`          | Front Defrost       | ON/OFF             |
| `max_ac`                 | Max A/C             | ON/OFF             |
| `recirculation`          | Air Recirculation   | ON/OFF             |
| `dual_climate_sync`      | Dual Zone Sync      | Synced/Independent |
| `ionizer`                | Ionizer             | ON/OFF             |

---

## 9. Seat Controls (Ghế Ngồi)

**Icon:** seat | **Priority:** 9

| Field          | Label                      | Values                 |
| -------------- | -------------------------- | ---------------------- |
| `seat_heat_fl` | Driver Seat Heating        | Off, Low, Medium, High |
| `seat_heat_fr` | Passenger Seat Heating     | Off, Low, Medium, High |
| `seat_vent_fl` | Driver Seat Ventilation    | Off, Low, Medium, High |
| `seat_vent_fr` | Passenger Seat Ventilation | Off, Low, Medium, High |
| `seat_cool_fl` | Driver Seat Cooling        | Off, Low, Medium, High |
| `seat_cool_fr` | Passenger Seat Cooling     | Off, Low, Medium, High |
| `seat_heat_rl` | Rear Left Seat Heating     | Off, Low, Medium, High |
| `seat_heat_rr` | Rear Right Seat Heating    | Off, Low, Medium, High |

---

## 10. Location & GPS (Vị Trí)

**Icon:** location | **Priority:** 10

| Field              | Label      | Unit                   |
| ------------------ | ---------- | ---------------------- |
| `latitude`         | Latitude   | degrees                |
| `longitude`        | Longitude  | degrees                |
| `altitude`         | Altitude   | m                      |
| `heading`          | Heading    | °                      |
| `gps_velocity`     | GPS Speed  | km/h                   |
| `gps_status`       | GPS Signal | No Fix, 2D Fix, 3D Fix |
| `location_address` | Address    | -                      |

---

## 11. Special Modes (Chế Độ Đặc Biệt)

**Icon:** star | **Priority:** 11

| Field         | Label       | Values          |
| ------------- | ----------- | --------------- |
| `pet_mode`    | Pet Mode    | Active/Inactive |
| `camp_mode`   | Camp Mode   | Active/Inactive |
| `valet_mode`  | Valet Mode  | Active/Inactive |
| `sentry_mode` | Sentry Mode | Active/Inactive |

---

## 12. Lights (Đèn)

**Icon:** lightbulb | **Priority:** 12

| Field                  | Label                  | Values                   |
| ---------------------- | ---------------------- | ------------------------ |
| `light_low_beam`       | Low Beam               | ON/OFF                   |
| `light_high_beam`      | High Beam              | ON/OFF                   |
| `light_fog_front`      | Front Fog Lights       | ON/OFF                   |
| `light_fog_rear`       | Rear Fog Lights        | ON/OFF                   |
| `light_drl`            | Daytime Running Lights | ON/OFF                   |
| `light_auto`           | Auto Headlights        | Enabled/Disabled         |
| `light_interior`       | Interior Lights        | ON/OFF                   |
| `light_turn_indicator` | Turn Indicators        | Off, Left, Right, Hazard |
| `light_brake`          | Brake Lights           | ON/OFF                   |
| `light_reverse`        | Reverse Lights         | ON/OFF                   |

---

## 13. Crash & Safety (An Toàn)

**Icon:** shield | **Priority:** 13

| Field             | Label            | Values         | Critical            |
| ----------------- | ---------------- | -------------- | ------------------- |
| `crash_front`     | Front Crash      | Detected/None  | =Detected           |
| `crash_rear`      | Rear Crash       | Detected/None  | =Detected           |
| `crash_left`      | Left Side Crash  | Detected/None  | =Detected           |
| `crash_right`     | Right Side Crash | Detected/None  | =Detected           |
| `crash_rollover`  | Rollover         | Detected/None  | =Detected           |
| `airbag_deployed` | Airbag Deployed  | YES/NO         | =YES                |
| `ecall_activated` | eCall Activated  | YES/NO         | =YES                |
| `child_detection` | Child Detection  | Detected/Clear | Warning if Detected |

---

## 14. Warnings & Alerts (Cảnh Báo)

**Icon:** warning | **Priority:** 14

| Field                 | Label               | Warning |
| --------------------- | ------------------- | ------- |
| `warning_low_battery` | Low Battery Warning | =Active |
| `warning_hv_low_soc`  | HV Battery Low SOC  | =Active |
| `warning_speed_limit` | Speed Limit Warning | -       |
| `warning_coolant_low` | Low Coolant         | =Low    |
| `warning_charge_lid`  | Charge Lid Open     | -       |
| `service_alert`       | Service Alert       | -       |

---

## 15. Trip Information (Thông Tin Chuyến Đi)

**Icon:** route | **Priority:** 15

| Field                      | Label                    | Unit      |
| -------------------------- | ------------------------ | --------- |
| `trip_a_distance`          | Trip A Distance          | km        |
| `trip_a_avg_speed`         | Trip A Avg Speed         | km/h      |
| `trip_a_consumption`       | Trip A Consumption       | kWh/100km |
| `trip_b_distance`          | Trip B Distance          | km        |
| `trip_b_avg_speed`         | Trip B Avg Speed         | km/h      |
| `trip_b_consumption`       | Trip B Consumption       | kWh/100km |
| `current_trip_distance`    | Current Trip Distance    | km        |
| `current_trip_avg_speed`   | Current Trip Avg Speed   | km/h      |
| `current_trip_consumption` | Current Trip Consumption | kWh/100km |

---

## 16. Firmware & Updates

**Icon:** cpu | **Priority:** 16

| Field               | Label            | Values                                                |
| ------------------- | ---------------- | ----------------------------------------------------- |
| `firmware_version`  | Firmware Version | -                                                     |
| `firmware_state`    | Update State     | Idle, Downloading, Ready, Installing, Complete, Error |
| `firmware_progress` | Update Progress  | %                                                     |
| `tbox_version`      | T-Box Version    | -                                                     |

---

## 17. ECU Modules

**Icon:** microchip | **Priority:** 17

| Field                  | Label                 |
| ---------------------- | --------------------- |
| `ecu_mhu_sw`           | MHU (Infotainment)    |
| `ecu_mhu_hw`           | MHU Hardware          |
| `ecu_mhu_manufacturer` | MHU Manufacturer      |
| `ecu_xgw_sw`           | XGW (Gateway)         |
| `ecu_bcm_sw`           | BCM (Body Control)    |
| `ecu_acm_sw`           | ACM (A/C Module)      |
| `ecu_vcu_sw`           | VCU (Vehicle Control) |
| `ecu_etg_sw`           | ETG (E-Trans)         |
| `ecu_bms_sw`           | BMS (Battery)         |

---

## 18. Vehicle Identity (Thông Tin Xe)

**Icon:** id-card | **Priority:** 18

| Field            | Label          |
| ---------------- | -------------- |
| `vin_number`     | VIN Number     |
| `manufacturer`   | Manufacturer   |
| `model_year`     | Model Year     |
| `vehicle_name`   | Vehicle Name   |
| `owner_name`     | Owner Name     |
| `platform`       | Platform       |
| `vehicle_class`  | Vehicle Class  |
| `engine_type`    | Engine Type    |
| `variant`        | Variant        |
| `market_area`    | Market Area    |
| `marketing_name` | Marketing Name |

---

## 19. Connectivity & Services

**Icon:** wifi | **Priority:** 19

| Field             | Label             | Values                    |
| ----------------- | ----------------- | ------------------------- |
| `pairing_status`  | App Pairing       | Connected/Not Connected   |
| `device_id`       | Paired Device ID  | -                         |
| `data_privacy`    | Data Privacy      | Off, Basic, Full          |
| `battery_leasing` | Battery Leasing   | Active/Inactive           |
| `service_status`  | Connected Service | Inactive, Active, Expired |

---

## Status Indicators

### Warning Status (Màu Vàng)

- Giá trị nằm ngoài phạm vi khuyến nghị
- Cần chú ý theo dõi

### Critical Status (Màu Đỏ)

- Giá trị nguy hiểm
- Cần xử lý ngay lập tức

---

## Usage

### Code Example

```javascript
import {
  DEEP_SCAN_GROUPS,
  getSortedGroups,
  getGroupByAlias,
} from "../config/deepScanGroups";

// Get all groups sorted by priority
const groups = getSortedGroups();

// Find group for a specific alias
const group = getGroupByAlias("VEHICLE_STATUS_HV_BATTERY_SOC");
// Returns: BATTERY_MAIN group

// Get total fields count
const totalFields = getTotalFieldsCount(); // ~120
```

### File Locations

- **Config:** `src/config/deepScanGroups.js`
- **Component:** `src/components/TelemetryDrawer.jsx`
- **Mapper:** `src/utils/telemetryMapper.js`
- **Alias Map:** `src/config/static_alias_map.json`

---

**Generated:** January 25, 2026
