import { Report } from '@/utils/types/models';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Bar } from 'react-chartjs-2';
import theme from '@/utils/constants/themes';

interface ZipCodeBarChartProps {
  reports: Report[];
}
const ZipCodeBarChart = ({ reports }: ZipCodeBarChartProps) => {
  const [zipCodeToCountMap, setZipCodeToCountMap] = useState<
    Map<string, number>
  >(new Map<string, number>());
  const generateZipCodeToCountMap = () => {
    const newMap = new Map<string, number>();
    for (const report of reports) {
      for (const zipCodeInfo of report.zipCodeClientsServed) {
        if (zipCodeInfo.clientsServed <= 0) {
          continue;
        }
        const zipCodeKey = `${zipCodeInfo.zipCode} (${zipCodeInfo.location})`;
        const existingCount = newMap.get(zipCodeKey) || 0;
        newMap.set(zipCodeKey, existingCount + zipCodeInfo.clientsServed);
      }
    }
    setZipCodeToCountMap(newMap);
  };

  useEffect(() => {
    generateZipCodeToCountMap();
  }, [reports]);

  const data = {
    labels: Array.from(zipCodeToCountMap.keys()),
    datasets: [
      {
        label: 'Clients Served',
        data: Array.from(zipCodeToCountMap.values()),
        backgroundColor: theme.primaryBlueRGBA(50),
      },
    ],
  };
  const options = {
    responsive: true,
  };

  return (
    <Box
      sx={{
        height: '100%',
      }}
    >
      <Bar data={data} options={options} />
    </Box>
  );
};

export default ZipCodeBarChart;
