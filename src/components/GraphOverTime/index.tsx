'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ReportDocument as ReportType } from '@/server/models/Report';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

// Register the required chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function GraphOverTime() {
  const [reports, setReports] = useState<ReportType[]>([]);
  const [metrics, setMetrics] = useState<string[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('clientsServed');

  // Fetch reports from the API
  const fetchReports = async () => {
    try {
      const response = await fetch(`/api/reports`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  // Fetch metrics from the API
  const fetchMetrics = async () => {
    try {
      const response = await fetch(`/api/metrics`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMetrics(data.metrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  // Handle metric selection change
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedMetric(event.target.value as string);
  };

  // Fetch reports and metrics on component mount
  useEffect(() => {
    fetchReports();
    fetchMetrics();
  }, []);

  // Calculate the metric map based on the selected metric
  const metricMap = new Map();
  reports.forEach((item) => {
    const startMonth = item.periodStart.month;
    const startYear = item.periodStart.year;
    const endMonth = item.periodEnd.month;
    const endYear = item.periodEnd.year;
    const key = `${startMonth} ${startYear}-${endMonth} ${endYear}`;
    const metric = item[selectedMetric as keyof ReportType];
    if (metricMap.has(key)) {
      metricMap.set(key, metricMap.get(key) + metric);
    } else {
      metricMap.set(key, metric);
    }
  });

  return (
    <>
      {/* Metric selection dropdown */}
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel>Metric</InputLabel>
          <Select value={selectedMetric} label="Metric" onChange={handleChange}>
            {metrics.map((metric) => (
              <MenuItem key={metric} value={metric}>
                {metric}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Line chart */}
      <Line
        data={{
          labels: Array.from(metricMap.keys()),
          datasets: [
            {
              label: selectedMetric,
              data: Array.from(metricMap.values()),
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top' as const,
            },
            // title: {
            //   display: true,
            //   text: 'Metric',
            // },
          },
        }}
      />
    </>
  );
}

export default GraphOverTime;
