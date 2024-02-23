'use server';
import dbConnect from '@/server';
import { NextResponse, NextRequest } from 'next/server';
import Project from '@/server/models/Project';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const orgId = req.nextUrl.searchParams.get('organizationId');
    const query = { organizationId: orgId };
    const projectInfo = await Project.find(query);

    return NextResponse.json(projectInfo);
  } catch (error) {
    console.error('Error fetching project data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
