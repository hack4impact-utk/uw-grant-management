import dbConnect from '@/utils/db-connect';
import { NextResponse, NextRequest } from 'next/server';
import Report from '@/server/models/Report';
import { withAuth } from '@/utils/auth';
interface Query {
  projectId?: string | { $in: string[] };
  organizationId?: string | { $in: string[] };
}

interface Projection {
  [key: string]: number;
}

export const GET = withAuth(async function (req: NextRequest) {
  await dbConnect();

  try {
    const query: Query = {};
    let projection: Projection | null = null;

    if (req) {
      const fields = req.nextUrl.searchParams.get('fields');
      const projectIds = (
        req.nextUrl.searchParams.get('projectId')?.split(',') || []
      ).filter((id) => !!id);
      const organizationIds = (
        req.nextUrl.searchParams.get('organizationId')?.split(',') || []
      ).filter((id) => !!id);

      // Add projectId to the query object if provided
      if (projectIds.length) {
        query.projectId = { $in: projectIds };
      }

      // Add organizationId to the query object if provided
      if (organizationIds.length) {
        query.organizationId = { $in: organizationIds };
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
});
