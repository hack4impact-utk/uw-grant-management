import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs/promises';
import { importCSVReport } from '@/utils/importing';

// Post request to save the file to the server
// Will also connect to the db and import the csv file
export async function POST(req: NextRequest) {
  // Get the form data
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const startYear = formData.get('startYear');
  const startMonth = formData.get('startMonth');
  const endYear = formData.get('endYear');
  const endMonth = formData.get('endMonth');

  // Construct new file name & path
  const newFileName =
    startMonth + '-' + startYear + '_' + endMonth + '-' + endYear + '.csv';
  const newFilePath = 'src/data/reports/' + newFileName;

  // Save the file to the server
  try {
    const fileBuffer = await file.arrayBuffer();
    await fs.writeFile(newFilePath, Buffer.from(fileBuffer));

    // Import the csv file
    await importCSVReport(newFilePath);

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
