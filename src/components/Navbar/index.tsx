'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

// TODO: Uncomment these when we add back the menu icon
// import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';

function Navbar() {
  const pathname = usePathname();

  const buttonColor = (route: string) => ({
    color: route === pathname ? 'orange' : 'white',
  });

  return (
    <AppBar position="relative" style={{ zIndex: 999 }}>
      <Toolbar>
        {/* <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton> */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            display: { xs: 'none', sm: 'block', color: 'white' },
          }}
        >
          <Link
            href="/"
            passHref
            style={{ textDecoration: 'none', color: 'white' }}
          >
            United Way Grant Management
          </Link>
        </Typography>
        <Link href="/" passHref>
          <Button sx={buttonColor('/')}>Map</Button>
        </Link>
        <Link href="/organizations" passHref>
          <Button sx={buttonColor('/organizations')}>Organizations</Button>
        </Link>
        <Link href="/import" passHref>
          <Button sx={buttonColor('/import')}>Import</Button>
        </Link>
        <Link href="/analytics" passHref>
          <Button sx={buttonColor('/analytics')}>Analytics</Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
