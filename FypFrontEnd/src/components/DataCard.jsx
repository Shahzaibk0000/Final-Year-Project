import PropTypes from "prop-types";
import { Box, Chip, Grid, Stack, Typography } from "@mui/material";
import CustomCard from "./CustomCard";

const DataCard = ({
  title,
  count,
  percentage,
  IconComponent,
  summarytitle,
  summary,
}) => {
  const isRate = percentage < 50;
  const chipColor = isRate ? "error" : "primary";

  return (
    <CustomCard contentSX={{ p: 2.25 }}>
      <Stack spacing={0.5}>
        <Typography variant="h6" color="textSecondary">
          {title}
        </Typography>
        <Grid container alignItems="center">
          <Grid item>
            <Typography variant="h4" color="inherit">
              {count}
            </Typography>
          </Grid>
          {percentage !== undefined && (
            <Grid item>
              <Chip
                variant="combined"
                color={chipColor}
                icon={<IconComponent sx={{ fontsize: 1 }} />}
                label={`${percentage}%`}
                sx={{
                  ml: 1.25,
                  pl: 1,
                }}
                size="small"
              />
            </Grid>
          )}
        </Grid>
      </Stack>

      <Box sx={{ pt: 2.25, display: "flex", alignItems: "center" }}>
        <Typography variant="caption" color="black">
          <Typography variant="caption" color="black" sx={{ fontWeight: 900 }}>
            {`${summarytitle} `}
          </Typography>
          {summary}
        </Typography>
      </Box>
    </CustomCard>
  );
};

DataCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  percentage: PropTypes.number,
  IconComponent: PropTypes.elementType.isRequired,
  summarytitle: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
};

export default DataCard;
