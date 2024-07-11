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
import ToastNotification, { emitToast } from "@components/ToastNotification";

const AddHospitalDialog = ({ open, onClose, refresh }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    hospitalType: "",
    tehsil: { id: "", name: "" },
  });
  const [tehsilOptions, setTehsilOptions] = useState([]);

  useEffect(() => {
    if (open) {
      const fetchTehsilOptions = async () => {
        try {
          const response = await axios.get(
            import.meta.env.VITE_REACT_APP_BASEURL + "/tehsil/getIdAndName"
          );
          setTehsilOptions(response.data);
        } catch (error) {
          emitToast("Error fetching Tehsils Options", "error");
        }
      };
      fetchTehsilOptions();
    }
  }, [open]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleTehsilChange = (event, newValue) => {
    if (!newValue) {
      setFormData((prevData) => ({
        ...prevData,
        tehsil: { id: "", name: "" },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        tehsil: newValue,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        import.meta.env.VITE_REACT_APP_BASEURL + "/hospital/add",
        formData
      );
      setFormData({
        name: "",
        code: "",
        address: "",
        hospitalType: "",
        tehsil: { id: "", name: "" },
      });
      refresh();
      onClose();
      emitToast("Hospital Added Successfully", "success");
    } catch (error) {
      emitToast("Error adding new Hospital Record", "error");
    }
  };

  return (
    <>
      <ToastNotification />
      <Dialog open={open} onClose={onClose}>
        <Box sx={{ p: 2 }}>
          <DialogTitle variant="h3">Add Hospital</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
                <TextField
                  margin="dense"
                  name="code"
                  label="Code"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.code}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Autocomplete
                  fullWidth
                  disablePortal
                  id="hospital-type-autocomplete"
                  value={formData.hospitalType}
                  onChange={(event, newValue) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      hospitalType: newValue,
                    }));
                  }}
                  options={["Government", "Private"]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Hospital Type"
                      variant="outlined"
                    />
                  )}
                  gutterBottom
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  fullWidth
                  disablePortal
                  id="tehsil-autocomplete"
                  value={formData.tehsil}
                  onChange={handleTehsilChange}
                  options={tehsilOptions}
                  getOptionLabel={(option) => option.name || ""}
                  renderInput={(params) => (
                    <TextField {...params} label="Tehsil" variant="outlined" />
                  )}
                  gutterBottom
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  name="address"
                  label="Address"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.address}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
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

AddHospitalDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tehsilOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ),
  refresh: PropTypes.func.isRequired,
};

export default AddHospitalDialog;
