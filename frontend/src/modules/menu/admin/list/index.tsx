// src/pages/admin/MenuSettings/index.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { FiPlus } from 'react-icons/fi';
import { menuApi, type MenuTreeResponse, MenuType } from '../../../../api/menuApi';
import { MenuTreePanel } from './MenuTreePanel';
import { MenuDetailsPanel } from './MenuDetailsPanel';

const MenuSettings: React.FC = () => {
  const [menuData, setMenuData] = useState<MenuTreeResponse[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<MenuTreeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await menuApi.getMenuTree(false);
      setMenuData(response);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to load menu data');
      console.error('Error fetching menu data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenu = async () => {
    try {
      setSaving(true);
      const newOrder = selectedMenu?.children 
        ? selectedMenu.children.length + 1 
        : menuData.length + 1;

      await menuApi.createMenu({
        title: 'New Menu Item',
        url: '/new',
        type: MenuType.INTERNAL,
        order: newOrder,
        isActive: true,
        parentId: selectedMenu?._id,
      });

      await fetchMenuData();
      setError(null);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to create menu');
      console.error('Error creating menu:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateMenu = async (updatedMenu: MenuTreeResponse) => {
    try {
      setSaving(true);
      await menuApi.updateMenu(updatedMenu._id, {
        title: updatedMenu.title,
        url: updatedMenu.url,
        type: updatedMenu.type,
        icon: updatedMenu.icon,
        order: updatedMenu.order,
        isActive: updatedMenu.isActive,
        parentId: updatedMenu.parentId,
      });

      await fetchMenuData();
      setError(null);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to update menu');
      console.error('Error updating menu:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMenu = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      setSaving(true);
      await menuApi.deleteMenu(id);
      await fetchMenuData();
      setSelectedMenu(null);
      setError(null);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to delete menu');
      console.error('Error deleting menu:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      setSaving(true);
      await menuApi.toggleMenuActive(id);
      await fetchMenuData();
      setError(null);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to toggle menu status');
      console.error('Error toggling menu:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Menu Settings
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<FiPlus />} 
          onClick={handleAddMenu}
          disabled={saving}
        >
          Add Menu Item
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 200px)' }}>
        <MenuTreePanel
          menuData={menuData}
          selectedMenu={selectedMenu}
          onSelectMenu={setSelectedMenu}
        />

        <MenuDetailsPanel
          selectedMenu={selectedMenu}
          saving={saving}
          onUpdateMenu={setSelectedMenu}
          onSaveMenu={handleUpdateMenu}
          onDeleteMenu={handleDeleteMenu}
          onToggleActive={handleToggleActive}
        />
      </Box>
    </Box>
  );
};

export default MenuSettings;