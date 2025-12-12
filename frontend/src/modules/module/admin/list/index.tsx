import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { FiSettings } from 'react-icons/fi';

export interface Module {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  version: string;
}

// Module Settings Page
const ModuleSettings: React.FC = () => {
  const modules: Module[] = [
    { id: 1, name: 'User Management', description: 'Manage users and permissions', enabled: true, version: '2.1.0' },
    { id: 2, name: 'Content Editor', description: 'Rich text content editor', enabled: true, version: '1.8.5' },
    { id: 3, name: 'Analytics Dashboard', description: 'View site analytics and metrics', enabled: true, version: '3.0.2' },
    { id: 4, name: 'Email Notifications', description: 'Automated email system', enabled: false, version: '1.5.0' },
    { id: 5, name: 'Media Library', description: 'Manage images and videos', enabled: true, version: '2.3.1' },
  ];

  return (
    <Box>
      <Typography variant="h5" component="h2" sx={{ mb: 3 }}>Module Settings</Typography>
      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid size={{xs: 12, md: 6}} key={module.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" component="div">{module.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{module.description}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Version: {module.version}
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={<Switch checked={module.enabled} color="primary" />}
                    label=""
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant="outlined" startIcon={<FiSettings />}>Configure</Button>
                  {module.enabled && <Chip label="Active" color="success" size="small" />}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ModuleSettings;