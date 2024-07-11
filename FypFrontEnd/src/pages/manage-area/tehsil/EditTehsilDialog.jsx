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

const EditTehsilDialog = ({ open, onClose, tehsil, refresh }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    district: { id: "", name: "" },
  });
  const [districtOptions, setDistrictOptions] = useState([]);

  useEffect(() => {
    if (tehsil) {
      setFormData({
        id: tehsil.id,
        name: tehsil.name,
        district: tehsil.district,
      });
    }
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
  }, [tehsil]);

  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleDistrictChange = (event, newValue) => {
    if (newValue) {
      setFormData((prevData) => ({
        ...prevData,
        district: newValue,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        district: { id: "", name: "" },
      }));
    }
  };

  const handleSubmit = async () => {
    const submitData = {
      id: formData.id,
      name: formData.name,
      district: { id: formData.district.id },
    };
    try {
      await axios.put(
        import.meta.env.VITE_REACT_APP_BASEURL + "/tehsil/update",
        submitData
      );
      onClose();
      refresh();
    } catch (error) {
      console.error("Error updating tehsil:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <DialogTitle variant="h3">Edit Tehsil</DialogTitle>
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
            Update
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

EditTehsilDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tehsil: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    district: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  }),
  refresh: PropTypes.func.isRequired,
};

export default EditTehsilDialog;
