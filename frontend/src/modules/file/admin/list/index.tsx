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
  FiTrash2,
  FiPlus,
  FiDownload,
  FiEye,
} from 'react-icons/fi';

// Types
export interface FileItem {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  uploadedBy: string;
}

// File Management Page
const FileManagement: React.FC = () => {
  const files: FileItem[] = [
    { id: 1, name: 'Annual_Report_2024.pdf', type: 'PDF', size: '2.4 MB', uploadDate: '2024-12-01', uploadedBy: 'John Doe' },
    { id: 2, name: 'Brand_Guidelines.pdf', type: 'PDF', size: '5.1 MB', uploadDate: '2024-11-28', uploadedBy: 'Jane Smith' },
    { id: 3, name: 'Product_Images.zip', type: 'ZIP', size: '24.8 MB', uploadDate: '2024-12-05', uploadedBy: 'Bob Johnson' },
    { id: 4, name: 'Corporate_Presentation.pptx', type: 'PPTX', size: '8.3 MB', uploadDate: '2024-12-03', uploadedBy: 'Alice Williams' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">File Management</Typography>
        <Button variant="contained" startIcon={<FiPlus />}>Upload File</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>File Name</TableCell>
              <TableCell sx={{ color: 'white' }}>Type</TableCell>
              <TableCell sx={{ color: 'white' }}>Size</TableCell>
              <TableCell sx={{ color: 'white' }}>Upload Date</TableCell>
              <TableCell sx={{ color: 'white' }}>Uploaded By</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id} hover>
                <TableCell>{file.name}</TableCell>
                <TableCell>
                  <Chip label={file.type} size="small" color="primary" variant="outlined" />
                </TableCell>
                <TableCell>{file.size}</TableCell>
                <TableCell>{file.uploadDate}</TableCell>
                <TableCell>{file.uploadedBy}</TableCell>
                <TableCell>
                  <IconButton size="small" color="primary">
                    <FiDownload />
                  </IconButton>
                  <IconButton size="small" color="primary">
                    <FiEye />
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

export default FileManagement;