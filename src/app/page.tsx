import Grid from '@mui/material/Grid';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/Map/'), { ssr: false });

function Home() {
  const appBarHeight = '64px';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
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

export default Home;
