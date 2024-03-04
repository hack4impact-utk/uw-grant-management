import Report from '@/server/models/Report';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db-connect';

interface ZipCodeFilters {
  organizationId?: Record<string, Array<string>>;
  $or?: { [x: string]: { $ne: number } }[];
}

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const urlSearchParams = request.nextUrl.searchParams;
    const organizationsString = urlSearchParams.get('organizations');
    const organizations = organizationsString
      ? organizationsString.split(',')
      : [];
    const metricsString = urlSearchParams.get('metrics');
    const metrics = metricsString ? metricsString.split(',') : [];

    const filter: ZipCodeFilters = {};

    if (organizations && organizations.length) {
      filter.organizationId = {
        $in: organizations,
      };
    }

    if (metrics && metrics.length) {
      filter.$or = metrics.map((metric) => ({
        [metric]: { $ne: 0 },
      }));
    }

    const zipCodeClientsServedMap = new Map<string, number>();
    const reports = await Report.find(filter);

    reports.forEach((report) => {
      report.zipCodeClientsServed.forEach((zipCodeInfo) => {
        let currentCount =
          zipCodeClientsServedMap.get(zipCodeInfo.zipCode) || 0;
        currentCount += zipCodeInfo.clientsServed;
        zipCodeClientsServedMap.set(zipCodeInfo.zipCode, currentCount);
      });
    });
    return NextResponse.json(
      {
        success: true,
        data: Object.fromEntries(zipCodeClientsServedMap.entries()),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching zip code data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
