/* eslint-disable react/prop-types */
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import {
  ArrowRight as ArrowRightIcon,
  ArrowLeft as ArrowLeftIcon,
} from "@mui/icons-material";

const MyStyledButton = styled(Button)(() => ({
  color: "white",
  borderRadius: "0px 8px 8px 0px",
  padding: "0px",
  minWidth: "1rem",
  width: "1.1rem",
  height: "40vh",
  position: "fixed",
  left: 0,
  top: "50%",
  transform: "translateY(-50%)",
  transition: "left 0.3s ease-in-out",
  zIndex: 1000,
}));

export default function CustomButton({ onButtonClick, buttonOpen }) {
  return (
    <MyStyledButton
      open={buttonOpen}
      variant="contained"
      onClick={onButtonClick}
    >
      {buttonOpen ? (
        <ArrowLeftIcon sx={{ fontSize: 34, color: "white" }} />
      ) : (
        <ArrowRightIcon sx={{ fontSize: 34, color: "white" }} />
      )}
    </MyStyledButton>
  );
}
