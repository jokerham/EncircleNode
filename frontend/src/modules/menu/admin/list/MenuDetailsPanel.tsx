// ============================================================================
// src/modules/menu/admin/list/MenuDetailsPanel.tsx
// ============================================================================

import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Paper,
  IconButton,
  Divider,
  Button,
  CircularProgress,
  Select,
  MenuItem as MuiMenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { FiTrash2, FiSave } from 'react-icons/fi';
import { type MenuTreeResponse, MenuType } from '../../../../api/menuApi';

interface MenuDetailsPanelProps {
  selectedMenu: MenuTreeResponse | null;
  saving: boolean;
  onUpdateMenu: (menu: MenuTreeResponse) => void;
  onSaveMenu: (menu: MenuTreeResponse) => void;
  onDeleteMenu: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export const MenuDetailsPanel: React.FC<MenuDetailsPanelProps> = ({
  selectedMenu,
  saving,
  onUpdateMenu,
  onSaveMenu,
  onDeleteMenu,
  onToggleActive,
}) => {
  if (!selectedMenu) {
    return (
      <Paper sx={{ flex: 1, p: 3, overflow: 'auto' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'text.secondary',
          }}
        >
          <Typography variant="body1">
            Select a menu item from the tree to view and edit its details
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ flex: 1, p: 3, overflow: 'auto' }}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Menu Item Details</Typography>
          <IconButton
            color="error"
            onClick={() => onDeleteMenu(selectedMenu._id)}
            disabled={saving}
          >
            <FiTrash2 />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Title"
            fullWidth
            value={selectedMenu.title}
            onChange={(e) =>
              onUpdateMenu({ ...selectedMenu, title: e.target.value })
            }
            disabled={saving}
          />

          <TextField
            label="URL"
            fullWidth
            value={selectedMenu.url}
            onChange={(e) =>
              onUpdateMenu({ ...selectedMenu, url: e.target.value })
            }
            disabled={saving}
          />

          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={selectedMenu.type}
              label="Type"
              onChange={(e) =>
                onUpdateMenu({ ...selectedMenu, type: e.target.value as MenuType })
              }
              disabled={saving}
            >
              <MuiMenuItem value={MenuType.INTERNAL}>Internal</MuiMenuItem>
              <MuiMenuItem value={MenuType.EXTERNAL}>External</MuiMenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Icon (optional)"
            fullWidth
            value={selectedMenu.icon || ''}
            onChange={(e) =>
              onUpdateMenu({ ...selectedMenu, icon: e.target.value })
            }
            disabled={saving}
            helperText="Icon name from react-icons (e.g., FiHome)"
          />

          <TextField
            label="Order"
            type="number"
            fullWidth
            value={selectedMenu.order}
            onChange={(e) =>
              onUpdateMenu({ ...selectedMenu, order: parseInt(e.target.value) || 0 })
            }
            disabled={saving}
          />

          <FormControlLabel
            control={
              <Switch
                checked={selectedMenu.isActive}
                onChange={() => onToggleActive(selectedMenu._id)}
                disabled={saving}
              />
            }
            label="Active"
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              variant="contained" 
              startIcon={saving ? <CircularProgress size={16} /> : <FiSave />}
              onClick={() => onSaveMenu(selectedMenu)}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};