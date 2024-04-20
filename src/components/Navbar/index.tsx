'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { theme } from '../../utils/constants/themes';

const useStyles = makeStyles({
  boldButton: {
    fontWeight: 'bold',
    margin: '0px 5px',
    '&:hover': {
      backgroundColor: theme.primaryBlue,
      color: 'white',
    },
  },
});

function Navbar() {
  const pathname = usePathname();

  const classes = useStyles();

  const buttonColor = (route: string) => ({
    color: theme.primaryBlue,
    backgroundColor: route === pathname ? theme.primaryYellow : 'white',
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
              color: theme.primaryBlue,
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
