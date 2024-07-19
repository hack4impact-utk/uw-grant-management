'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import theme from '@/utils/constants/themes';
import { useTheme } from '@material-ui/core/styles';
import Image from 'next/image';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import Menu from '@mui/material/Menu';

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
  const muiTheme = useTheme();
  const [navMenuAnchorEl, setNavMenuAnchorEl] = useState<HTMLElement | null>(
    null
  );
  const isMdScreen = useMediaQuery(muiTheme.breakpoints.up('md'));
  const isSmScreen = useMediaQuery(muiTheme.breakpoints.up('sm'));

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNavMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setNavMenuAnchorEl(null);
  };

  const buttonColor = (route: string) => ({
    color: theme.primaryBlue,
    backgroundColor: route === pathname ? theme.primaryYellow : 'white',
  });

  const navLinks = [
    {
      path: '/',
      label: 'Map',
    },
    {
      path: '/organizations',
      label: 'Organizations',
    },
    {
      path: '/reports',
      label: 'Reports',
    },
    {
      path: '/analytics',
      label: 'Analytics',
    },
  ];

  const getNavLinks = () => {
    return navLinks.map((navLink, i) => (
      <Link href={navLink.path} passHref key={i}>
        <Button className={classes.boldButton} sx={buttonColor(navLink.path)}>
          {navLink.label}
        </Button>
      </Link>
    ));
  };

  return (
    <AppBar
      position="fixed"
      style={{
        zIndex: muiTheme.zIndex.appBar,
        padding: '.5rem 0',
        backgroundColor: '#fff',
        height: '5rem',
      }}
      elevation={1}
    >
      <Toolbar>
        <Typography
          variant="h1"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {isSmScreen ? (
            <Image
              alt="United Way of Greater Knoxville Logo"
              src="/images/UWGK-Logo-Color-White-Background.png"
              width={220}
              height={60}
              priority
            />
          ) : (
            <Image
              alt="United Way of Greater Knoxville Logo"
              src="/images/UW_Social_Circle-671x671.png"
              width={60}
              height={60}
              priority
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
          )}
          {/* <Link
            href="/"
            passHref
            style={{
              color: theme.primaryBlue,
              marginLeft: '20px',
              fontWeight: 'bold',
              textDecoration: 'none',
            }}
          >
            Grant Management
          </Link> */}
        </Typography>
        {isMdScreen ? (
          getNavLinks()
        ) : (
          <>
            <IconButton
              size="large"
              edge="start"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleMenu}
            >
              <MenuIcon
                style={{
                  color: theme.primaryBlue,
                }}
              />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={navMenuAnchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(navMenuAnchorEl)}
              onClose={handleClose}
            >
              {getNavLinks().map((linkEl, i) => (
                <ListItem key={i} onClick={handleClose}>
                  {linkEl}
                </ListItem>
              ))}
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
