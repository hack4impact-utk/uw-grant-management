'use client';
import React, { useState } from 'react';
import ImportForm from '../../components/ImportForm';
import PastReportSubmissions from '@/components/PastReportSubmissions';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

interface GridTabPanelProps {
  value: string;
  currentValue: string;
  children: React.ReactNode;
  onlyRenderWhenSelected?: boolean;
}
function GridTabPanel({
  value,
  currentValue,
  children,
  onlyRenderWhenSelected = false,
}: GridTabPanelProps) {
  const isSelected = value === currentValue;
  if (onlyRenderWhenSelected && !isSelected) {
    return null;
  }

  return (
    <Grid
      item
      xs={12}
      sx={{
        display: isSelected ? 'block' : 'none',
      }}
    >
      {children}
    </Grid>
  );
}
export default function ImportPage() {
  const [currentTab, setCurrentTab] = useState<string>('submit-report');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };
  return (
    <>
      <Tabs onChange={handleChange} centered value={currentTab}>
        <Tab label="Submit Report" value="submit-report" />
        <Tab label="Past Submissions" value="past-submissions" />
      </Tabs>
      <Grid container>
        <GridTabPanel value={'submit-report'} currentValue={currentTab}>
          <ImportForm />
        </GridTabPanel>
        <GridTabPanel
          value={'past-submissions'}
          currentValue={currentTab}
          onlyRenderWhenSelected
        >
          <PastReportSubmissions />
        </GridTabPanel>
      </Grid>
    </>
  );
}
