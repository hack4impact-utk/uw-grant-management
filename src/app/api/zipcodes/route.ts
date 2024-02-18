// import type { NextApiRequest, NextApiResponse } from 'next';
import Report from '@/server/models/Report';
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db-connect';

export async function GET() {
  await dbConnect();

  try {
    const zipCodeClientsServedMap = new Map<string, number>();
    const reports = await Report.find({});
    reports.forEach((report) => {
      report.zipCodeClientsServed.forEach((zipCodeInfo) => {
        let currentCount =
          zipCodeClientsServedMap.get(zipCodeInfo.zipCode) || 0;
        currentCount += zipCodeInfo.clientsServed;
        zipCodeClientsServedMap.set(zipCodeInfo.zipCode, currentCount);
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

// try {
//   const zipCodeData = await Report.find({});
//   res.status(200).json({ data: zipCodeData });
// } catch (error) {
//   console.error("Error fetching zip code data:", error);
//   res.status(500).json({ message: "Error fetching data" });
// }

// To handle a POST request to /api
// export async function POST(request: any) {
//   console.log("HELLO");
//   return NextResponse.json({ message: "Hello World" }, { status: 200 });
// }
