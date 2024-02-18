"use client"
import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import FilterPanel from '../components/FilterPanel/index';
import Map from '../components/Map/index';

export default function Page() {
  const appBarHeight = '64px';
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [appBarShift, setAppBarShift] = useState(false);

  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setIsFilterPanelOpen(false);
        setAppBarShift(false);
      } else {
        setIsFilterPanelOpen(true);
        setAppBarShift(true);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static" style={{ transition: 'margin 0.3s', marginLeft: appBarShift && isFilterPanelOpen ? '240px' : '0' }}>
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
      <div style={{ flexGrow: 1, height: `calc(100% - ${appBarHeight})`, display: 'flex' }}>
        <div style={{ width: isFilterPanelOpen ? '240px' : '0', transition: 'width 0.3s' }}>
          <FilterPanel open={isFilterPanelOpen} onClose={toggleFilterPanel} />
        </div>
        <div style={{ flexGrow: 1, overflow: 'auto' }}>
          <Map />
        </div>
      </div>
    </div>
  );
}
