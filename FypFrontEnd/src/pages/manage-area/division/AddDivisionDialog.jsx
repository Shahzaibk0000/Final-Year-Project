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

const AddDivisionDialog = ({ open, onClose, refresh }) => {
  const [formData, setFormData] = useState({
    name: "",
    province: null,
  });
  const [provinceOptions, setProvinceOptions] = useState([]);

  useEffect(() => {
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
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleProvinceChange = (event, newValue) => {
    if (!newValue) {
      setFormData((prevData) => ({
        ...prevData,
        province: { id: "", name: "" },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        province: newValue,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        import.meta.env.VITE_REACT_APP_BASEURL + "/division/add",
        formData
      );
      setFormData({
        name: "",
        province: { id: "", name: "" },
      });
      refresh();
      onClose();
    } catch (error) {
      console.error("Error creating division:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <Box sx={{ p: 2 }}>
          <DialogTitle variant="h3">Add Division</DialogTitle>
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
                  id="province-autocomplete"
                  value={formData.province}
                  onChange={handleProvinceChange}
                  options={provinceOptions}
                  getOptionLabel={(option) => option.name || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Province"
                      variant="outlined"
                    />
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
    </>
  );
};

AddDivisionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
};

export default AddDivisionDialog;
