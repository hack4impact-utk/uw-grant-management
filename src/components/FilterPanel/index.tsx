'use client';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Drawer } from '../Drawer';
import React, { useEffect, useState } from 'react';

interface AssistanceMetricOption {
  label: string;
  value: string;
}
interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  onMetricsChange: (selectedMetrics: AssistanceMetricOption[]) => void;
}

const knoxCountyCities = [
  { label: 'Knoxville', value: 'Knoxville' },
  { label: 'Farragut', value: 'Farragut' },
  { label: 'Concord', value: 'Concord' },
  { label: 'Powell', value: 'Powell' },
  { label: 'Mascot', value: 'Mascot' },
  { label: 'Halls Crossroads', value: 'Halls Crossroads' },
  { label: 'Cedar Bluff', value: 'Cedar Bluff' },
  { label: 'Strawberry Plains', value: 'Strawberry Plains' },
  { label: 'Corryton', value: 'Corryton' },
  { label: 'Carter', value: 'Carter' },
];

const FilterPanel: React.FC<FilterPanelProps> = ({
  open,
  onClose,
  onMetricsChange,
}) => {
  const [searchObject, setSearchObject] = useState({
    checkbox: false,
    radio: 'female',
    select: 10,
    switch: false,
    text_field: 'Hello, World!',
    drop_down_field: undefined,
  });

  type AssistanceMetricOption = {
    label: string;
    value: string;
  };

  // type MetricTotals = {
  //   [key: string]: number;
  // };

  // interface MetricOption {
  //   label: string;
  //   value: string;
  // }

  const camelCaseToTitleCase = (camelCase: string) => {
    if (camelCase === '') return camelCase;

    return camelCase
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str: string) => str.toUpperCase())
      .trim();
  };

  // const [filters, setFilters] = useState({
  //   organizations: [],
  //   metrics: [],
  // });

  // const [reportsData, setReportsData] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);

  const [metricsOptions, setMetricsOptions] = useState<
    AssistanceMetricOption[]
  >([]);
  const [selectedMetrics, setSelectedMetrics] = useState<
    AssistanceMetricOption[]
  >([]);

  console.log('Selected Metrics for API call:', selectedMetrics);
  const metricsQuery = selectedMetrics.map((metric) => metric.value).join(',');
  console.log(`Fetching data for metrics: ${metricsQuery}`);

  const getReportsData = async () => {
    //setIsLoading(true);
    try {
      const response = await fetch('/api/metrics/');
      if (!response.ok) {
        throw new Error('Failed to fetch metrics data');
      }
      const data = await response.json();

      const metricsArray = Object.keys(data.metricsOptions).map((key) => ({
        label: camelCaseToTitleCase(key),
        value: key,
      }));

      setMetricsOptions(metricsArray);
    } catch (error) {
      console.error('Error fetching metrics data:', error);
    } finally {
      //setIsLoading(false);
    }
  };

  useEffect(() => {
    getReportsData();
  }, []);

  useEffect(() => {
    onMetricsChange(selectedMetrics);
  }, [selectedMetrics]);

  const updateSearchObject = (key: string, val: boolean | string | number) => {
    setSearchObject({
      ...searchObject,
      [key]: val,
    });
  };

  // const handleSwitchOrCheckboxChange = (
  //   event: ChangeEvent<HTMLInputElement>
  // ) => {
  //   updateSearchObject(event.target.name, event.target.checked);
  // };

  // const handleGeneralInputChange = (
  //   event:
  //     | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  //     | SelectChangeEvent<number>
  // ) => {
  //   updateSearchObject(event.target.name, event.target.value);
  // };

  // const fetchDataWithFilters = async () => {
  //   const queryParams = new URLSearchParams();

  //   if (filters.organizations.length) {
  //     queryParams.append('organizations', filters.organizations.join(','));
  //   }

  //   if (filters.metrics.length) {
  //     queryParams.append('metrics', filters.metrics.join(','));
  //   }

  //   try {
  //     const response = await fetch(`/api/zipcodes?metrics=${encodeURIComponent(metricsQuery)}`);

  //     const data = await response.json();
  //   } catch (error) {
  //     console.error('Error fetching data with filters:', error);
  //   }
  // };

  //   useEffect(() => {
  //     if (selectedMetrics.length > 0) {
  //         fetchDataWithFilters();
  //     }
  // }, [selectedMetrics]);

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      style={{
        zIndex: 998,
      }}
    >
      <h2
        style={{
          padding: '12px',
        }}
      >
        Filters
      </h2>
      <div>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={knoxCountyCities}
          sx={{ width: 300 }}
          onChange={(any, newValue) => {
            updateSearchObject(
              'drop_down_field',
              newValue?.value ? newValue.value : ''
            );
          }}
          renderInput={(params) => (
            <TextField {...params} label="Locations in Knox County" />
          )}
        />
      </div>
      <div>
        <Autocomplete
          multiple
          value={selectedMetrics}
          onChange={(event, newValue) => {
            setSelectedMetrics(newValue);
          }}
          options={metricsOptions}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300, mt: 2 }}
          renderInput={(params) => (
            <TextField {...params} label="Filter by Metrics" />
          )}
        />
      </div>
    </Drawer>
  );
};

export default FilterPanel;
