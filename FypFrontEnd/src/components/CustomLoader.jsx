/* eslint-disable react/display-name */
import { Suspense } from "react";
import { styled } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";

const BarStyler = styled("div")(({ theme }) => ({
  "& > * + *": {
    marginTop: theme.spacing(2),
  },
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 4000,
  width: "100%",
}));

const TopLoaderBar = () => (
  <BarStyler>
    <LinearProgress color="primary" sx={{ height: 6, borderRadius: 100 }} />
  </BarStyler>
);

const CustomLoader = (Component) => (props) =>
  (
    <Suspense fallback={<TopLoaderBar />}>
      <Component {...props} />
    </Suspense>
  );

export default CustomLoader;
