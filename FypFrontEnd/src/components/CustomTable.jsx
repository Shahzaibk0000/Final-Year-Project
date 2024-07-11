/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useMemo } from "react";
import {
  AddLocation as AddLocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";
import { Box, Button, lighten } from "@mui/material";

const DataColumns = ({ tablecolumns, data, title, handleAdd }) => {
  const columns = useMemo(
    () => [
      {
        id: "table",
        header: "",
        columns: tablecolumns,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: false,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: false,
    enableRowSelection: false,

    initialState: { showColumnFilters: true, showGlobalFilter: true },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [5, 10, 20, 30],
      shape: "rounded",
      variant: "outlined",
    },
    renderTopToolbar: ({ table }) => {
      return (
        <Box
          sx={(theme) => ({
            backgroundColor: lighten(theme.palette.background.default, 0.05),
            display: "flex",
            gap: "0.5rem",
            p: "8px",
            justifyContent: "space-between",
          })}
        >
          <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <MRT_GlobalFilterTextField table={table} />
            <MRT_ToggleFiltersButton table={table} />
          </Box>
          <Box>
            <Box sx={{ display: "flex", gap: "0.5rem" }}>
              <Button
                variant="contained"
                startIcon={<AddLocationIcon sx={{ fontSize: "0.5rem" }} />}
                onClick={handleAdd}
              >
                Add {title}
              </Button>
            </Box>
          </Box>
        </Box>
      );
    },
  });

  return <MaterialReactTable table={table} />;
};

const CustomTable = ({ tablecolumns, data, title, handleAdd }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DataColumns
        tablecolumns={tablecolumns}
        data={data}
        title={title}
        handleAdd={handleAdd}
      />
    </LocalizationProvider>
  );
};

export default CustomTable;
