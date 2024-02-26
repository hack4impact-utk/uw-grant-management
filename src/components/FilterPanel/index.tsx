'use client';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Drawer } from '../Drawer';
import { ChangeEvent } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import React, { useEffect, useState } from 'react';

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
}
interface Option {
  _id: {
      $oid: string;
  };
  name: string;
  createdAt: {
      $date: string;
  };
  updatedAt: {
      $date: string;
  };
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

const FilterPanel: React.FC<FilterPanelProps> = ({ open, onClose }) => {
  const [searchObject, setSearchObject] = useState({
    checkbox: false,
    radio: 'female',
    select: 10,
    switch: false,
    text_field: 'Hello, World!',
    drop_down_field: undefined,
    organizations_filters: [],
  });

  const [organizationSections, setOrganizationSections] = useState([]);

  type AssistanceMetricOption = {
    label: string;
    value: string;
  };

  const [assistanceMetrics, setAssistanceMetrics] = useState<
    AssistanceMetricOption[]
  >([]);

  const getAssistanceData = async () => {
    try {
      const response = await fetch('/api/assistance/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const metricsData = data.numericFieldsSummary ?? {};

      const newAssistanceMetrics = Object.keys(metricsData).map((key) => ({
        label: key
          .split(/(?=[A-Z])/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        value: key,
      }));

      setAssistanceMetrics(newAssistanceMetrics);
    } catch (error) {
      console.error('Failed to fetch assistance data:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/organizations');
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setOrganizationSections(data);
      } catch (error) {
        console.error('Error fetching organization info:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    getAssistanceData();
  }, []);

  const updateSearchObject = (key: string, val: boolean | string | number | Array<object>) => {
    setSearchObject({
      ...searchObject,
      [key]: val,
    });
  };

  const handleSwitchOrCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    updateSearchObject(event.target.name, event.target.checked);
  };

  const handleGeneralInputChange = (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<number>
  ) => {
    updateSearchObject(event.target.name, event.target.value);
  };

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
        <Checkbox
          checked={searchObject.checkbox}
          name={'checkbox'}
          onChange={handleSwitchOrCheckboxChange}
        />
      </div>
      <div>
        <RadioGroup
          value={searchObject.radio}
          name="radio"
          onChange={handleGeneralInputChange}
        >
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
      </div>
      <div>
        <Select
          value={searchObject.select}
          label="Select"
          onChange={handleGeneralInputChange}
          name="select"
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </div>
      <div>
        <Switch
          name="switch"
          checked={searchObject.switch}
          onChange={handleSwitchOrCheckboxChange}
        />
      </div>
      <div>
        <TextField
          name="text_field"
          value={searchObject.text_field}
          onChange={handleGeneralInputChange}
        />
      </div>
      <br />
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
          disablePortal
          options={assistanceMetrics}
          sx={{ width: 300, mt: 2 }}
          onChange={(event, newValue) => {
            updateSearchObject(
              'metrics_field',
              newValue?.value ? newValue.value : ''
            );
          }}
          renderInput={(params) => (
            <TextField {...params} label="Filter by Metrics" />
          )}
        />
      </div>
      <div>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={organizationSections}
        sx={{ width: 300, mt: 2 }}
        onChange={(event, newValue) => {
          updateSearchObject(
            'organizations_filters',
            newValue? newValue : []
          );
        }}
        getOptionLabel={(option: Option) => option?.name}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label="Filter By Organizations"
            placeholder="Type Organization Name"
          />
        )}
      />
      </div>
    </Drawer>
  );
};

export default FilterPanel;
