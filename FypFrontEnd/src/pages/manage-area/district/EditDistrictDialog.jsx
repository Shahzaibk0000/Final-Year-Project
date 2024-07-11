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
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";

const EditDistrictDialog = ({ open, onClose, district, refresh }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    division: { id: "", name: "" },
  });
  const [divisionOptions, setDivisionOptions] = useState([]);

  useEffect(() => {
    if (district) {
      setFormData({
        id: district.id,
        name: district.name,
        division: district.division,
      });
    }
    const fetchDivisionOptions = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_REACT_APP_BASEURL + "/division/getIdAndName"
        );
        setDivisionOptions(response.data);
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    };
    fetchDivisionOptions();
  }, [district]);

  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleDivisionChange = (event, newValue) => {
    if (newValue) {
      setFormData((prevData) => ({
        ...prevData,
        division: newValue,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        division: { id: "", name: "" },
      }));
    }
  };

  const handleSubmit = async () => {
    const submitData = {
      id: formData.id,
      name: formData.name,
      division: { id: formData.division.id },
    };
    try {
      await axios.put(
        import.meta.env.VITE_REACT_APP_BASEURL + "/district/update",
        submitData
      );
      onClose();
      refresh();
    } catch (error) {
      console.error("Error updating district:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <DialogTitle variant="h3">Edit District</DialogTitle>
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
                onChange={(e) => handleInputChange(e, "name")}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                disablePortal
                id="division-autocomplete"
                value={formData.division}
                onChange={handleDivisionChange}
                options={divisionOptions}
                getOptionLabel={(option) => option.name || ""}
                renderInput={(params) => (
                  <TextField {...params} label="Division" variant="outlined" />
                )}
                gutterBottom
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
};

EditDistrictDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  district: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    division: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  }),
  refresh: PropTypes.func.isRequired,
};

export default EditDistrictDialog;
