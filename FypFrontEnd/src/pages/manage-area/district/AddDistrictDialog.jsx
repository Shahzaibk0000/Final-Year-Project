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
  Slide,
} from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";

const AddDistrictDialog = ({ open, onClose, refresh }) => {
  const [divisionOptions, setDivisionOptions] = useState([]);

  useEffect(() => {
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
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      division: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      division: Yup.object()
        .required("Division is required")
        .shape({
          id: Yup.string().required("Division ID is required"),
          name: Yup.string().required("Division name is required"),
        }),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post(
          import.meta.env.VITE_REACT_APP_BASEURL + "/district/add",
          values
        );
        formik.resetForm();
        refresh();
        onClose();
      } catch (error) {
        console.error("Error creating district:", error);
      }
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={(props) => <Slide direction="up" {...props} />}
    >
      <Box sx={{ p: 2 }}>
        <DialogTitle variant="h3">Add District</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  name="name"
                  label="Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  fullWidth
                  disablePortal
                  id="division-autocomplete"
                  value={formik.values.division}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("division", newValue);
                  }}
                  onBlur={() => formik.setFieldTouched("division", true)}
                  options={divisionOptions}
                  getOptionLabel={(option) => option.name || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Division"
                      variant="outlined"
                      error={
                        formik.touched.division &&
                        Boolean(formik.errors.division)
                      }
                      helperText={
                        formik.touched.division &&
                        (formik.errors.division?.name || formik.errors.division)
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={formik.handleSubmit}
            disabled={!formik.dirty || !formik.isValid}
          >
            Add
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

AddDistrictDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
};

export default AddDistrictDialog;
