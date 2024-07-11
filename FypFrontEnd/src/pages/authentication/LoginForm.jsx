import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import axios from "axios";
import { useUser } from "@context/UserContext";
import ToastNotification, { emitToast } from "@components/ToastNotification";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { updateUser } = useUser();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL +
          "/user/login?email=" +
          values.email +
          "&password=" +
          values.password
      );

      if (response.data != "" && response.data != null) {
        updateUser(response.data);
        navigate("/dashboard");
      } else {
        emitToast("User not Found in system", "error");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
    setSubmitting(false);
  };

  return (
    <>
      <ToastNotification />
      <Formik
        initialValues={{
          email: "amir.ali2036a@gmail.com",
          password: "1234567",
        }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="user-email">
                    Email Address <span style={{ color: "red" }}>*</span>
                  </InputLabel>
                  <Field
                    as={OutlinedInput}
                    id="user-email"
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    fullWidth
                  />
                  <ErrorMessage name="email" component={FormHelperText} error />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="user-password">
                    Password <span style={{ color: "red" }}>*</span>
                  </InputLabel>
                  <Field
                    as={OutlinedInput}
                    id="user-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    fullWidth
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          edge="end"
                          size="large"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <ErrorMessage
                    name="password"
                    component={FormHelperText}
                    error
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Button
                  disableElevation
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default LoginForm;
