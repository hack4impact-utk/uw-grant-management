import dbConnect from '@/utils/db-connect';
import { withAuth } from '@/utils/auth';
import { NextResponse, NextRequest } from 'next/server';
import { createReports, validateImportCSV } from '@/utils/importing';
import { loadReportCSV } from '@/utils/parsing/csvParser';
import ReportSubmission from '@/server/models/ReportSubmission';
import { getServerSession } from 'next-auth';

export const GET = withAuth(async function () {
  await dbConnect();

  try {
    const reportSubmissions = await ReportSubmission.find().sort('-createdAt');
    return NextResponse.json(reportSubmissions);
  } catch (error) {
    console.error('Error fetching report submission data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async function (req: NextRequest) {
  try {
    const session = await getServerSession();
    const user = session?.user;
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const { startYear, startMonth, endYear, endMonth } = getFormData(formData);

    // Validate the CSV file data.
    const validationErrors = await validateImportCSV(file);
    if (validationErrors && validationErrors.length > 0) {
      return handleValidationErrors(validationErrors);
    }

    const existingReport = await ReportSubmission.find({
      periodStart: {
        month: startMonth,
        year: startYear,
      },
      periodEnd: {
        month: endMonth,
        year: endYear,
      },
    });
    if (existingReport.length) {
      return NextResponse.json(
        {
          success: false,
          message: `A report has already been submitted for the time period of ${startMonth} ${startYear} - ${endMonth} ${endYear}.`,
        },
        {
          status: 409,
        }
      );
    }
    const data = await loadReportCSV(file);
    const newReportSubmission = await ReportSubmission.create({
      submittedByEmail: user?.email,
      submittedByName: user?.name,
      periodStart: {
        month: startMonth,
        year: startYear,
      },
      periodEnd: {
        month: endMonth,
        year: endYear,
      },
      data: data,
    });

    await createReports(newReportSubmission.toObject());

    return NextResponse.json(
      {
        success: true,
        message: 'File uploaded successfully',
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: 'Error saving & processing the file. Please try again...',
      },
      { status: 500 }
    );
  }
});

/* Get the form data from the FormData object. */
function getFormData(formData: FormData) {
  return {
    startYear: formData.get('startYear') as string,
    startMonth: formData.get('startMonth') as string,
    endYear: formData.get('endYear') as string,
    endMonth: formData.get('endMonth') as string,
  };
}

/* Handle the validation errors found in the CSV file. Return a 422: Unprocessable Entity error code */
async function handleValidationErrors(validationErrors: string) {
  console.log('Validation Errors founds, returning 422');
  return NextResponse.json(
    {
      success: false,
      message: validationErrors,
    },
    { status: 422 }
  );
}
