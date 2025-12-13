import { ThemeProvider } from "@emotion/react";
import { Box, Link, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { styled } from "@mui/system";

const AccessDeniedBox = styled(Box)(() => ({
  boxSizing: "border-box",
  width: "100vw",
  height: "100vh",
}));

const AccessDeniedContainerBox = styled(Box)(() => ({
  boxSizing: 'border-box',
  position: 'relative',
  lineHeight: 1.4,
  textAlign: 'center',
  width: '100%',
  left: '50%',
  top: '50%',
  pl: 15,
  pr: 15,
  transform: 'translate(-50%, -12%)'
}));

const AccessDenied403Box = styled(Box)(() => ({
  boxSizing: 'border-box',
  position: 'absolute',
  height: 100,
  top: 0,
  left: '50%',
  zIndex: -1,
  transform: 'translateX(-50%)',
}));

const theme = createTheme({
  components: {
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontFamily: "'Maven Pro', sans-serif",
          color: "#ececec",
          fontWeight: 900,
          fontSize: 276,
          margin: 0,
          position: "absolute",
          left: "50%",
          transform: "translate(-50%, -50%)",
        },
        h2: {
          fontFamily: "'Maven Pro', sans-serif",
          fontSize: 46,
          color: "#000",
          fontWeight: 900,
          textTransform: "uppercase",
          margin: 0,
          textAlign: "center",
        },
        h4: {
          fontFamily: "'Maven Pro', sans-serif",
          fontSize: 15,
          color: "#000",
          fontWeight: 400,
          textTransform: "uppercase",
          marginTop: 15,
          textAlign: "center",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontFamily: "'Maven Pro', sans-serif",
          fontSize: 14,
          textDecoration: "none",
          textTransform: "uppercase",
          background: "#f44336",
          display: "inline-block",
          padding: "16px 38px",
          border: "2px solid transparent",
          borderRadius: "40px",
          color: "#fff",
          fontWeight: 400,
          transition: "0.2s all",
          "&:hover": {
            backgroundColor: "#fff",
            borderColor: "#f44336",
            color: "#f44336",
          },
        },
      },
    },
  },
});

const AccessDenied = () => {
  return (
    <ThemeProvider theme={theme}>
      <AccessDeniedBox>
        <AccessDeniedContainerBox>
          <AccessDenied403Box>
            <Typography variant="h1">403</Typography>
          </AccessDenied403Box>
          <Typography variant="h2">Access Denied!</Typography>
          <Typography variant="h4">
            You don't have permission to access this page. Please contact your
            administrator if you believe this is an error.
          </Typography>
          <Link href="/">Back To Homepage</Link>
        </AccessDeniedContainerBox>
      </AccessDeniedBox>
    </ThemeProvider>
  );
}

export default AccessDenied;