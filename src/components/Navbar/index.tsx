'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

// TODO: Uncomment these when we add back the menu icon
// import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';

const primary_blue = '#005191';
const primary_yellow = '#FFB351';

const useStyles = makeStyles({
  boldButton: {
    fontWeight: 'bold',
    margin: '0px 5px',
    '&:hover': {
      backgroundColor: primary_blue,
      color: 'white',
    },
  },
});

function Navbar() {
  const pathname = usePathname();

  const classes = useStyles();

  const buttonColor = (route: string) => ({
    color: primary_blue,
    backgroundColor: route === pathname ? primary_yellow : 'white',
  });

  return (
    <AppBar
      position="relative"
      style={{ zIndex: 999, padding: '0px 0px', backgroundColor: '#fff' }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            display: { xs: 'none', sm: 'block', color: 'white' },
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src="https://uwgk.org/wp-content/uploads/2020/05/UWGK-Logo-Color-White-Background.png"
            style={{ width: '220px' }}
          />
          <Link
            href="/"
            passHref
            style={{
              textDecoration: 'none',
              color: primary_blue,
              marginLeft: '20px',
            }}
          >
            Grant Management
          </Link>
        </Typography>
        <Link href="/" passHref>
          <Button className={classes.boldButton} sx={buttonColor('/')}>
            Map
          </Button>
        </Link>
        <Link href="/organizations" passHref>
          <Button
            className={classes.boldButton}
            sx={buttonColor('/organizations')}
          >
            Organizations
          </Button>
        </Link>
        <Link href="/import" passHref>
          <Button className={classes.boldButton} sx={buttonColor('/import')}>
            Import
          </Button>
        </Link>
        <Link href="/analytics" passHref>
          <Button className={classes.boldButton} sx={buttonColor('/analytics')}>
            Analytics
          </Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
