import { useState } from "react";
import {
  IconButton,
  Menu,
  Divider,
  MenuItem,
  Typography,
  ListItemIcon,
} from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { Link } from "react-router-dom";
import UploadDataDialog from "@components/UploadDataDialog";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
const NavDropMenu = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleUploadDialogOpen = () => {
    setUploadDialogOpen(true);
    handleCloseNavMenu();
  };

  const handleUploadDialogClose = () => {
    setUploadDialogOpen(false);
  };

  return (
    <>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        color="inherit"
      >
        <MenuOutlinedIcon color="black" />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        sx={{
          display: { xs: "block", md: "none" },
        }}
      >
        <MenuItem onClick={handleCloseNavMenu} component={Link} to="/dashboard">
          <ListItemIcon>
            <DashboardOutlinedIcon />
          </ListItemIcon>
          <Typography textAlign="center" sx={{ color: "black" }}>
            Dashboard
          </Typography>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={handleCloseNavMenu}
          component={Link}
          to="/predictive-analytics"
        >
          <ListItemIcon>
            <BarChartOutlinedIcon />
          </ListItemIcon>
          <Typography textAlign="center" sx={{ color: "black" }}>
            Predictive Analytics
          </Typography>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />

        <MenuItem onClick={handleUploadDialogOpen}>
          <ListItemIcon>
            <CloudUploadOutlinedIcon />
          </ListItemIcon>
          <Typography textAlign="center" sx={{ color: "black" }}>
            Upload Data
          </Typography>
        </MenuItem>
      </Menu>

      {/* Render the UploadDataDialog component */}
      <UploadDataDialog
        open={uploadDialogOpen}
        onClose={handleUploadDialogClose}
      />
    </>
  );
};

export default NavDropMenu;
