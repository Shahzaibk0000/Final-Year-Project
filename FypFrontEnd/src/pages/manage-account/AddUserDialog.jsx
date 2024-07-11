import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
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
  IconButton,
  InputAdornment,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import defaultProfilePicture from "@assets/images/default-avatar.jpg";
import { getPictureBase64, fetchImageAsBlob } from "@utility";
const AddUserDialog = ({ open, onClose, refresh }) => {
  const initialState = useMemo(
    () => ({
      firstName: "",
      lastName: "",
      cnic: "",
      email: "",
      contact: "",
      password: "",
      usertype: "Super Administrator",
      tehsil: { id: "", name: "" },
      division: { id: "", name: "" },
      district: { id: "", name: "" },
      province: { id: "", name: "" },
      hospital: { id: "", name: "" },
      profilePicture: defaultProfilePicture.split(",")[1],
    }),
    []
  );

  const [formData, setFormData] = useState({ ...initialState });
  const [showPassword, setShowPassword] = useState(false);
  const [areaOptions, setAreaOptions] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [tehsilOptions, setTehsilOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [hospitalOptions, setHospitalOptions] = useState([]);
  const [profilePicturePreview, setProfilePicturePreview] = useState(
    defaultProfilePicture
  );
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [newProfilePictureName, setNewProfilePictureName] = useState(null);

  useEffect(() => {
    const initializeProfilePicture = async () => {
      try {
        const blob = await fetchImageAsBlob(defaultProfilePicture);
        const base64Image = await getPictureBase64(blob);
        setFormData((prevData) => ({
          ...prevData,
          profilePicture: base64Image,
        }));
      } catch (error) {
        console.error("Error converting default profile picture:", error);
      }
    };
    const fetchOptions = async () => {
      try {
        const endpoints = [
          "tehsil/getIdAndName",
          "division/getIdAndName",
          "district/getIdAndName",
          "province/getIdAndName",
          "hospital/getIdAndName",
        ];

        const [
          tehsilData,
          divisionData,
          districtData,
          provinceData,
          hospitalData,
        ] = await Promise.all(
          endpoints.map((endpoint) =>
            axios.get(import.meta.env.VITE_REACT_APP_BASEURL + "/" + endpoint)
          )
        );

        setTehsilOptions(tehsilData.data);
        setDivisionOptions(divisionData.data);
        setDistrictOptions(districtData.data);
        setProvinceOptions(provinceData.data);
        setHospitalOptions(hospitalData.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    if (open) {
      initializeProfilePicture();
      fetchOptions();
    }
  }, [open]);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleProfilePictureChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file && ["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setNewProfilePictureName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfilePicture(reader.result.split(",")[1]);
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file (jpg, jpeg, png).");
    }
  };

  const handleRemoveProfilePicture = () => {
    setNewProfilePicture(null);
    setProfilePicturePreview(defaultProfilePicture);
    setFormData((prevData) => ({
      ...prevData,
      profilePicture: defaultProfilePicture.split(",")[1],
    }));
  };

  const userSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    cnic: Yup.string().required("CNIC is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    contact: Yup.string().required("Contact is required"),
    password: Yup.string().required("Password is required"),
    usertype: Yup.string().required("User type is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      cnic: values.cnic,
      email: values.email,
      contact: values.contact,
      password: values.password,
      usertype: values.usertype,
      tehsil:
        values.usertype === "Tehsil Administrator"
          ? { id: selectedArea.id }
          : null,
      division:
        values.usertype === "Division Administrator"
          ? { id: selectedArea.id }
          : null,
      district:
        values.usertype === "District Administrator"
          ? { id: selectedArea.id }
          : null,
      province:
        values.usertype === "Province Administrator"
          ? { id: selectedArea.id }
          : null,
      hospital:
        values.usertype === "Hospital Administrator"
          ? { id: selectedArea.id }
          : null,
      profilePicture: newProfilePicture
        ? newProfilePicture
        : formData.profilePicture,
    };
    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASEURL}/user/add`,
        payload
      );
      setFormData({ ...initialState });
      setSelectedArea(null);
      setNewProfilePicture(null);
      setProfilePicturePreview(defaultProfilePicture);
      refresh();
      onClose();
    } catch (error) {
      console.error("Error creating user:", error);
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <DialogTitle variant="h3">Add User</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={formData}
            validationSchema={userSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              setFieldValue,
              isSubmitting,
            }) => (
              <Form>
                <Grid container spacing={2} sx={{ mt: 0 }}>
                  {["firstName", "lastName", "cnic", "contact"].map((field) => (
                    <Grid item xs={6} key={field}>
                      <Field
                        as={TextField}
                        name={field}
                        label={`${field.replace(/^\w/, (c) =>
                          c.toUpperCase()
                        )}`}
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={values[field]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched[field] && Boolean(errors[field])}
                        helperText={touched[field] && errors[field]}
                      />
                    </Grid>
                  ))}
                  <Grid
                    item
                    xs={values.usertype === "Super Administrator" ? 12 : 6}
                  >
                    <Autocomplete
                      fullWidth
                      disablePortal
                      id="user-type-autocomplete"
                      value={values.usertype}
                      onChange={(e, newValue) => {
                        setFieldValue("usertype", newValue || "");
                        setSelectedArea(null);
                        const optionsMap = {
                          "Tehsil Administrator": tehsilOptions,
                          "Division Administrator": divisionOptions,
                          "District Administrator": districtOptions,
                          "Province Administrator": provinceOptions,
                          "Hospital Administrator": hospitalOptions,
                        };
                        setAreaOptions(optionsMap[newValue] || []);
                      }}
                      options={[
                        "Super Administrator",
                        "Province Administrator",
                        "Division Administrator",
                        "District Administrator",
                        "Tehsil Administrator",
                        "Hospital Administrator",
                      ]}
                      renderInput={(params) => (
                        <Field
                          as={TextField}
                          {...params}
                          label="User Type"
                          variant="outlined"
                          error={touched.usertype && Boolean(errors.usertype)}
                          helperText={touched.usertype && errors.usertype}
                        />
                      )}
                    />
                  </Grid>
                  {values.usertype !== "Super Administrator" && (
                    <Grid item xs={6}>
                      <Autocomplete
                        fullWidth
                        disablePortal
                        id="area-autocomplete"
                        value={selectedArea}
                        onChange={(event, newValue) => {
                          setSelectedArea(newValue || null);
                          setFieldValue(
                            "area",
                            newValue || { id: "", name: "" }
                          );
                        }}
                        options={areaOptions}
                        getOptionLabel={(option) => option.name || ""}
                        renderInput={(params) => (
                          <Field
                            as={TextField}
                            {...params}
                            label={values.usertype.replace(
                              " Administrator",
                              ""
                            )}
                            variant="outlined"
                            error={
                              touched.area?.name && Boolean(errors.area?.name)
                            }
                            helperText={touched.area?.name && errors.area?.name}
                          />
                        )}
                      />
                    </Grid>
                  )}
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      name="email"
                      label="Email"
                      type="text"
                      fullWidth
                      variant="outlined"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      name="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      fullWidth
                      variant="outlined"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleTogglePasswordVisibility}
                            >
                              {showPassword ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      p={2}
                      border="1px solid #ccc"
                      borderRadius="8px"
                    >
                      <img
                        src={
                          profilePicturePreview == null
                            ? defaultProfilePicture
                            : profilePicturePreview
                        }
                        alt="Profile Preview"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      <Box flexGrow={1} ml={2}>
                        {newProfilePicture
                          ? newProfilePictureName
                          : "Profile Picture"}
                      </Box>
                      {newProfilePicture && (
                        <IconButton
                          onClick={handleRemoveProfilePicture}
                          style={{ marginRight: "8px" }}
                        >
                          <CloseIcon />
                        </IconButton>
                      )}
                      <Button variant="contained" component="label">
                        Upload
                        <input
                          type="file"
                          hidden
                          accept="image/jpeg,image/png,image/jpg"
                          onChange={handleProfilePictureChange}
                        />
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                <DialogActions>
                  <Button onClick={onClose}>Cancel</Button>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Add
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

AddUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
};

export default AddUserDialog;
