'use client';
import React, { useEffect, useState, ReactNode, useRef } from 'react';
import { FilterPanelAutocomplete } from '@/components/FilterPanel/FilterPanelAutocomplete';
import CategorizedMetricsTable from '@/components/CategoryTable';
import ReportTimeSeriesGraph from '@/components/ReportTimeSeriesGraph';
import { Report } from '@/utils/types/models';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { SxProps } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import theme from '@/utils/constants/themes';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Zoom from '@mui/material/Zoom';
import { numberWithCommas } from '@/utils/formatting';
import DemographicPieChart from '@/components/DemographicPieChart';
import ZipCodeBarChart from '@/components/ZipCodeBarChart';
import { useSearchParams } from 'next/navigation';

// Register the required chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);
interface OrganizationRow {
  id: string;
  name: string;
}

interface ProjectRow {
  id: string;
  name: string;
  organizationId: string;
}

interface SelectedFilters {
  organizations: string[];
  projects: string[];
}

interface AnalyticsPagePaperProps {
  sx?: SxProps;
  children: ReactNode;
  title: string;
  isLoading: boolean;
}

type SummedReportValue = 'clientsServed' | 'amountAwarded' | 'jobsCreated';

interface IncreasingNumericValueProps {
  value: number;
  unit?: string;
  isLoading: boolean;
}
const IncreasingNumericValue = ({
  value,
  unit,
  isLoading,
}: IncreasingNumericValueProps) => {
  const valueElRef = useRef<HTMLSpanElement>(null);
  const valueRef = useRef<number>(0);
  useEffect(() => {
    valueRef.current = 0;
    const interval = setInterval(() => {
      if (!valueElRef.current) {
        return;
      }
      valueRef.current += value / 500;
      valueElRef.current.textContent = numberWithCommas(
        Math.round(valueRef.current)
      );
      if (valueRef.current >= value) {
        clearInterval(interval);
        valueElRef.current.textContent = numberWithCommas(value);
      }
    }, 1);
  }, [value]);
  if (isLoading) {
    return (
      <Skeleton variant="text" animation="wave" sx={{ fontSize: '3rem' }} />
    );
  }
  return (
    <Zoom in={!isLoading} style={{ transitionDuration: '750ms' }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          fontFamily: 'monospace',
          width: '100%',
          marginLeft: '2rem',
        }}
      >
        <span>{unit}</span>
        <span ref={valueElRef} />
      </Typography>
    </Zoom>
  );
  return;
};

const AnalyticsPagePaper = ({
  sx,
  children,
  title,
  isLoading,
}: AnalyticsPagePaperProps) => {
  return (
    <Paper
      sx={{
        backgroundColor: theme.primaryBlueRGBA(10),
        width: '100%',
        height: '100%',
        padding: '1rem',
        boxSizing: 'border-box',
      }}
      square={false}
      elevation={0}
    >
      {isLoading ? (
        <Skeleton variant="text" sx={{ fontSize: '2rem' }} animation="wave" />
      ) : (
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            position: 'relative',
            top: '8px',
            left: '8px',
          }}
        >
          {title}
        </Typography>
      )}
      <Box
        sx={{
          ...(sx || {}),
          boxSizing: 'border-box',
          marginTop: '1.5rem',
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};

const AnalyticsPage = () => {
  const [organizations, setOrganizations] = useState<OrganizationRow[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [projectOptions, setProjectOptions] = useState<ProjectRow[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const organizationId = searchParams.get('organizationId');
  const projectId = searchParams.get('projectId');

  // State to keep track of selected filters
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    organizations: organizationId ? [organizationId] : [],
    projects: projectId ? [projectId] : [],
  });

  const getOrganizations = async () => {
    const response = await fetch('/api/organizations');
    if (!response.ok) {
      throw new Error('Failed to fetch organizations');
    }
    const data = await response.json();
    setOrganizations(data);
  };

  const getProjects = async () => {
    const response = await fetch('/api/projects');
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    const data = await response.json();
    setProjects(data);
  };

  useEffect(() => {
    getOrganizations();
    getProjects();
  }, []);

  // Update project options based on selected organizations
  useEffect(() => {
    if (selectedFilters.organizations.length > 0) {
      setProjectOptions(
        projects.filter((project) =>
          selectedFilters.organizations.includes(project.organizationId)
        )
      );
    } else {
      setProjectOptions(projects);
    }
  }, [selectedFilters.organizations, projects]);

  // Handles changes to filter options and clears unrelated projects when Organization is changed
  const handleAutocompleteChange = (name: string, value: any[]) => {
    if (name === 'organizations') {
      const isAllSelected = value.some((item) => item.value === 'all');
      if (isAllSelected && value.length === 1) {
        setSelectedFilters({
          organizations: [],
          projects: [],
        });
      } else {
        const selectedOrgIds = value
          .filter((item) => item.value !== 'all')
          .map((item) => item.value);
        const newProjects = selectedFilters.projects.filter((projectId) => {
          const project = projects.filter((p) => p.id == projectId)[0];
          return selectedOrgIds.includes(project.organizationId);
        });
        setSelectedFilters((prev) => ({
          ...prev,
          projects: newProjects,
          organizations: selectedOrgIds,
        }));
      }
    } else if (name === 'projects') {
      const isAllSelected = value.some((item) => item.value === 'all');
      if (isAllSelected && value.length === 1) {
        setSelectedFilters((prev) => ({
          ...prev,
          projects: [],
        }));
      } else {
        const selectedProjectIds = value
          .filter((item) => item.value !== 'all')
          .map((item) => item.value);
        setSelectedFilters((prev) => ({
          ...prev,
          projects: selectedProjectIds,
        }));
      }
    }
  };

  const sumReportValue = (value: SummedReportValue) => {
    return reports.reduce((prev, curr) => {
      return prev + curr[value];
    }, 0);
  };

  const getFilteredReports = async () => {
    const response = await fetch(`
/api/reports?organizationId=
${selectedFilters.organizations.join(',')}&projectId=
${selectedFilters.projects.join(',')}`);
    const data = await response.json();
    setReports(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getFilteredReports();
  }, [selectedFilters]);

  return (
    <Grid
      container
      spacing={2}
      gap={2}
      sx={{
        padding: '2rem',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AnalyticsPagePaper
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
            }}
            title="Filters"
            isLoading={isLoading}
          >
            {isLoading ? (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                }}
              >
                <Skeleton
                  variant="rounded"
                  height={50}
                  width={300}
                  animation="wave"
                  sx={{
                    margin: '.5rem',
                  }}
                />
                <Skeleton
                  variant="rounded"
                  height={50}
                  width={300}
                  animation="wave"
                  sx={{
                    margin: '.5rem',
                  }}
                />
              </Box>
            ) : (
              <>
                <FilterPanelAutocomplete
                  name="organizations"
                  label="Select Organizations"
                  value={
                    selectedFilters.organizations.length == 0
                      ? [{ label: 'All', value: 'all' }]
                      : selectedFilters.organizations.map((id) => ({
                          label:
                            organizations.find((org) => org.id === id)?.name ||
                            '',
                          value: id,
                        }))
                  }
                  handleAutocompleteChange={(event, value) =>
                    handleAutocompleteChange('organizations', value)
                  }
                  options={[
                    { label: 'All', value: 'all' },
                    ...organizations.map((org) => ({
                      label: org.name,
                      value: org.id,
                    })),
                  ]}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                />
                <FilterPanelAutocomplete
                  name="projects"
                  label="Select Projects"
                  value={
                    selectedFilters.projects.length == 0
                      ? [{ label: 'All', value: 'all' }]
                      : selectedFilters.projects.map((id) => ({
                          label:
                            projectOptions.find((proj) => proj.id === id)
                              ?.name || '',
                          value: id,
                        }))
                  }
                  handleAutocompleteChange={(event, value) =>
                    handleAutocompleteChange('projects', value)
                  }
                  options={[
                    { label: 'All', value: 'all' },
                    ...projectOptions.map((proj) => ({
                      label: proj.name,
                      value: proj.id,
                    })),
                  ]}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                />
              </>
            )}
          </AnalyticsPagePaper>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4} xl={4}>
          <AnalyticsPagePaper title="Clients Served" isLoading={isLoading}>
            <IncreasingNumericValue
              value={sumReportValue('clientsServed')}
              isLoading={isLoading}
            />
          </AnalyticsPagePaper>
        </Grid>
        <Grid item xs={12} md={6} lg={4} xl={4}>
          <AnalyticsPagePaper title="Jobs Created" isLoading={isLoading}>
            <IncreasingNumericValue
              value={sumReportValue('jobsCreated')}
              isLoading={isLoading}
            />
          </AnalyticsPagePaper>
        </Grid>
        <Grid item xs={12} md={12} lg={4} xl={4}>
          <AnalyticsPagePaper title="Grant Money Awarded" isLoading={isLoading}>
            <IncreasingNumericValue
              value={sumReportValue('amountAwarded')}
              unit="$"
              isLoading={isLoading}
            />
          </AnalyticsPagePaper>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={8} xl={8}>
          <AnalyticsPagePaper
            title="Assistance over Time"
            isLoading={isLoading}
          >
            {isLoading ? (
              <>
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  height={50}
                  sx={{ marginBottom: '1rem' }}
                />
                <Skeleton variant="rounded" animation="wave" height={300} />
              </>
            ) : (
              <ReportTimeSeriesGraph reports={reports} />
            )}
          </AnalyticsPagePaper>
        </Grid>
        <Grid item xs={12} md={6} lg={4} xl={4}>
          <AnalyticsPagePaper title="Demographics" isLoading={isLoading}>
            {isLoading ? (
              <>
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  height={50}
                  sx={{ marginBottom: '1rem' }}
                />
                <Skeleton variant="rounded" animation="wave" height={300} />
              </>
            ) : (
              <DemographicPieChart reports={reports} />
            )}
          </AnalyticsPagePaper>
        </Grid>
        <Grid item xs={12} md={6} lg={4} xl={4}>
          <AnalyticsPagePaper
            title="Assistance by Category"
            isLoading={isLoading}
          >
            {isLoading ? (
              <>
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  height={50}
                  sx={{ marginBottom: '1rem' }}
                />
                <Skeleton variant="rounded" height={300} animation="wave" />
              </>
            ) : (
              <CategorizedMetricsTable reports={reports} />
            )}
          </AnalyticsPagePaper>
        </Grid>
        <Grid item xs={12} md={12} lg={8} xl={8}>
          <AnalyticsPagePaper
            title="Clients Served by Zip Code"
            isLoading={isLoading}
          >
            {isLoading ? (
              <>
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  height={50}
                  sx={{ marginBottom: '1rem' }}
                />
                <Skeleton variant="rounded" animation="wave" height={300} />
              </>
            ) : (
              <ZipCodeBarChart reports={reports} />
            )}
          </AnalyticsPagePaper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AnalyticsPage;
