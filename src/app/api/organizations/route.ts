import dbConnect from '@/utils/db-connect';
import { NextResponse } from 'next/server';
import Organization from '@/server/models/Organization';

export async function GET() {
  await dbConnect();
  try {
    await dbConnect();
    const organizationInfo = await Organization.find().select(['id', 'name']);
    return NextResponse.json(organizationInfo);
  } catch (error) {
    console.error('Error fetching organization data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
