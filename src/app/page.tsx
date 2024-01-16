import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/Map/'), { ssr: false });

export default async function Home() {
  const appBarHeight = '64px';
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            United Way Grant Management
          </Typography>
          <Button color="inherit">Example Button</Button>
        </Toolbar>
      </AppBar>
      <div style={{ flexGrow: 1, height: `calc(100% - ${appBarHeight})` }}>
        <Grid container style={{ height: '100%' }}>
          <Grid item xs={3}>
            <div
              style={{
                borderRight: '2px solid rgba(0, 0, 0, .2)',
                height: '100%',
              }}
            >
              <h2
                style={{
                  padding: '12px',
                }}
              >
                Filters
              </h2>
            </div>
          </Grid>
          <Grid item xs={9}>
            <Map />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
