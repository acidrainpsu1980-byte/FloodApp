import { NextResponse } from 'next/server';
import { updateRequestStatus } from '@/lib/storage';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        if (!body.status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        const updatedRequest = updateRequestStatus(id, body.status);

        if (!updatedRequest) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        return NextResponse.json(updatedRequest);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
    }
}
