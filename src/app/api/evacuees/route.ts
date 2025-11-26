import { NextRequest, NextResponse } from 'next/server';
import { getEvacueesContainer } from '@/lib/cosmosdb';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q') || '';

        const container = await getEvacueesContainer();

        let sqlQuery = 'SELECT * FROM c WHERE c.status != "deleted"';
        const parameters = [];

        if (query) {
            sqlQuery += ' AND (CONTAINS(c.firstName, @query, true) OR CONTAINS(c.lastName, @query, true))';
            parameters.push({ name: '@query', value: query });
        }

        // Limit results to avoid overload
        sqlQuery += ' OFFSET 0 LIMIT 50';

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
