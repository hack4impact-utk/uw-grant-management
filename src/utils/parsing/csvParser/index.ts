import fs from 'fs';
import Papa from 'papaparse';

export interface CSVReportRow {
  ['Organization Name']: string;
  ['Project Name']: string;
  ['Amount Awarded']: string;
  ['Clients Served']: string;
  ['Jobs Created']: string;
  ['Partners']: string;
  ['Food Assistance']: string;
  ['Food Knowledge and Skills']: string;
  ['Access to Healthy Foods']: string;
  ['Producer Support']: string;
  ['Clothing Assistance']: string;
  ['Hygiene Assistance']: string;
  ['Health Care Assistance']: string;
  ['Mental Health Assistance']: string;
  ['Child Care BirthPreK']: string;
  ['Child Care BirthPreK Hours']: string;
  ['Child Care School Age']: string;
  ['Child Care SchoolAged Hours']: string;
  ['Subsidies or Scholarships']: string;
  ['Rental Assistance']: string;
  ['Utility Assistance']: string;
  ['Other Assistance']: string;
  ['Attraction and Retention']: string;
  ['Corryton 37721']: string;
  ['Farragut 37934']: string;
  ['Heiskell 37754']: string;
  ['Knoxville 37938']: string;
  ['Knoxville 37902']: string;
  ['Knoxville 37909']: string;
  ['Knoxville 37912']: string;
  ['Knoxville 37914']: string;
  ['Knoxville 37915']: string;
  ['Knoxville 37916']: string;
  ['Knoxville 37917']: string;
  ['Knoxville 37918']: string;
  ['Knoxville 37919']: string;
  ['Knoxville 37920']: string;
  ['Knoxville 37921']: string;
  ['Knoxville 37922']: string;
  ['Knoxville 37923']: string;
  ['Knoxville 37924']: string;
  ['Knoxville 37931']: string;
  ['Knoxville 37932']: string;
  ['Powell 37849']: string;
  ['Mascot 37806']: string;
  ['People Served  Full Grant Reporting Period']: string;
  ['Number of People Served No Previous Access']: string;
  ['Female']: string;
  ['Male']: string;
  ['Other Sex']: string;
  ['Unknown Sex']: string;
  ['White']: string;
  ['Black or African American']: string;
  ['Asian American']: string;
  ['American Indian or Alaska Native']: string;
  ['Native Hawaiian and Pacific Islander']: string;
  ['Two or More Races']: string;
  ['Other Designation']: string;
  ['Race Unknown']: string;
  ['Hispanic or Latino']: string;
  ['Not Hispanic or Latino']: string;
  ['Unknown Ethnicity']: string;
  ['Below Poverty Level 100 and below of poverty based on size of family unit']: string;
  ['Low Income 101200 of poverty based on size of family unit']: string;
  ['Above Low Income 201 and above based on size of family unit']: string;
  ['Income Unknown']: string;
  ['Under Five']: string;
  ['Five  Seventeen']: string;
  ['Eighteen  TwentyFour']: string;
  ['TwentyFive  FortyFour']: string;
  ['FortyFive  SixtyFour']: string;
  ['SixtyFive  Over']: string;
  ['Age Unknown']: string;
}

export const loadReportCSV = async (
  filePath: string
): Promise<CSVReportRow[]> => {
  const csvFile = fs.readFileSync(filePath, 'utf8');
  return new Promise((resolve, reject) => {
    Papa.parse(csvFile, {
      header: true,
      complete: (results) => {
        resolve(results.data as CSVReportRow[]);
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
};
