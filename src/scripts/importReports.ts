import dbConnect from '@/utils/db-connect';
import Report from '@/server/models/Report';
import Organization from '@/server/models/Organization';
import Project from '@/server/models/Project';
import ReportSubmission from '@/server/models/ReportSubmission';

dbConnect()
  .then(async () => {
    if (process.argv.includes('--reset')) {
      await ReportSubmission.deleteMany({});
      await Organization.deleteMany({});
      await Project.deleteMany({});
      await Report.deleteMany({});
    }

    // const reportsDir = 'src/data/reports/';
    // const reportFiles = await fs.promises.readdir(reportsDir);
    // for (const reportFileName of reportFiles) {
    //   await importCSVReport(reportsDir + reportFileName);
    // }

    process.exit();
  })
  .catch((e) => {
    throw e;
  });
