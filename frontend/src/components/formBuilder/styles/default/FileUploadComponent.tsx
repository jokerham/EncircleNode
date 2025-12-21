import React, { useState } from 'react';
import {
  Button,
  Box,
  Typography,
  LinearProgress,
  Link,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { FiUpload, FiX } from 'react-icons/fi';
import type { FormikProps } from 'formik';
import type { FileFieldConfig, FileUploadProgress, UploadedFile } from '../../types';

// ==================== FILE UPLOAD COMPONENT ====================
const FileUploadComponent: React.FC<{
  field: FileFieldConfig;
  formikProps: FormikProps<Record<string, unknown>>;
}> = ({ field, formikProps }) => {
  const { values, setFieldValue } = formikProps;
  const [uploadProgress, setUploadProgress] = useState<FileUploadProgress[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>((values[field.name] as UploadedFile[]) || []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (field.onUpload) {
      // Initialize progress for each file
      const progressArray = files.map((file) => ({
        fileName: file.name,
        progress: 0,
      }));
      setUploadProgress(progressArray);

      try {
        // Simulate upload progress
        const uploadPromises = files.map(async (file, index) => {
          for (let i = 0; i <= 100; i += 20) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            setUploadProgress((prev) =>
              prev.map((p, idx) => (idx === index ? { ...p, progress: i } : p))
            );
          }
        });

        await Promise.all(uploadPromises);

        // Call the actual upload handler
        const uploaded = await field.onUpload(files);
        const newFiles = [...uploadedFiles, ...uploaded];
        setUploadedFiles(newFiles);
        setFieldValue(field.name, newFiles);

        if (field.onChange) {
          field.onChange(newFiles, formikProps);
        }

        setUploadProgress([]);
      } catch (error) {
        console.error('Upload failed:', error);
        setUploadProgress([]);
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    setFieldValue(field.name, newFiles);
    if (field.onChange) {
      field.onChange(newFiles, formikProps);
    }
  };

  return (
    <Box margin="normal" className={field.className} style={field.style}>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {field.label}
      </Typography>
      <Button variant="outlined" component="label" startIcon={<FiUpload size={18} />}>
        Upload Files
        <input
          type="file"
          hidden
          multiple={field.multiple}
          accept={field.accept}
          onChange={handleFileChange}
          disabled={field.disabled}
        />
      </Button>

      {uploadProgress.length > 0 && (
        <Box mt={2}>
          {uploadProgress.map((progress, index) => (
            <Box key={index} mb={1}>
              <Typography variant="caption">{progress.fileName}</Typography>
              <LinearProgress variant="determinate" value={progress.progress} />
            </Box>
          ))}
        </Box>
      )}

      {uploadedFiles.length > 0 && (
        <List dense>
          {uploadedFiles.map((file, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" onClick={() => removeFile(index)} size="small">
                  <FiX size={16} />
                </IconButton>
              }
            >
              <ListItemText
                primary={<Link href={file.url} target="_blank">{file.name}</Link>}
                secondary={`${(file.size / 1024).toFixed(2)} KB - ${new Date(
                  file.uploadedAt
                ).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default FileUploadComponent;