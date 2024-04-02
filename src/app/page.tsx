'use client';
import React, { useState } from 'react';
import FilterPanel from '@/components/FilterPanel';
import TuneIcon from '@mui/icons-material/Tune';
import SpeedDial from '@mui/material/SpeedDial';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('../components/Map/index'), {
  ssr: false,
});

export default function MapPage() {
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '95vh' }}>
      <FilterPanel
        open={isFilterPanelOpen}
        onClose={toggleFilterPanel}
        searchObject={searchObject}
        setSearchObject={setSearchObject}
      />
      {!isFilterPanelOpen && (
        <SpeedDial
          ariaLabel="Filters"
          sx={{
            position: 'absolute',
            top: 60,
            left: 60,
          }}
          icon={<TuneIcon />}
          onClick={toggleFilterPanel}
        />
      )}
      <DynamicMap searchObject={searchObject} />
    </div>
  );
}
