import { generateDummyReports } from '@/utils/generating/reports';

if (process.argv.length < 3) {
  console.error('Usage: pnpm create-dummy-reports --<numYearsBackdate>');
  process.exit(1);
}

const args = process.argv.slice(2);
const numYearsBack = parseInt(args[0].replace('--', ''));

if (isNaN(numYearsBack)) {
  console.error('Invalid argument: ' + args[0]);
  process.exit(1);
}

generateDummyReports(numYearsBack);
