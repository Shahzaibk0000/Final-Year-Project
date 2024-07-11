import {
  AppBar,
  Box,
  Container,
  Divider,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import AdbIcon from "@mui/icons-material/Adb";
import NavBarMenu from "./Navigation/NavBarMenu";
import Profile from "./Profile/index";
import NavDropMenu from "./Navigation/NavDropMenu";

function Header() {
  const theme = useTheme();

  const styleappbar = {
    position: "fixed",
    color: "inherit",
    elevation: 0,
    sx: {
      width: "100%",
      borderBottom: `1px solid ${theme.palette.divider}`,
      boxShadow:
        "0px 2px 4px -1px rgba(0,0,0,0.1), 0px 4px 5px 0px rgba(0,0,0,0.06), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    },
  };

  return (
    <AppBar {...styleappbar}>
      <Container maxWidth="1660px">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            RTPADAOHC
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <NavDropMenu />
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            RTPADAOHC
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "flex-end",
            }}
          >
            <NavBarMenu />
          </Box>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              display: { xs: "none", md: "flex" },
              marginRight: 2,
              marginLeft: 2,
            }}
          />
          <Box sx={{ flexGrow: 0 }}>
            <Profile />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
