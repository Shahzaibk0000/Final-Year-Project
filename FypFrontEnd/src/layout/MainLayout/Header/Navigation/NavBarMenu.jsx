import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { List, ListItem, Typography, useTheme } from "@mui/material";
import UploadDataDialog from "@components/UploadDataDialog";

const Navigation = () => {
  const location = useLocation();
  const theme = useTheme();
  const itemWidth = "12rem";

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const handleUploadDialogOpen = () => {
    setUploadDialogOpen(true);
  };

  const handleUploadDialogClose = () => {
    setUploadDialogOpen(false);
  };

  const getBackgroundColor = (path) => {
    if (location.pathname === "/" && path === "/dashboard/") {
      return theme.palette.primary.lighter;
    }
    return location.pathname === path
      ? theme.palette.primary.lighter
      : "transparent";
  };

  return (
    <>
      <List sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        {/* Dashboard */}
        <ListItem
          button
          component={Link}
          to="/dashboard"
          style={{
            textDecoration: "none",
            color: "inherit",
            backgroundColor: getBackgroundColor("/dashboard/"),
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            borderRadius: 1.5,
            width: itemWidth,
            whiteSpace: "nowrap",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: theme.palette.primary.lighter,
            },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1,
              fontWeight: 600,
            }}
          >
            Dashboard
          </Typography>
        </ListItem>

        {/* Predictive Analytics */}
        <ListItem
          button
          component={Link}
          to="/predictive-analytics/"
          style={{
            textDecoration: "none",
            color: "inherit",
            backgroundColor: getBackgroundColor("/predictive-analytics/"),
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            borderRadius: 1.5,
            width: itemWidth,
            whiteSpace: "nowrap",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: theme.palette.primary.lighter,
            },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1,
              fontWeight: 600,
            }}
          >
            Predictive Analytics
          </Typography>
        </ListItem>

        {/* Upload Data */}
        <ListItem
          onClick={handleUploadDialogOpen}
          style={{
            textDecoration: "none",
            color: "inherit",
            backgroundColor: getBackgroundColor("/upload-data/"),
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            borderRadius: 1.5,
            width: itemWidth,
            whiteSpace: "nowrap",
            textAlign: "left",
            cursor: "pointer",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: theme.palette.primary.lighter,
            },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1,
              fontWeight: 600,
            }}
          >
            Upload Data
          </Typography>
        </ListItem>
      </List>

      {/* Render the UploadDataDialog component */}
      <UploadDataDialog
        open={uploadDialogOpen}
        onClose={handleUploadDialogClose}
      />
    </>
  );
};

export default Navigation;
