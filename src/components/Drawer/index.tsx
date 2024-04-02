'use client';
import { Drawer as MUIDrawer } from '@mui/material/';

export function Drawer(props: any) {
  return (
    <MUIDrawer
      {...props}
      style={{
        zIndex: 998,
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
