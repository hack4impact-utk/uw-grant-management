import Report from '@/server/models/Report';
import dbConnect from '@/utils/db-connect';
import type { NextApiRequest, NextApiResponse } from 'next';

interface IZipCodeClientsServed {
  zipCode: string;
  clientsServed: number;
}

interface ApiResponse {
  data: IZipCodeClientsServed[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const reports = await Report.find({}, 'zipCodeClientsServed -_id').lean();
      const zipCodesAndClients = reports
        .map((report) => report.zipCodeClientsServed)
        .flat();
      res.status(200).json({ data: zipCodesAndClients });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'An error occurred',
        data: [],
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
