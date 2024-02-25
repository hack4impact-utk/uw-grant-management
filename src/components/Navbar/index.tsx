'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function Navbar() {
  const pathname = usePathname();

  const buttonColor = (route: string) => ({
    color: route === pathname ? 'orange' : 'white',
  });

  return (
    <AppBar position="static" sx={{ flexGrow: 1 }}>
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
        <Link href="/nonprofits" passHref>
          <Button sx={buttonColor('/nonprofits')}>Nonprofits</Button>
        </Link>
        <Link href="/examplepage" passHref>
          <Button sx={buttonColor('/examplepage')}>Page 2</Button>
        </Link>
        <Link href="/examplepage2" passHref>
          <Button sx={buttonColor('/examplepage2')}>Page 3</Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
