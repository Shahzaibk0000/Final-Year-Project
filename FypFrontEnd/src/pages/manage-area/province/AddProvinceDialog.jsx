import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Grid,
} from "@mui/material";
import PropTypes from "prop-types";
import axios from "axios";

function AddProvinceDialog({ open, onClose, refresh }) {
  const [formData, setFormData] = useState({
    name: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        import.meta.env.VITE_REACT_APP_BASEURL + "/province/add",
        formData
      );
      refresh();
      onClose();
    } catch (error) {
      console.error("Error creating province:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <DialogTitle variant="h3">Add New Province</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Province Name */}
            <Grid item xs={12}>
              <TextField
                margin="dense"
                value={formData.name}
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleChange}
                name="name"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Confirm
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

AddProvinceDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
};

export default AddProvinceDialog;
