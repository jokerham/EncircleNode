import React from 'react';
import {
  Typography,
  IconButton,
  Box,
  Container,
  Grid,
  Link,
  Divider,
} from '@mui/material';
import {
  FiMail as EmailIcon,
  FiPhone as PhoneIcon,
  FiMapPin as LocationOnIcon,
  FiFacebook as FacebookIcon,
  FiTwitter as TwitterIcon,
  FiLinkedin as LinkedInIcon,
  FiInstagram as InstagramIcon
} from 'react-icons/fi';

// Footer Component
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'grey.300',
        py: 6
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid size={{xs:12, md:6}}>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
              ENCIRCLE
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.400', mb: 2 }}>
              Your comprehensive content management system portal for seamless project management and collaboration.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton
                component="a"
                href="#"
                sx={{ color: 'grey.400', '&:hover': { color: 'primary.main' } }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                component="a"
                href="#"
                sx={{ color: 'grey.400', '&:hover': { color: 'primary.main' } }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                component="a"
                href="#"
                sx={{ color: 'grey.400', '&:hover': { color: 'primary.main' } }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                component="a"
                href="#"
                sx={{ color: 'grey.400', '&:hover': { color: 'primary.main' } }}
              >
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={{xs:12, sm: 6, md:3}}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
              Quick Links
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {['Home', 'Notice', 'Projects', 'About Us'].map((item, index) => (
                <Box component="li" key={index} sx={{ mb: 1 }}>
                  <Link
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    sx={{
                      color: 'grey.300',
                      textDecoration: 'none',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    {item}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid size={{xs:12, sm:6, md:3}}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
              Contact Us
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <EmailIcon style={{marginRight: 1, marginTop: 0.5, fontSize: 20}} />
                <Typography variant="body2">info@encircle.com</Typography>
              </Box>
              <Box component="li" sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <PhoneIcon style={{marginRight: 1, marginTop: 0.5, fontSize: 20}} />
                <Typography variant="body2">+1 (555) 123-4567</Typography>
              </Box>
              <Box component="li" sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <LocationOnIcon style={{marginRight: 1, marginTop: 0.5, fontSize: 20}} />
                <Typography variant="body2">123 Portal Street, Tech City, TC 12345</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Divider sx={{ borderColor: 'grey.800', my: 4 }} />
        <Typography variant="body2" align="center" sx={{ color: 'grey.500' }}>
          &copy; {currentYear} ENCIRCLE. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;