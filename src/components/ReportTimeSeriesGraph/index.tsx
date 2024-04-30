'use client';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Report } from '@/utils/types/models';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { camelCaseToTitleCase } from '@/utils/formatting';
import { primaryMetrics } from '@/utils/constants';

type ReportSeriesGraphProps = {
  reports: Report[];
};

function ReportTimeSeriesGraph({ reports }: ReportSeriesGraphProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>('clientsServed');

  // Handle metric selection change
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedMetric(event.target.value as string);
  };

  const monthShortVersionsMap = new Map<string, string>([
    ['January', 'Jan.'],
    ['February', 'Feb.'],
    ['March', 'March'],
    ['April', 'April'],
    ['May', 'May'],
    ['June', 'June'],
    ['July', 'July'],
    ['August', 'Aug.'],
    ['September', 'Sept.'],
    ['October', 'Oct.'],
    ['November', 'Nov.'],
    ['December', 'Dec.'],
  ]);

  // Calculate the metric map based on the selected metric
  const metricMap = new Map();
  reports.forEach((item) => {
    const startMonth = item.periodStart.month;
    const startYear = item.periodStart.year;
    const endMonth = item.periodEnd.month;
    const endYear = item.periodEnd.year;
    const key = `${startMonth} ${startYear}-${endMonth} ${endYear}`;
    const metric = item[selectedMetric as keyof Report];
    if (metricMap.has(key)) {
      metricMap.set(key, metricMap.get(key) + metric);
    } else {
      metricMap.set(key, metric);
    }
  });

  // Sort the metricMap based on start year and start month
  const sortedMetricMap = new Map(
    Array.from(metricMap.entries())
      .sort(([keyA], [keyB]) => {
        const firstKeyArr = keyA.split('-');
        const secondKeyArr = keyB.split('-');

        const [startMonthA, startYearA] = firstKeyArr[0].split(' ');
        const [startMonthB, startYearB] = secondKeyArr[0].split(' ');

        const monthOrder = [
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
        ];

        const monthIndexA = monthOrder.indexOf(startMonthA);
        const monthIndexB = monthOrder.indexOf(startMonthB);

        if (startYearA !== startYearB) {
          return parseInt(startYearA) - parseInt(startYearB);
        } else {
          return monthIndexA - monthIndexB;
        }
      })
      .map(([dateRangeStr, clientsServed]: [string, string]) => {
        const dateRange = dateRangeStr.split('-');
        const [startMonth, startYear] = dateRange[0].split(' ');
        const [endMonth, endYear] = dateRange[1].split(' ');
        const formattedDateRange = `${monthShortVersionsMap.get(startMonth)} ${startYear}
- ${monthShortVersionsMap.get(endMonth)} ${endYear}`;
        return [formattedDateRange, clientsServed];
      })
  );

  return (
    <>
      {/* Metric selection dropdown */}
      <Box sx={{ width: '100%', height: '100%' }}>
        <FormControl fullWidth>
          <InputLabel>Metric</InputLabel>
          <Select value={selectedMetric} label="Metric" onChange={handleChange}>
            {primaryMetrics.map((metric) => (
              <MenuItem key={metric} value={metric}>
                {camelCaseToTitleCase(metric)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Line chart */}
      <Line
        data={{
          labels: Array.from(sortedMetricMap.keys()),
          datasets: [
            {
              label: camelCaseToTitleCase(selectedMetric),
              data: Array.from(sortedMetricMap.values()),
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        }}
        title={`${camelCaseToTitleCase(selectedMetric)} by date`}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top' as const,
            },
          },
        }}
      />
    </>
  );
}

export default ReportTimeSeriesGraph;
