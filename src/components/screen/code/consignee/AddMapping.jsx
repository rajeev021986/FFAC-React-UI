import React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";

export default function AddMapping({ formik, dropdownData, disabled }) {
  const consigneeEntityFreeDays = formik.values.consigneeEntityFreeDays || [
    { id: 1, item: "", freeDays: "", storageRate: ""},
  ];

  // Static options for dropdowns
  const itemNameOptions = [{ label: "Agency Fees", value: "Agency Fees" }];
  // const unitTypeOptions = dropdownData?.unitType || [
  //   { label: "Flat", value: "FLAT" },
  //   { label: "20ft", value: "20FT" },
  //   { label: "40ft", value: "40FT" },
  //   { label: "CBM", value: "CBM" },
  // ];
  // const currencyOptions = [
  //   { label: "KSH", value: "KSH" },
  //   { label: "USD", value: "USD" },
  // ];
  // const shipmentTypeOptions = dropdownData?.shipmentType || [
  //   { label: "IMPORT LOCAL", value: "IMPORT_LOCAL" },
  //   { label: "IMPORT TRANSIT", value: "IMPORT_TRANSIT" },
  //   { label: "EXPORT LOCAL", value: "EXPORT_LOCAL" },
  //   { label: "EXPORT TRANSIT", value: "EXPORT_TRANSIT" },
  //   { label: "AIR IMPORT LOCAL", value: "AIR_IMPORT_LOCAL" },
  //   { label: "AIR EXPORT LOCAL", value: "AIR_EXPORT_LOCAL" },
  // ];

  // Handler to add a new row
  const addRow = () => {
    const newRow = {
      id: Date.now(),
      item: "",
      freeDays: "",
      storageRate: "",
      // shipmentType: "",
      // unitRate: "0",
      // new:true
    };
    formik.setFieldValue("consigneeEntityFreeDays", [...consigneeEntityFreeDays, newRow]);
  };

  // Handler to delete a row
  const deleteRow = (id) => {
    const updatedRows = consigneeEntityFreeDays.filter((row) => row.id !== id);
    formik.setFieldValue("consigneeEntityFreeDays", updatedRows);
  };

  // Columns for DataGrid
  const columns = [
    {
      field: "item",
      headerName: "Item",
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: itemNameOptions.map((option) => option.label),
    },
    {
      field: "freeDays",
      headerName: "Free Days",
      flex: 1,
      editable: true,
    },
    {
      field: "storageRate",
      headerName: "Storage Rate",
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
          disabled={disabled || consigneeEntityFreeDays.length === 1}
        >
          Delete
        </Button>
      ),
    },
  ];

  // Handler to commit changes
  const handleProcessRowUpdate = (newRow, oldRow) => {
    const updatedRows = consigneeEntityFreeDays.map((row) =>
      row.id === newRow.id ? { ...row, ...newRow } : row
    );
    formik.setFieldValue("consigneeEntityFreeDays", updatedRows);
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
        
      </Button>
      <Box sx={{ height: 400, marginTop: 2 }}>
        <DataGrid
          rows={consigneeEntityFreeDays}
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
