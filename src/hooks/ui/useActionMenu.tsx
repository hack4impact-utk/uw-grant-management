import { useState, useCallback } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface MenuAction {
  label: string;
  disabled?: boolean;
  onClick: React.MouseEventHandler<HTMLLIElement>;
}

interface ActionMenuProps {
  actions: MenuAction[];
  anchorEl: Element | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<Element | null>>;
}
function ActionMenuTemplate({
  actions,
  anchorEl,
  setAnchorEl,
}: ActionMenuProps) {
  const menuOpen = Boolean(anchorEl);
  const handleClose = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleClose}>
      {actions.map((action, i) => (
        <MenuItem
          key={i}
          disabled={action.disabled || false}
          onClick={(event) => {
            event.stopPropagation();
            if (action.onClick) {
              action.onClick(event);
            }
            handleClose(event);
          }}
        >
          {action.label}
        </MenuItem>
      ))}
    </Menu>
  );
}

interface UseActionMenuProps {
  actions: MenuAction[];
}

export default function useActionMenu({ actions }: UseActionMenuProps) {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const handleOpen = (
    event: React.MouseEvent<HTMLLIElement> | React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const ActionMenu = useCallback(() => {
    return (
      <ActionMenuTemplate
        actions={actions}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
      />
    );
  }, [actions, anchorEl]);

  return {
    handleOpen,
    ActionMenu,
  };
}
