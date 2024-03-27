// validationUtils.js

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

export const validateImportForm = (formData: {
  file: File | null;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
}) => {
  const errors = {
    file: '',
    startYear: '',
    startMonth: '',
    endYear: '',
    endMonth: '',
  };

  // Validate file
  if (!formData.file) {
    errors.file = 'Please upload a file.';
  }

  // Validate startYear
  if (!formData.startYear || formData.startYear.length !== 4) {
    errors.startYear = 'Invalid year format. Please use YYYY format.';
  }

  // Validate startMonth
  if (
    !formData.startMonth ||
    !months.includes(formData.startMonth.toLowerCase())
  ) {
    errors.startMonth = 'Please enter the full month name.';
  }

  // Validate endYear
  if (!formData.endYear || formData.endYear.length !== 4) {
    errors.endYear = 'Invalid year format. Please use YYYY format.';
  }

  // Validate endMonth
  if (!formData.endMonth || !months.includes(formData.endMonth.toLowerCase())) {
    errors.endMonth = 'Please enter the full month name.';
  }

  return errors;
};
