import Report from '@/server/models/Report';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db-connect';
import { Organization, Project } from '@/utils/types/models';

interface ZipCodeFilters {
  organizationId?: Record<string, Array<string>>;
  $or?: { [x: string]: { $ne: number } }[];
}

interface ZipCodeInfo {
  clientsServed: number;
  totalOrganizationsPresent: number;
  totalProjectsPresent: number;
  organizationsPresent: Set<string>;
  projectsPresent: Set<string>;
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

    const zipCodeClientsServedMap = new Map<string, ZipCodeInfo>();
    const reports = await Report.find(filter)
      .populate<{ organizationId: Organization }>('organizationId')
      .populate<{ projectId: Project }>('projectId');

    reports.forEach((report) => {
      const organization = report.organizationId;
      const project = report.projectId;

      report.zipCodeClientsServed.forEach((zipCodeInfo) => {
        const currentInfo = zipCodeClientsServedMap.get(
          zipCodeInfo.zipCode
        ) || {
          clientsServed: 0,
          totalOrganizationsPresent: 0,
          totalProjectsPresent: 0,
          organizationsPresent: new Set<string>(),
          projectsPresent: new Set<string>(),
        };

        currentInfo.clientsServed += zipCodeInfo.clientsServed;
        if (zipCodeInfo.clientsServed) {
          currentInfo.organizationsPresent.add(organization.name);
          currentInfo.projectsPresent.add(project.name);
          currentInfo.totalOrganizationsPresent =
            currentInfo.organizationsPresent.size;
          currentInfo.totalProjectsPresent =
            currentInfo.organizationsPresent.size;
        }

        zipCodeClientsServedMap.set(zipCodeInfo.zipCode, currentInfo);
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
