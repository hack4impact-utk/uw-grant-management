import dbConnect from '@/server';
import { NextResponse, NextRequest } from 'next/server';
import Report from '@/server/models/Report';

/* 
Usage:
/api/reports -> returns all reports 
/api/reports?fields=clientsServed -> returns clientsServed for all reports 
/api/reports?projectId=12345 -> returns all reports with projectId = 12345
/api/reports?fields=clientsServed&projectId=12345 -> returns clientServed for all reports with projectId = 12345
NOTE: Can include as many fields as need (comma separated) but only one projectId
*/

// Interface for the query object
interface Query {
  projectId?: string;
}

// Interface for the projection object
interface Projection {
  [key: string]: number;
}

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const query: Query = {};
    let projection: Projection | null = null;

    if (req) {
      const fields = req.nextUrl.searchParams.get('fields');
      const projectId = req.nextUrl.searchParams.get('projectId');

      // Add projectId to the query object if provided
      if (projectId) {
        query.projectId = projectId;
      }

      // Add fields to the projection object if provided
      if (fields) {
        projection = {};
        fields.split(',').forEach((field) => {
          projection![field.trim()] = 1;
        });
      }
    }

    // Execute the query with the specified projection
    const reportInfo = projection
      ? await Report.find(query, projection)
      : await Report.find(query);
    return NextResponse.json(reportInfo);
  } catch (error) {
    console.error('Error fetching report data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
