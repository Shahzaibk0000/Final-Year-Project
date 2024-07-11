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
  Slide,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import PropTypes from "prop-types";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  symptoms: Yup.string().required("Symptoms are required"),
  causes: Yup.string().required("Causes are required"),
});

function EditDiseaseDialog({ open, onClose, disease, refresh }) {
  const [formData] = useState({
    id: disease.id || null,
    name: disease.name || "",
    description: disease.description || "",
    symptoms: disease.symptoms || "",
    causes: disease.causes || "",
  });

  const handleSubmit = async (values) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_BASEURL}/disease/update`,
        values
      );
      console.log("Data updated successfully");
      refresh();
      onClose();
    } catch (error) {
      console.error("Error updating data", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Slide}>
      <Formik
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched }) => (
          <Form>
            <Box sx={{ p: 2 }}>
              <DialogTitle variant="h3">Edit Disease</DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 0 }}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      autoFocus
                      name="name"
                      label="Name"
                      type="text"
                      fullWidth
                      variant="outlined"
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      name="description"
                      label="Description"
                      multiline
                      rows={4}
                      fullWidth
                      variant="outlined"
                      error={touched.description && Boolean(errors.description)}
                      helperText={touched.description && errors.description}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      name="symptoms"
                      label="Symptoms"
                      multiline
                      rows={4}
                      fullWidth
                      variant="outlined"
                      error={touched.symptoms && Boolean(errors.symptoms)}
                      helperText={touched.symptoms && errors.symptoms}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="causes"
                      label="Causes"
                      multiline
                      rows={4}
                      fullWidth
                      variant="outlined"
                      error={touched.causes && Boolean(errors.causes)}
                      helperText={touched.causes && errors.causes}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" type="submit">
                  Confirm
                </Button>
              </DialogActions>
            </Box>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}

EditDiseaseDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  disease: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    symptoms: PropTypes.string,
    causes: PropTypes.string,
  }).isRequired,
  refresh: PropTypes.func.isRequired,
};

export default EditDiseaseDialog;
