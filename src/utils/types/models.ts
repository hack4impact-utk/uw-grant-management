import { z } from 'zod';
import { zipCodes, locations } from '../constants';

// const monthsEnum = z.enum(months);
const zipCodesEnum = z.enum(zipCodes);
const locationsEnum = z.enum(locations);

export const TimePeriodSchema = z.object({
  month: z.string(),
  year: z.string(),
});

const ZipCodeClientsServedSchema = z.object({
  zipCode: zipCodesEnum,
  clientsServed: z.number(),
  location: locationsEnum,
});

const ClientsSexSchema = z.object({
  female: z.number(),
  male: z.number(),
  other: z.number(),
  unknown: z.number(),
});

const ClientsRaceSchema = z.object({
  caucasian: z.number(),
  africanAmerican: z.number(),
  asianAmerican: z.number(),
  americanIndianAlaskan: z.number(),
  nativeHawaiianPacificIslander: z.number(),
  twoOrMoreRaces: z.number(),
  unknown: z.number(),
});

const ClientEthnicitySchema = z.object({
  hispanicLatino: z.number(),
  notHispanicLatino: z.number(),
  unknown: z.number(),
});

const ClientHouseholdIncomeSchema = z.object({
  belowPoverty: z.number(),
  lowIncome: z.number(),
  aboveLowIncome: z.number(),
  unknown: z.number(),
});

const ClientAgeSchema = z.object({
  underFive: z.number(),
  fiveToSeventeen: z.number(),
  eighteenToTwentyFour: z.number(),
  twentyFiveToFortyFour: z.number(),
  fortyFiveToSixtyFour: z.number(),
  sixtyFiveAndOver: z.number(),
  unknown: z.number(),
});

const demographicsEnum = z.enum([
  'Client Zip Code',
  'Sex',
  'Race',
  'Ethnicity',
  'Household Income',
  'Age',
]);

const ReportSchema = z.object({
  id: z.string(),
  periodStart: TimePeriodSchema,
  periodEnd: TimePeriodSchema,
  reportSubmissionId: z.string(),
  organizationId: z.string(),
  projectId: z.string(),
  clientsServed: z.number(),
  amountAwarded: z.number(),
  jobsCreated: z.number(),
  partners: z.number(),
  foodAssistance: z.number(),
  foodKnowledgeAndSkills: z.number(),
  accessToHealthyFoods: z.number(),
  producerSupport: z.number(),
  clothingAssistance: z.number(),
  hygieneAssistance: z.number(),
  healthCareAssistance: z.number(),
  mentalHealthAssistance: z.number(),
  childCareBirthToPreK: z.number(),
  childCareBirthToPreKHours: z.number(),
  childCareSchoolAged: z.number(),
  childCareSchoolAgedHours: z.number(),
  subsidiesOrScholarships: z.number(),
  rentalAssistance: z.number(),
  utilityAssistance: z.number(),
  otherAssistance: z.number(),
  reportedDemographics: z.array(demographicsEnum),
  zipCodeClientsServed: z.array(ZipCodeClientsServedSchema),
  clientsServedBySex: ClientsSexSchema,
  clientsServedByRace: ClientsRaceSchema,
  clientsServedByEthnicity: ClientEthnicitySchema,
  clientsServedByHouseholdIncome: ClientHouseholdIncomeSchema,
  clientsServedByAge: ClientAgeSchema,
  attractionAndRetention: z.string(),
});

const CSVReportRowSchema = z.object({
  ['Organization Name']: z.string(),
  ['Project Name']: z.string(),
  ['Amount Awarded']: z.string(),
  ['Clients Served']: z.string(),
  ['Jobs Created']: z.string(),
  ['Partners']: z.string(),
  ['Food Assistance']: z.string(),
  ['Food Knowledge and Skills']: z.string(),
  ['Access to Healthy Foods']: z.string(),
  ['Producer Support']: z.string(),
  ['Clothing Assistance']: z.string(),
  ['Hygiene Assistance']: z.string(),
  ['Health Care Assistance']: z.string(),
  ['Mental Health Assistance']: z.string(),
  ['Child Care BirthPreK']: z.string(),
  ['Child Care BirthPreK Hours']: z.string(),
  ['Child Care School Age']: z.string(),
  ['Child Care SchoolAged Hours']: z.string(),
  ['Subsidies or Scholarships']: z.string(),
  ['Rental Assistance']: z.string(),
  ['Utility Assistance']: z.string(),
  ['Other Assistance']: z.string(),
  ['Attraction and Retention']: z.string(),
  ['Corryton 37721']: z.string(),
  ['Farragut 37934']: z.string(),
  ['Heiskell 37754']: z.string(),
  ['Knoxville 37938']: z.string(),
  ['Knoxville 37902']: z.string(),
  ['Knoxville 37909']: z.string(),
  ['Knoxville 37912']: z.string(),
  ['Knoxville 37914']: z.string(),
  ['Knoxville 37915']: z.string(),
  ['Knoxville 37916']: z.string(),
  ['Knoxville 37917']: z.string(),
  ['Knoxville 37918']: z.string(),
  ['Knoxville 37919']: z.string(),
  ['Knoxville 37920']: z.string(),
  ['Knoxville 37921']: z.string(),
  ['Knoxville 37922']: z.string(),
  ['Knoxville 37923']: z.string(),
  ['Knoxville 37924']: z.string(),
  ['Knoxville 37931']: z.string(),
  ['Knoxville 37932']: z.string(),
  ['Powell 37849']: z.string(),
  ['Mascot 37806']: z.string(),
  ['People Served  Full Grant Reporting Period']: z.string(),
  ['Number of People Served No Previous Access']: z.string(),
  ['Female']: z.string(),
  ['Male']: z.string(),
  ['Other Sex']: z.string(),
  ['Unknown Sex']: z.string(),
  ['White']: z.string(),
  ['Black or African American']: z.string(),
  ['Asian American']: z.string(),
  ['American Indian or Alaska Native']: z.string(),
  ['Native Hawaiian and Pacific Islander']: z.string(),
  ['Two or More Races']: z.string(),
  ['Other Designation']: z.string(),
  ['Race Unknown']: z.string(),
  ['Hispanic or Latino']: z.string(),
  ['Not Hispanic or Latino']: z.string(),
  ['Unknown Ethnicity']: z.string(),
  ['Below Poverty Level 100 and below of poverty based on size of family unit']:
    z.string(),
  ['Low Income 101200 of poverty based on size of family unit']: z.string(),
  ['Above Low Income 201 and above based on size of family unit']: z.string(),
  ['Income Unknown']: z.string(),
  ['Under Five']: z.string(),
  ['Five  Seventeen']: z.string(),
  ['Eighteen  TwentyFour']: z.string(),
  ['TwentyFive  FortyFour']: z.string(),
  ['FortyFive  SixtyFour']: z.string(),
  ['SixtyFive  Over']: z.string(),
  ['Age Unknown']: z.string(),
});

const ReportSubmissionSchema = z.object({
  id: z.string(),
  submittedByName: z.string(),
  submittedByEmail: z.string().email(),
  periodStart: TimePeriodSchema,
  periodEnd: TimePeriodSchema,
  data: z.array(CSVReportRowSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const ProjectSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  name: z.string(),
});

export type Report = z.infer<typeof ReportSchema>;
export type ReportSubmission = z.infer<typeof ReportSubmissionSchema>;
export type CSVReportRow = z.infer<typeof CSVReportRowSchema>;
export type Organization = z.infer<typeof OrganizationSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type TimePeriod = z.infer<typeof TimePeriodSchema>;
