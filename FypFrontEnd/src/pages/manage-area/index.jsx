import { useState, useEffect } from "react";
import { Typography, Tabs, Tab } from "@mui/material/";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CustomCard from "@components/CustomCard";
import ProvinceTable from "./province/ProvinceTable";
import DivisionTable from "./division/DivisionTable";
import DistrictTable from "./district/DistrictTable";
import TehsilTable from "./tehsil/TehsilTable";
import {
  LocationOnOutlined,
  AccountTreeOutlined,
  BusinessOutlined,
  LocationCityOutlined,
} from "@mui/icons-material";
import { useUser } from "@context/UserContext";
import { Navigate } from "react-router-dom";
import { a11yProps, TabPanel } from "@components/TabPart";

const ManageArea = () => {
  useEffect(() => {
    document.title = "Manage Area"; // Set the initial document title once
  }, []);
  const { user } = useUser();

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        document.title = "Manage Province";
        break;
      case 1:
        document.title = "Manage Division";
        break;
      case 2:
        document.title = "Manage District";
        break;
      case 3:
        document.title = "Manage Tehsil";
        break;
      default:
        document.title = "Manage Province";
        break;
    }
  };
  if (user.usertype !== "Super Administrator" || user.usertype === null) {
    return <Navigate to="/dashboard" replace />;
  }

  const provinceQueryClient = new QueryClient();
  const divisionQueryClient = new QueryClient();
  const districtQueryClient = new QueryClient();
  const tehsilQueryClient = new QueryClient();

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Manage Area
      </Typography>
      <Tabs value={value} onChange={handleChange} aria-label="manage area tabs">
        <Tab
          label="Province"
          icon={<LocationOnOutlined />}
          iconPosition="start"
          {...a11yProps(0)}
          sx={{ minHeight: "48px", minWidth: "100px" }}
        />
        <Tab
          label="Division"
          icon={<AccountTreeOutlined />}
          iconPosition="start"
          {...a11yProps(1)}
          sx={{ minHeight: "48px", minWidth: "100px" }}
        />
        <Tab
          label="District"
          icon={<BusinessOutlined />}
          iconPosition="start"
          {...a11yProps(2)}
          sx={{ minHeight: "48px", minWidth: "100px" }}
        />
        <Tab
          label="Tehsil"
          icon={<LocationCityOutlined />}
          iconPosition="start"
          {...a11yProps(3)}
          sx={{ minHeight: "48px", minWidth: "100px" }}
        />
      </Tabs>
      <TabPanel value={value} index={0}>
        <CustomCard sx={{ mt: 5, mb: 5 }}>
          <Typography variant="h3" sx={{ marginBottom: 2 }}>
            Manage Province
          </Typography>
          <QueryClientProvider client={provinceQueryClient}>
            <ProvinceTable />
          </QueryClientProvider>
        </CustomCard>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CustomCard sx={{ mt: 5, mb: 5 }}>
          <Typography variant="h3" sx={{ marginBottom: 2 }}>
            Manage Division
          </Typography>
          <QueryClientProvider client={divisionQueryClient}>
            <DivisionTable />
          </QueryClientProvider>
        </CustomCard>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <CustomCard sx={{ mt: 5, mb: 5 }}>
          <Typography variant="h3" sx={{ marginBottom: 2 }}>
            Manage District
          </Typography>
          <QueryClientProvider client={districtQueryClient}>
            <DistrictTable />
          </QueryClientProvider>
        </CustomCard>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <CustomCard sx={{ mt: 5, mb: 5 }}>
          <Typography variant="h3" sx={{ marginBottom: 2 }}>
            Manage Tehsil
          </Typography>
          <QueryClientProvider client={tehsilQueryClient}>
            <TehsilTable />
          </QueryClientProvider>
        </CustomCard>
      </TabPanel>
    </>
  );
};

export default ManageArea;
