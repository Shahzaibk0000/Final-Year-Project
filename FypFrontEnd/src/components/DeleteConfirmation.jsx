import PropTypes from "prop-types";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
} from "@mui/material";
import { forwardRef } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { red, grey } from "@mui/material/colors";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteConfirmation = ({ open, onClose, onDelete }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-labelledby="delete-confirmation-dialog-title"
      aria-describedby="delete-confirmation-dialog-description"
      sx={{
        "& .MuiDialog-paper": {
          minWidth: "250px",
          maxWidth: "500px",
          width: "80%",
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center" }}>
        <HighlightOffIcon style={{ fontSize: 110, color: red[500] }} />
      </DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Container style={{ textAlign: "center" }}>
          <Typography variant="h2" align="center">
            Are you sure?
          </Typography>
          <Typography variant="body1" align="center">
            Do you really want to delete this record?
          </Typography>
          <Typography variant="body1" align="center">
            This process cannot be undone
          </Typography>
        </Container>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            width: "8rem",
            marginRight: 1,
            backgroundColor: grey[500],
            color: "#fff",
            mb: 2,
            "&:hover": {
              boxShadow:
                "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
              backgroundColor: grey[500],
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onDelete}
          variant="contained"
          sx={{
            width: "8rem",
            backgroundColor: red[500],
            color: "#fff",
            mb: 2,
            "&:hover": {
              boxShadow:
                "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
              backgroundColor: red[500],
            },
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteConfirmation.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteConfirmation;
