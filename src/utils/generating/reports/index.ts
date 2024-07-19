import { CSVReportRow } from '@/utils/types/models';
import { OrganizationProjects } from '@/utils/constants';
import fs from 'fs';

// Function to write the CSV header to the report file.
function writeCSVHeader(reportData: CSVReportRow, fileName: string) {
  const header = Object.keys(reportData).join(',') + '\n';
  fs.writeFileSync(fileName, header);
}

// Function to write the data to the report file.
function writeToCSVFile(reportData: CSVReportRow, fileName: string) {
  // Handle edge case where some organization names contain a comma. Need to ensure they are not split into separate columns.
  const csvString =
    Object.values(reportData)
      .map((val: string) => {
        if (val.includes(',') || val.includes('"')) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      })
      .join(',') + '\n';

  fs.appendFileSync(fileName, csvString);
}

// Function to generate a random dollar amount string.
function generateDollarAmount() {
  const amount = Math.floor(Math.random() * 100000).toString();
  return '$' + amount + '.00';
}

// Function to generate a random number.
function generateRandomNumber(max: number) {
  return Math.floor(Math.random() * max);
}

// Function to generate random values for the jobs created, partners, and assistance fields.
function generateAssistanceValues(clientsServed: number) {
  const jobsCreated = generateRandomNumber(50);
  const partners = generateRandomNumber(25);
  const foodAssistance = generateRandomNumber(clientsServed);
  const foodKnowledgeAndSkills = generateRandomNumber(clientsServed);
  const accessToHealthyFoods = generateRandomNumber(clientsServed);
  const producerSupport = generateRandomNumber(10);
  const clothingAssistance = generateRandomNumber(clientsServed);
  const hygieneAssistance = generateRandomNumber(clientsServed);
  const healthCareAssistance = generateRandomNumber(clientsServed);
  const mentalHealthAssistance = generateRandomNumber(clientsServed);
  const childCareBirthPreK = generateRandomNumber(10);
  const childCareBirthPreKHours = generateRandomNumber(10);
  const childCareSchoolAge = generateRandomNumber(10);
  const childCareSchoolAgedHours = generateRandomNumber(10);
  const subsidiesOrScholarships = generateRandomNumber(20);
  const rentalAssistance = generateRandomNumber(clientsServed / 2);
  const utilityAssistance = generateRandomNumber(clientsServed);
  const otherAssistance = generateRandomNumber(clientsServed);

  return {
    jobsCreated,
    partners,
    foodAssistance,
    foodKnowledgeAndSkills,
    accessToHealthyFoods,
    producerSupport,
    clothingAssistance,
    hygieneAssistance,
    healthCareAssistance,
    mentalHealthAssistance,
    childCareBirthPreK,
    childCareBirthPreKHours,
    childCareSchoolAge,
    childCareSchoolAgedHours,
    subsidiesOrScholarships,
    rentalAssistance,
    utilityAssistance,
    otherAssistance,
  };
}

// Function to generate random zip code values.
function generateRandomZipCodeValues() {
  return Array.from({ length: 22 }, () => generateRandomNumber(100));
}

// Function to generate random values for the people served fields.
function generateRandomPeopleServeValues(zipCodeValues: number[]) {
  const peopleServedFullGrantReportingPeriod = zipCodeValues.reduce(
    (acc, val) => acc + val,
    0
  );
  const peopleServedNoPreviousAccess = generateRandomNumber(
    peopleServedFullGrantReportingPeriod
  );

  return {
    peopleServedFullGrantReportingPeriod,
    peopleServedNoPreviousAccess,
  };
}

// Function to generate random values for different genders.
function generateRandomGenderValues(
  peopleServedFullGrantReportingPeriod: number
) {
  const female = generateRandomNumber(
    peopleServedFullGrantReportingPeriod / 2 + 1
  );
  const male = generateRandomNumber(
    peopleServedFullGrantReportingPeriod / 2 + 1
  );
  const otherSex = generateRandomNumber(
    peopleServedFullGrantReportingPeriod / 2 + 1
  );
  const unknownSex = Math.max(
    0,
    peopleServedFullGrantReportingPeriod - (female + male + otherSex)
  );

  return {
    female,
    male,
    otherSex,
    unknownSex,
  };
}

// Function to generate random values for race and ethnicity.
function generateRandomRaceEthnicityValues(
  peopleServedFullGrantReportingPeriod: number
) {
  const white = generateRandomNumber(peopleServedFullGrantReportingPeriod);
  const blackOrAfricanAmerican = generateRandomNumber(
    peopleServedFullGrantReportingPeriod - white
  );
  const asianAmerican = generateRandomNumber(
    peopleServedFullGrantReportingPeriod - white - blackOrAfricanAmerican
  );
  const americanIndianOrAlaskaNative = generateRandomNumber(
    peopleServedFullGrantReportingPeriod -
      white -
      blackOrAfricanAmerican -
      asianAmerican
  );
  const nativeHawaiianAndPacificIslander = generateRandomNumber(
    peopleServedFullGrantReportingPeriod -
      white -
      blackOrAfricanAmerican -
      asianAmerican -
      americanIndianOrAlaskaNative
  );
  const twoOrMoreRaces = generateRandomNumber(
    peopleServedFullGrantReportingPeriod -
      white -
      blackOrAfricanAmerican -
      asianAmerican -
      americanIndianOrAlaskaNative -
      nativeHawaiianAndPacificIslander
  );
  const otherDesignation = generateRandomNumber(
    peopleServedFullGrantReportingPeriod -
      white -
      blackOrAfricanAmerican -
      asianAmerican -
      americanIndianOrAlaskaNative -
      nativeHawaiianAndPacificIslander -
      twoOrMoreRaces
  );
  const raceUnknown =
    peopleServedFullGrantReportingPeriod -
    white -
    blackOrAfricanAmerican -
    asianAmerican -
    americanIndianOrAlaskaNative -
    nativeHawaiianAndPacificIslander -
    twoOrMoreRaces -
    otherDesignation;
  const hispanicOrLatino = generateRandomNumber(
    peopleServedFullGrantReportingPeriod - raceUnknown
  );
  const notHispanicOrLatino = generateRandomNumber(
    peopleServedFullGrantReportingPeriod - raceUnknown - hispanicOrLatino
  );
  const unknownEthnicity =
    peopleServedFullGrantReportingPeriod -
    hispanicOrLatino -
    notHispanicOrLatino;

  return {
    white,
    blackOrAfricanAmerican,
    asianAmerican,
    americanIndianOrAlaskaNative,
    nativeHawaiianAndPacificIslander,
    twoOrMoreRaces,
    otherDesignation,
    raceUnknown,
    hispanicOrLatino,
    notHispanicOrLatino,
    unknownEthnicity,
  };
}

// Function to generate random values for income.
function generateRandomIncomeValues(
  peopleServedFullGrantReportingPeriod: number
) {
  const belowPovertyLevel100AndBelowOfPovertyBasedOnSizeOfFamilyUnit =
    generateRandomNumber(peopleServedFullGrantReportingPeriod / 2 + 1);
  const lowIncome101200OfPovertyBasedOnSizeOfFamilyUnit = generateRandomNumber(
    peopleServedFullGrantReportingPeriod -
      belowPovertyLevel100AndBelowOfPovertyBasedOnSizeOfFamilyUnit
  );
  const aboveLowIncome201AndAboveBasedOnSizeOfFamilyUnit = generateRandomNumber(
    peopleServedFullGrantReportingPeriod -
      lowIncome101200OfPovertyBasedOnSizeOfFamilyUnit
  );
  const incomeUnknown = Math.max(
    0,
    peopleServedFullGrantReportingPeriod -
      belowPovertyLevel100AndBelowOfPovertyBasedOnSizeOfFamilyUnit -
      lowIncome101200OfPovertyBasedOnSizeOfFamilyUnit -
      aboveLowIncome201AndAboveBasedOnSizeOfFamilyUnit
  );

  return {
    belowPovertyLevel100AndBelowOfPovertyBasedOnSizeOfFamilyUnit,
    lowIncome101200OfPovertyBasedOnSizeOfFamilyUnit,
    aboveLowIncome201AndAboveBasedOnSizeOfFamilyUnit,
    incomeUnknown,
  };
}

// Function to generate random values for age.
function generateRandomAgeValues(peopleServedFullGrantReportingPeriod: number) {
  const underFive = generateRandomNumber(peopleServedFullGrantReportingPeriod);
  const fiveSeventeen = generateRandomNumber(
    peopleServedFullGrantReportingPeriod - underFive
  );
  const eighteenTwentyFour = generateRandomNumber(
    peopleServedFullGrantReportingPeriod - underFive - fiveSeventeen
  );
  const twentyFiveFortyFour = generateRandomNumber(
    peopleServedFullGrantReportingPeriod -
      underFive -
      fiveSeventeen -
      eighteenTwentyFour
  );
  const fortyFiveSixtyFour = generateRandomNumber(
    peopleServedFullGrantReportingPeriod -
      underFive -
      fiveSeventeen -
      eighteenTwentyFour -
      twentyFiveFortyFour
  );
  const sixtyFiveOver = generateRandomNumber(
    peopleServedFullGrantReportingPeriod -
      underFive -
      fiveSeventeen -
      eighteenTwentyFour -
      twentyFiveFortyFour -
      fortyFiveSixtyFour
  );
  const ageUnknown =
    peopleServedFullGrantReportingPeriod -
    underFive -
    fiveSeventeen -
    eighteenTwentyFour -
    twentyFiveFortyFour -
    fortyFiveSixtyFour -
    sixtyFiveOver;

  return {
    underFive,
    fiveSeventeen,
    eighteenTwentyFour,
    twentyFiveFortyFour,
    fortyFiveSixtyFour,
    sixtyFiveOver,
    ageUnknown,
  };
}

// Function to generate the fake report data for the specified organization and project.
function generateFakeReportData(orgName: string, projName: string) {
  const clientsServed = generateRandomNumber(500);
  const assistanceValues = generateAssistanceValues(clientsServed);
  const zipCodeValues = generateRandomZipCodeValues();
  const peopleServedValues = generateRandomPeopleServeValues(zipCodeValues);
  const genderValues = generateRandomGenderValues(
    peopleServedValues.peopleServedFullGrantReportingPeriod
  );
  const raceEthnicityValues = generateRandomRaceEthnicityValues(
    peopleServedValues.peopleServedFullGrantReportingPeriod
  );
  const incomeValues = generateRandomIncomeValues(
    peopleServedValues.peopleServedFullGrantReportingPeriod
  );
  const ageValues = generateRandomAgeValues(
    peopleServedValues.peopleServedFullGrantReportingPeriod
  );

  const reportData: CSVReportRow = {
    ['Organization Name']: orgName,
    ['Project Name']: projName,
    ['Amount Awarded']: generateDollarAmount(),
    ['Clients Served']: clientsServed.toString(),
    ['Jobs Created']: assistanceValues.jobsCreated.toString(),
    ['Partners']: assistanceValues.partners.toString(),
    ['Food Assistance']: assistanceValues.foodAssistance.toString(),
    ['Food Knowledge and Skills']:
      assistanceValues.foodKnowledgeAndSkills.toString(),
    ['Access to Healthy Foods']:
      assistanceValues.accessToHealthyFoods.toString(),
    ['Producer Support']: assistanceValues.producerSupport.toString(),
    ['Clothing Assistance']: assistanceValues.clothingAssistance.toString(),
    ['Hygiene Assistance']: assistanceValues.hygieneAssistance.toString(),
    ['Health Care Assistance']:
      assistanceValues.healthCareAssistance.toString(),
    ['Mental Health Assistance']:
      assistanceValues.mentalHealthAssistance.toString(),
    ['Child Care BirthPreK']: assistanceValues.childCareBirthPreK.toString(),
    ['Child Care BirthPreK Hours']:
      assistanceValues.childCareBirthPreKHours.toString(),
    ['Child Care School Age']: assistanceValues.childCareSchoolAge.toString(),
    ['Child Care SchoolAged Hours']:
      assistanceValues.childCareSchoolAgedHours.toString(),
    ['Subsidies or Scholarships']:
      assistanceValues.subsidiesOrScholarships.toString(),
    ['Rental Assistance']: assistanceValues.rentalAssistance.toString(),
    ['Utility Assistance']: assistanceValues.utilityAssistance.toString(),
    ['Other Assistance']: assistanceValues.otherAssistance.toString(),
    ['Attraction and Retention']: 'N/A',
    ['Corryton 37721']: zipCodeValues[0].toString(),
    ['Farragut 37934']: zipCodeValues[1].toString(),
    ['Heiskell 37754']: zipCodeValues[2].toString(),
    ['Knoxville 37938']: zipCodeValues[3].toString(),
    ['Knoxville 37902']: zipCodeValues[4].toString(),
    ['Knoxville 37909']: zipCodeValues[5].toString(),
    ['Knoxville 37912']: zipCodeValues[6].toString(),
    ['Knoxville 37914']: zipCodeValues[7].toString(),
    ['Knoxville 37915']: zipCodeValues[8].toString(),
    ['Knoxville 37916']: zipCodeValues[9].toString(),
    ['Knoxville 37917']: zipCodeValues[10].toString(),
    ['Knoxville 37918']: zipCodeValues[11].toString(),
    ['Knoxville 37919']: zipCodeValues[12].toString(),
    ['Knoxville 37920']: zipCodeValues[13].toString(),
    ['Knoxville 37921']: zipCodeValues[14].toString(),
    ['Knoxville 37922']: zipCodeValues[15].toString(),
    ['Knoxville 37923']: zipCodeValues[16].toString(),
    ['Knoxville 37924']: zipCodeValues[17].toString(),
    ['Knoxville 37931']: zipCodeValues[18].toString(),
    ['Knoxville 37932']: zipCodeValues[19].toString(),
    ['Powell 37849']: zipCodeValues[20].toString(),
    ['Mascot 37806']: zipCodeValues[21].toString(),
    ['People Served  Full Grant Reporting Period']:
      peopleServedValues.peopleServedFullGrantReportingPeriod.toString(),
    ['Number of People Served No Previous Access']:
      peopleServedValues.peopleServedNoPreviousAccess.toString(),
    ['Female']: genderValues.female.toString(),
    ['Male']: genderValues.male.toString(),
    ['Other Sex']: genderValues.otherSex.toString(),
    ['Unknown Sex']: genderValues.unknownSex.toString(),
    ['White']: raceEthnicityValues.white.toString(),
    ['Black or African American']:
      raceEthnicityValues.blackOrAfricanAmerican.toString(),
    ['Asian American']: raceEthnicityValues.asianAmerican.toString(),
    ['American Indian or Alaska Native']:
      raceEthnicityValues.americanIndianOrAlaskaNative.toString(),
    ['Native Hawaiian and Pacific Islander']:
      raceEthnicityValues.nativeHawaiianAndPacificIslander.toString(),
    ['Two or More Races']: raceEthnicityValues.twoOrMoreRaces.toString(),
    ['Other Designation']: raceEthnicityValues.otherDesignation.toString(),
    ['Race Unknown']: raceEthnicityValues.raceUnknown.toString(),
    ['Hispanic or Latino']: raceEthnicityValues.hispanicOrLatino.toString(),
    ['Not Hispanic or Latino']:
      raceEthnicityValues.notHispanicOrLatino.toString(),
    ['Unknown Ethnicity']: raceEthnicityValues.unknownEthnicity.toString(),
    ['Below Poverty Level 100 and below of poverty based on size of family unit']:
      incomeValues.belowPovertyLevel100AndBelowOfPovertyBasedOnSizeOfFamilyUnit.toString(),
    ['Low Income 101200 of poverty based on size of family unit']:
      incomeValues.lowIncome101200OfPovertyBasedOnSizeOfFamilyUnit.toString(),
    ['Above Low Income 201 and above based on size of family unit']:
      incomeValues.aboveLowIncome201AndAboveBasedOnSizeOfFamilyUnit.toString(),
    ['Income Unknown']: incomeValues.incomeUnknown.toString(),
    ['Under Five']: ageValues.underFive.toString(),
    ['Five  Seventeen']: ageValues.fiveSeventeen.toString(),
    ['Eighteen  TwentyFour']: ageValues.eighteenTwentyFour.toString(),
    ['TwentyFive  FortyFour']: ageValues.twentyFiveFortyFour.toString(),
    ['FortyFive  SixtyFour']: ageValues.fortyFiveSixtyFour.toString(),
    ['SixtyFive  Over']: ageValues.sixtyFiveOver.toString(),
    ['Age Unknown']: ageValues.ageUnknown.toString(),
  };

  return reportData;
}

// Function to create the dummy reports for the specified period.
function createReportsForPeriod(periodStart: string, periodEnd: string) {
  // eslint-disable-next-line prefer-const
  let reports: CSVReportRow[] = [];

  // Generate the fake data for each organization and project. Save it in the reports array.
  for (const [orgName, projName] of OrganizationProjects) {
    const reportData = generateFakeReportData(orgName, projName);
    reports.push(reportData);
  }

  // Write the CSV header to the report file.
  writeCSVHeader(
    reports[0],
    `src/data/reports/${periodStart}_${periodEnd}.csv`
  );

  // Write the data to the report file.
  for (let i = 0; i < reports.length; i++) {
    writeToCSVFile(
      reports[i],
      `src/data/reports/${periodStart}_${periodEnd}.csv`
    );
  }
}

// Function to generate the dummy reports for the specified number of years back.
export async function generateDummyReports(numYearsBackdate: number) {
  console.log('Creating Dummy reports: ' + numYearsBackdate + ' years back');

  const currentYear = new Date().getFullYear();
  const startYear = currentYear - numYearsBackdate;

  // Create 2 reports for each year backdated.
  for (let i = 0; i < numYearsBackdate; i++) {
    const year = startYear + i;
    const periodStart1 = 'january-' + year.toString();
    const periodEnd1 = 'june-' + year.toString();
    const periodStart2 = 'july-' + year.toString();
    const periodEnd2 = 'december-' + year.toString();

    console.log(
      'Creating reports for period: ' +
        periodStart1 +
        ' to ' +
        periodEnd1 +
        ' and ' +
        periodStart2 +
        ' to ' +
        periodEnd2
    );

    createReportsForPeriod(periodStart1, periodEnd1);
    createReportsForPeriod(periodStart2, periodEnd2);
  }

  return;
}
