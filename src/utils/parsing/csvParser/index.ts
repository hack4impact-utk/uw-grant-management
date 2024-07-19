import fs from 'fs';
import Papa from 'papaparse';
import { CSVReportRow } from '@/utils/types/models';
import { cleanCSVReportRow } from '@/utils/importing';

export const loadReportCSV = async (
  input: string | File
): Promise<CSVReportRow[]> => {
  const csvFile =
    typeof input === 'string'
      ? fs.readFileSync(input, 'utf8')
      : await input.text();
  return new Promise((resolve, reject) => {
    Papa.parse(csvFile, {
      header: true,
      complete: (results) => {
        const result = results.data as CSVReportRow[];
        resolve(
          result
            .filter((row) => Object.values(row).some((val) => val?.trim()))
            .map(cleanCSVReportRow)
        );
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
};
