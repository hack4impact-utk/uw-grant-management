import dbConnect from '@/utils/db-connect';
import { NextResponse, NextRequest } from 'next/server';
import Project from '@/server/models/Project';
import { withAuth } from '@/utils/auth';

interface Query {
  organizationId?: string;
}

export const GET = withAuth(async function (req: NextRequest) {
  await dbConnect();

  try {
    const query: Query = {};

    // Check if the request object exists and has the expected query parameter
    if (req) {
      const orgId = req.nextUrl.searchParams.get('organizationId');

      if (orgId) {
        query.organizationId = orgId;
      }
    }

    // Will fetch all projects if organizationId query is not provided or invalid
    const projectInfo = await Project.find(query);
    return NextResponse.json(projectInfo);
  } catch (error) {
    console.error('Error fetching project data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
});
