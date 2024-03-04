import dbConnect from '@/utils/db-connect';
import { NextResponse, NextRequest } from 'next/server';
import Report from '@/server/models/Report';

/*
Usage:
/api/reports -> returns all reports
/api/reports?fields=clientsServed -> returns 'clientsServed' field for all reports
/api/reports?projectId=12345 -> returns all reports for a specific project ID
/api/reports?organizationId=67890 -> returns all reports for a specific organization ID
/api/reports?fields=clientsServed&projectId=12345 -> returns 'clientsServed' field for all reports with a specific project ID
/api/reports?fields=clientsServed&organizationId=67890 -> returns 'clientsServed' field for all reports with a specific organization ID
/api/reports?fields=clientsServed,anotherField&projectId=12345 -> returns specified fields for all reports with a specific project ID
NOTE: Can include as many fields as needed (comma-separated) but only one projectId and one organizationId at a time.
*/

interface Query {
  projectId?: string;
  organizationId?: string;
}

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
      const organizationId = req.nextUrl.searchParams.get('organizationId');

      // Add projectId to the query object if provided
      if (projectId) {
        query.projectId = projectId;
      }

      // Add organizationId to the query object if provided
      if (organizationId) {
        query.organizationId = organizationId;
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
      ? await Report.find(query, projection) // Find reports with specified fields
      : await Report.find(query); // Find reports without specifying fields
    return NextResponse.json(reportInfo);
  } catch (error) {
    console.error('Error fetching report data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
