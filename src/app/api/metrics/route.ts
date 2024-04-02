import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db-connect';

export async function GET() {
  await dbConnect();

  try {
    const metrics = [
      'amountAwarded',
      'clientsServed',
      'jobsCreated',
      'partners',
      'foodAssistance',
      'foodKnowledgeAndSkills',
      'accessToHealthyFoods',
      'producerSupport',
      'clothingAssistance',
      'hygieneAssistance',
      'healthCareAssistance',
      'mentalHealthAssistance',
      'childCareBirthToPreK',
      'childCareBirthToPreKHours',
      'childCareSchoolAged',
      'childCareSchoolAgedHours',
      'subsidiesOrScholarships',
      'rentalAssistance',
      'utilityAssistance',
      'otherAssistance',
    ];

    return NextResponse.json(
      {
        success: true,
        metrics: metrics,
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
