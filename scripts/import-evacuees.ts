import { CosmosClient } from "@azure/cosmos";
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseName = process.env.COSMOS_DATABASE || 'FloodReliefDB';
const containerName = 'Evacuees'; // New container for evacuees

if (!endpoint || !key) {
    console.error("Please set COSMOS_ENDPOINT and COSMOS_KEY in .env.local");
    process.exit(1);
}

const client = new CosmosClient({ endpoint, key });

async function importData() {
    try {
        const database = client.database(databaseName);
        const { container } = await database.containers.createIfNotExists({
            id: containerName,
            partitionKey: '/district' // Partition by district seems reasonable
        });

        const csvFilePath = path.resolve(__dirname, '../../data.csv');
        const fileContent = fs.readFileSync(csvFilePath, 'utf-8');

        const records = parse(fileContent, {
            columns: false, // We'll handle columns manually since header is on line 2
            skip_empty_lines: true,
            from_line: 6 // Data starts from line 6 based on the file view
        });

        console.log(`Found ${records.length} records to import.`);

        let successCount = 0;
        let errorCount = 0;

        for (const record of records) {
            // Mapping based on CSV structure:
            // Col 0: Index (e.g., 2)
            // Col 1: Timestamp (e.g., "26/11/2025, 0:15:14")
            // Col 2: Shelter (e.g., "มอ. (มหาวิทยาลัยสงขลานครินทร์)")
            // Col 3: First Name
            // Col 4: Last Name
            // Col 5: Gender
            // Col 6: District | Sub-district (e.g., "อำเภอหาดใหญ่ | หาดใหญ่")
            // Col 7: Address (Optional)

            if (!record[3] || !record[4]) continue; // Skip if no name

            const districtParts = record[6] ? record[6].split('|') : [];
            const district = districtParts[0]?.trim() || 'Unknown';
            const subDistrict = districtParts[1]?.trim() || '';

            const evacuee = {
                id: `evac-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                timestamp: record[1],
                shelter: record[2],
                firstName: record[3],
                lastName: record[4],
                gender: record[5],
                district: district,
                subDistrict: subDistrict,
                address: record[7] || "",
                status: "safe", // Default status
                importedAt: new Date().toISOString()
            };

            try {
                await container.items.create(evacuee);
                successCount++;
                if (successCount % 50 === 0) console.log(`Imported ${successCount} records...`);
            } catch (err) {
                console.error(`Error importing ${evacuee.firstName} ${evacuee.lastName}:`, err);
                errorCount++;
            }
        }

        console.log(`Import completed. Success: ${successCount}, Errors: ${errorCount}`);

    } catch (error) {
        console.error("Import failed:", error);
    }
}

importData();
