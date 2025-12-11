import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Switch,
} from '@mui/material';
import {
  FiEdit,
  FiTrash2,
  FiPlus,
} from 'react-icons/fi';


export interface MenuItem {
  id: number;
  name: string;
  url: string;
  order: number;
  visible: boolean;
  parent?: string;
}

// Menu Settings Page
const MenuSettings: React.FC = () => {
  const siteMenus: MenuItem[] = [
    { id: 1, name: 'Home', url: '/', order: 1, visible: true },
    { id: 2, name: 'About', url: '/about', order: 2, visible: true },
    { id: 3, name: 'Services', url: '/services', order: 3, visible: true },
    { id: 4, name: 'Products', url: '/products', order: 4, visible: true, parent: 'Services' },
    { id: 5, name: 'Contact', url: '/contact', order: 5, visible: true },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">Menu Settings</Typography>
        <Button variant="contained" startIcon={<FiPlus />}>Add Menu Item</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Order</TableCell>
              <TableCell sx={{ color: 'white' }}>Name</TableCell>
              <TableCell sx={{ color: 'white' }}>URL</TableCell>
              <TableCell sx={{ color: 'white' }}>Parent</TableCell>
              <TableCell sx={{ color: 'white' }}>Visible</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {siteMenus.map((menu) => (
              <TableRow key={menu.id} hover>
                <TableCell>{menu.order}</TableCell>
                <TableCell>{menu.name}</TableCell>
                <TableCell>{menu.url}</TableCell>
                <TableCell>{menu.parent || '-'}</TableCell>
                <TableCell>
                  <Switch checked={menu.visible} color="primary" />
                </TableCell>
                <TableCell>
                  <IconButton size="small" color="primary">
                    <FiEdit />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <FiTrash2 />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MenuSettings;