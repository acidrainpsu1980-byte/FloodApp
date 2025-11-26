import fs from 'fs';
import path from 'path';

// The exact parsing logic from the frontend component
const parseCSVLine = (line: string) => {
    const result = [];
    let start = 0;
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
            inQuotes = !inQuotes;
        } else if (line[i] === ',' && !inQuotes) {
            let field = line.substring(start, i).trim();
            if (field.startsWith('"') && field.endsWith('"')) {
                field = field.substring(1, field.length - 1);
            }
            result.push(field);
            start = i + 1;
        }
    }
    let lastField = line.substring(start).trim();
    if (lastField.startsWith('"') && lastField.endsWith('"')) {
        lastField = lastField.substring(1, lastField.length - 1);
    }
    result.push(lastField);
    return result;
};

const testImport = () => {
    const csvPath = path.resolve(process.cwd(), 'data.csv');
    const inputData = fs.readFileSync(csvPath, 'utf-8');
    const lines = inputData.trim().split('\n');

    const data = [];

    console.log(`Total lines in file: ${lines.length}`);

    for (const line of lines) {
        // Skip empty lines or lines with just commas
        if (!line.trim() || line.replace(/,/g, '').trim().length === 0) continue;

        const cols = parseCSVLine(line);

        // Try to detect column offset
        let offset = 0;
        if (cols[0] === '' && cols[1]?.includes('/')) offset = 1; // Starts with empty col
        else if (cols[0]?.includes('/')) offset = 0; // Starts directly with timestamp
        else if (cols[1]?.includes('/') && !isNaN(parseInt(cols[0]))) offset = 1; // Starts with index number
        else {
            if (data.length === 0 && lines.indexOf(line) < 10) {
                console.log(`Skipping line ${lines.indexOf(line)}: cols[0]='${cols[0]}', cols[1]='${cols[1]}'`);
            }
            continue; // Not a data line
        }

        const firstName = cols[offset + 2];
        const lastName = cols[offset + 3];

        if (!firstName || !lastName || firstName === 'ชื่อ') {
            if (data.length === 0) console.log(`Skipping header/invalid: ${firstName} ${lastName}`);
            continue; // Skip header or invalid
        }

        const districtParts = cols[offset + 5] ? cols[offset + 5].split('|') : [];

        data.push({
            timestamp: cols[offset],
            shelter: cols[offset + 1],
            firstName: firstName,
            lastName: lastName,
            gender: cols[offset + 4],
            district: districtParts[0]?.trim() || 'Unknown',
            subDistrict: districtParts[1]?.trim() || '',
            address: cols[offset + 6] || "",
            status: "safe"
        });
    }

    console.log(`Successfully parsed ${data.length} records.`);
    if (data.length > 0) {
        console.log("Sample Record 1:", data[0]);
        console.log("Sample Record Last:", data[data.length - 1]);
    }
};

testImport();
