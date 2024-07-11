import PropTypes from "prop-types";
import { forwardRef } from "react";
import { useTheme } from "@mui/material/styles";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";

const CustomCard = forwardRef(function CustomCard(
  {
    border = true,
    boxShadow,
    children,
    content = true,
    contentSX = {},
    darkTitle,
    elevation,
    secondary,
    shadow,
    sx = {},
    title,
    ...others
  },
  ref
) {
  const theme = useTheme();
  boxShadow = theme.palette.mode === "dark" ? boxShadow || true : boxShadow;

  return (
    <Card
      elevation={elevation || 0}
      ref={ref}
      {...others}
      sx={{
        border: border ? "1px solid" : "none",
        borderRadius: 2,
        borderColor:
          theme.palette.mode === "dark"
            ? theme.palette.divider
            : theme.palette.grey.A800,
        boxShadow:
          boxShadow && (!border || theme.palette.mode === "dark")
            ? shadow || theme.customShadows.z1
            : "inherit",
        ":hover": {
          boxShadow: boxShadow ? shadow || theme.customShadows.z1 : "inherit",
        },
        "& pre": {
          m: 0,
          p: "16px !important",
          fontFamily: theme.typography.fontFamily,
          fontSize: "0.75rem",
        },
        ...sx,
      }}
    >
      {!darkTitle && title && (
        <CardHeader
          sx={{
            p: 2.5,
            "& .MuiCardHeader-action": { m: "0px auto", alignSelf: "center" },
          }}
          titleTypographyProps={{ variant: "subtitle1" }}
          title={title}
          action={secondary}
        />
      )}
      {darkTitle && title && (
        <CardHeader
          sx={{
            p: 2.5,
            "& .MuiCardHeader-action": { m: "0px auto", alignSelf: "center" },
          }}
          title={<Typography variant="h3">{title}</Typography>}
          action={secondary}
        />
      )}

      {content && <CardContent sx={contentSX}>{children}</CardContent>}
      {!content && children}
    </Card>
  );
});

CustomCard.displayName = "CustomCard";

CustomCard.propTypes = {
  border: PropTypes.bool,
  boxShadow: PropTypes.bool,
  contentSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  elevation: PropTypes.number,
  secondary: PropTypes.node,
  shadow: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  content: PropTypes.bool,
  children: PropTypes.node,
};

export default CustomCard;
