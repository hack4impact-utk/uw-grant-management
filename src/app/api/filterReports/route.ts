import Report from '@/server/models/Report';
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db-connect';

// This was just an idea I played around with. It is not being used anywhere.

// function filterNonZeroValues(obj: Record<string, number>): Record<string, number> {
//     return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== 0));
//   }

export async function GET(metricKey: string) {
  await dbConnect();

  try {
    const reports = await Report.find({});
    let totalClientsServedForMetric = 0;

    const transformedReports = reports.map((report) => {
      const reportObj = JSON.parse(JSON.stringify(report.toObject()));
      const metricsArray: Array<{ key: string; value: number }> = [];

      Object.keys(reportObj).forEach((key) => {
        const value = reportObj[key];
        if (typeof value === 'number') {
          metricsArray.push({ key, value });

          if (key === metricKey) {
            totalClientsServedForMetric += value;
          }
          console.log(totalClientsServedForMetric);
        }
      });
      return {
        ...reportObj,
        metrics: metricsArray,
        zipCodeClientsServed: reportObj.zipCodeClientsServed,
        clientsServedBySex: reportObj.clientsServedBySex,
        clientsServedByRace: reportObj.clientsServedByRace,
        clientsServedByEthnicity: reportObj.clientsServedByEthnicity,
        clientsServedByHouseholdIncome:
          reportObj.clientsServedByHouseholdIncome,
        clientsServedByAge: reportObj.clientsServedByAge,
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: transformedReports,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching report data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
