import dbConnect from '@/utils/db-connect';
import { NextResponse, NextRequest } from 'next/server';
import Report from '@/server/models/Report';
import { Organization } from '@/utils/types/models';

type RequestParams = {
  params: {
    zipCode: string;
  };
};

type OrganizationInfo = {
  id: string;
  name: string;
  projectIds: Set<string>;
};

export async function GET(req: NextRequest, { params }: RequestParams) {
  await dbConnect();
  try {
    const reports = await Report.find({
      zipCodeClientsServed: {
        $elemMatch: {
          zipCode: params.zipCode,
          clientsServed: { $gt: 0 },
        },
      },
    }).populate<{ organizationId: Organization }>('organizationId');

    const orgIdtoOrgMap = new Map<string, OrganizationInfo>();
    for (const report of reports) {
      let org = orgIdtoOrgMap.get(report.organizationId.id);
      if (!org) {
        org = {
          id: report.organizationId.id,
          name: report.organizationId.name,
          projectIds: new Set(),
        };
        orgIdtoOrgMap.set(report.organizationId.id, org);
      }
      org.projectIds.add(report.projectId);
    }

    return NextResponse.json({
      success: true,
      data: Array.from(orgIdtoOrgMap.values()).map(
        (orgInfo: OrganizationInfo) => {
          return {
            ...orgInfo,
            projectIds: Array.from(orgInfo.projectIds),
          };
        }
      ),
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
  }

  return NextResponse.json({
    success: false,
  });
}
