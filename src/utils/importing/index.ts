import Report from '@/server/models/Report';
import Organization from '@/server/models/Organization';
import Project from '@/server/models/Project';
import { loadReportCSV, CSVReportRow } from '@/utils/parsing/csvParser';
import { locations } from '@/utils/constants';
import { capitalize } from '@/utils/formatting';
import { TimePeriod } from '@/utils/types/models';

// Pull an integer from a numeric or empty string. Empty
// string is defaulted to 0.
function extractInt(value: string) {
  return parseInt(value.trim() || '0');
}

// Create organization
async function createOrg(orgName: string) {
  return await Organization.create({
    name: orgName,
  });
}

// Create project
async function createProject(projectName: string, orgId: string) {
  return await Project.create({
    organizationId: orgId,
    name: projectName,
  });
}

// Parse zip code data
function parseZipCodeClientsServed(reportData: CSVReportRow) {
  return Object.entries(reportData)
    .filter(([key]) => {
      return locations.some((prefix) => key.includes(prefix));
    })
    .map(([key, val]) => {
      const [location, zipCode] = key.split(' ');
      return {
        zipCode: zipCode,
        clientsServed: extractInt(val),
        location: location,
      };
    });
}

async function createReport(
  reportData: CSVReportRow,
  organizationId: string,
  projectId: string,
  periodStart: TimePeriod,
  periodEnd: TimePeriod
) {
  // If the report hasn't been created yet, create it.
  const existingReport = await Report.findOne({
    organizationId: organizationId,
    projectId: projectId,
    'periodStart.month': periodStart.month,
    'periodStart.year': periodStart.year,
    'periodEnd.month': periodEnd.month,
    'periodEnd.year': periodEnd.year,
  });

  if (existingReport) {
    return;
  }

  await Report.create({
    organizationId: organizationId,
    projectId: projectId,
    periodStart: periodStart,
    periodEnd: periodEnd,
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

export const importCSVReport = async (filePath: string) => {
  // Parse time period information from file path
  const fileName = filePath.split('/').pop() || '';
  const [periodStartString, periodEndString] = fileName
    .replace('.csv', '')
    .split('_');

  const periodStart: TimePeriod = {
    month: capitalize(periodStartString.split('-')[0]),
    year: periodStartString.split('-')[1],
  };
  const periodEnd: TimePeriod = {
    month: capitalize(periodEndString.split('-')[0]),
    year: periodEndString.split('-')[1],
  };

  // Load CSV data
  const data = await loadReportCSV(filePath);

  const orgNameToIdMapper = new Map<string, string>();
  // Find existing organization and create mapper
  const orgs = await Organization.find();
  orgs.forEach((org) => {
    orgNameToIdMapper.set(org.name, org.id);
  });

  for (const item of data) {
    // Ignore rows that don't have crucial names
    if (!(item['Organization Name'].trim() && item['Project Name'].trim())) {
      continue;
    }

    // Find organization id
    let orgId = orgNameToIdMapper.get(item['Organization Name']) || '';
    if (!orgId) {
      const newOrg = await createOrg(item['Organization Name']);
      orgNameToIdMapper.set(newOrg.name, newOrg.id);
      orgId = newOrg.id;
    }

    // Find project id
    const existingProject = await Project.findOne({
      organizationId: orgId,
      name: item['Project Name'],
    });

    const projectId = existingProject
      ? existingProject.id
      : (await createProject(item['Project Name'], orgId)).id;

    await createReport(item, orgId, projectId, periodStart, periodEnd);
  }
};
