/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import {
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import EditHospitalDialog from "./EditHospitalDialog";
import AddHospitalDialog from "./AddHospitalDialog";
import DeleteConfirmation from "@components/DeleteConfirmation";
import OverLayLoader from "@components/OverlayLoader";
import { PeopleAltOutlined as PeopleAltOutlinedIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@utility";
import ToastNotification, { emitToast } from "@components/ToastNotification";

const HospitalTable = () => {
  const navigate = useNavigate();
  const [deleteHospitalId, setDeleteHospitalId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddHospitalDialogOpen, setIsAddHospitalDialogOpen] = useState(false);
  const [isEditHospitalDialogOpen, setIsEditHospitalDialogOpen] =
    useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalCount, setTotalCount] = useState(0);
  const {
    data: { data = [], meta } = { data: [], meta: 0 }, // Initialize data as an empty array and meta as 0
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "table-data",
      columnFilters,
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    queryFn: async () => {
      try {
        const fetchURL = new URL(
          import.meta.env.VITE_REACT_APP_BASEURL + "/hospital/getTableData"
        );
        fetchURL.searchParams.set(
          "start",
          `${pagination.pageIndex * pagination.pageSize}`
        );
        fetchURL.searchParams.set("size", `${pagination.pageSize}`);
        fetchURL.searchParams.set(
          "filters",
          JSON.stringify(columnFilters ?? [])
        );
        fetchURL.searchParams.set("sorting", JSON.stringify(sorting ?? []));
        fetchURL.searchParams.set("globalFilter", globalFilter ?? "");

        const response = await axios.get(fetchURL.href);
        setTotalCount(response.data.totalCount);

        return {
          data: response.data.content,
          meta: response.data.totalCount,
        };
      } catch (error) {
        emitToast("Error fetching Hospital Records", "error");
        throw new Error("Error fetching Hospital Records");
      }
    },
  });

  const handleDeleteHospital = (hospitalId) => {
    setDeleteHospitalId(hospitalId);
    setIsDeleteDialogOpen(true);
  };

  const toggleDeleteDialog = () => {
    setIsDeleteDialogOpen((prevOpen) => !prevOpen);
    if (!isDeleteDialogOpen) {
      setDeleteHospitalId(null);
    }
  };

  const deleteHospitalFromServer = async () => {
    try {
      if (deleteHospitalId) {
        await axios.delete(
          import.meta.env.VITE_REACT_APP_BASEURL +
            "/hospital/delete/" +
            deleteHospitalId
        );
        refetch();
      }
    } catch (error) {
      emitToast("Error deleting hospital:", "error");
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteHospitalId(null);
    }
  };

  const toggleEditHospitalDialog = (hospital) => {
    setSelectedHospital(hospital);
    setIsEditHospitalDialogOpen((prevOpen) => !prevOpen);
  };

  const toggleAddHospitalDialog = () => {
    setIsAddHospitalDialogOpen((prevOpen) => !prevOpen);
  };

  const columns = useMemo(
    () => [
      {
        id: "table",
        header: "",
        columns: [
          {
            id: "id",
            accessorKey: "id",
            header: "ID",
            size: 150,
          },
          {
            id: "name",
            accessorKey: "name",
            header: "Name",
            size: 150,
          },
          {
            id: "patients",
            header: "Patients",
            size: 200,
            Cell: ({ row }) => (
              <Box sx={{ display: "flex", gap: "0.5rem" }}>
                <Button
                  variant="contained"
                  sx={{
                    color: "#ffffff",
                    borderColor: "#4caf50",
                    backgroundColor: "#4caf50",
                    "&:hover": {
                      backgroundColor: "#388e3c",
                      borderColor: "#388e3c",
                    },
                  }}
                  startIcon={
                    <PeopleAltOutlinedIcon sx={{ color: "#ffffff" }} />
                  }
                  onClick={() =>
                    navigate(
                      `/manage-hospital/patient-records/${row.original.id}`
                    )
                  }
                >
                  View Patients
                </Button>
              </Box>
            ),
          },
          {
            id: "code",
            accessorKey: "code",
            header: "Code",
            size: 150,
          },
          {
            id: "hospital_type",
            accessorKey: "hospitalType",
            header: "Hospital Type",
            size: 150,
          },
          {
            id: "tehsil_name",
            accessorFn: (row) =>
              row.tehsil != null ? row.tehsil.name : "No Tehsil",
            header: "Tehsil Name",
            size: 150,
          },
          {
            accessorFn: (row) =>
              row.createdOn ? formatDate(row.createdOn) : "Not Created",
            id: "createdOn",
            header: "Created On",
            filterVariant: "date",
            filterFn: "lessThan",
            sortingFn: "datetime",
            Cell: ({ cell }) =>
              cell.row.original.createdOn
                ? formatDate(cell.row.original.createdOn)
                : "Not Created",
          },

          {
            accessorFn: (row) =>
              row.updatedOn ? formatDate(row.updatedOn) : "Not Updated",
            id: "updatedOn",
            header: "Updated On",
            filterVariant: "date",
            filterFn: "lessThan",
            sortingFn: "datetime",
            Cell: ({ cell }) =>
              cell.row.original.updatedOn
                ? formatDate(cell.row.original.updatedOn)
                : "Not Updated",
          },
          {
            id: "actions",
            header: "Actions",
            size: 200,
            Cell: ({ row }) => (
              <Box sx={{ display: "flex", gap: "0.5rem" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => toggleEditHospitalDialog(row.original)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteHospital(row.original.id)}
                >
                  Delete
                </Button>
              </Box>
            ),
          },
        ],
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: { showColumnFilters: true },
    manualFiltering: true, //turn off built-in client-side filtering
    manualPagination: true, //turn off built-in client-side pagination
    manualSorting: true, //turn off built-in client-side sorting
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderTopToolbarCustomActions: () => (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            marginLeft: 1,
          }}
        >
          <Box>
            <Button variant="contained" onClick={toggleAddHospitalDialog}>
              Add Hospital
            </Button>
            <Button
              variant="contained"
              sx={{
                color: "#ffffff",
                borderColor: "#4caf50",
                backgroundColor: "#4caf50",
                "&:hover": {
                  backgroundColor: "#388e3c",
                  borderColor: "#388e3c",
                },
                ml: 2,
              }}
              startIcon={<PeopleAltOutlinedIcon sx={{ color: "#ffffff" }} />}
              onClick={() => navigate(`/manage-hospital/patient-records`)}
            >
              View All Patients Records
            </Button>
          </Box>

          <Box>
            <Tooltip arrow title="Refresh Data">
              <IconButton onClick={() => refetch()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </>
    ),
    rowCount: meta,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: false,
      showProgressBars: isRefetching,
      sorting,
      showLoadingOverlay: false,
    },
    enableFullScreenToggle: false,
  });

  return (
    <>
      <ToastNotification />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ marginTop: "30px" }}>
          <MaterialReactTable table={table} />
          <OverLayLoader loading={isLoading} />
          <AddHospitalDialog
            open={isAddHospitalDialogOpen}
            onClose={toggleAddHospitalDialog}
            refresh={refetch}
          />
          <DeleteConfirmation
            open={isDeleteDialogOpen}
            onClose={toggleDeleteDialog}
            onDelete={deleteHospitalFromServer}
          />
          {isEditHospitalDialogOpen && selectedHospital && (
            <EditHospitalDialog
              open={isEditHospitalDialogOpen}
              onClose={() => setIsEditHospitalDialogOpen(false)}
              hospital={selectedHospital}
              refresh={refetch}
            />
          )}
        </Box>
      </LocalizationProvider>
    </>
  );
};

export default HospitalTable;
