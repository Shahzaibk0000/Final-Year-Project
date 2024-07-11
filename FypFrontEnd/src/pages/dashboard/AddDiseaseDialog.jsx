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
import axios from "axios";
// eslint-disable-next-line react/prop-types
function AddDiseaseDialog({ open, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    symptoms: "",
    causes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    axios
      .post(import.meta.env.VITE_REACT_APP_BASEURL + "/disease/add", formData)
      .then((response) => {
        console.log("Data sent successfully", response.data);
        onClose();
      })
      .catch((error) => {
        console.error("Error sending data", error);
      });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <DialogTitle variant="h3">Add New Disease</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                name="description"
                label="Description"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                name="symptoms"
                label="Symptoms"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="causes"
                label="Causes"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                onChange={handleChange}
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

export default AddDiseaseDialog;
