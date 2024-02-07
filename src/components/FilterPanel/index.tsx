'use client';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { ChangeEvent } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';

function FilterPanel() {
  const [searchObject, setSearchObject] = useState({
    checkbox: false,
    radio: 'female',
    select: 10,
    switch: false,
    text_field: 'Hello, World!',
  });

  const updateSearchObject = (key: string, val: boolean | string | number) => {
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
    <div>
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
    </div>
  );
}

export default FilterPanel;