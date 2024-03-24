'use client';
import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// inputs
// 1.) Import csv file
// 2.) reporting period start year
// 3.) reporting period start month
// 4.) reporting period end year
// 5.) reporting period end month

// TODO
// For importing I need to do a few things
// 1.) Need to construct the correct file name based on the inputs and save to src/data/reports (probably going to have to make an API endpoint for this)
// 2.) Once that is done, can pass it to the import function in utils
// 3.) Enforce inputs are correct and required (check year format, check month format, check if file is uploaded, etc.)

// all months in lowercase
const months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function ImportForm() {
  const [file, setFile] = useState(null);

  const [startYear, setStartYear] = useState(null);
  const [startYearError, setStartYearError] = useState(false);

  const [startMonth, setStartMonth] = useState(null);
  const [startMonthError, setStartMonthError] = useState(false);

  const [endYear, setEndYear] = useState(null);
  const [endYearError, setEndYearError] = useState(false);

  const [endMonth, setEndMonth] = useState(null);
  const [endMonthError, setEndMonthError] = useState(false);

  // Right now, just grabbing the file and saving it to state
  const handleFileChange = (e) => {
    setFile(e.target.value);
    console.log('Name: ', e.target.value);

    // Just get the csv name
    const fileName = e.target.value.split('\\').pop();
    setFile(fileName);

    // All file reading stuff, may be handled somewhere else
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event?.target?.result;
      console.log('Contents: ', fileContent);
    };
    reader.readAsText(file);
  };

  // Handle start year validation
  const handleStartYearChange = (e) => {
    const year = e.target.value;

    if (year.length !== 4) {
      setStartYearError(true);
    } else {
      setStartYearError(false);
      setStartYear(e.target.value);
      console.log('Start Year: ', startYear);
    }
    return;
  };
  // Handle start month validation
  const handleStartMonthChange = (e) => {
    const input_month = e.target.value.toLowerCase();

    if (months.includes(input_month)) {
      setStartMonthError(false);
      setStartMonth(input_month);
      console.log('Start Month: ', startMonth);
    } else {
      setStartMonthError(true);
    }
    return;
  };

  // Handle end year validation
  const handleEndYearChange = (e) => {
    const year = e.target.value;

    if (year.length !== 4) {
      setEndYearError(true);
    } else {
      setEndYearError(false);
      setEndYear(e.target.value);
      console.log('End Year: ', endYear);
    }
    return;
  };

  // Handle end month validation
  const handleEndMonthChange = (e) => {
    const input_month = e.target.value.toLowerCase();

    if (months.includes(input_month)) {
      setEndMonthError(false);
      setEndMonth(input_month);
      console.log('End Month: ', endMonth);
    } else {
      setEndMonthError(true);
    }
    return;
  };

  const submitForm = () => {
    console.log('Submitting form');
    const newFileName = `${startYear}_${startMonth}_${endYear}_${endMonth}.csv`;
    console.log('New File Name: ', newFileName);

    // Save the file to src/data/reports
    // Call import function on the new file
    // If successful, display success message
    // If not, display error message
    // Clear the form
  };

  return (
    <Box
      component="form"
      autoComplete="off"
      alignItems="center"
      gap={4}
      p={2}
      sx={{ border: '2px blue' }}
    >
      <h1>Import Form</h1>
      <br />
      <div>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
        >
          Upload File
          <VisuallyHiddenInput
            accept=".csv"
            id="contained-button-file"
            type="file"
            onChange={handleFileChange}
            required
          />
        </Button>
        {file && <p>File: {file}</p>}
      </div>
      <br />

      <TextField
        label="Reporting Period Start Year"
        placeholder="YYYY"
        variant="outlined"
        margin="normal"
        error={startYearError}
        helperText={
          startYearError ? 'Invalid year format. Please use YYYY format.' : ''
        }
        onBlur={handleStartYearChange}
        onChange={handleStartYearChange}
        fullWidth
        required
      />
      <br />
      <TextField
        label="Reporting Period Start Month"
        placeholder="Month"
        variant="outlined"
        margin="normal"
        error={startMonthError}
        helperText={
          startMonthError
            ? 'Invalid month format. Please enter full month name.'
            : ''
        }
        onBlur={handleStartMonthChange}
        onChange={handleStartMonthChange}
        fullWidth
        required
      />
      <br />
      <TextField
        label="Reporting Period End Year"
        placeholder="YYYY"
        variant="outlined"
        margin="normal"
        error={endYearError}
        helperText={
          endYearError ? 'Invalid year format. Please use YYYY format.' : ''
        }
        onBlur={handleEndYearChange}
        onChange={handleEndYearChange}
        fullWidth
        required
      />
      <br />
      <TextField
        label="Reporting Period End Month"
        variant="outlined"
        margin="normal"
        error={endMonthError}
        helperText={
          endMonthError
            ? 'Invalid month format. Please enter full month name.'
            : ''
        }
        onBlur={handleEndMonthChange}
        onChange={handleEndMonthChange}
        fullWidth
        required
      />
      <br />
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          submitForm();
        }}
      >
        Submit
      </Button>
    </Box>
  );
}
