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
  Avatar,
  Chip,
  Button,
} from '@mui/material';
import {
  FiEdit,
  FiTrash2,
  FiPlus,
} from 'react-icons/fi';

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  role: string;
  joinDate: string;
}

// Member List Page
const MemberList: React.FC = () => {
  const members: User[] = [
    { id: 1, name: 'John Doe', email: 'john@mizuho.com', status: 'active', role: 'Admin', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@mizuho.com', status: 'active', role: 'Editor', joinDate: '2024-02-20' },
    { id: 3, name: 'Bob Johnson', email: 'bob@mizuho.com', status: 'inactive', role: 'User', joinDate: '2024-03-10' },
    { id: 4, name: 'Alice Williams', email: 'alice@mizuho.com', status: 'active', role: 'Manager', joinDate: '2024-01-05' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">Member List</Typography>
        <Button variant="contained" startIcon={<FiPlus />}>Add Member</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>User</TableCell>
              <TableCell sx={{ color: 'white' }}>Email</TableCell>
              <TableCell sx={{ color: 'white' }}>Role</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
              <TableCell sx={{ color: 'white' }}>Join Date</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>{user.name.charAt(0)}</Avatar>
                    <Typography variant="body2">{user.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    color={user.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{user.joinDate}</TableCell>
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

export default MemberList;