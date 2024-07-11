import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";

const Overlay = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  zIndex: 4000,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  pointerEvents: "auto",
});

const OverLayLoader = ({ loading, children }) => {
  return (
    <>
      {loading && (
        <Overlay>
          <CircularProgress color="primary" />
        </Overlay>
      )}
      {children}
    </>
  );
};
OverLayLoader.propTypes = {
  loading: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

export default OverLayLoader;
