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

function extractInt(value: string) {
  return parseInt(value.trim() || '0');
}

async function createReport(
  reportData: CSVReportRow,
  organizationId: string,
  projectId: string
) {
  const existingReport = await Report.findOne({
    organizationId: organizationId,
    projectId: projectId,
    'periodStart.month': 'May',
    'periodStart.year': '2023',
    'periodEnd.month': 'September',
    'periodEnd.year': '2023',
  });
  if (existingReport) {
    return;
  }

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
    clientsServed: extractInt(reportData['Clients Served']),
    jobsCreated: extractInt(reportData['Jobs Created']),
    partners: extractInt(reportData['Partners']),
    foodAssistance: extractInt(reportData['Food Assistance']),
    foodKnowledgeAndSkills: extractInt(reportData['Food Knowledge and Skills']),
    accessToHealthyFoods: extractInt(reportData['Access to Healthy Foods']),
    producerSupport: extractInt(reportData['Producer Support']),
    clothingAssistance: extractInt(reportData['Clothing Assistance']),
    hygieneAssistance: extractInt(reportData['Hygiene Assistance']),
    healthCareAssistance: extractInt(reportData['Health Care Assistance']),
    mentalHealthAssistance: extractInt(reportData['Mental Health Assistance']),
    childCareBirthToPreK: extractInt(reportData['Child Care BirthPreK']),
    childCareBirthToPreKHours: extractInt(
      reportData['Child Care BirthPreK Hours']
    ),
    childCareSchoolAged: extractInt(reportData['Child Care School Age']),
    childCareSchoolAgedHours: extractInt(
      reportData['Child Care SchoolAged Hours']
    ),
    subsidiesOrScholarships: extractInt(
      reportData['Subsidies or Scholarships']
    ),
    rentalAssistance: extractInt(reportData['Rental Assistance']),
    utilityAssistance: extractInt(reportData['Utility Assistance']),
    otherAssistance: extractInt(reportData['Other Assistance']),
    zipCodeClientsServed: parseZipCodeClientsServed(reportData),
    clientsServedByAge: {
      underFive: extractInt(reportData['Under Five']),
      fiveToSeventeen: extractInt(reportData['Five  Seventeen']),
      eighteenToTwentyFour: extractInt(reportData['Eighteen  TwentyFour']),
      twentyFiveToFortyFour: extractInt(reportData['TwentyFive  FortyFour']),
      fortyFiveToSixtyFour: extractInt(reportData['FortyFive  SixtyFour']),
      sixtyFiveAndOver: extractInt(reportData['SixtyFive  Over']),
      unknown: extractInt(reportData['Age Unknown']),
    },
    clientsServedBySex: {
      female: extractInt(reportData['Female']),
      male: extractInt(reportData['Male']),
      other: extractInt(reportData['Other Sex']),
      unknown: extractInt(reportData['Unknown Sex']),
    },
    clientsServedByRace: {
      caucasian: extractInt(reportData['White']),
      africanAmerican: extractInt(reportData['Black or African American']),
      asianAmerican: extractInt(reportData['Asian American']),
      americanIndianAlaskan: extractInt(
        reportData['American Indian or Alaska Native']
      ),
      nativeHawaiianPacificIslander: extractInt(
        reportData['Native Hawaiian and Pacific Islander']
      ),
      twoOrMoreRaces: extractInt(reportData['Two or More Races']),
      unknown: extractInt(reportData['Race Unknown']),
    },
    clientsServedByHouseholdIncome: {
      belowPoverty: extractInt(
        reportData[
          'Below Poverty Level 100 and below of poverty based on size of family unit'
        ]
      ),
      lowIncome: extractInt(
        reportData['Low Income 101200 of poverty based on size of family unit']
      ),
      aboveLowIncome: extractInt(
        reportData[
          'Above Low Income 201 and above based on size of family unit'
        ]
      ),
      unknown: extractInt(reportData['Income Unknown']),
    },
    clientsServedByEthnicity: {
      hispanicLatino: extractInt(reportData['Hispanic or Latino']),
      notHispanicLatino: extractInt(reportData['Not Hispanic or Latino']),
      unknown: extractInt(reportData['Unknown Ethnicity']),
    },
  });
}

dbConnect()
  .then(async () => {
    const data = await loadReportCSV('src/data/may-2023_september-2023.csv');
    const orgNameToIdMapper = new Map<string, string>();

    const orgs = await Organization.find();
    orgs.forEach((org) => {
      orgNameToIdMapper.set(org.name, org.id);
    });

    for (const item of data) {
      if (!(item['Organization Name'].trim() && item['Project Name'].trim())) {
        continue;
      }

      let orgId = orgNameToIdMapper.get(item['Organization Name']) || '';
      if (!orgId) {
        const newOrg = await createOrg(item['Organization Name']);
        orgNameToIdMapper.set(newOrg.name, newOrg.id);
        orgId = newOrg.id;
      }

      const existingProject = await Project.findOne({
        organizationId: orgId,
        name: item['Project Name'],
      });

      const project = existingProject
        ? existingProject
        : await createProject(item['Project Name'], orgId);

      await createReport(item, orgId, project.id);
    }

    process.exit();
  })
  .catch((e) => {
    throw e;
  });
