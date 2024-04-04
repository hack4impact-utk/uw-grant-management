import dbConnect from '@/utils/db-connect';
import { NextResponse, NextRequest } from 'next/server';
import Organization from '@/server/models/Organization';

interface Query {
  name?: { $regex: RegExp };
}

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const query: Query = {};

    // Check if the request object exists and has the expected query parameter
    if (req) {
      const searchTerm = req.nextUrl.searchParams.get('search');
      if (searchTerm) {
        const regex = new RegExp(searchTerm, 'i');
        query.name = { $regex: regex };
      }
    }

    // Will fetch all organizations if query is not provided
    const organizationInfo = await Organization.find(query);
    return NextResponse.json(organizationInfo);
  } catch (error) {
    console.error('Error fetching organization data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
