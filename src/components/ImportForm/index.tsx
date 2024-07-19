'use client';
import { useState } from 'react';
import { validateImportForm } from '@/utils/validation/importFormValidation';
import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImportInfoModal from '../ImportInfoModal';
import { useConfirm } from 'material-ui-confirm';

interface ImportFormData {
  file: File | null;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
}

export default function ImportForm() {
  const [formData, setFormData] = useState<ImportFormData>(
    {} as ImportFormData
  );
  const [validationErrors, setValidationErrors] = useState({
    file: '',
    startYear: '',
    startMonth: '',
    endYear: '',
    endMonth: '',
  });
  const [fileName, setFileName] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState<
    string[]
  >([]);
  const confirm = useConfirm();

  // Handle input change for each form field. If the field is a file, also set the file name.
  const handleInputChange = (
    field: keyof ImportFormData,
    value: File | string
  ) => {
    setFormData((prevFormData) => ({ ...prevFormData, [field]: value }));
    setValidationErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));

    // If setting the file, also set the file name.
    if (field === 'file' && value instanceof File) {
      setFileName(value.name);
    }
  };

  // Handle form submission.
  const submitForm = () => {
    setSubmissionSuccess(false);
    setSubmissionError(false);
    setSubmissionErrorMessage([]);

    const errors = validateImportForm(formData);

    // Validate form inputs by checking if there are any errors.
    if (Object.values(errors).some((error) => error !== '')) {
      setValidationErrors(errors);
      return;
    }

    // Prepare form data for submission.
    const formInputData = new FormData();
    formInputData.append('file', formData.file as File);
    formInputData.append('startYear', formData.startYear as string);
    formInputData.append('startMonth', formData.startMonth as string);
    formInputData.append('endYear', formData.endYear as string);
    formInputData.append('endMonth', formData.endMonth as string);

    // API Call to submit the form data.
    fetch('/api/report-submissions', {
      method: 'POST',
      body: formInputData,
    })
      .then((response) =>
        response.json().then((data) => {
          if (data.success) {
            setSubmissionSuccess(true);

            // setFormData({
            //   file: null,
            //   startYear: '',
            //   startMonth: '',
            //   endYear: '',
            //   endMonth: '',
            // });
            // setFileName('');

            // Set timeout just to show the success message for a few seconds.
            setTimeout(() => {
              setSubmissionSuccess(false);
            }, 5000);
          } else {
            if (response.status == 409) {
              confirm({
                title: 'Report Submission Failed',
                description: data.message,
                hideCancelButton: true,
              });
              return;
            }
            setSubmissionError(true);
            setSubmissionErrorMessage([data.message]);
          }
        })
      )
      .catch((error) => {
        setSubmissionError(true);
        setSubmissionErrorMessage([error.message]);
      });
  };

  return (
    <OuterBox>
      <Box
        component="form"
        autoComplete="off"
        flexDirection="column"
        p={2}
        sx={{ border: '2px blue' }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h3">Import Form</Typography>
        <Typography variant="subtitle1">
          Please upload a CSV file to import data to the database.
        </Typography>
        <br />
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
          style={{}}
        >
          Upload File
          <VisuallyHiddenInput
            accept=".csv"
            id="contained-button-file"
            type="file"
            onChange={(e) => {
              if (e.target.files) {
                handleInputChange('file', e.target.files[0]);
              }
            }}
            required
          />
        </Button>
        {validationErrors.file && (
          <Typography variant="subtitle1" style={{ color: 'red' }}>
            {validationErrors.file}
          </Typography>
        )}
        <br />
        {{ fileName } && (
          <Typography variant="subtitle1">{fileName}</Typography>
        )}
        <br />
        <Grid
          container
          spacing={3}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={12} container>
            <Grid item xs={12}>
              <Typography variant="h6">Reporting Period Start</Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField
                label="Month"
                placeholder="Month"
                variant="standard"
                margin="normal"
                onChange={(e) =>
                  handleInputChange('startMonth', e.target.value)
                }
                error={!!validationErrors.startMonth}
                helperText={validationErrors.startMonth}
                value={formData.startMonth || ''}
                sx={{ width: '100%' }}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Year"
                placeholder="YYYY"
                variant="standard"
                margin="normal"
                onChange={(e) => handleInputChange('startYear', e.target.value)}
                value={formData.startYear || ''}
                error={!!validationErrors.startYear}
                helperText={validationErrors.startYear}
                sx={{ width: '100%' }}
                required
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} container>
            <Grid item xs={12}>
              <Typography variant="h6">Reporting Period Start</Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField
                label="Month"
                placeholder="Month"
                variant="standard"
                margin="normal"
                onChange={(e) => handleInputChange('endMonth', e.target.value)}
                error={!!validationErrors.endMonth}
                helperText={validationErrors.endMonth}
                value={formData.endMonth || ''}
                sx={{ width: '100%' }}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Year"
                placeholder="YYYY"
                variant="standard"
                margin="normal"
                onChange={(e) => handleInputChange('endYear', e.target.value)}
                error={!!validationErrors.endYear}
                helperText={validationErrors.endYear}
                value={formData.endYear || ''}
                sx={{ width: '100%' }}
                required
              />
            </Grid>
          </Grid>
        </Grid>
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
        <br />
        <ImportInfoModal />
        <br />
        {submissionSuccess && (
          <Typography variant="subtitle1" style={{ color: 'green' }}>
            Upload Successful
          </Typography>
        )}
        {submissionError && (
          <Box textAlign={'left'}>
            {submissionErrorMessage.map((error, index) => (
              <Typography
                key={index}
                variant="subtitle2"
                style={{ color: 'red' }}
              >
                {error}
              </Typography>
            ))}
          </Box>
        )}
      </Box>
    </OuterBox>
  );
}

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

const OuterBox = styled(Box)({
  backgroundColor: '#f0f0f0',
  padding: '15px',
  margin: 'auto',
  maxWidth: '700px',
  marginTop: '20px',
});
