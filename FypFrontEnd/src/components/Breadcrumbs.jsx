import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Grid,
  Typography,
  Link,
} from "@mui/material";
import CustomCard from "./CustomCard";

const Breadcrumbs = ({ pageinfo }) => {
  const location = useLocation();
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

  const matchUrl = (url, pathname) => {
    const dynamicSegmentRegex = /:[^\s/]+/g;
    const regex = new RegExp(`^${url.replace(dynamicSegmentRegex, "[^/]+")}$`);
    return regex.test(pathname);
  };

  const findBreadcrumbItems = (pages, pathname, breadcrumbTrail = []) => {
    for (const item of pages) {
      if (matchUrl(item.url, pathname)) {
        breadcrumbTrail.push(item);
        if (item.children) {
          findBreadcrumbItems(item.children, pathname, breadcrumbTrail);
        }
        break;
      } else if (pathname.startsWith(item.url) && item.url !== "/") {
        breadcrumbTrail.push(item);
        if (item.children) {
          findBreadcrumbItems(item.children, pathname, breadcrumbTrail);
        }
      }
    }
    return breadcrumbTrail;
  };

  useEffect(() => {
    const breadcrumbTrail = findBreadcrumbItems(pageinfo, location.pathname);
    setBreadcrumbItems(breadcrumbTrail);
  }, [location.pathname, pageinfo]);

  let breadcrumbContent;

  if (breadcrumbItems.length > 0) {
    breadcrumbContent = (
      <CustomCard
        border={false}
        sx={{ mb: 3, bgcolor: "transparent" }}
        content={false}
      >
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={1}
        >
          <Grid item>
            <MuiBreadcrumbs aria-label="breadcrumb">
              <Link
                component={RouterLink}
                to="/"
                color="textSecondary"
                variant="h6"
                sx={{ textDecoration: "none" }}
              >
                Home
              </Link>
              {breadcrumbItems.map((item, index) => (
                <Typography
                  key={item.id}
                  component={RouterLink}
                  to={item.url}
                  variant="h6"
                  sx={{
                    textDecoration: "none",
                    fontWeight:
                      index === breadcrumbItems.length - 1 ? "bold" : "normal",
                    color:
                      index === breadcrumbItems.length - 1
                        ? "black"
                        : "textSecondary",
                  }}
                >
                  {item.title}
                </Typography>
              ))}
            </MuiBreadcrumbs>
          </Grid>
        </Grid>
      </CustomCard>
    );
  }

  return breadcrumbContent;
};

Breadcrumbs.propTypes = {
  pageinfo: PropTypes.array.isRequired,
};

export default Breadcrumbs;
