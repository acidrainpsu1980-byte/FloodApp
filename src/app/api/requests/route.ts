import { NextResponse } from 'next/server';
import { getRequests, saveRequest, RequestData } from '@/lib/storage';

export async function GET() {
    const requests = getRequests();
    return NextResponse.json(requests);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.name || !body.phone || !body.location || !body.needs || !Array.isArray(body.needs)) {
            return NextResponse.json({ error: 'Missing required fields or invalid needs format' }, { status: 400 });
        }

        // Auto-Assignment Logic
        let assignedUnit: 'Medical' | 'Water Rescue' | 'Supply' | 'General' = 'General';
        let priority: 'High' | 'Normal' = 'Normal';

        if (body.needs.includes("ยารักษาโรค")) {
            assignedUnit = 'Medical';
            priority = 'High';
        } else if (body.needs.includes("อพยพ")) {
            assignedUnit = 'Water Rescue';
            priority = 'High';
        } else if (body.needs.includes("อาหารและน้ำดื่ม") || body.needs.includes("เสื้อผ้า")) {
            assignedUnit = 'Supply';
        }

        const newRequest: RequestData = {
            id: Math.random().toString(36).substring(7),
            ...body,
            status: 'pending',
            assignedUnit,
            priority,
            createdAt: new Date().toISOString(),
        };

        const savedRequest = saveRequest(newRequest);
        return NextResponse.json(savedRequest, { status: 201 });
    } catch (error) {
        console.error("Failed to process request:", error);
        return NextResponse.json({ error: 'Failed to save request' }, { status: 500 });
    }
}
