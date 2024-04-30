import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  tableCellClasses,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Report } from '@/utils/types/models';
import { camelCaseToTitleCase } from '@/utils/formatting';

interface CategorizedMetricsTableProps {
  reports: Report[];
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const CategorizedMetricsTable = ({ reports }: CategorizedMetricsTableProps) => {
  const [category, setCategory] = useState<string>('Food');
  const [reportFieldToSumMap, setReportFieldToSumMap] =
    useState<Map<string, number>>();
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCategory(event.target.value);
  };

  const categoryFieldMapping: { [key: string]: string[] | undefined } = {
    Food: [
      'foodAssistance',
      'foodKnowledgeAndSkills',
      'accessToHealthyFoods',
      'producerSupport',
    ],
    Clothing: ['clothingAssistance'],
    Hygiene: ['hygieneAssistance'],
    'Health Care': ['healthCareAssistance'],
    'Mental Health': ['mentalHealthAssistance'],
    'Child Care': [
      'childCareBirthToPreK',
      'childCareBirthToPreKHours',
      'childCareSchoolAged',
      'childCareSchoolAgedHours',
      'subsidiesOrScholarships',
    ],
    Housing: ['rentalAssistance', 'utilityAssistance'],
    Other: ['otherAssistance'],
  };

  const categories = [
    'Food',
    'Clothing',
    'Hygiene',
    'Health Care',
    'Mental Health',
    'Child Care',
    'Housing',
    'Other',
  ];

  useEffect(() => {
    const fieldCounts = new Map<string, number>();
    const categoryFields = categoryFieldMapping[category] || [];
    for (const report of reports) {
      for (const field of categoryFields) {
        const existingCount = fieldCounts.get(field) || 0;
        fieldCounts.set(
          field,
          (report[field as keyof Report] as number) + existingCount
        );
      }
    }

    setReportFieldToSumMap(fieldCounts);
  }, [category, reports]);
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <FormControl
        fullWidth
        style={{ marginBottom: '.5rem', maxWidth: '100%' }}
      >
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          value={category}
          label="Category"
          onChange={handleCategoryChange}
        >
          {categories.map((cat, idx) => (
            <MenuItem key={idx} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper} sx={{ width: '100%' }}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Assistance Type</StyledTableCell>
              <StyledTableCell>Number of Individuals Assisted</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoryFieldMapping[category]?.map((field) => (
              <StyledTableRow key={field}>
                <StyledTableCell component="th" scope="row">
                  {camelCaseToTitleCase(field)}
                </StyledTableCell>
                <StyledTableCell>
                  {reportFieldToSumMap?.get(field)}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CategorizedMetricsTable;
