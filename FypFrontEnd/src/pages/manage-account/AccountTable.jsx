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
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import EditUserDialog from "./EditUserDialog";
import AddUserDialog from "./AddUserDialog";
import DeleteConfirmation from "@components/DeleteConfirmation";
import OverLayLoader from "@components/OverlayLoader";
import { formatDate } from "@utility";

const AccountTable = () => {
  const [deleteAccountId, setDeleteAccountId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [passwordVisibility, setPasswordVisibility] = useState({});

  const {
    data: { data = [], meta } = {}, // Initialize data as an empty array
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
      const fetchURL = new URL(
        import.meta.env.VITE_REACT_APP_BASEURL + "/user/getTableData"
      );
      fetchURL.searchParams.set(
        "start",
        `${pagination.pageIndex * pagination.pageSize}`
      );
      fetchURL.searchParams.set("size", `${pagination.pageSize}`);
      fetchURL.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
      fetchURL.searchParams.set("sorting", JSON.stringify(sorting ?? []));
      fetchURL.searchParams.set("globalFilter", globalFilter ?? "");
      const response = await axios.get(fetchURL.href);
      setTotalCount(response.data.totalCount);
      return {
        data: response.data.content,
        meta: response.data.totalCount,
      };
    },
  });
  const [initialize, setInitialize] = useState(false);

  // Function to toggle full screen - just for reference, you might not need it
  function handleClick() {
    var header = document.querySelector("header");

    var computedStyle = window.getComputedStyle(header);
    if (computedStyle.display === "flex") {
      header.style.display = "none";
    } else {
      header.style.display = "flex";
    }
  }

  // Function to initialize button - just for reference, you might not need it
  function initializeButton() {
    var button = document.querySelector(
      'button.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium.css-riw2ar-MuiButtonBase-root-MuiIconButton-root[aria-label="Toggle full screen"]'
    );

    var header = document.querySelector("header");
    header.style.display = "flex";

    button.addEventListener("click", handleClick);
  }

  useEffect(() => {
    if (!initialize) {
      setTimeout(() => {
        initializeButton();
      }, 2000);
      setInitialize(true);
    }
  }, []);

  const handleDeleteAccount = (accountId) => {
    setDeleteAccountId(accountId);
    setIsDeleteDialogOpen(true);
  };

  const toggleDeleteDialog = () => {
    setIsDeleteDialogOpen((prevOpen) => !prevOpen);
    if (!isDeleteDialogOpen) {
      setDeleteAccountId(null);
    }
  };

  const deleteAccountFromServer = async () => {
    try {
      if (deleteAccountId) {
        await axios.delete(
          import.meta.env.VITE_REACT_APP_BASEURL +
            "/user/delete/" +
            deleteAccountId
        );
        refetch();
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteAccountId(null);
    }
  };

  const toggleEditUserDialog = (account) => {
    setSelectedAccount(account);
    setIsEditUserDialogOpen((prevOpen) => !prevOpen);
  };

  const toggleAddUserDialog = () => {
    setIsAddUserDialogOpen((prevOpen) => !prevOpen);
  };

  const handleTogglePasswordVisibility = (accountId) => {
    setPasswordVisibility((prevVisibility) => ({
      ...prevVisibility,
      [accountId]: !prevVisibility[accountId],
    }));
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 100,
      },
      {
        accessorFn: (row) => `${row.firstName}`,
        id: "firstName",
        header: "First Name",
        size: 200,
        Cell: ({ renderedCellValue, row }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <img
              alt="avatar"
              height={30}
              src={`data:image/jpeg;base64,${
                row.original.profilePicture == null
                  ? ""
                  : row.original.profilePicture
              }`}
              loading="lazy"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <span>{renderedCellValue}</span>
          </Box>
        ),
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        size: 200,
      },
      {
        accessorKey: "usertype",
        header: "User Type",
        size: 150,
      },
      {
        accessorKey: "contact",
        header: "Contact",
        size: 150,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 250,
      },
      {
        accessorKey: "password",
        header: "Password",
        size: 150,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <span>
              {passwordVisibility[row.original.id]
                ? row.original.password
                : "***********"}
            </span>
            <IconButton
              onClick={() => handleTogglePasswordVisibility(row.original.id)}
              aria-label="toggle password visibility"
              size="small"
              sx={{ fontSize: "20px", bottom: 4, marginLeft: 1 }}
            >
              {passwordVisibility[row.original.id] ? (
                <VisibilityOffIcon sx={{ fontSize: "20px" }} />
              ) : (
                <VisibilityIcon sx={{ fontSize: "20px" }} />
              )}
            </IconButton>
          </Box>
        ),
      },
      {
        accessorFn: (row) =>
          row.province != null ? row.province.name : "No Province",
        id: "province.name",
        header: "Province Name",
        size: 150,
      },
      {
        accessorFn: (row) =>
          row.division != null ? row.division.name : "No Division",
        id: "division.name",
        header: "Division Name",
        size: 150,
      },
      {
        accessorFn: (row) =>
          row.district != null ? row.district.name : "No District",
        id: "district.name",
        header: "District Name",
        size: 150,
      },
      {
        accessorFn: (row) =>
          row.tehsil != null ? row.tehsil.name : "No Tehsil",
        id: "tehsil.name",
        header: "Tehsil Name",
        size: 150,
      },
      {
        accessorFn: (row) =>
          row.hospital != null ? row.hospital.name : "No Hospital",
        id: "hospital.name",
        header: "Hospital Name",
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
              onClick={() => toggleEditUserDialog(row.original)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleDeleteAccount(row.original.id)}
            >
              Delete
            </Button>
          </Box>
        ),
      },
    ],
    [passwordVisibility]
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
            <Button
              startIcon={<PersonAddIcon sx={{ fontSize: "0.5rem" }} />}
              variant="contained"
              onClick={toggleAddUserDialog}
            >
              Add User
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
  });

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ marginTop: "30px" }}>
          <MaterialReactTable table={table} />
          <OverLayLoader loading={isLoading} />
          <AddUserDialog
            open={isAddUserDialogOpen}
            onClose={toggleAddUserDialog}
            refresh={refetch}
          />
          <DeleteConfirmation
            open={isDeleteDialogOpen}
            onClose={toggleDeleteDialog}
            onDelete={deleteAccountFromServer}
          />
          {isEditUserDialogOpen && selectedAccount && (
            <EditUserDialog
              open={isEditUserDialogOpen}
              onClose={() => setIsEditUserDialogOpen(false)}
              account={selectedAccount}
              refresh={refetch}
            />
          )}
        </Box>
      </LocalizationProvider>
    </>
  );
};

export default AccountTable;
