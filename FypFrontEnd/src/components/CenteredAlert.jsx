import PropTypes from "prop-types"; // Import PropTypes
import { Box, Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

const CenteredAlert = ({ title, color = "red" }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "54vh",
        width: "100%",
        backgroundColor: "transparent",
      }}
    >
      <WarningIcon sx={{ fontSize: 150, color: color }} />
      <Typography variant="h4" mt={2} sx={{ textAlign: "center" }}>
        {title}
      </Typography>
    </Box>
  );
};

// Add PropTypes validation
CenteredAlert.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
};

export default CenteredAlert;
