import { useState, useEffect } from "react";
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

function EditProvinceDialog({ open, onClose, province, refresh }) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
  });

  useEffect(() => {
    if (province) {
      setFormData({
        id: province.id,
        name: province.name,
      });
    }
  }, [province]);

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        import.meta.env.VITE_REACT_APP_BASEURL + "/province/update",
        formData
      );
      refresh();
      onClose();
    } catch (error) {
      console.error("Error updating province:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <DialogTitle variant="h3">Edit Province</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Province Name */}
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={handleChange}
                name="name"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Update
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

EditProvinceDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  province: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
};

export default EditProvinceDialog;
