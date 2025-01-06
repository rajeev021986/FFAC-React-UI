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
      minWidth: 150,
      renderCell: (params) => (
        <Tooltip title={params.value || "No Value"} arrow>
          <span>{params.value || "N/A"}</span>
        </Tooltip>
      ),
      headerAlign: "center",
      align: "center",
    },
    {
      field: "oldValue",
      headerName: "Old Value",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Tooltip title={params.value || "No Value"} arrow>
          <span>{params.value || "N/A"}</span>
        </Tooltip>
      ),
      headerAlign: "center",
      align: "center",
    },
    {
      field: "newValue",
      headerName: "New Value",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Tooltip title={params.value || "No Value"} arrow>
          <span>{params.value || "N/A"}</span>
        </Tooltip>
      ),
      headerAlign: "center",
      align: "center",
    },
    {
      field: "modifiedBy",
      headerName: "Modified By",
      flex: 1,
      minWidth: 110,
      renderCell: (params) => (
        <Tooltip title={params.value || "No Value"} arrow>
          <span>{params.value || "N/A"}</span>
        </Tooltip>
      ),
      headerAlign: "center",
      align: "center",
    },
    {
      field: "modifiedDate",
      headerName: "Modified Date",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Tooltip title={params.value || "No Value"} arrow>
          <span>{appDateFormat(params.value) || "N/A"}</span>
        </Tooltip>
      ),
      headerAlign: "center",
      align: "center",
    },
  ];

  return (
    <Box sx={{ width: "100%", textAlign: "right" }}>
      <Box sx={{ height: "auto" }}>
        <DataGrid
          rows={data}
          columns={columns}
          disableSelectionOnClick
          disableColumnMenu
          getRowId={(row) => row.id}
          autoHeight={true}
          hideFooter
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "primary.main",
              lineHeight: 10,
            },
            "& .MuiDataGrid-cell": {
              whiteSpace: "normal",
              wordWrap: "break-word",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              color: "#fff",
              fontSize: "15px",
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default GridDataTable;
