import { useMemo } from "react";
import { Box, lighten } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";
import { formatDate } from "@utility";
// eslint-disable-next-line react/prop-types
const PredictiveTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        id: "table",
        header: "",
        columns: [
          {
            accessorFn: (row) => (row.Date ? row.Date : "No Date"),
            id: "Date",
            header: "Date",
            filterVariant: "Date",
            filterFn: "lessThan",
            sortingFn: "datetime",
            Cell: ({ cell }) =>
              cell.row.original.Date ? cell.row.original.Date : "No Date",
          },
          {
            id: "PredictedPatients",
            accessorKey: "PredictedPatients",
            header: "Predictive Patient Count",
            size: 150,
          },
          {
            id: "OxygenCylindersRequired",
            accessorKey: "OxygenCylindersRequired",
            header: "Oxygen Cylinders Required",
            size: 150,
          },
          {
            id: "VentilatorsRequired",
            accessorKey: "VentilatorsRequired",
            header: "Ventilators Required",
            size: 150,
          },
        ],
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: data,
    getRowId: (originalRow) => originalRow.id,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: false,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: false,
    enableRowSelection: false,
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: false,
      pagination: { pageSize: 6, pageIndex: 0 },
    },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    muiPaginationProps: {
      color: "secondary",
      shape: "rounded",
      variant: "outlined",
    },
    muiTablePaginationProps: {
      rowsPerPageOptions: [],
      labelRowsPerPage: null,
      SelectProps: {
        hidden: true, // Hide the select component
      },
    },
    muiTablePaperProps: {
      sx: {
        maxHeight: "700px",
        mb: 3,
      },
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
        </Box>
      );
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <style>
        {`
          .MuiBox-root.css-exd1zr {
            display: none;
          }
            .MuiBox-root.css-ompuv2{
            display: none;
        }
            .MuiTableCell-root.MuiTableCell-head.MuiTableCell-alignCenter.MuiTableCell-sizeMedium.css-fgs4o8-MuiTableCell-root
            {
              display: none;
            }
              .MuiBox-root.css-c2cgq0
              {
              display: none;
        }
              
        `}
      </style>
      <MaterialReactTable table={table} rowsPerPageOptions={[]} />
    </LocalizationProvider>
  );
};

export default PredictiveTable;
