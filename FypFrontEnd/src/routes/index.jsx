import { useRoutes } from "react-router-dom";
import MainRoutes from "./MainRoutes";
import LoginRoute from "./LoginRoute";
import { Navigate } from "react-router-dom";
import NotFoundPage from "../pages/extra/NotFoundPage";
const Routes = () => {
  return useRoutes([
    LoginRoute,
    MainRoutes,
    { path: "*", element: <Navigate to="/404NotFound" /> },
    { path: "/404NotFound", element: <NotFoundPage /> },
  ]);
};

export default Routes;
