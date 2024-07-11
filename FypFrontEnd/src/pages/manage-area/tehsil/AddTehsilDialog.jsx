import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Grid,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";

const AddTehsilDialog = ({ open, onClose, refresh }) => {
  const [formData, setFormData] = useState({
    name: "",
    district: null,
  });
  const [districtOptions, setDistrictOptions] = useState([
    { id: "", name: "" },
  ]);

  useEffect(() => {
    const fetchDistrictOptions = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_REACT_APP_BASEURL + "/district/getIdAndName"
        );
        setDistrictOptions(response.data);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };
    fetchDistrictOptions();
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleDistrictChange = (event, newValue) => {
    if (!newValue) {
      setFormData((prevData) => ({
        ...prevData,
        district: { id: "", name: "" },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        district: newValue,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        import.meta.env.VITE_REACT_APP_BASEURL + "/tehsil/add",
        formData
      );
      setFormData({
        name: "",
        district: { id: "", name: "" },
      });
      refresh();
      onClose();
    } catch (error) {
      console.error("Error creating tehsil:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <DialogTitle variant="h3">Add Tehsil</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="name"
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                disablePortal
                id="district-autocomplete"
                value={formData.district}
                onChange={handleDistrictChange}
                options={districtOptions}
                getOptionLabel={(option) => option.name || ""}
                renderInput={(params) => (
                  <TextField {...params} label="District" variant="outlined" />
                )}
                gutterBottom
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Add
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

AddTehsilDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
};

export default AddTehsilDialog;
