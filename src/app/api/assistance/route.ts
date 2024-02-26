import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db-connect';
import Report from '@/server/models/Report';
export async function GET() {
  await dbConnect();

  try {
    // Initialize an object to hold the sum of each selected numeric field
    const numericFieldsSummary: { [key: string]: number } = {
      amountAwarded: 0,
      clientsServed: 0,
      jobsCreated: 0,
      partners: 0,
      foodAssistance: 0,
      foodKnowledgeAndSkills: 0,
      accessToHealthyFoods: 0,
      producerSupport: 0,
      clothingAssistance: 0,
      hygieneAssistance: 0,
      healthCareAssistance: 0,
      mentalHealthAssistance: 0,
      childCareBirthToPreK: 0,
      childCareBirthToPreKHours: 0,
      childCareSchoolAged: 0,
      childCareSchoolAgedHours: 0,
      subsidiesOrScholarships: 0,
      rentalAssistance: 0,
      utilityAssistance: 0,
      otherAssistance: 0,
    };

    const reports = await Report.find({});

    reports.forEach((report) => {
      Object.keys(numericFieldsSummary).forEach((field) => {
        const value = report.get(field);
        if (typeof value === 'number') {
          numericFieldsSummary[field] += value;
        }
      });
    });

    return NextResponse.json(
      {
        success: true,
        numericFieldsSummary,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching numeric fields summary:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch numeric fields summary',
      },
      { status: 500 }
    );
  }
}
