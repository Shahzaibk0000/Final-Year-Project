import MainCard from "@components/CustomCard";
import DiseaseTable from "./DiseaseTable";
import { Grid, Typography } from "@mui/material/";
import { Navigate } from "react-router-dom";
import { useUser } from "@context/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const ManageDisease = () => {
  document.title = "Manage Disease";
  const { user } = useUser();
  if (user.usertype !== "Super Administrator" || user.usertype === null) {
    return <Navigate to="/dashboard" replace />;
  }
  const queryClient = new QueryClient();
  return (
    <>
      <MainCard>
        <Typography variant="h3" sx={{ marginBottom: 2 }}>
          Manage Disease
        </Typography>
        <Grid
          item
          md={8}
          sx={{ display: { sm: "none", md: "block", lg: "none" } }}
        />
        <QueryClientProvider client={queryClient}>
          <DiseaseTable />
        </QueryClientProvider>
      </MainCard>
    </>
  );
};

export default ManageDisease;
