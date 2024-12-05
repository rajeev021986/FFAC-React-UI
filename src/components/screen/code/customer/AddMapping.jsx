import React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";

export default function AddMapping({ formik, dropdownData, disabled }) {
  const customerEntityTariffs = formik.values.customerEntityTariffs || [
    { id: 1, chargeName: "", unitType: "", currency: "", shipmentType: "", unitRate: "" },
  ];

  // Static options for dropdowns
  const chargeNameOptions = [{ label: "Agency Fees", value: "Agency Fees" }];
  const unitTypeOptions = dropdownData?.unitType || [
    { label: "Flat", value: "FLAT" },
    { label: "20ft", value: "20FT" },
    { label: "40ft", value: "40FT" },
    { label: "CBM", value: "CBM" },
  ];
  const currencyOptions = [
    { label: "KSH", value: "KSH" },
    { label: "USD", value: "USD" },
  ];
  const shipmentTypeOptions = dropdownData?.shipmentType || [
    { label: "IMPORT LOCAL", value: "IMPORT_LOCAL" },
    { label: "IMPORT TRANSIT", value: "IMPORT_TRANSIT" },
    { label: "EXPORT LOCAL", value: "EXPORT_LOCAL" },
    { label: "EXPORT TRANSIT", value: "EXPORT_TRANSIT" },
    { label: "AIR IMPORT LOCAL", value: "AIR_IMPORT_LOCAL" },
    { label: "AIR EXPORT LOCAL", value: "AIR_EXPORT_LOCAL" },
  ];

  // Handler to add a new row
  const addRow = () => {
    const newRow = {
      id: Date.now(),
      chargeName: "",
      unitType: "",
      currency: "",
      shipmentType: "",
      unitRate: "0",
    };
    formik.setFieldValue("customerEntityTariffs", [...customerEntityTariffs, newRow]);
  };

  // Handler to delete a row
  const deleteRow = (id) => {
    const updatedRows = customerEntityTariffs.filter((row) => row.id !== id);
    formik.setFieldValue("customerEntityTariffs", updatedRows);
  };

  // Columns for DataGrid
  const columns = [
    {
      field: "chargeName",
      headerName: "Charge Name",
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: chargeNameOptions.map((option) => option.label),
    },
    {
      field: "unitType",
      headerName: "Unit Type",
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: unitTypeOptions.map((option) => option.label),
    },
    {
      field: "currency",
      headerName: "Currency",
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: currencyOptions.map((option) => option.label),
    },
    {
      field: "shipmentType",
      headerName: "Shipment Type",
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: shipmentTypeOptions.map((option) => option.label),
    },
    {
      field: "unitRate",
      headerName: "Unit Rate",
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
          disabled={disabled || customerEntityTariffs.length === 1}
        >
          Delete
        </Button>
      ),
    },
  ];

  // Handler to commit changes
  const handleProcessRowUpdate = (newRow, oldRow) => {
    const updatedRows = customerEntityTariffs.map((row) =>
      row.id === newRow.id ? { ...row, ...newRow } : row
    );
    formik.setFieldValue("customerEntityTariffs", updatedRows);
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
        Add Tariff
      </Button>
      <Box sx={{ height: 400, marginTop: 2 }}>
        <DataGrid
          rows={customerEntityTariffs}
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
