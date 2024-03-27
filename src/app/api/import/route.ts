import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs/promises';
import { importCSVReport } from '@/utils/importing';

/* 
    Handle POST request to /api/import.
    This endpoint will save the uploaded CSV file to the server and import the data to the database.
*/

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const startYear = formData.get('startYear') as string;
  const startMonth = formData.get('startMonth') as string;
  const endYear = formData.get('endYear') as string;
  const endMonth = formData.get('endMonth') as string;

  const newFileName =
    startMonth.toLowerCase() +
    '-' +
    startYear +
    '_' +
    endMonth.toLowerCase() +
    '-' +
    endYear +
    '.csv';
  const newFilePath = 'src/data/reports/' + newFileName;

  try {
    // Save the file to the server.
    const fileBuffer = await file.arrayBuffer();
    await fs.writeFile(newFilePath, Buffer.from(fileBuffer));

    // Import the CSV report to the database.
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
