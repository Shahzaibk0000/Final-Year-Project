import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box } from "@mui/material";
import CustomCard from "@components/CustomCard";

const styles = {
  root: {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  icon: {
    fontSize: 100,
    marginBottom: "1rem",
  },
  link: {
    textDecoration: "none",
    margin: "0.5rem",
  },
  logo: {
    position: "absolute",
    top: 20,
    left: 20,
  },
};

const NotFoundPage = () => {
  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      <Box sx={styles.logo}>
        <Typography variant="h4" color="black">
          Logo
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: 2,
          backgroundColor: "common.white",
        }}
      >
        <CustomCard
          sx={{
            width: "80%",
            maxWidth: 1000,
            padding: { xs: 3, sm: 4, md: 5, xl: 6 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: { xs: "column", md: "row" },
          }}
          content={false}
          border={false}
          boxShadow
        >
          <ErrorOutlineIcon style={styles.icon} color="error" />
          <Box
            sx={{
              ml: { md: 3 },
              textAlign: { xs: "center", md: "left" },
              mt: { xs: 2, md: 0 },
            }}
          >
            <Typography
              variant="h1"
              sx={{ textAlign: { xs: "center", md: "left" } }}
            >
              404 Page Not Found
            </Typography>
            <Typography
              variant="body1"
              sx={{ textAlign: { xs: "center", md: "left" } }}
            >
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </Typography>
            <Button
              component={Link}
              to="/"
              variant="contained"
              color="primary"
              style={styles.link}
              startIcon={<ArrowBackIcon />}
            >
              Go Back to Home
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              color="primary"
              style={styles.link}
              startIcon={<LockOutlinedIcon />}
            >
              Login
            </Button>
          </Box>
        </CustomCard>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
