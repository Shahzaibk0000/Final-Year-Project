import MainCard from "@components/CustomCard";
import PatientTable from "./PatientTable";
import { Grid, Typography } from "@mui/material/";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";

const PatientRecords = () => {
  const queryClient = new QueryClient();
  const { hospitalId } = useParams();
  document.title = "Patient Records";
  return (
    <>
      <MainCard>
        <Typography variant="h3" sx={{ marginBottom: 2 }}>
          Patient Records
        </Typography>
        <Grid
          item
          md={8}
          sx={{ display: { sm: "none", md: "block", lg: "none" } }}
        />
        <QueryClientProvider client={queryClient}>
          <PatientTable hospitalId={hospitalId} />
        </QueryClientProvider>
      </MainCard>
    </>
  );
};

export default PatientRecords;
PatientRecords.propTypes = {
  hospitalId: PropTypes.any,
};
