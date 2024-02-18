"use client"
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import FilterPanel from '@/components/FilterPanel';
import Map from '../components/Map/index';

export default function Page() {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="relative" style={{zIndex: 999}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleFilterPanel}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            United Way Grant Management
          </Typography>
          <Button color="inherit">Example Button</Button>
        </Toolbar>
      </AppBar>
      <FilterPanel open={isFilterPanelOpen} onClose={toggleFilterPanel}/>
      <Map />
    </div>
  );
}
