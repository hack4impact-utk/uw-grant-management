import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ open, onClose }) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      BackdropProps={{
        invisible: true,
        sx: {
          backdropFilter: 'none'
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px' }}>
        <h2>Filter Options</h2>
      </div>
      <List>
        <ListItem button>
          <ListItemText primary="Filter Option 1" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Filter Option 2" />
        </ListItem>
        {/* Add more filter options */}
      </List>
    </Drawer>
  );
};

export default FilterPanel;
