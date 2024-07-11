import { lazy } from "react";
import LoginLayout from "@layout/LoginLayout";
import CustomLoader from "@components/CustomLoader";
const Login = CustomLoader(lazy(() => import("@pages/authentication/Login")));

const LoginRoute = {
  path: "/",
  element: <LoginLayout />,
  children: [
    {
      path: "login",
      element: <Login />,
    },
  ],
};

export default LoginRoute;
