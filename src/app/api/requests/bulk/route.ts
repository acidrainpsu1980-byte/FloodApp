import { NextRequest, NextResponse } from "next/server";
import { getContainer } from "@/lib/cosmosdb";
import { RequestData } from "@/lib/storage";

export async function POST(request: NextRequest) {
    try {
        const { requests } = await request.json();

        if (!Array.isArray(requests) || requests.length === 0) {
            return NextResponse.json(
                { error: "Invalid requests data" },
                { status: 400 }
            );
        }

        const container = await getContainer();
        const importedRequests: RequestData[] = [];

        for (const req of requests) {
            const newRequest: RequestData = {
                id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: req.name,
                phone: req.phone,
                location: req.location,
                peopleCount: req.peopleCount,
                needs: req.needs,
                priority: req.priority || "Normal",
                status: "pending",
                assignedUnit: req.assignedUnit || "ทั่วไป",
                note: req.note || "",
                timestamp: new Date().toISOString(),
            };

            await container.items.create(newRequest);
            importedRequests.push(newRequest);
        }

        return NextResponse.json({
            success: true,
            count: importedRequests.length,
            requests: importedRequests
        });
    } catch (error) {
        console.error("Bulk import error:", error);
        return NextResponse.json(
            { error: "Failed to import requests" },
            { status: 500 }
        );
    }
}
