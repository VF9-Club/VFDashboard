const fs = require('fs');
const path = require('path');

// Paths
const DOCS_DIR = path.join(__dirname);
const VF3_DIR = path.join(DOCS_DIR, 'api/responses/VF3');

const FILES_TO_MASK = [
    path.join(VF3_DIR, 'telemetry.json'),
    path.join(VF3_DIR, 'user-vehicle.json'),
    path.join(VF3_DIR, 'token.json'),
    path.join(VF3_DIR, 'get-alias.json'),
    path.join(DOCS_DIR, '08_VF3_Telemetry_Report.html')
];

// Sensitive keys/patterns to mask
const SENSITIVE_KEYS = [
    'vin', 'VIN', 'vehicleId', 'deviceKey', 'deviceId', 'userId', // Identifiers
    'email', 'phone', 'address', 'name', 'firstName', 'lastName', 'profileName', 'ownedName', // PII
    'licensePlate', // Vehicle Info
    'latitude', 'longitude', 'lat', 'lng', 'LOCATION_LATITUDE', 'LOCATION_LONGITUDE', // Location
    'access_token', 'refresh_token', 'id_token', 'token', // Auth
    'alias-col', // HTML class check helper
];

// Specific values to look for (extracted from previous reads to be safe)
const SPECIFIC_VALUES_TO_MASK = [
    '20.990905', '105.869694', // Specific coords found in report
    'hongcucnt@gmail.com', // Specific email found
    'RLNVBL9K3SH701087', // Specific VIN found
    'Daisy‘s VF3', // Specific name
    '25978389', // CID
    'Nguyễn Thị Hồng Cúc', // Name
    '30M00437', // License Plate
    '97d2b9c1-7502-4ee7-ba66-f6a94542ad53' // User ID in URL
];

function maskString(str) {
    if (!str || str.length < 4) return '****';
    return str.substring(0, 2) + '*'.repeat(str.length - 4) + str.substring(str.length - 2);
}

function maskValue(key, value) {
    if (typeof value === 'string') {
        // Check if value looks like a sensitive token (long string starting with eyJ)
        if (value.startsWith('eyJ')) return maskString(value);

        // Check specific values
        if (SPECIFIC_VALUES_TO_MASK.some(v => value.includes(v))) {
            return '********';
        }

        // Heuristics based on Key
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('email')) return 'user@example.com';
        if (lowerKey.includes('vin')) return 'VF3XXXXXXXXXXXXXX';
        if (lowerKey.includes('latitude')) return '21.000000';
        if (lowerKey.includes('longitude')) return '105.000000';
        if (lowerKey.includes('token')) return '***TOKEN***';
        if (lowerKey.includes('licenseplate')) return '30A-XXXXX';
        if (lowerKey.includes('name') && !lowerKey.includes('filename') && !lowerKey.includes('marketing') && !lowerKey.includes('vehiclenamed') && !lowerKey.includes('model') && !lowerKey.includes('code')) return 'Masked Name';
    }
    // Number masking for coords
    if (typeof value === 'number') {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('latitude')) return 21.000000;
        if (lowerKey.includes('longitude')) return 105.000000;
    }
    return value;
}

function processObject(obj) {
    if (Array.isArray(obj)) {
        return obj.map(item => processObject(item));
    } else if (typeof obj === 'object' && obj !== null) {
        const newObj = {};
        for (const [key, value] of Object.entries(obj)) {
            // Check if key is sensitive
            let isSensitive = SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k.toLowerCase()));

            // Special check for Telemetry items (resourceId based)
            // We can't easily map resourceId back to meaning here without the map, 
            // but we can check if the value matches known sensitive data

            if (isSensitive) {
                newObj[key] = maskValue(key, value);
            } else {
                newObj[key] = processObject(value);

                // Deep check for values in normal fields that might be sensitive
                if (typeof newObj[key] === 'string' && SPECIFIC_VALUES_TO_MASK.some(v => newObj[key].includes(v))) {
                    newObj[key] = maskValue(key, newObj[key]);
                }
            }
        }
        return newObj;
    }
    return obj;
}

function maskFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${filePath} (not found)`);
        return;
    }

    console.log(`Masking ${filePath}...`);
    const content = fs.readFileSync(filePath, 'utf8');

    if (filePath.endsWith('.json')) {
        try {
            const data = JSON.parse(content);
            const maskedData = processObject(data);
            fs.writeFileSync(filePath, JSON.stringify(maskedData, null, 2));
        } catch (e) {
            console.error(`Error parsing JSON ${filePath}:`, e);
            // Fallback to string replacement
            let maskedContent = content;
            SPECIFIC_VALUES_TO_MASK.forEach(val => {
                maskedContent = maskedContent.replace(new RegExp(val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '********');
            });
            fs.writeFileSync(filePath, maskedContent);
        }
    } else {
        // Text/HTML replacement
        let maskedContent = content;

        // Replace coordinates in HTML values
        // Look for <td class="value-col">20.990905</td>
        maskedContent = maskedContent.replace(/>\s*20\.990905\s*<\/td>/g, '>21.000000</td>');
        maskedContent = maskedContent.replace(/>\s*105\.869694\s*<\/td>/g, '>105.000000</td>');

        // Replace VIN
        maskedContent = maskedContent.replace(/RLNVBL9K3SH701087/g, 'VF3XXXXXXXXXXXXXX');

        // Replace Email
        maskedContent = maskedContent.replace(/hongcucnt@gmail.com/g, 'user@example.com');

        // Replace CID
        maskedContent = maskedContent.replace(/25978389/g, '********');

        // Replace Name
        maskedContent = maskedContent.replace(/Daisy‘s VF3/g, 'My VF3');

        fs.writeFileSync(filePath, maskedContent);
    }
}

FILES_TO_MASK.forEach(f => maskFile(f));
console.log('Masking complete.');
