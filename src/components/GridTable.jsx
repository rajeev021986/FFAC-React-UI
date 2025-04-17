import React from "react";
import { Box, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { appDateFormat } from "./utils/date";

function GridDataTable({ data }) {
  const columns = [
    {
      field: "displayName",
      headerName: "Display Name",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Tooltip title={params.value || "No Value"} arrow>
          <span>{params.value || ""}</span>
        </Tooltip>
      ),
      headerAlign: "center",
      align: "center",
    },
    {
      field: "oldValue",
      headerName: "Old Value",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Tooltip title={params.value || "No Value"} arrow>
          <span>{params.value || ""}</span>
        </Tooltip>
      ),
      headerAlign: "center",
      align: "center",
    },
    {
      field: "newValue",
      headerName: "New Value",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Tooltip title={params.value || "No Value"} arrow>
          <span>{params.value || ""}</span>
        </Tooltip>
      ),
      headerAlign: "center",
      align: "center",
    },
    {
      field: "modifiedBy",
      headerName: "Modified By",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Tooltip title={params.value || "No Value"} arrow>
          <span>{params.value || ""}</span>
        </Tooltip>
      ),
      headerAlign: "center",
      align: "center",
    },
  ];

  return (
    <Box sx={{ width: "100%", textAlign: "right" }}>
      <Box sx={{ height: 100 }}>
        <DataGrid
          rows={data}
          columns={columns}
          disableSelectionOnClick
          disableColumnMenu
          getRowId={(row) => row.id}
          hideFooter
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "primary.main",
              lineHeight: 10,
              height: "38px !important",
            },
            "& .MuiDataGrid-cell": {
              whiteSpace: "normal",
              wordWrap: "break-word",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              color: "#fff",
              fontSize: "14px",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "14px",
            },
            "& .MuiDataGrid-sortIcon": {
              color: "#fff",
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default GridDataTable;
