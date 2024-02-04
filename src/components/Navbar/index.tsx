'use client';
import React from 'react';
import Link from 'next/link';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            United Way Grant Management
          </Typography>
          <Link href="/nonprofits" passHref>
            <Button style={{ color: 'white' }}>Nonprofits</Button>
          </Link>
          <Link href="/examplepage" passHref>
            <Button style={{ color: 'white' }}>Page 2</Button>
          </Link>
          <Link href="/examplepage2" passHref>
            <Button style={{ color: 'white' }}>Page 3</Button>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
