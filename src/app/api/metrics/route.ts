import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db-connect';
import Report from '@/server/models/Report';

export async function GET() {
  await dbConnect();

  try {
    // Initialize an object to hold the sum of each selected numeric field
    const metricsOptions: { [key: string]: number } = {
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
      Object.keys(metricsOptions).forEach((field) => {
        const value = report.get(field);
        if (typeof value === 'number') {
          metricsOptions[field] += value;
        }
      });
    });

    return NextResponse.json(
      {
        success: true,
        metricsOptions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching metric fields summary:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch  metric fields summary',
      },
      { status: 500 }
    );
  }
}
