import { Box, Toolbar } from "@mui/material";
import Breadcrumbs from "@components/Breadcrumbs";
import Header from "./Header";
import { Outlet, Navigate } from "react-router-dom";
import pageinfo from "./pageinfo";
import { useUser } from "@context/UserContext";
const MainLayout = () => {
  const { user } = useUser();

  if (!user || !user.id) {
    return <Navigate to="/login" />;
  }

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Header />
      <Box
        component="main"
        sx={{ width: "100%", flexGrow: 1, p: { xs: 2, sm: 3 } }}
      >
        <Toolbar />

        <Breadcrumbs pageinfo={pageinfo} />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
