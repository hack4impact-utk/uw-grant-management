import dbConnect from '@/server';
import Report from '@/server/models/Report';
import Organization from '@/server/models/Organization';
import Project from '@/server/models/Project';
import { loadReportCSV, CSVReportRow } from '@/utils/parsing/csvParser';

async function createOrg(orgName: string) {
  return await Organization.create({
    name: orgName,
  });
}

async function createProject(projectName: string, orgId: string | undefined) {
  return await Project.create({
    organizationId: orgId,
    name: projectName,
  });
}

function parseZipCodeClientsServed(reportData: CSVReportRow) {
  const zipCodePrefixes = [
    'Knoxville',
    'Farragut',
    'Corryton',
    'Heiskell',
    'Powell',
    'Mascot',
  ];
  return Object.entries(reportData)
    .filter(([key]) => {
      return zipCodePrefixes.some((prefix) => key.includes(prefix));
    })
    .map(([key, val]) => {
      return {
        zipCode: key.split(' ')[1],
        clientsServed: parseInt(val.trim() || '0'),
      };
    });
}

async function createReport(
  reportData: CSVReportRow,
  organizationId: string,
  projectId: string
) {
  await Report.create({
    organizationId: organizationId,
    projectId: projectId,
    periodStart: {
      month: 'May',
      year: '2023',
    },
    periodEnd: {
      month: 'September',
      year: '2023',
    },
    amountAwarded: parseFloat(
      reportData['Amount Awarded'].replace('$', '').trim() || '0'
    ).toFixed(2),
    clientsServed: parseInt(reportData['Clients Served'].trim() || '0'),
    jobsCreated: parseInt(reportData['Clients Served'].trim() || '0'),
    partners: parseInt(reportData['Partners'].trim() || '0'),
    foodAssistance: parseInt(reportData['Food Assistance'].trim() || '0'),
    foodKnowledgeAndSkills: parseInt(
      reportData['Food Knowledge and Skills'].trim() || '0'
    ),
    accessToHealthyFoods: parseInt(
      reportData['Access to Healthy Foods'].trim() || '0'
    ),
    producerSupport: parseInt(reportData['Producer Support'].trim() || '0'),
    clothingAssistance: parseInt(
      reportData['Clothing Assistance'].trim() || '0'
    ),
    hygieneAssistance: parseInt(reportData['Hygiene Assistance'].trim() || '0'),
    healthCareAssistance: parseInt(
      reportData['Health Care Assistance'].trim() || '0'
    ),
    mentalHealthAssistance: parseInt(
      reportData['Mental Health Assistance'].trim() || '0'
    ),
    childCareBirthToPreK: parseInt(
      reportData['Child Care BirthPreK'].trim() || '0'
    ),
    childCareBirthToPreKHours: parseInt(
      reportData['Child Care BirthPreK Hours'].trim() || '0'
    ),
    childCareSchoolAged: parseInt(
      reportData['Child Care School Age'].trim() || '0'
    ),
    childCareSchoolAgedHours: parseInt(
      reportData['Child Care SchoolAged Hours'].trim() || '0'
    ),
    subsidiesOrScholarships: parseInt(
      reportData['Subsidies or Scholarships'].trim() || '0'
    ),
    rentalAssistance: parseInt(reportData['Rental Assistance'].trim() || '0'),
    utilityAssistance: parseInt(reportData['Utility Assistance'].trim() || '0'),
    otherAssistance: parseInt(reportData['Other Assistance'].trim() || '0'),
    zipCodeClientsServed: parseZipCodeClientsServed(reportData),
  });
}

dbConnect()
  .then(async () => {
    await Organization.deleteMany();
    await Project.deleteMany();
    await Report.deleteMany();

    const data = await loadReportCSV('src/data/six-month-reports.csv');
    const orgNameToIdMapper = new Map<string, string>();

    const orgs = await Organization.find();
    orgs.forEach((org) => {
      orgNameToIdMapper.set(org.name, org.id);
    });

    for (const item of data) {
      if (!item['Organization Name']) {
        continue;
      }

      let orgId = orgNameToIdMapper.get(item['Organization Name']) || '';
      if (!orgId) {
        const newOrg = await createOrg(item['Organization Name']);
        orgNameToIdMapper.set(newOrg.name, newOrg.id);
        orgId = newOrg.id;
      }

      const projectQuery = await Project.find({
        organizationId: orgId,
        name: item['Project Name'],
      });

      const project = projectQuery.length
        ? projectQuery[0]
        : await createProject(item['Organization Name'], orgId);

      await createReport(item, orgId, project.id);
    }

    process.exit();
  })
  .catch((e) => {
    throw e;
  });
