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
  Chip,
  Button,
} from '@mui/material';
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiEye,
} from 'react-icons/fi';

// Types
export interface Post {
  id: number;
  title: string;
  author: string;
  category: string;
  date: string;
  status: 'published' | 'draft';
  views: number;
}

// Post Management Page
const PostManagement: React.FC = () => {
  const posts: Post[] = [
    { id: 1, title: 'Q4 Financial Report', author: 'John Doe', category: 'Reports', date: '2024-12-08', status: 'published', views: 245 },
    { id: 2, title: 'New Product Launch', author: 'Jane Smith', category: 'News', date: '2024-12-09', status: 'published', views: 512 },
    { id: 3, title: 'Corporate Policy Update', author: 'Bob Johnson', category: 'Policy', date: '2024-12-10', status: 'draft', views: 0 },
    { id: 4, title: 'Market Analysis 2024', author: 'Alice Williams', category: 'Analysis', date: '2024-12-07', status: 'published', views: 389 },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">Post Management</Typography>
        <Button variant="contained" startIcon={<FiPlus />}>Create Post</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Title</TableCell>
              <TableCell sx={{ color: 'white' }}>Author</TableCell>
              <TableCell sx={{ color: 'white' }}>Category</TableCell>
              <TableCell sx={{ color: 'white' }}>Date</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
              <TableCell sx={{ color: 'white' }}>Views</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id} hover>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>
                  <Chip label={post.category} size="small" variant="outlined" />
                </TableCell>
                <TableCell>{post.date}</TableCell>
                <TableCell>
                  <Chip
                    label={post.status}
                    color={post.status === 'published' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{post.views}</TableCell>
                <TableCell>
                  <IconButton size="small" color="primary">
                    <FiEye />
                  </IconButton>
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

export default PostManagement;