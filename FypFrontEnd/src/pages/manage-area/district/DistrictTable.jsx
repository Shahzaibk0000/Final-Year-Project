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
  AddLocation as AddLocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import EditDistrictDialog from "./EditDistrictDialog.jsx";
import AddDistrictDialog from "./AddDistrictDialog.jsx";
import DeleteConfirmation from "@components/DeleteConfirmation";
import OverLayLoader from "@components/OverlayLoader";
import { formatDate } from "@utility";

const DistrictTable = () => {
  const [deleteDistrictId, setDeleteDistrictId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDistrictDialogOpen, setIsAddDistrictDialogOpen] = useState(false);
  const [isEditDistrictDialogOpen, setIsEditDistrictDialogOpen] =
    useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalCount, setTotalCount] = useState(0);

  const {
    data: { data = [], meta } = {},
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
        import.meta.env.VITE_REACT_APP_BASEURL + "/district/getTableData"
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

  const handleDeleteDistrict = (districtId) => {
    setDeleteDistrictId(districtId);
    setIsDeleteDialogOpen(true);
  };

  const toggleDeleteDialog = () => {
    setIsDeleteDialogOpen((prevOpen) => !prevOpen);
    if (!isDeleteDialogOpen) {
      setDeleteDistrictId(null);
    }
  };

  const deleteDistrictFromServer = async () => {
    try {
      if (deleteDistrictId) {
        await axios.delete(
          import.meta.env.VITE_REACT_APP_BASEURL +
            "/district/delete/" +
            deleteDistrictId
        );
        refetch();
      }
    } catch (error) {
      console.error("Error deleting district:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteDistrictId(null);
    }
  };

  const toggleEditDistrictDialog = (district) => {
    setSelectedDistrict(district);
    setIsEditDistrictDialogOpen((prevOpen) => !prevOpen);
  };

  const toggleAddDistrictDialog = () => {
    setIsAddDistrictDialogOpen((prevOpen) => !prevOpen);
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
            id: "division.name",
            accessorFn: (row) => row.division.name,
            header: "Division Name",
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
                  onClick={() => toggleEditDistrictDialog(row.original)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteDistrict(row.original.id)}
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
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    enableFullScreenToggle: false,

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
              startIcon={<AddLocationIcon sx={{ fontSize: "0.5rem" }} />}
              variant="contained"
              onClick={toggleAddDistrictDialog}
            >
              Add District
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
          <DeleteConfirmation
            open={isDeleteDialogOpen}
            onClose={toggleDeleteDialog}
            onDelete={deleteDistrictFromServer}
          />
          <AddDistrictDialog
            open={isAddDistrictDialogOpen}
            onClose={toggleAddDistrictDialog}
            refresh={refetch}
          />
          {isEditDistrictDialogOpen && selectedDistrict && (
            <EditDistrictDialog
              open={isEditDistrictDialogOpen}
              onClose={() => setIsEditDistrictDialogOpen(false)}
              district={selectedDistrict}
              refresh={refetch}
            />
          )}
        </Box>
      </LocalizationProvider>
    </>
  );
};

export default DistrictTable;
