import React from "react";
import { Box, Button, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Delete } from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AutoCompleteInput from "../../../common/AutoCompletInput";
import ApiManager from "../../../../services/ApiManager";
export default function AddMapping({ formik, dropdownData, disabled }) {
  const customerEntityTariffs = formik.values.customerEntityTariffs || [
    {
      id: 1,
      chargeName: "",
      unitType: "",
      currency: "",
      shipmentType: "",
      unitRate: "",
    },
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
      new: true,
    };
    formik.setFieldValue("customerEntityTariffs", [
      ...customerEntityTariffs,
      newRow,
    ]);
  };
  const deleteRow = (id) => {
    const updatedRows = customerEntityTariffs.filter((row) => row.id !== id);
    formik.setFieldValue("customerEntityTariffs", updatedRows);
  };
  const fetchSuggestions = async (inputValue, inputId) => {
    inputId = inputId === "chargeName" ? "CHARGE" : "CURRENCY";
    if (!inputValue) return [];

    const response = await ApiManager.fetchVesselSuggestions(
      inputValue,
      inputId
    );
    const data = await response.body;

    return data || [];
  };
  // Columns for DataGrid
  const columns = [
    {
      field: "chargeName",
      headerName: "Charge Name",
      flex: 1,
      renderCell: (params) => {
        return (
          <AutoCompleteInput
            id="chargeName"
            suggestionName="charge_name"
            value={params.value}
            error={
              formik.errors.customerEntityTariffs?.[params.rowIndex]?.chargeName
            }
            onChange={(newValue) => {
              const rowIndex = formik.values.customerEntityTariffs.findIndex(
                (entity) => entity.id === params.id
              );
              // setTimeout(() => {
              formik.setValues({
                ...formik.values,
                customerEntityTariffs: formik.values.customerEntityTariffs.map(
                  (entity, index) =>
                    index === rowIndex
                      ? { ...entity, chargeName: newValue }
                      : entity
                ),
              });
              // }, 1500);
            }}
            fetchSuggestions={fetchSuggestions}
          />
        );
      },
      headerAlign: "center",
      align: "center",
    },
    {
      field: "unitType",
      headerName: "Unit Type",
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: unitTypeOptions.map((option) => option.value),
      headerAlign: "center",
      align: "center",
    },
    {
      field: "currency",
      headerName: "Currency",
      flex: 1,
      renderCell: (params) => {
        return (
          <AutoCompleteInput
            id="currency"
            suggestionName="currency"
            value={params.value}
            error={
              formik.errors.customerEntityTariffs?.[params.rowIndex]?.chargeName
            }
            onChange={(newValue) => {
              const rowIndex = formik.values.customerEntityTariffs.findIndex(
                (entity) => entity.id === params.id
              );
              formik.setValues({
                ...formik.values,
                customerEntityTariffs: formik.values.customerEntityTariffs.map(
                  (entity, index) =>
                    index === rowIndex
                      ? { ...entity, currency: newValue }
                      : entity
                ),
              });
            }}
            fetchSuggestions={fetchSuggestions}
          />
        );
      },
      headerAlign: "center",
      align: "center",
    },
    {
      field: "shipmentType",
      headerName: "Shipment Type",
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: shipmentTypeOptions.map((option) => option.value),
      headerAlign: "center",
      align: "center",
    },
    {
      field: "unitRate",
      headerName: "Unit Rate",
      flex: 1,
      editable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderHeader: () => (
        <IconButton color="primary">
          <AddCircleIcon onClick={addRow} />
        </IconButton>
      ),
      renderCell: (params) => (
        <Button
          disabled={disabled}
          color="error"
          onClick={() => deleteRow(params.row.id)}
          // disabled={disabled || customerEntityTariffs.length === 1}
        >
          <Delete />
        </Button>
      ),
      headerAlign: "center",
      align: "center",
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
    <Box sx={{ width: "100%", marginTop: 2, textAlign: "right" }}>
      {/* <Button
        variant="contained"
        startIcon={<Add />}
        onClick={addRow}
        disabled={disabled}
        sx={{ borderRadius: "17px 18px 18px 17px", margin: "5px" }}
      >
        Add Tariff
      </Button> */}
      <Box
        sx={{
          height: 400,
          marginTop: 2,
        }}
      >
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
