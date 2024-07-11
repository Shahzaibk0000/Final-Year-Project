import PropTypes from "prop-types";
import { Box, Grid, Stack, Typography } from "@mui/material";
import CustomCard from "./CustomCard";

const ResourcesDataCard = ({ title, count, IconComponent }) => {
  return (
    <CustomCard
      contentSX={{
        p: 2.25,
        height: "100%",
      }}
    >
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Stack spacing={0.5}>
            <Typography variant="h6" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="h3" color="inherit">
              {count}
            </Typography>
          </Stack>
        </Grid>
        <Grid item>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 70,
              height: 70, // Increase the height to make the icon larger
              borderRadius: "50%",
              bgcolor: "grey.50",
            }}
          >
            <IconComponent sx={{ fontSize: 40, color: "rgb(22, 119, 255)" }} />
            {/* Increase the font size */}
          </Box>
        </Grid>
      </Grid>
    </CustomCard>
  );
};

ResourcesDataCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  IconComponent: PropTypes.elementType.isRequired,
  iconColor: PropTypes.string.isRequired, // Define iconColor prop as a string
};

export default ResourcesDataCard;
