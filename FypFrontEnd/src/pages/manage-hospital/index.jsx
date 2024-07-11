import MainCard from "@components/CustomCard";
import HospitalTable from "./HospitalTable";
import { Grid, Typography } from "@mui/material/";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { useUser } from "@context/UserContext";
const ManageHospital = () => {
  document.title = "Manage Hospital";
  const { user } = useUser();
  const queryClient = new QueryClient();
  if (user.usertype !== "Super Administrator" || user.usertype === null) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <>
      <MainCard>
        <Typography variant="h3" sx={{ marginBottom: 2 }}>
          Manage Hospital
        </Typography>
        <Grid
          item
          md={8}
          sx={{ display: { sm: "none", md: "block", lg: "none" } }}
        />
        <QueryClientProvider client={queryClient}>
          <HospitalTable />
        </QueryClientProvider>
      </MainCard>
    </>
  );
};

export default ManageHospital;
