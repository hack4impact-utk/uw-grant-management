import dbConnect from '@/utils/db-connect';
import { NextResponse, NextRequest } from 'next/server';
import ReportSubmission from '@/server/models/ReportSubmission';
import { withAuth } from '@/utils/auth';
import { Report } from '@/server/models';

interface Params {
  reportSubmissionId: string;
}

export const DELETE = withAuth(async function (
  req: NextRequest,
  {
    params,
  }: {
    params: Params;
  }
) {
  await dbConnect();
  const { reportSubmissionId } = params;
  const reportSubmission = ReportSubmission.findOne({
    _id: reportSubmissionId,
  });
  if (!reportSubmission) {
    return NextResponse.json(
      { success: false },
      {
        status: 404,
      }
    );
  }

  await Report.deleteMany({
    reportSubmissionId: reportSubmissionId,
  });
  await reportSubmission.deleteOne();
  return NextResponse.json(
    { success: true },
    {
      status: 200,
    }
  );
});
