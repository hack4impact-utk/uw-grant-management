import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { ChartData } from 'chart.js';
import { Report } from '@/utils/types/models';
import { camelCaseToTitleCase } from '@/utils/formatting';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface DemographicBarChartProps {
  reports: Report[];
}

type DemographicOptionValue =
  | 'clientsServedBySex'
  | 'clientsServedByRace'
  | 'clientsServedByEthnicity'
  | 'clientsServedByHouseholdIncome'
  | 'clientsServedByAge';

interface DemographicOption {
  label: string;
  value: DemographicOptionValue;
}

const DemographicBarChart = ({ reports }: DemographicBarChartProps) => {
  const demographicOptions: DemographicOption[] = [
    {
      label: 'Sex',
      value: 'clientsServedBySex' as const,
    },
    {
      label: 'Race',
      value: 'clientsServedByRace' as const,
    },
    {
      label: 'Ethnicity',
      value: 'clientsServedByEthnicity',
    },
    {
      label: 'Household Income',
      value: 'clientsServedByHouseholdIncome',
    },
    {
      label: 'Age',
      value: 'clientsServedByAge',
    },
  ];

  const [dataMap, setDataMap] = useState<Map<string, number>>();
  const [selectedDemographicOption, setSelectedDemographicOption] =
    useState<DemographicOption>(demographicOptions[0]);

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    setSelectedDemographicOption({
      value: event.target.value as DemographicOptionValue,
      label: `clientsServedBy${value.replace(' ', '')}`,
    });
  };

  useEffect(() => {
    const newDataMap = new Map<string, number>();
    reports.forEach((report) => {
      Object.entries(report[selectedDemographicOption.value]).forEach(
        ([key, value]) => {
          if (!value) return;
          const currentCount = newDataMap.get(key) || 0;
          newDataMap.set(key, currentCount + value);
        }
      );
    });
    setDataMap(newDataMap);
  }, [reports, selectedDemographicOption]);

  const chartData: ChartData<'pie', number[], string> = {
    labels: Array.from(dataMap?.keys() || []).map(camelCaseToTitleCase),
    datasets: [
      {
        data: Array.from(dataMap?.values() || []),
        backgroundColor: [
          '#0074D9',
          '#FF4136',
          '#2ECC40',
          '#FF851B',
          '#7FDBFF',
          '#B10DC9',
          '#FFDC00',
          '#001f3f',
          '#39CCCC',
          '#01FF70',
          '#85144b',
          '#F012BE',
          '#3D9970',
          '#111111',
          '#AAAAAA',
        ],
      },
    ],
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <FormControl fullWidth sx={{ margin: '1rem 0', maxWidth: '100%' }}>
        <InputLabel id="demographic-select-label">Demographic</InputLabel>
        <Select
          labelId="demographic-select-label"
          value={selectedDemographicOption.value}
          label="Demographic"
          onChange={handleChange}
        >
          {demographicOptions.map((demographicOption) => (
            <MenuItem
              key={demographicOption.value}
              value={demographicOption.value}
            >
              {demographicOption.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Pie data={chartData} />
    </Box>
  );
};

export default DemographicBarChart;
