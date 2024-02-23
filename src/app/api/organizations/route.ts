import dbConnect from '@/server';
import { NextResponse } from 'next/server';
import Organization from '@/server/models/Organization';

export async function GET() {
  await dbConnect();
  try {
    const organizationInfo = await Organization.find();
    return NextResponse.json(organizationInfo);
  } catch (error) {
    console.error('Error fetching organization data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
