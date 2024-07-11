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

const EditDivisionDialog = ({ open, onClose, division, refresh }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    province: { id: "", name: "" },
  });
  const [provinceOptions, setProvinceOptions] = useState([]);

  useEffect(() => {
    if (division) {
      setFormData({
        id: division.id,
        name: division.name,
        province: division.province,
      });
    }
    const fetchProvinceOptions = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_REACT_APP_BASEURL + "/province/getIdAndName"
        );
        setProvinceOptions(response.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinceOptions();
  }, [division]);

  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleProvinceChange = (event, newValue) => {
    if (newValue) {
      setFormData((prevData) => ({
        ...prevData,
        province: newValue,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        province: { id: "", name: "" },
      }));
    }
  };

  const handleSubmit = async () => {
    const submitData = {
      id: formData.id,
      name: formData.name,
      province: { id: formData.province.id },
    };
    try {
      await axios.put(
        import.meta.env.VITE_REACT_APP_BASEURL + "/division/update",
        submitData
      );
      onClose();
      refresh();
    } catch (error) {
      console.error("Error updating division:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <DialogTitle variant="h3">Edit Division</DialogTitle>
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
                id="province-autocomplete"
                value={formData.province}
                onChange={handleProvinceChange}
                options={provinceOptions}
                getOptionLabel={(option) => option.name || ""}
                renderInput={(params) => (
                  <TextField {...params} label="Province" variant="outlined" />
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

EditDivisionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  division: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    province: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  }),
  refresh: PropTypes.func.isRequired,
};

export default EditDivisionDialog;
