'use client';
import { Drawer as MUIDrawer } from '@mui/material/';
import { useTheme } from '@material-ui/core';

export function Drawer(props: any) {
  const theme = useTheme();
  return (
    <MUIDrawer
      {...props}
      style={{
        zIndex: theme.zIndex.appBar - 1,
      }}
    >
      <div
        style={{
          padding: '12px',
          paddingTop: '64px',
        }}
      >
        {props.children}
      </div>
    </MUIDrawer>
  );
}
