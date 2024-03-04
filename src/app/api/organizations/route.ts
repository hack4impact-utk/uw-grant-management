import dbConnect from '@/server';
import { NextResponse } from 'next/server';
import Organization from '@/server/models/Organization';

export async function GET() {
  try {
    await dbConnect();
    const organizationInfo = await Organization.find().select(['id', 'name']);
    return NextResponse.json(organizationInfo);
  } catch (error) {
    console.error('Error fetching organization info:', error);
  }
}
