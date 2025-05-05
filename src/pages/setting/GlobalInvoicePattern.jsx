import React from "react";
import { DataGrid, GridToolbarColumnsButton } from "@mui/x-data-grid";
import { useGridApiRef } from "@mui/x-data-grid";
import { Box, Grid } from "@mui/material";
import ResetNumberEdit from "../../components/utils/resetNumberEdit";

export default function GlovalInvoicePattern({ value, setvalue, title }) {
  const apiRef = useGridApiRef();

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "invoiceType",
      headerName: "Invoice Type",
      headerAlign: "center",
      align: "center",
      width: 200,
      editable: false,
      renderCell: (params) => <span>{params.row.invoiceType}</span>,
    },
    {
      field: "resetNumber",
      headerName: "Reset Number",
      width: 120,
      editable: false,
      align: "center",
      headerAlign: "center",
      renderEditCell: (params) => (
        <ResetNumberEdit
          id={params.id}
          value={params.value}
          field={params.field}
          api={params.api}
          row={params.row}
        />
      ),
    },
    {
      field: "invoicePattern",
      headerName: "Invoice Pattern",
      headerAlign: "center",
      align: "center",
      flex: 1,
      editable: false,
      renderCell: (params) => <span>{params.row.invoicePattern || ""}</span>,
      renderHeader: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ color: "white" }}>Invoice Pattern</span>
        </div>
      ),
    },
    {
      field: "sampleInvoiceNumber",
      headerName: "Sample Invoice Number",
      width: 250,
      align: "center",
      headerAlign: "center",
      editable: false,
      renderCell: (params) => (
        <span>{params.row.sampleInvoiceNumber || ""}</span>
      ),
    },
  ];

  return (
    <Grid item xs={12} md={10} sm={12}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "50px",
        }}
      >
        <h3>{title}</h3>
      </div>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          apiRef={apiRef}
          rows={value}
          editMode="cell"
          columns={columns}
          experimentalFeatures={{ newEditingApi: true }}
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "primary.main",
              lineHeight: 10,
            },
            "& .MuiDataGrid-cell": {
              whiteSpace: "normal",
              wordWrap: "break-word",
              fontSize: "14px",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              color: "#fff",
              fontSize: "14px",
            },
            "& .MuiDataGrid-sortIcon": {
              color: "#fff",
            },
            "& .MuiDataGrid-menuIconButton .MuiSvgIcon-root": {
              fill: "#fff",
            },
          }}
          disableRowSelectionOnClick
          autoHeight={false}
          hideFooter
          slots={{
            toolbar: () => (
              <Box
                sx={{ display: "flex", justifyContent: "space-between", p: 1 }}
              >
                <GridToolbarColumnsButton />
              </Box>
            ),
          }}
        />
      </div>
    </Grid>
  );
}
