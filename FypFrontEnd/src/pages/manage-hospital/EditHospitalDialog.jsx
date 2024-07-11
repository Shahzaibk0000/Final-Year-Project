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
import ToastNotification, { emitToast } from "@components/ToastNotification";

const EditHospitalDialog = ({ open, onClose, hospital, refresh }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    code: "",
    address: "",
    hospitalType: "",
    tehsil: { id: "", name: "" },
  });
  const [tehsilOptions, setTehsilOptions] = useState([]);

  useEffect(() => {
    if (open) {
      if (hospital) {
        setFormData({
          id: hospital.id,
          name: hospital.name,
          code: hospital.code,
          address: hospital.address,
          hospitalType: hospital.hospitalType,
          tehsil: hospital.tehsil,
        });
      }
      const fetchTehsilOptions = async () => {
        try {
          const response = await axios.get(
            import.meta.env.VITE_REACT_APP_BASEURL + "/tehsil/getIdAndName"
          );
          setTehsilOptions(response.data);
        } catch (error) {
          emitToast("Error fetching Tehsil Options", "error");
        }
      };
      fetchTehsilOptions();
    }
  }, [open]);

  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleTehsilChange = (event, newValue) => {
    if (newValue) {
      setFormData((prevData) => ({
        ...prevData,
        tehsil: { id: newValue.id, name: newValue.name },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        tehsil: null,
      }));
    }
  };

  const handleSubmit = async () => {
    const submitData = {
      id: formData.id,
      name: formData.name,
      code: formData.code,
      address: formData.address,
      hospitalType: formData.hospitalType,
      tehsil: { id: formData.tehsil.id },
    };
    try {
      await axios.put(
        import.meta.env.VITE_REACT_APP_BASEURL + "/hospital/update",
        submitData
      );
      onClose();
      refresh();
    } catch (error) {
      emitToast("Error updating Hospital record", "error");
    }
  };

  return (
    <>
      <ToastNotification />

      <Dialog open={open} onClose={onClose}>
        <Box sx={{ p: 2 }}>
          <DialogTitle variant="h3">Edit Hospital</DialogTitle>
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
                  onChange={(e) => handleInputChange(e, "name")}
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
                  onChange={(e) => handleInputChange(e, "code")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  fullWidth
                  disablePortal
                  id="hospital-type-autocomplete"
                  value={formData.hospitalType || ""}
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
                  onChange={(e) => handleInputChange(e, "address")}
                  multiline
                  rows={3}
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
    </>
  );
};

EditHospitalDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  hospital: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    code: PropTypes.string,
    address: PropTypes.string,
    hospitalType: PropTypes.oneOf(["Government", "Private"]),
    tehsil: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  }),
  refresh: PropTypes.func.isRequired,
};

export default EditHospitalDialog;
