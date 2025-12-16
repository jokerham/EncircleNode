import {
  Box,
  Typography,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import {
  FiCheck,
  FiShield,
  FiX,
} from 'react-icons/fi';
import type { Permission } from './types';

interface PermissionsModalProps {
  open: boolean;
  onClose: () => void;
  role: {
    name: string;
    description?: string;
    permissions?: Permission[];
  } | null;
  userName: string;
  loading?: boolean;
  error?: string | null;
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({
  open,
  onClose,
  role,
  userName,
  loading = false,
  error = null,
}) => {
  if (!role) return null;

  // Group permissions by resource
  const groupedPermissions = () => {
    if (!role.permissions || role.permissions.length === 0) {
      return { resources: [], actions: [], matrix: {} };
    }

    const resources = new Set<string>();
    const actions = new Set<string>();
    const matrix: { [key: string]: { [key: string]: boolean } } = {};

    role.permissions.forEach((permission) => {
      const resource = permission.resource || 'General';
      const action = permission.action || permission.name;

      resources.add(resource);
      actions.add(action);

      if (!matrix[resource]) {
        matrix[resource] = {};
      }
      matrix[resource][action] = true;
    });

    return {
      resources: Array.from(resources).sort(),
      actions: Array.from(actions).sort(),
      matrix,
    };
  };

  const { resources, actions, matrix } = groupedPermissions();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FiShield size={20} />
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
              {role.name} Permissions
            </Typography>
            <Typography variant="caption" color="text.secondary">
              • User: {userName}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pb: 2 }}>
        {role.description && (
          <Alert severity="info" sx={{ mb: 2, py: 0.5 }}>
            <Typography variant="body2">{role.description}</Typography>
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={32} />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : role.permissions && role.permissions.length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small" sx={{ minWidth: 500 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      borderRight: '2px solid',
                      borderColor: 'divider',
                      position: 'sticky',
                      left: 0,
                      bgcolor: 'grey.100',
                      zIndex: 1,
                    }}
                  >
                    Resource
                  </TableCell>
                  {actions.map((action) => (
                    <TableCell 
                      key={action} 
                      align="center" 
                      sx={{ 
                        fontWeight: 600,
                        minWidth: 80,
                        px: 1,
                      }}
                    >
                      <Chip 
                        label={action} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 22 }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {resources.map((resource) => (
                  <TableRow 
                    key={resource}
                    sx={{
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <TableCell 
                      component="th" 
                      scope="row"
                      sx={{ 
                        fontWeight: 500,
                        borderRight: '2px solid',
                        borderColor: 'divider',
                        position: 'sticky',
                        left: 0,
                        bgcolor: 'background.paper',
                        zIndex: 1,
                      }}
                    >
                      {resource}
                    </TableCell>
                    {actions.map((action) => (
                      <TableCell 
                        key={`${resource}-${action}`} 
                        align="center"
                        sx={{ px: 1 }}
                      >
                        {matrix[resource]?.[action] ? (
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              bgcolor: 'success.light',
                              color: 'success.dark',
                            }}
                          >
                            <FiCheck size={14} />
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              bgcolor: 'grey.100',
                              color: 'grey.400',
                            }}
                          >
                            <FiX size={14} />
                          </Box>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="warning">
            No permissions assigned to this role.
          </Alert>
        )}

        {role.permissions && role.permissions.length > 0 && (
          <Box sx={{ mt: 1.5, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: 'success.light',
                  color: 'success.dark',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FiCheck size={12} />
              </Box>
              <Typography variant="caption" color="text.secondary">
                Granted
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: 'grey.100',
                  color: 'grey.400',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FiX size={12} />
              </Box>
              <Typography variant="caption" color="text.secondary">
                Not granted
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained" size="small">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PermissionsModal;