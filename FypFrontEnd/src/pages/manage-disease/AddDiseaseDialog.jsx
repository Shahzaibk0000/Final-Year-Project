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

function AddDiseaseDialog({ open, onClose, refresh }) {
  const [formData] = useState({
    name: "",
    description: "",
    symptoms: "",
    causes: "",
  });

  const handleSubmit = (values, setSubmitting) => {
    axios
      .post(import.meta.env.VITE_REACT_APP_BASEURL + "/disease/add", values)
      .then((response) => {
        console.log("Data sent successfully", response.data);
        onClose();
      })
      .catch((error) => {
        console.error("Error sending data", error);
      })
      .finally(() => {
        refresh();
        setSubmitting(false);
      });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Slide}
      TransitionProps={{ direction: "up" }}
    >
      <Formik
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values, setSubmitting);
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Box sx={{ p: 2 }}>
              <DialogTitle variant="h3">Add New Disease</DialogTitle>
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
                <Button onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                >
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

AddDiseaseDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
};

export default AddDiseaseDialog;
