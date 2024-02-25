import fs from 'fs';
import dbConnect from '@/server';
import Report from '@/server/models/Report';
import Organization from '@/server/models/Organization';
import Project from '@/server/models/Project';
import { importCSVReport } from '@/utils/importing';

dbConnect()
  .then(async () => {
    if (process.argv.includes('--reset')) {
      await Organization.deleteMany({});
      await Project.deleteMany({});
      await Report.deleteMany({});
    }
    const reportsDir = 'src/data/reports/';
    const reportFiles = await fs.promises.readdir(reportsDir);
    reportFiles.forEach(
      async (reportFileName) =>
        await importCSVReport(reportsDir + reportFileName)
    );

    process.exit();
  })
  .catch((e) => {
    throw e;
  });
