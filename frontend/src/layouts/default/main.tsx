import React from 'react';
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
} from '@mui/material';

// Main App Component
const DefaultContent: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Card elevation={1}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
            Welcome to ENCIRCLE
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Your content management system portal. Use the navigation menu above to explore different sections.
          </Typography>

          {/* Sample Content Cards */}
          <Grid container spacing={3}>
            <Grid size={{xs:12, md:4}}>
              <Card
                variant="outlined"
                sx={{
                  height: '100%',
                  transition: 'box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: 3
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                    Latest Notices
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stay updated with the latest announcements and notices.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{xs:12, md:4}}>
              <Card
                variant="outlined"
                sx={{
                  height: '100%',
                  transition: 'box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: 3
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                    Active Projects
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View and manage all your ongoing projects in one place.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{xs:12, md:4}}>
              <Card
                variant="outlined"
                sx={{
                  height: '100%',
                  transition: 'box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: 3
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                    Resources
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Access important documents and learning materials.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DefaultContent;