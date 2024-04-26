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

const categoryFieldMapping: { [key: string]: string[] | undefined } = {
  Food: [
    'foodAssistance',
    'foodKnowledgeAndSkills',
    'accessToHealthyFoods',
    'producerSupport',
  ],
  Clothing: ['clothingAssistance'],
  Hygiene: ['hygieneAssistance'],
  'Health Care': ['healthCareAssistance'],
  'Mental Health': ['mentalHealthAssistance'],
  'Child Care': [
    'childCareBirthToPreK',
    'childCareBirthToPreKHours',
    'childCareSchoolAged',
    'childCareSchoolAgedHours',
    'subsidiesOrScholarships',
  ],
  Housing: ['rentalAssistance', 'utilityAssistance'],
  Other: ['otherAssistance'],
};

interface Query {
  projectId?: string | { $in: string[] };
  organizationId?: string | { $in: string[] };
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
      const category = req.nextUrl.searchParams.get('category');
      const projectIds = req.nextUrl.searchParams.getAll('projectId');
      const organizationIds = req.nextUrl.searchParams.getAll('organizationId');

      if (category) {
        projection = projection || {};
        const categoryFields = categoryFieldMapping[category];
        if (categoryFields) {
          categoryFields.forEach((field: string | number) => {
            projection![field] = 1;
          });
        } else {
          return NextResponse.json(
            { success: false, error: 'Invalid category' },
            { status: 400 }
          );
        }
      }

      // Add projectId to the query object if provided
      if (projectIds.length > 0) {
        query.projectId = { $in: projectIds };
      }

      // Add organizationId to the query object if provided
      if (organizationIds.length > 0) {
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
}
