import { NextRequest, NextResponse } from 'next/server';
import { getEvacueesContainer } from '@/lib/cosmosdb';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q') || '';
        const limit = 50; // Define limit as it's used in the querySpec

        const container = await getEvacueesContainer();

        let sqlQuery = 'SELECT * FROM c WHERE c.status != "deleted" AND c.type = "evacuee"';
        const parameters = [];

        if (query) {
            sqlQuery += ' AND (CONTAINS(c.firstName, @query, true) OR CONTAINS(c.lastName, @query, true))';
            parameters.push({ name: '@query', value: query });
        }

        // Limit results to avoid overload
        sqlQuery += ` OFFSET 0 LIMIT ${limit}`;

        const { resources } = await container.items.query({
            query: sqlQuery,
            parameters: parameters
        }).fetchAll();

        return NextResponse.json({ evacuees: resources });

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id, partitionKey } = await request.json();
        if (!id || !partitionKey) {
            return NextResponse.json({ error: 'Missing id or partitionKey' }, { status: 400 });
        }

        const container = await getEvacueesContainer();

        // Soft delete
        const { resource: item } = await container.item(id, partitionKey).read();
        if (!item) {
            console.error(`Item not found: id=${id}, partitionKey=${partitionKey}`);
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        console.log(`Deleting item: ${item.firstName} ${item.lastName} (${id})`);
        item.status = 'deleted';
        await container.item(id, partitionKey).replace(item);
        console.log(`Successfully deleted item: ${id}`);

        return NextResponse.json({ message: 'Deleted successfully', deletedId: id });
    } catch (error: any) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, partitionKey, ...updates } = body;

        if (!id || !partitionKey) {
            return NextResponse.json({ error: 'Missing id or partitionKey' }, { status: 400 });
        }

        const container = await getEvacueesContainer();

        // Get existing item
        const { resource: item } = await container.item(id, partitionKey).read();

        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        // Merge updates
        const updatedItem = { ...item, ...updates, updatedAt: new Date().toISOString() };

        await container.item(id, partitionKey).replace(updatedItem);

        return NextResponse.json({ message: 'Updated successfully', item: updatedItem });
    } catch (error: any) {
        console.error("Update Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
