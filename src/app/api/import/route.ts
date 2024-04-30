import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs/promises';
import { importCSVReport, validateImportCSV } from '@/utils/importing';

/* 
    Handle POST request to /api/import.
    This endpoint will save the uploaded CSV file to the server and import the data to the database.
*/

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const { startYear, startMonth, endYear, endMonth } = getFormData(formData);
    const newFileName = generateNewFileName(
      startYear,
      startMonth,
      endYear,
      endMonth
    );
    const newFilePath = 'src/data/reports/' + newFileName;

    // Validate the CSV file data.
    const validationErrors = await validateImportCSV(file);
    if (validationErrors && validationErrors.length > 0) {
      return handleValidationErrors(validationErrors);
    }

    // Save the CSV file to the server & upload the data to the database.
    await saveCSVFile(file, newFilePath);

    return NextResponse.json(
      {
        success: true,
        message: 'File uploaded successfully',
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Error saving & processing the file. Please try again...',
      },
      { status: 500 }
    );
  }
}

/* Get the form data from the FormData object. */
function getFormData(formData: FormData) {
  return {
    startYear: formData.get('startYear') as string,
    startMonth: formData.get('startMonth') as string,
    endYear: formData.get('endYear') as string,
    endMonth: formData.get('endMonth') as string,
  };
}

/* Generate a new file name based on the time period. */
function generateNewFileName(
  startYear: string,
  startMonth: string,
  endYear: string,
  endMonth: string
) {
  return (
    startMonth.toLowerCase() +
    '-' +
    startYear +
    '_' +
    endMonth.toLowerCase() +
    '-' +
    endYear +
    '.csv'
  );
}

/* Handle the validation errors found in the CSV file. Return a 422: Unprocessable Entity error code */
async function handleValidationErrors(validationErrors: string) {
  console.log('Validation Errors founds, returning 422');
  return NextResponse.json(
    {
      success: false,
      message: 'Error with validation of the CSV File... Please try again.',
      errors: validationErrors,
    },
    { status: 422 }
  );
}

/* Save the CSV file to the server and import the data to the database. */
async function saveCSVFile(file: File, newFilePath: string) {
  // Save the file to the server.
  console.log('SAVING');
  const fileBuffer = await file.arrayBuffer();
  await fs.writeFile(newFilePath, Buffer.from(fileBuffer));

  // Import the CSV report to the database.
  await importCSVReport(newFilePath);
}
