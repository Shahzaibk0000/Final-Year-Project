import { useState, useEffect, forwardRef } from "react";
import {
  Dialog,
  Autocomplete,
  TextField,
  Grid,
  Typography,
  Button,
  Box,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PropTypes from "prop-types";
import Slide from "@mui/material/Slide";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import axios from "axios";
import debounce from "lodash/debounce";
import { useUser } from "@context/UserContext";
import { userType } from "@utility";
import { useFormik } from "formik";
import * as Yup from "yup";
import ToastNotification, { emitToast } from "@components/ToastNotification";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UploadDataDialog = ({ open, onClose }) => {
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [tehsilOptions, setTehsilOptions] = useState([]);
  const [hospitalOptions, setHospitalOptions] = useState([]);
  const [diseaseOptions, setDiseaseOptions] = useState([]);
  const { user } = useUser();

  const fetchProvinces = debounce(async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL + "/province/getIdAndName"
      );
      setProvinceOptions(response.data);
    } catch (error) {
      emitToast("Error fetching Provinces options", "error");
    }
  }, 300);

  const fetchDivisions = debounce(async (provinceIds) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL +
          "/division/getDivisionsByProvinceIds",
        {
          params: { provinceIds: provinceIds.join(",") },
        }
      );
      setDivisionOptions(response.data);
    } catch (error) {
      emitToast("Error fetching Divisions options", "error");
    }
  }, 300);

  const fetchDistricts = debounce(async (divisionIds) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL +
          "/district/getDistrictsByDivisionIds",
        {
          params: { divisionIds: divisionIds.join(",") },
        }
      );
      setDistrictOptions(response.data);
    } catch (error) {
      emitToast("Error fetching Districts options", "error");
    }
  }, 300);

  const fetchTehsils = debounce(async (districtIds) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL +
          "/tehsil/getTehsilsByDistrictIds",
        {
          params: { districtIds: districtIds.join(",") },
        }
      );
      setTehsilOptions(response.data);
    } catch (error) {
      emitToast("Error fetching Tehsils options", "error");
    }
  }, 300);

  const fetchHospitals = debounce(async (tehsilIds) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL +
          "/hospital/getHospitalsByTehsilIds",
        {
          params: { tehsilIds: tehsilIds.join(",") },
        }
      );
      setHospitalOptions(response.data);
    } catch (error) {
      emitToast("Error fetching Hospitals options", "error");
    }
  }, 300);

  const fetchDisease = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL + "/disease/getIdAndName"
      );
      setDiseaseOptions(response.data);
    } catch (error) {
      emitToast("Error fetching Disease options", "error");
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      switch (user.usertype) {
        case userType.superAdmin:
          await fetchProvinces();
          break;
        case userType.provinceAdmin:
          await fetchDivisions([user.province.id]);
          break;
        case userType.divisionAdmin:
          await fetchDistricts([user.division.id]);
          break;
        case userType.districtAdmin:
          await fetchTehsils([user.district.id]);
          break;
        case userType.tehsilAdmin:
          await fetchHospitals([user.tehsil.id]);
          break;
        default:
          break;
      }
      await fetchDisease();
    };
    if (open) {
      fetchOptions();
    }
  }, [open]);

  const formik = useFormik({
    initialValues: {
      province: null,
      division: null,
      district: null,
      tehsil: null,
      hospital: null,
      disease: null,
      file: null,
    },
    validationSchema: Yup.object({
      province: Yup.object()
        .nullable()
        .when("user", {
          is: userType.superAdmin,
          then: Yup.object().nullable().required("Province is required"),
        }),
      division: Yup.object()
        .nullable()
        .when("user", {
          is: (value) =>
            [userType.superAdmin, userType.provinceAdmin].includes(value),
          then: Yup.object().nullable().required("Division is required"),
        }),
      district: Yup.object()
        .nullable()
        .when("user", {
          is: (value) =>
            [
              userType.superAdmin,
              userType.provinceAdmin,
              userType.divisionAdmin,
            ].includes(value),
          then: Yup.object().nullable().required("District is required"),
        }),
      tehsil: Yup.object()
        .nullable()
        .when("user", {
          is: (value) =>
            [
              userType.superAdmin,
              userType.provinceAdmin,
              userType.divisionAdmin,
              userType.districtAdmin,
            ].includes(value),
          then: Yup.object().nullable().required("Tehsil is required"),
        }),
      hospital: Yup.object().nullable().required("Hospital is required"),
      disease: Yup.object().nullable().required("Disease is required"),
      file: Yup.mixed().required("File is required"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("file", values.file);
      formData.append(
        "hospitalId",
        values.hospital.id != null ? values.hospital.id : user.hospital.id
      );
      formData.append("diseaseId", values.disease.id);

      axios
        .post(
          import.meta.env.VITE_REACT_APP_BASEURL + "/patient/upload",
          formData
        )
        .then((response) => {
          emitToast(response.data, "success");
          handleClose();
          //reload page
          window.location.reload();
        })
        .catch(() => {
          emitToast("Uploading Patient failed!", "error");
        });
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type !== "text/csv") {
      emitToast("Invalid file type. Please upload a CSV file.", "warning");
      return;
    }

    formik.setFieldValue("file", file);
  };

  const handleClose = () => {
    setProvinceOptions([]);
    setDivisionOptions([]);
    setDistrictOptions([]);
    setTehsilOptions([]);
    setHospitalOptions([]);
    setDiseaseOptions([]);
    formik.resetForm();
    onClose();
  };

  const handleProvinceChange = (event, newValue) => {
    formik.setFieldValue("province", newValue);
    if (newValue) {
      fetchDivisions([newValue.id]);
    } else {
      setDivisionOptions([]);
    }
    formik.setFieldValue("division", null);
    formik.setFieldValue("district", null);
    formik.setFieldValue("tehsil", null);
    formik.setFieldValue("hospital", null);
  };

  const handleDivisionChange = (event, newValue) => {
    formik.setFieldValue("division", newValue);
    if (newValue) {
      fetchDistricts([newValue.id]);
    } else {
      setDistrictOptions([]);
    }
    formik.setFieldValue("district", null);
    formik.setFieldValue("tehsil", null);
    formik.setFieldValue("hospital", null);
  };

  const handleDistrictChange = (event, newValue) => {
    formik.setFieldValue("district", newValue);
    if (newValue) {
      fetchTehsils([newValue.id]);
    } else {
      setTehsilOptions([]);
    }
    formik.setFieldValue("tehsil", null);
    formik.setFieldValue("hospital", null);
  };

  const handleTehsilChange = (event, newValue) => {
    formik.setFieldValue("tehsil", newValue);
    if (newValue) {
      fetchHospitals([newValue.id]);
    } else {
      setHospitalOptions([]);
    }
    formik.setFieldValue("hospital", null);
  };

  const handleHospitalChange = (event, newValue) => {
    formik.setFieldValue("hospital", newValue);
  };

  const handleDiseaseChange = (event, newValue) => {
    formik.setFieldValue("disease", newValue);
  };

  const renderAutocomplete = (
    label,
    options,
    value,
    onChange,
    disabled = false,
    error,
    touched
  ) => (
    <Grid item xs={12} md={4}>
      <Autocomplete
        disablePortal
        options={options}
        value={value}
        onChange={onChange}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={error && touched}
            helperText={error && touched ? error : ""}
            fullWidth
            variant="outlined"
          />
        )}
        disabled={disabled}
      />
    </Grid>
  );

  return (
    <>
      <ToastNotification />
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        TransitionComponent={Transition}
      >
        <Box sx={{ p: 2 }}>
          <DialogTitle variant="h3" sx={{ mb: 0 }}>
            Upload Data
          </DialogTitle>
          <DialogContent sx={{ mb: 0 }}>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {user.usertype === userType.superAdmin &&
                  renderAutocomplete(
                    "Province",
                    provinceOptions,
                    formik.values.province,
                    handleProvinceChange,
                    false,
                    formik.errors.province,
                    formik.touched.province
                  )}
                {(user.usertype === userType.superAdmin ||
                  user.usertype === userType.provinceAdmin) &&
                  renderAutocomplete(
                    "Division",
                    divisionOptions,
                    formik.values.division,
                    handleDivisionChange,
                    !formik.values.province &&
                      user.usertype === userType.superAdmin,
                    formik.errors.division,
                    formik.touched.division
                  )}
                {(user.usertype === userType.superAdmin ||
                  user.usertype === userType.provinceAdmin ||
                  user.usertype === userType.divisionAdmin) &&
                  renderAutocomplete(
                    "District",
                    districtOptions,
                    formik.values.district,
                    handleDistrictChange,
                    !formik.values.division &&
                      (user.usertype === userType.superAdmin ||
                        user.usertype === userType.provinceAdmin),
                    formik.errors.district,
                    formik.touched.district
                  )}
                {(user.usertype === userType.superAdmin ||
                  user.usertype === userType.provinceAdmin ||
                  user.usertype === userType.divisionAdmin ||
                  user.usertype === userType.districtAdmin) &&
                  renderAutocomplete(
                    "Tehsil",
                    tehsilOptions,
                    formik.values.tehsil,
                    handleTehsilChange,
                    !formik.values.district &&
                      (user.usertype === userType.superAdmin ||
                        user.usertype === userType.provinceAdmin ||
                        user.usertype === userType.divisionAdmin),
                    formik.errors.tehsil,
                    formik.touched.tehsil
                  )}
                {(user.usertype === userType.superAdmin ||
                  user.usertype === userType.provinceAdmin ||
                  user.usertype === userType.divisionAdmin ||
                  user.usertype === userType.districtAdmin ||
                  user.usertype === userType.tehsilAdmin) &&
                  renderAutocomplete(
                    "Hospital",
                    hospitalOptions,
                    formik.values.hospital,
                    handleHospitalChange,
                    !formik.values.tehsil &&
                      (user.usertype === userType.superAdmin ||
                        user.usertype === userType.provinceAdmin ||
                        user.usertype === userType.divisionAdmin ||
                        user.usertype === userType.districtAdmin),
                    formik.errors.hospital,
                    formik.touched.hospital
                  )}
                {renderAutocomplete(
                  "Disease",
                  diseaseOptions,
                  formik.values.disease,
                  handleDiseaseChange,
                  false,
                  formik.errors.disease,
                  formik.touched.disease
                )}
                <Grid item xs={12}>
                  <Box
                    border={2}
                    borderColor="primary.main"
                    borderRadius={2}
                    padding={4}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    bgcolor="grey.100"
                    sx={{
                      cursor: "pointer",
                      minHeight: "200px",
                      borderStyle: "dashed",
                      borderWidth: "2px",
                      borderColor: "black",
                    }}
                    onClick={() => {
                      if (formik.values.file == null)
                        document.getElementById("file-upload-input").click();
                    }}
                  >
                    <CloudUploadIcon
                      style={{ fontSize: 60, color: "primary.main" }}
                    />
                    <Typography variant="h6" style={{ marginTop: 16 }}>
                      Drop file here or click to browse through your machine
                    </Typography>
                    {formik.values.file == null && (
                      <input
                        type="file"
                        id="file-upload-input"
                        hidden
                        onChange={handleFileChange}
                      />
                    )}
                  </Box>
                  {formik.values.file && (
                    <Box mt={2}>
                      <Box
                        display="flex"
                        alignItems="center"
                        border={1}
                        borderColor="black"
                        borderRadius={2}
                        padding={1}
                      >
                        <UploadFileIcon sx={{ marginRight: 1, fontSize: 30 }} />
                        <Box>
                          <Typography variant="h5" fontWeight="bold">
                            {formik.values.file.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ marginRight: 1, fontSize: 16 }}
                          >
                            {formik.values.file.type}
                          </Typography>
                        </Box>
                        <Button
                          onClick={() => formik.setFieldValue("file", null)}
                          variant="text"
                          color="error"
                          sx={{ marginLeft: "auto" }}
                        >
                          <DeleteIcon />
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Grid>
              </Grid>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button type="submit" color="primary" variant="contained">
                  Upload
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};

UploadDataDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UploadDataDialog;
