'use client';
import React, { useState } from 'react';
import FilterPanel from '@/components/FilterPanel';
import TuneIcon from '@mui/icons-material/Tune';
import SpeedDial from '@mui/material/SpeedDial';
import dynamic from 'next/dynamic';
import { useTheme } from '@material-ui/core';

const DynamicMap = dynamic(() => import('../components/Map/index'), {
  ssr: false,
});

export default function MapPage() {
  const theme = useTheme();
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [searchObject, setSearchObject] = useState<
    Record<string, Array<string>>
  >({
    organizations: [],
    metrics: [],
  });

  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };
  return (
    <div style={{ height: '100%' }}>
      <FilterPanel
        open={isFilterPanelOpen}
        onClose={toggleFilterPanel}
        searchObject={searchObject}
        setSearchObject={setSearchObject}
      />
      <SpeedDial
        ariaLabel="Filters"
        sx={{
          position: 'absolute',
          top: 80,
          left: 60,
          zIndex: theme.zIndex.appBar - 2,
        }}
        icon={<TuneIcon />}
        onClick={toggleFilterPanel}
      />
      <DynamicMap searchObject={searchObject} />
    </div>
  );
}
