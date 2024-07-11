import { useState, useEffect, forwardRef } from "react";
import {
  Button,
  Dialog,
  Box,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton,
  TextField,
  Grid,
  Slide,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUser } from "@context/UserContext";
import { useNavigate } from "react-router-dom";
import { CompareObject } from "@utility";
import ToastNotification, { emitToast } from "@components/ToastNotification";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditProfileDialog = ({ open, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [newProfilePictureName, setNewProfilePictureName] = useState(null);

  const navigate = useNavigate();

  const { user, updateUser } = useUser();
  const formik = useFormik({
    initialValues: {
      id: "",
      usertype: "",
      firstName: "",
      lastName: "",
      email: "",
      contact: "",
      password: "",
      cnic: "",
      province: null,
      division: null,
      district: null,
      tehsil: null,
      hospital: null,
      profilePicture: null,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      contact: Yup.string().required("Contact is required"),
      password: Yup.string().required("Password is required"),
      cnic: Yup.string().required("CNIC is required"),
    }),
    onSubmit: async (values) => {
      const payload = {
        ...values,
        tehsil:
          values.usertype === "Tehsil Administrator" ? values.tehsil : null,
        division:
          values.usertype === "Division Administrator" ? values.division : null,
        district:
          values.usertype === "District Administrator" ? values.district : null,
        province:
          values.usertype === "Province Administrator" ? values.province : null,
        hospital:
          values.usertype === "Hospital Administrator" ? values.hospital : null,
        profilePicture: newProfilePicture
          ? newProfilePicture
          : user.profilePicture,
      };
      if (CompareObject(payload, user)) {
        onClose();
        return;
      }
      try {
        await axios.put(
          `${import.meta.env.VITE_REACT_APP_BASEURL}/user/update`,
          payload
        );
        if (
          payload.email === user.email &&
          payload.password === user.password
        ) {
          const response = await axios.get(
            `${import.meta.env.VITE_REACT_APP_BASEURL}/user/login?email=${
              user.email
            }&password=${user.password}`
          );
          updateUser(response.data);
        } else {
          updateUser({
            id: null,
            firstName: "",
            lastName: "",
            usertype: "",
            contact: "",
            cnic: "",
            email: "",
            password: "",
            profilePicture: null,
            province: null,
            division: null,
            district: null,
            tehsil: null,
            hospital: null,
            createdOn: null,
          });
          navigate("/login");
        }

        setNewProfilePicture(null);
        setProfilePicturePreview(null);
        onClose();
      } catch (error) {
        emitToast("Error updating User", "error");
      }
    },
  });

  useEffect(() => {
    if (user) {
      formik.setValues({ ...user });
      if (user.profilePicture) {
        setProfilePicturePreview(
          `data:image/jpeg;base64,${user.profilePicture}`
        );
      }
    }
  }, [user]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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
      emitToast("Please select a valid image file (jpg, jpeg, png).", "error");
    }
  };

  const handleRemoveProfilePicture = () => {
    setNewProfilePicture(null);
    setProfilePicturePreview(
      user ? `data:image/jpeg;base64,${user.profilePicture}` : null
    );
  };

  return (
    <>
      <ToastNotification />
      <Dialog
        open={open}
        onClose={onClose}
        aria-describedby="edit-profile-dialog"
        PaperProps={{
          style: {
            borderRadius: "12px",
            padding: "4px",
          },
        }}
        TransitionComponent={Transition}
      >
        <Box sx={{ p: 2 }}>
          <DialogTitle variant="h3">Edit Profile</DialogTitle>
          <DialogContent>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2} sx={{ marginTop: 1 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="id"
                    name="id"
                    label="ID"
                    value={formik.values.id}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="cnic"
                    name="cnic"
                    label="CNIC"
                    value={formik.values.cnic}
                    onChange={formik.handleChange}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.firstName &&
                      Boolean(formik.errors.firstName)
                    }
                    helperText={
                      formik.touched.firstName && formik.errors.firstName
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.lastName && Boolean(formik.errors.lastName)
                    }
                    helperText={
                      formik.touched.lastName && formik.errors.lastName
                    }
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="usertype"
                    name="usertype"
                    label="User Type"
                    value={formik.values.usertype}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="contact"
                    name="contact"
                    label="Contact"
                    value={formik.values.contact}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.contact && Boolean(formik.errors.contact)
                    }
                    helperText={formik.touched.contact && formik.errors.contact}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOutlinedIcon />
                          ) : (
                            <VisibilityOffOutlinedIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
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
                        profilePicturePreview != null
                          ? profilePicturePreview
                          : `data:image/jpeg;base64,${user.profilePicture}`
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
                <Button color="primary" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit">
                  Save
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};

EditProfileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditProfileDialog;
