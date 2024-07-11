/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Autocomplete,
  TextField,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  PeopleAltOutlined as PeopleAltOutlinedIcon,
  PersonRemove as PersonRemoveIcon,
  LocalHospital as LocalHospitalIcon,
} from "@mui/icons-material";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { useUser } from "@context/UserContext";
import { formatDatetoWordDate } from "@utility";
import DataCard from "@components/DataCard";
import CustomCard from "@components/CustomCard";
import FilterDrawer from "./Drawer";
import CustomButton from "@components/CustomButtom";
import CenteredAlert from "@components/CenteredAlert";
import OverLayLoader from "@components/OverlayLoader";
import PieChartStatistics from "./PieChartStatistics";
import DynamicTimeChart from "./DynamicTimeChart";
import LineRaceChart from "./LineRaceChart";
import {
  LocationOnOutlined,
  AccountTreeOutlined,
  BusinessOutlined,
  LocationCityOutlined,
  LocalHospitalOutlined,
} from "@mui/icons-material";
import { getTabIndices, userType } from "@utility";
import { debounce } from "lodash";
import { a11yProps, TabPanel } from "@components/TabPart";
import OrganDataChart from "./OrganDataChart";
import BarChart from "./BarChart";
import ToastNotification, { emitToast } from "@components/ToastNotification";
import BarRaceSymptoms from "./BarRaceSymptoms";
import { Link } from "react-router-dom";
import PieChartStatisticsGender from "./PieChartStatisticsGender";
const CustomIconButton = styled(IconButton)({
  fontSize: "1.25rem",
});

const Dashboard = () => {
  document.title = "Dashboard - Real-Time Analytics";
  const [BarChartData, setBarChartData] = useState([]);
  const [DynamicTimeChartData, setDynamicTimeChartData] = useState([]);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (
      filters.provinceIds.length !== 0 ||
      filters.divisionIds.length !== 0 ||
      filters.districtIds.length !== 0 ||
      filters.tehsilIds.length !== 0 ||
      filters.hospitalIds.length !== 0 ||
      filters.admissionEndDate != null ||
      filters.admissionStartDate != null ||
      filters.ageEnd != null ||
      filters.ageStart != null ||
      filters
    ) {
      if (userType.superAdmin == user.usertype) {
        switch (newValue) {
          case 0:
            fetchBarChartData("province", filters);
            break;
          case 1:
            fetchBarChartData("division", filters);
            break;
          case 2:
            fetchBarChartData("district", filters);
            break;
          case 3:
            fetchBarChartData("tehsil", filters);
            break;
          case 4:
            fetchBarChartData("hospital", filters);
            break;
        }
        return;
      } else if (userType.provinceAdmin == user.usertype) {
        switch (newValue) {
          case 0:
            fetchBarChartData("division", filters);
            break;
          case 1:
            fetchBarChartData("district", filters);
            break;
          case 2:
            fetchBarChartData("tehsil", filters);
            break;
          case 3:
            fetchBarChartData("hospital", filters);
            break;
        }
        return;
      } else if (userType.divisionAdmin == user.usertype) {
        switch (newValue) {
          case 0:
            fetchBarChartData("district", filters);
            break;
          case 1:
            fetchBarChartData("tehsil", filters);
            break;
          case 2:
            fetchBarChartData("hospital", filters);
            break;
        }
        return;
      } else if (userType.districtAdmin == user.usertype) {
        switch (newValue) {
          case 0:
            fetchBarChartData("tehsil", filters);
            break;
          case 1:
            fetchBarChartData("hospital", filters);
            break;
        }
        return;
      } else if (userType.hospitalAdmin == user.usertype) {
        switch (newValue) {
          case 0:
            fetchBarChartData("hospital", filters);
            break;
        }
        return;
      }
    }
    if (userType.superAdmin == user.usertype) {
      switch (newValue) {
        case 0:
          fetchBarChartData("province");
          break;
        case 1:
          fetchBarChartData("division");
          break;
        case 2:
          fetchBarChartData("district");
          break;
        case 3:
          fetchBarChartData("tehsil");
          break;
        case 4:
          fetchBarChartData("hospital");
          break;
      }
      return;
    } else if (userType.provinceAdmin == user.usertype) {
      switch (newValue) {
        case 0:
          fetchBarChartData("division");
          break;
        case 1:
          fetchBarChartData("district");
          break;
        case 2:
          fetchBarChartData("tehsil");
          break;
        case 3:
          fetchBarChartData("hospital");
          break;
      }
      return;
    } else if (userType.divisionAdmin == user.usertype) {
      switch (newValue) {
        case 0:
          fetchBarChartData("district");
          break;
        case 1:
          fetchBarChartData("tehsil");
          break;
        case 2:
          fetchBarChartData("hospital");
          break;
      }
      return;
    } else if (userType.districtAdmin == user.usertype) {
      switch (newValue) {
        case 0:
          fetchBarChartData("tehsil");
          break;
        case 1:
          fetchBarChartData("hospital");
          break;
      }
      return;
    } else if (userType.hospitalAdmin == user.usertype) {
      switch (newValue) {
        case 0:
          fetchBarChartData("hospital");
          break;
      }
      return;
    }
  };

  const fetchBarChartData = debounce(
    async (type, updatedFilters = initialFilters) => {
      try {
        if (type == null || selectedDisease == null) {
          return;
        }

        const response = await axios.post(
          `${
            import.meta.env.VITE_REACT_APP_BASEURL
          }/dashboard/getBarChartData/${type}/${user.id}/${selectedDisease.id}`,
          updatedFilters
        );
        setBarChartData(response.data);
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
      }
    },
    300
  );

  const [drawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [disease, setDisease] = useState([]);
  const initialFilters = {
    provinceIds: [],
    divisionIds: [],
    districtIds: [],
    tehsilIds: [],
    hospitalIds: [],
    symptoms: [],
    admissionStartDate: null,
    admissionEndDate: null,
    gender: null,
    ageStart: null,
    ageEnd: null,
  };
  const [filters, setFilters] = useState(initialFilters);
  const [statisticCardData, setStatisticCardData] = useState({
    patientsTotalCount: 0,
    patientsCount: 0,
    patientsDeathsCount: 0,
    patientsRecoveredCount: 0,
    patientsChronicCount: 0,
    femalePatientCount: 0,
    malePatientCount: 0,
    admissionStartDate: null,
    admissionEndDate: null,
  });
  const [organChartData, setOrganChartData] = useState({
    heartCount: 0,
    largeIntestineCount: 0,
    smallIntestineCount: 0,
    kidneyCount: 0,
    lungCount: 0,
  });
  const [hospitalPatientCount, setHospitalPatientCount] = useState([
    ["Patients", "Hospital", "Year"],
  ]);
  const [barRaceSymptoms, setBarRaceSymptoms] = useState({
    feverCount: 0,
    highFeverCount: 0,
    hypertensionCount: 0,
    cardiacCount: 0,
    weaknessPainCount: 0,
    respiratoryCount: 0,
    cancerCount: 0,
    thyroidCount: 0,
    prostateCount: 0,
    kidneyCount: 0,
    neuroCount: 0,
    nauseaCount: 0,
    asymptomaticCount: 0,
    gastrointestinalCount: 0,
    orthoCount: 0,
    respiratoryCDCount: 0,
    cardiacsCDCount: 0,
    kidneyCDCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const [dataPresent, setDataPresent] = useState(false);
  const fetchDisease = debounce(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BASEURL}/disease/getIdAndName`
      );
      setDisease(response.data);
    } catch (error) {
      emitToast(`Error fetching disease names: ${error.message}`, "error");
    }
  }, 300);

  const fetchDashboardData = debounce(
    async (updatedFilters = initialFilters) => {
      try {
        if (selectedDisease != null && user != null) {
          const response = await axios.post(
            `${
              import.meta.env.VITE_REACT_APP_BASEURL
            }/dashboard/getDashboardData/${user.id}/${selectedDisease.id}`,
            updatedFilters
          );
          setDataPresent(response.data.dataPresent);
          setStatisticCardData(response.data.statisticResponse);
          setDynamicTimeChartData(
            response.data.dynamicTimeChartData.dataPoints
          );
          setBarRaceSymptoms(response.data.barRaceSymptoms);
          setOrganChartData(response.data.organChartData);
          const newHospitalPatientCount = Array.isArray(
            response.data.hospitalPatientCount.patientCounts
          )
            ? response.data.hospitalPatientCount.patientCounts.map((item) =>
                Array.isArray(item) && item.length === 3 ? item : null
              )
            : // Filtering out invalid entries
              [];

          // Update the state with validated data
          setHospitalPatientCount((prevState) => [
            ...prevState,
            ...newHospitalPatientCount,
          ]);

          // Update the state with validated data

          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    },
    300
  );

  useEffect(() => {
    if (selectedDisease != null) {
      fetchDashboardData();
      if (user.usertype === userType.superAdmin) {
        fetchBarChartData("province");
      } else if (user.usertype === userType.provinceAdmin) {
        fetchBarChartData("division");
      } else if (user.usertype === userType.divisionAdmin) {
        fetchBarChartData("district");
      } else if (user.usertype === userType.tehsilAdmin) {
        fetchBarChartData("hospital");
      } else if (user.usertype === userType.hospitalAdmin) {
        fetchBarChartData("hospital");
      }
    }
    if (selectedDisease == null) {
      fetchDisease();
    }
  }, [selectedDisease]);

  const toggleFilterDrawer = () => {
    setFilterDrawerOpen(!drawerOpen);
  };

  const handleDiseaseChange = (event, newValue) => {
    setSelectedDisease(newValue);
    if (newValue != null) {
      setIsLoading(true);
      emitToast("Disease selected successfully", "success");
      setDataPresent(false);
      setStatisticCardData({
        patientsTotalCount: 0,
        patientsCount: 0,
        patientsDeathsCount: 0,
        patientsRecoveredCount: 0,
        patientsChronicCount: 0,
        femalePatientCount: 0,
        malePatientCount: 0,
        admissionStartDate: null,
        admissionEndDate: null,
      });
      setOrganChartData({
        heartCount: 0,
        largeIntestineCount: 0,
        smallIntestineCount: 0,
        kidneyCount: 0,
        lungCount: 0,
      });
      setBarRaceSymptoms({
        feverCount: 0,
        highFeverCount: 0,
        hypertensionCount: 0,
        cardiacCount: 0,
        weaknessPainCount: 0,
        respiratoryCount: 0,
        cancerCount: 0,
        thyroidCount: 0,
        prostateCount: 0,
        kidneyCount: 0,
        neuroCount: 0,
        nauseaCount: 0,
        asymptomaticCount: 0,
        gastrointestinalCount: 0,
        orthoCount: 0,
        respiratoryCDCount: 0,
        cardiacsCDCount: 0,
        kidneyCDCount: 0,
      });
      setHospitalPatientCount([["Patients", "Hospital", "Year"]]);
      setDynamicTimeChartData([]);
      setBarChartData([]);
    }
  };

  const handleFilterValue = (filtersValue) => {
    let updatedFilters;
    setFilters((prevFilters) => {
      updatedFilters = { ...prevFilters, ...filtersValue };
    });
    setFilters(filtersValue);
    if (userType.superAdmin == user.usertype) {
      switch (value) {
        case 0:
          fetchBarChartData("province", updatedFilters);
          break;
        case 1:
          fetchBarChartData("division", updatedFilters);
          break;
        case 2:
          fetchBarChartData("district"), updatedFilters;
          break;
        case 3:
          fetchBarChartData("tehsil", updatedFilters);
          break;
        case 4:
          fetchBarChartData("hospital", updatedFilters);
          break;
        default:
          break;
      }
      fetchDashboardData(updatedFilters);
      return;
    }
    switch (value) {
      case 0:
        fetchBarChartData("division", updatedFilters);
        break;
      case 1:
        fetchBarChartData("district", updatedFilters);
        break;
      case 2:
        fetchBarChartData("tehsil", updatedFilters);
        break;
      case 3:
        fetchBarChartData("hospital", updatedFilters);
        break;
      case 4:
        fetchBarChartData("hospital", updatedFilters);
        break;
      default:
        break;
    }
    fetchDashboardData(updatedFilters);
  };
  const tabIndices = getTabIndices(user.usertype);

  const {
    patientsTotalCount,
    patientsCount,
    patientsDeathsCount,
    patientsRecoveredCount,
    patientsChronicCount,
    admissionStartDate,
    admissionEndDate,
  } = statisticCardData;

  const recoveryRate = (patientsRecoveredCount / patientsTotalCount) * 100;
  const deathRate = (patientsDeathsCount / patientsTotalCount) * 100;
  const chronicRate = (patientsChronicCount / patientsTotalCount) * 100;

  const recoveryTrend =
    recoveryRate > 50 ? "Positive Recovery Trend" : "Negative Recovery Trend";
  const deathTrend =
    deathRate > 5 ? "Negative Death Trend" : "Positive Death Trend";

  return (
    <>
      <OverLayLoader loading={isLoading} />

      <ToastNotification />
      {selectedDisease != null && (
        <>
          <CustomButton
            onButtonClick={toggleFilterDrawer}
            buttonOpen={drawerOpen}
          />
          <FilterDrawer
            open={drawerOpen}
            onClose={toggleFilterDrawer}
            handleFilterValue={handleFilterValue}
          />
        </>
      )}
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="h5">Real-Time Analytics</Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Autocomplete
                sx={{
                  width: { xs: "100%", sm: 222 },
                  height: 40,
                  "& .MuiInputBase-root": {
                    height: "100%",
                  },
                  mb: 1.5,
                  position: "relative",
                }}
                id="Disease-autocomplete"
                options={disease}
                getOptionLabel={(option) => option.name}
                value={selectedDisease}
                onChange={handleDiseaseChange}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Disease"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: user.usertype === userType.superAdmin && (
                        <Tooltip
                          disableFocusListener
                          disableTouchListener
                          title="Manage Disease"
                        >
                          <CustomIconButton
                            component={Link}
                            to="/manage-disease"
                            size="small"
                            sx={{
                              top: "50%",
                              zIndex: 1,
                            }}
                          >
                            <SettingsIcon />
                          </CustomIconButton>
                        </Tooltip>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
        {selectedDisease != null ? (
          <>
            {dataPresent ? (
              <>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <DataCard
                    title="Population"
                    count={patientsCount || 0}
                    percentage={
                      ((patientsCount / patientsTotalCount) * 100).toFixed(2) ||
                      0
                    }
                    IconComponent={PeopleAltOutlinedIcon}
                    summarytitle="Time Period:"
                    summary={`${formatDatetoWordDate(
                      admissionStartDate
                    )} ~ ${formatDatetoWordDate(admissionEndDate)}`}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <DataCard
                    title="Recovered Patient"
                    count={patientsRecoveredCount || 0}
                    percentage={recoveryRate.toFixed(2) || 0}
                    IconComponent={LocalHospitalIcon}
                    summarytitle="Recovery Rate:"
                    summary={`${recoveryTrend} ${
                      recoveryRate.toFixed(2) || 0
                    }%`}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <DataCard
                    title="Decreased Patient"
                    count={patientsDeathsCount || 0}
                    percentage={deathRate.toFixed(2) || 0}
                    IconComponent={PersonRemoveIcon}
                    summarytitle="Death Rate:"
                    summary={`${deathTrend} ${deathRate.toFixed(2) || 0}%`}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <DataCard
                    title="Chronic Patient Population"
                    count={patientsChronicCount || 0}
                    percentage={chronicRate.toFixed(2) || 0}
                    IconComponent={PeopleAltOutlinedIcon}
                    summarytitle="Summary:"
                    summary={`${
                      chronicRate.toFixed(2) || 0
                    }% Chronic Patients out of ${patientsTotalCount || 0}`}
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={4}>
                  <Typography variant="h5">
                    Pie Graph - Population Statistics
                  </Typography>
                  <CustomCard sx={{ mt: 2 }} content={false}>
                    <Box sx={{ p: 3, pb: 0 }}>
                      <PieChartStatistics
                        chartData={{
                          recoveredPatient: patientsRecoveredCount,
                          deathPatient: patientsDeathsCount,
                        }}
                      />
                    </Box>
                  </CustomCard>
                </Grid>
                <Grid item xs={12} md={7} lg={8}>
                  <Typography variant="h5">
                    Bar Graph - Patient Population Statistics -
                    {value === tabIndices.province
                      ? "Province"
                      : value === tabIndices.division
                      ? "Division"
                      : value === tabIndices.district
                      ? "District"
                      : value === tabIndices.tehsil
                      ? "Tehsil"
                      : "Hospital"}
                  </Typography>
                  <CustomCard content={false} sx={{ mt: 1.5 }}>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="bar area tabs"
                      variant="scrollable"
                      scrollButtons="auto"
                      sx={{ minHeight: "48px" }}
                    >
                      {user.usertype === userType.superAdmin && (
                        <Tab
                          label="Province"
                          icon={<LocationOnOutlined />}
                          iconPosition="start"
                          {...a11yProps(tabIndices.province)}
                          sx={{ minHeight: "48px", minWidth: "100px" }}
                        />
                      )}
                      {(user.usertype === userType.superAdmin ||
                        user.usertype === userType.provinceAdmin) && (
                        <Tab
                          label="Division"
                          icon={<AccountTreeOutlined />}
                          iconPosition="start"
                          {...a11yProps(tabIndices.division)}
                          sx={{ minHeight: "48px", minWidth: "100px" }}
                        />
                      )}
                      {(user.usertype === userType.superAdmin ||
                        user.usertype === userType.provinceAdmin ||
                        user.usertype === userType.divisionAdmin) && (
                        <Tab
                          label="District"
                          icon={<BusinessOutlined />}
                          iconPosition="start"
                          {...a11yProps(tabIndices.district)}
                          sx={{ minHeight: "48px", minWidth: "100px" }}
                        />
                      )}
                      {(user.usertype === userType.superAdmin ||
                        user.usertype === userType.provinceAdmin ||
                        user.usertype === userType.divisionAdmin ||
                        user.usertype === userType.districtAdmin) && (
                        <Tab
                          label="Tehsil"
                          icon={<LocationCityOutlined />}
                          iconPosition="start"
                          {...a11yProps(tabIndices.tehsil)}
                          sx={{ minHeight: "48px", minWidth: "100px" }}
                        />
                      )}
                      {(user.usertype === userType.superAdmin ||
                        user.usertype === userType.provinceAdmin ||
                        user.usertype === userType.divisionAdmin ||
                        user.usertype === userType.districtAdmin ||
                        user.usertype === userType.tehsilAdmin) && (
                        <Tab
                          label="Hospital"
                          icon={<LocalHospitalOutlined />}
                          iconPosition="start"
                          {...a11yProps(tabIndices.hospital)}
                          sx={{ minHeight: "48px", minWidth: "100px" }}
                        />
                      )}
                    </Tabs>
                    {user.usertype === userType.superAdmin && (
                      <TabPanel value={value} index={tabIndices.province}>
                        <Box sx={{ pt: 1, pr: 2 }}>
                          <BarChart BarChartdata={BarChartData} />
                        </Box>
                      </TabPanel>
                    )}
                    {(user.usertype === userType.superAdmin ||
                      user.usertype === userType.provinceAdmin) && (
                      <TabPanel value={value} index={tabIndices.division}>
                        <Box sx={{ pt: 1, pr: 2 }}>
                          <BarChart BarChartdata={BarChartData} />
                        </Box>
                      </TabPanel>
                    )}
                    {(user.usertype === userType.superAdmin ||
                      user.usertype === userType.provinceAdmin ||
                      user.usertype === userType.divisionAdmin) && (
                      <TabPanel value={value} index={tabIndices.district}>
                        <Box sx={{ pt: 1, pr: 2 }}>
                          <BarChart BarChartdata={BarChartData} />
                        </Box>
                      </TabPanel>
                    )}
                    {(user.usertype === userType.superAdmin ||
                      user.usertype === userType.provinceAdmin ||
                      user.usertype === userType.divisionAdmin ||
                      user.usertype === userType.districtAdmin) && (
                      <TabPanel value={value} index={tabIndices.tehsil}>
                        <Box sx={{ pt: 1, pr: 2 }}>
                          <BarChart BarChartdata={BarChartData} />
                        </Box>
                      </TabPanel>
                    )}
                    {(user.usertype === userType.superAdmin ||
                      user.usertype === userType.provinceAdmin ||
                      user.usertype === userType.divisionAdmin ||
                      user.usertype === userType.districtAdmin ||
                      user.usertype === userType.tehsilAdmin) && (
                      <TabPanel value={value} index={tabIndices.hospital}>
                        <Box sx={{ pt: 1, pr: 2 }}>
                          <BarChart BarChartdata={BarChartData} />
                        </Box>
                      </TabPanel>
                    )}
                  </CustomCard>
                </Grid>
                <Grid item xs={12} md={5} lg={7}>
                  <Typography variant="h5">Bar Race - Symptoms</Typography>
                  <CustomCard sx={{ mt: 2 }} content={false}>
                    <Box sx={{ p: 3, pb: 0 }}>
                      <BarRaceSymptoms data={barRaceSymptoms} />
                    </Box>
                  </CustomCard>
                </Grid>
                <Grid item xs={12} md={5} lg={5}>
                  <Typography variant="h5">
                    Pie Graph - Gender Statistics
                  </Typography>
                  <CustomCard sx={{ mt: 2 }} content={false}>
                    <Box sx={{ textAlign: "center" }}>
                      <Box sx={{ p: 3, pb: 0 }}>
                        <PieChartStatisticsGender
                          chartData={{
                            malePatient: statisticCardData.malePatientCount,
                            femalePatient: statisticCardData.femalePatientCount,
                          }}
                        />
                      </Box>
                    </Box>
                  </CustomCard>
                </Grid>
                <Grid item xs={12} md={7} lg={8}>
                  <Typography variant="h5">
                    Line Race - Hospital Patient Count
                  </Typography>
                  <CustomCard content={false} sx={{ mt: 1.5 }}>
                    <Box sx={{ pt: 1, pr: 2 }}>
                      <LineRaceChart chartData={hospitalPatientCount} />
                    </Box>
                  </CustomCard>
                </Grid>
                <Grid item xs={12} md={5} lg={4}>
                  <Typography variant="h5">
                    Dynamic Time Wise Patient Count
                  </Typography>
                  <CustomCard sx={{ mt: 2 }} content={false}>
                    <Box sx={{ p: 3, pb: 0 }}>
                      <DynamicTimeChart chartData={DynamicTimeChartData} />
                    </Box>
                  </CustomCard>
                </Grid>
                <Grid item xs={12} md={7} lg={12}>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <Typography variant="h5">
                        Organ Health Overview Chart
                      </Typography>
                    </Grid>
                  </Grid>
                  <CustomCard sx={{ mt: 2 }} content={false}>
                    <Box sx={{ p: 3, pb: 0, textAlign: "center" }}>
                      <div style={{ width: "100%", height: "480px" }}>
                        <OrganDataChart OrganChartData={organChartData} />
                      </div>
                    </Box>
                  </CustomCard>
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <CenteredAlert
                  title={
                    isLoading == true
                      ? "Patients Records is Loading"
                      : "Patient Records for this Disease are not Present"
                  }
                  color={isLoading == true ? "#ffcc00" : "red"}
                />
              </Grid>
            )}
          </>
        ) : (
          <CenteredAlert title="Select Disease to view Real Time Analytics" />
        )}
      </Grid>
    </>
  );
};

export default Dashboard;
