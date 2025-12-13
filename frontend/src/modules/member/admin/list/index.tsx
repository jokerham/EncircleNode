import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  FiEdit,
  FiTrash2,
  FiPlus,
} from 'react-icons/fi';
import { userApi } from '../../../../api/userApi';

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  roleId: {
    _id: string;
    name: string;
    description?: string;
  };
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

const MemberList: React.FC = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userApi.getAllUsers();
      setMembers(response as User[]);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to load members');
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this member?')) {
      return;
    }

    try {
      // Assuming you have a delete endpoint
      // await userApi.deleteUser(id);
      await fetchMembers();
      console.log('Delete user:', id);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to delete member');
      console.error('Error deleting member:', err);
    }
  };

  const handleEdit = (id: string) => {
    console.log('Edit user:', id);
    // Navigate to edit page or open modal
  };

  const handleAddMember = () => {
    console.log('Add new member');
    // Navigate to add page or open modal
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
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
          Member List
        </Typography>
        <Button variant="contained" startIcon={<FiPlus />} onClick={handleAddMember}>
          Add Member
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>User</TableCell>
              <TableCell sx={{ color: 'white' }}>Email</TableCell>
              <TableCell sx={{ color: 'white' }}>Role</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
              <TableCell sx={{ color: 'white' }}>Last Login</TableCell>
              <TableCell sx={{ color: 'white' }}>Join Date</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.length > 0 ? (
              members.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {getInitials(user.name)}
                      </Avatar>
                      <Typography variant="body2">{user.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.roleId.name}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActive ? 'Active' : 'Inactive'}
                      color={user.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleEdit(user._id)}
                    >
                      <FiEdit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDelete(user._id)}
                    >
                      <FiTrash2 />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    No members found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MemberList;