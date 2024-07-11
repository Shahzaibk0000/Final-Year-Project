import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import CustomCard from "./CustomCard";

const PDataCard = ({ title, count, IconComponent }) => {
  return (
    <CustomCard contentSX={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <Box>
          <Typography variant="h5" color="textSecondary">
            {title}
          </Typography>
          <Typography variant="h3" color="inherit" sx={{ mt: 1 }}>
            {count}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconComponent sx={{ fontSize: 60 }} />
        </Box>
      </Box>
    </CustomCard>
  );
};

PDataCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.string.isRequired,
  IconComponent: PropTypes.elementType.isRequired,
};

export default PDataCard;
