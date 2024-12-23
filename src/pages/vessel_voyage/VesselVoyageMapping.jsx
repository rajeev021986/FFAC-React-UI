import React from "react";
import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export function VesselVoyageMapping({ formik, disabled }) {
  const vesselLineEntity = formik.values.vesselLineEntities || [
    { id: 1, vesselName: "", shippingLine: "" },
  ];
  // Handler to add a new row
  const addRow = () => {
    const newRow = {
      id: Date.now(),
      vesselName: "",
      shippingLine: "",
      new: true,
    };
    formik.setFieldValue("vesselLineEntities", [...vesselLineEntity, newRow]);
  };

  // Handler to delete a row
  const deleteRow = (id) => {
    const updatedRows = vesselLineEntity.filter((row) => row.id !== id);
    formik.setFieldValue("vesselLineEntities", updatedRows);
  };

  // Columns for DataGrid
  const columns = [
    {
      field: "vesselName",
      headerName: "Vessel Name",
      flex: 1,
      editable: true,
    },
    {
      field: "shippingLine",
      headerName: "Shipping Line",
      flex: 1,
      editable: true,
    },

    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => (
        <Button
          color="error"
          onClick={() => deleteRow(params.row.id)}
          disabled={disabled || vesselLineEntity.length === 1}
        >
          Delete
        </Button>
      ),
    },
  ];

  // Handler to commit changes
  const handleProcessRowUpdate = (newRow, oldRow) => {
    const updatedRows = vesselLineEntity.map((row) =>
      row.id === newRow.id ? { ...row, ...newRow } : row
    );
    formik.setFieldValue("vesselLineEntities", updatedRows);
    return newRow;
  };

  return (
    <Box sx={{ width: "100%", marginTop: 2 }}>
      <Button
        startIcon={<Add />}
        onClick={addRow}
        variant="outlined"
        color="primary"
        disabled={disabled}
      >
        Add Line
      </Button>
      <Box sx={{ height: 400, marginTop: 2 }}>
        <DataGrid
          rows={vesselLineEntity}
          columns={columns}
          disableSelectionOnClick
          processRowUpdate={handleProcessRowUpdate}
          experimentalFeatures={{ newEditingApi: true }}
          getRowId={(row) => row.id}
          disableColumnMenu
        />
      </Box>
    </Box>
  );
}
