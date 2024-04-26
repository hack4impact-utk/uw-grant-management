import React, { useEffect, useState, useCallback } from 'react';
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
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

interface ReportData {
  [key: string]: number;
}

interface ReportComponentProps {
  organizationId?: string[];
  projectId?: string[];
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

const CategoryFilter: React.FC<ReportComponentProps> = ({
  organizationId,
  projectId,
}) => {
  const [category, setCategory] = useState<string>('');
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCategory(event.target.value);
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

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      let url = `/api/reports?category=${category}`;
      if (organizationId && organizationId.length > 0) {
        organizationId.forEach((id) => (url += `&organizationId=${id}`));
      }
      if (projectId && projectId.length > 0) {
        projectId.forEach((id) => (url += `&projectId=${id}`));
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const fetchedReports = await response.json();

      const aggregatedData = fetchedReports.reduce(
        (acc: ReportData, report: ReportData) => {
          Object.keys(report).forEach((key) => {
            if (!key.includes('_id') && !key.includes('id')) {
              acc[key] = (acc[key] || 0) + report[key];
            }
          });
          return acc;
        },
        {}
      );

      setReports([aggregatedData]);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category, organizationId, projectId]);

  useEffect(() => {
    if (organizationId && projectId && category) {
      fetchReports();
    }
  }, [organizationId, projectId, category, fetchReports]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          value={category}
          label="Category"
          onChange={handleCategoryChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {categories.map((cat, idx) => (
            <MenuItem key={idx} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer
        component={Paper}
        sx={{ width: 'auto', overflowX: 'visible' }}
      >
        <Table sx={{ minWidth: '650px' }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Assistance Type</StyledTableCell>
              <StyledTableCell align="right">
                Number of Individuals Assisted
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report, idx) =>
              Object.entries(report)
                .filter(([key]) => !key.includes('_id') && !key.includes('id'))
                .map(([key, value]) => (
                  <StyledTableRow key={`${key}-${idx}`}>
                    <StyledTableCell component="th" scope="row">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </StyledTableCell>
                    <StyledTableCell align="right">{value}</StyledTableCell>
                  </StyledTableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CategoryFilter;
