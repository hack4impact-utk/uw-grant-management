import { z } from 'zod';

// Assuming months and zipCodes are arrays of string literals
const monthsEnum = z.enum([
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]);

// Assuming months and zipCodes are arrays of string literals
const zipCodesEnum = z.enum([
  '37721',
  '37934',
  '37754',
  '37938',
  '37902',
  '37909',
  '37912',
  '37914',
  '37915',
  '37916',
  '37917',
  '37918',
  '37919',
  '37920',
  '37921',
  '37922',
  '37923',
  '37924',
  '37931',
  '37932',
  '37806',
  '37849',
]);

const TimePeriodSchema = z.object({
  month: monthsEnum,
  year: z.string(),
});

const ZipCodeClientsServedSchema = z.object({
  zipCode: zipCodesEnum,
  clientsServed: z.number(),
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
  other: z.number(),
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

const SixMonthReportSchema = z.object({
  periodStart: TimePeriodSchema,
  periodEnd: TimePeriodSchema,
  nonProfit: z.string(), // Assuming ObjectId is represented as string in Zod
  clientsServed: z.number(),
  jobsCreated: z.number(),
  partners: z.number(),
  foodAssistance: z.number(),
  foodKnowledgeAndSkills: z.number(),
  accessToHealthFoods: z.number(),
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
  ClientsServedBySex: ClientsSexSchema,
  ClientsServedByRace: ClientsRaceSchema,
  ClientsServedByEthnicity: ClientEthnicitySchema,
  ClientsServedByHouseholdIncome: ClientHouseholdIncomeSchema,
  ClientsServedByAge: ClientAgeSchema,
});

export type SixMonthReport = z.infer<typeof SixMonthReportSchema>;

export default SixMonthReportSchema;
