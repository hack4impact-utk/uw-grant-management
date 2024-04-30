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
  organizationId: z.string(), // Assuming ObjectId is represented as string in Zod
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
export type Organization = z.infer<typeof OrganizationSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type TimePeriod = z.infer<typeof TimePeriodSchema>;
