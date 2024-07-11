import PropTypes from "prop-types";
import {
  Box,
  Grid,
  Container,
  Typography,
  useTheme,
  Stack,
} from "@mui/material";
import CustomCard from "@components/CustomCard";
import LoginForm from "./LoginForm";

const Login = () => {
  document.title = "Login";
  const theme = useTheme();
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Box
        sx={{
          position: "absolute",
          filter: "blur(18px)",
          zIndex: -1,
          bottom: 0,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "calc(100vh - 175px)",
            backgroundColor: theme.palette.common.white,
          }}
        />
      </Box>
      <Grid
        container
        direction="column"
        justifyContent="flex-end"
        sx={{
          minHeight: "100vh",
        }}
      >
        <Grid item xs={12} sx={{ ml: 3, mt: 3 }}>
          <Typography variant="h4" color="black">
            MediAnalytics
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid
            item
            xs={12}
            container
            justifyContent="center"
            alignItems="center"
            sx={{
              minHeight: {
                xs: "calc(100vh - 134px)",
                md: "calc(100vh - 112px)",
              },
            }}
          >
            <Grid item>
              <CustomCard
                sx={{
                  maxWidth: { xs: 400, lg: 475 },
                  margin: { xs: 2.5, md: 3 },
                  "& > *": {
                    flexGrow: 1,
                    flexBasis: "50%",
                  },
                }}
                content={false}
                border={false}
                boxShadow
              >
                <Box sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="baseline"
                        sx={{ mb: { xs: -0.5, sm: 0.5 } }}
                      >
                        <Typography variant="h3">Login</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <LoginForm />
                    </Grid>
                  </Grid>
                </Box>
              </CustomCard>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <Container maxWidth="xl"></Container>
        </Grid>
      </Grid>
    </Box>
  );
};

Login.propTypes = {
  children: PropTypes.node,
};

export default Login;
