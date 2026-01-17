const fs = require('fs');
const path = require('path');

// Paths
const TELEMETRY_PATH = path.join(__dirname, 'api/responses/VF3/telemetry.json');
const BROKEN_ALIAS_PATH = path.join(__dirname, 'api/responses/VF3/get-alias.json');
const STATIC_ALIAS_PATH = path.join(__dirname, '../backend/lib/static_alias_map.json');
const OUTPUT_PATH = path.join(__dirname, '08_VF3_Telemetry_Report.html');

// Read Files
console.log('Reading files...');
const telemetryRaw = fs.readFileSync(TELEMETRY_PATH, 'utf8');
const telemetryData = JSON.parse(telemetryRaw).data;

let aliasMap = {};

try {
    const rawAlias = fs.readFileSync(BROKEN_ALIAS_PATH, 'utf8');
    const parsed = JSON.parse(rawAlias);
    if (parsed.message && parsed.message.includes('expired')) {
        console.warn('Warning: get-alias.json contains an expired token error. Falling back to static_alias_map.json');
        throw new Error('Invalid get-alias.json');
    }
    aliasMap = parsed;
} catch (e) {
    console.log('Using static_alias_map.json as source of truth.');
    const staticMapRaw = fs.readFileSync(STATIC_ALIAS_PATH, 'utf8');
    aliasMap = JSON.parse(staticMapRaw);
}

// Build Reverse Map (ObjectId_InstanceId_ResourceId -> Alias)
const idToAlias = {};
Object.keys(aliasMap).forEach(key => {
    const item = aliasMap[key];
    // Key format: OID_IID_RID
    // Note: telemetry uses numbers, map uses strings.
    const lookupKey = `${item.objectId}_${item.instanceId}_${item.resourceId}`;
    idToAlias[lookupKey] = key;
});

// Process Telemetry
const groupedData = {};

telemetryData.forEach(item => {
    // lookupKey: OID_IID_RID
    // Telemetry item has: resourceId, instanceId, objectId (numbers)
    const lookupKey = `${item.objectId}_${item.instanceId}_${item.resourceId}`;
    const alias = idToAlias[lookupKey];

    if (alias) {
        // Infer Group from Alias
        // format example: BATTERY_LEASING_INFO_...
        // We want "BATTERY LEASING" or "BATTERY LEASING INFO"
        // Heuristic: Split by _, take parts until we hit the metric name?
        // Actually, let's just take the first 2-3 words.
        // Better heuristic: look at the prefixes in the known report.

        let group = 'OTHERS';
        const parts = alias.split('_');

        // Common prefixes that define groups in the example report
        // BATTERY_LEASING_INFO -> BATTERY LEASING
        // BMS_STATUS -> BMS STATUS
        // CAMP_MODE -> CAMP MODE
        // CAPP_PAIRING -> CAPP PAIRING
        // CCARSERVICE_OBJECT -> CCARSERVICE OBJECT
        // CHARGE_CONTROL -> CHARGE CONTROL
        // CHARGING_STATUS -> CHARGING STATUS
        // CLIMATE_CONTROL -> CLIMATE CONTROL
        // CLIMATE_INFORMATION -> CLIMATE INFORMATION
        // CLIMATE_SCHEDULE -> CLIMATE SCHEDULE
        // DATA_PRIVACY -> DATA PRIVACY
        // DOOR_AJAR -> DOOR AJAR
        // DOOR_BONNET -> DOOR BONNET
        // DOOR_TRUNK -> DOOR TRUNK
        // ECUS_INFORMATION -> ECUS INFORMATION

        // It seems typically the first two words form the group, unless it's VINFAST_VEHICLE...
        if (parts.length >= 2) {
            group = parts.slice(0, 2).join(' ');
            if (parts[0] === 'VINFAST' && parts[1] === 'VEHICLE') {
                // VINFAST_VEHICLE_IDENTIFIER -> VINFAST VEHICLE IDENTIFIER
                group = parts.slice(0, 3).join(' ');
            }
            if (parts[0] === 'BATTERY' && parts[1] === 'LEASING') {
                group = 'BATTERY LEASING';
            }
        }

        if (!groupedData[group]) groupedData[group] = [];

        // Name formatting: convert Alias to Title Case replacing _ with space?
        // The example has "Battery leasing control" for "BATTERY_LEASING_INFO_BATTERY_LEASING_CONTROL".
        // It seems the Name is derived from the suffix after the group prefix?
        // BATTERY_LEASING_INFO_BATTERY_LEASING_CONTROL -> BATTERY_LEASING_CONTROL ?

        // Let's just use the Alias as the Name for now, or prettify the whole Alias.
        // Since we don't have the "Name" field in the json, we construct a readable name.
        const readableName = alias.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());

        groupedData[group].push({
            alias: alias,
            name: readableName, // Approximation
            value: item.value
        });
    } else {
        // Unknown items
        if (!groupedData['UNKNOWN_MAPPING']) groupedData['UNKNOWN_MAPPING'] = [];
        groupedData['UNKNOWN_MAPPING'].push({
            alias: `UNKNOWN (${item.objectId}/${item.instanceId}/${item.resourceId})`,
            name: `DeviceKey: ${item.deviceKey}`,
            value: item.value
        });
    }
});

// Generate HTML
const htmlStart = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VF3 Telemetry Report</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; background-color: #f4f4f9; color: #333; }
        h1 { text-align: center; color: #2c3e50; }
        .group-container { background: #fff; margin-bottom: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); overflow: hidden; }
        .group-header { background-color: #3498db; color: #fff; padding: 15px 20px; font-size: 1.2em; font-weight: bold; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #ecf0f1; color: #7f8c8d; font-weight: 600; text-transform: uppercase; font-size: 0.9em; }
        tr:hover { background-color: #f1f2f6; }
        tr:last-child td { border-bottom: none; }
        .value-col { font-family: 'Consolas', monospace; color: #e74c3c; }
        .alias-col { font-weight: 500; color: #2980b9; font-size: 0.9em; }
        .no-data { text-align: center; padding: 20px; color: #7f8c8d; }
    </style>
</head>
<body>
    <h1>VF3 Vehicle Telemetry Report</h1>
    <p style="text-align:center; color: #7f8c8d;">Generated from <code>telemetry.json</code> and <code>static_alias_map.json</code></p>
`;

let htmlContent = '';

// Sort groups
const sortedGroups = Object.keys(groupedData).sort();

sortedGroups.forEach(group => {
    htmlContent += `
    <div class="group-container">
        <div class="group-header">${group}</div>
        <table>
            <thead>
                <tr>
                    <th style="width: 40%">Alias</th>
                    <th style="width: 30%">Name (Derived)</th>
                    <th style="width: 30%">Value</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Sort items by Alias
    groupedData[group].sort((a, b) => a.alias.localeCompare(b.alias));

    groupedData[group].forEach(row => {
        htmlContent += `
                <tr>
                    <td class="alias-col">${row.alias}</td>
                    <td>${row.name}</td>
                    <td class="value-col">${row.value}</td>
                </tr>
        `;
    });

    htmlContent += `
            </tbody>
        </table>
    </div>
    `;
});

const htmlEnd = `
</body>
</html>`;

fs.writeFileSync(OUTPUT_PATH, htmlStart + htmlContent + htmlEnd);
console.log(`Report generated at ${OUTPUT_PATH}`);
