import React from "react";
import { IconButton, Grid, Box, Button } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import AppAutocomplete from "../../../common/AppAutocomplete";
import InputBox from "../../../common/InputBox";
export default function AddMapping({ formik }) {
  const customerEntityTariffs = formik.values.customerEntityTariffs || [
    { chargeName: "", unitType: "", currency: "", unitRate: "" },
  ];
  // Static options for autocomplete
  const chargeNameOptions = [
    { label: "Agency Fees", value: "chargeName" },
  ];

  const unitType = [
    { label: "flat", value: "FLAT" },
    { label: "20ft", value: "20FT" },
    { label: "40ft", value: "40FT" },
    { label: "cbm", value: "CBM" },
  ];

  const currencyOptions = [
    { label: "KSH", value: "ksh" },
    { label: "USD", value: "usd" },
  ];

  const shipmentTypeOption = [
    { label: "IMPORT LOCAL", value: "IMPORT_LOCAL" },
    { label: "IMPORT TRANSIT", value: "IMPORT_TRANSIT" },
    { label: "EXPORT LOCAL", value: "EXPORT_LOCAL" },
    { label: "EXPORT TRANSIT", value: "EXPORT_TRANSIT" },
    { label: "AIR IMPORT LOCAL", value: "AIR_IMPORT_LOCAL" },
    { label: "AIR EXPORT LOCAL", value: "AIR_EXPORT_LOCAL" },
  ];

  // Handler to add a new row
  const addRow = () => {
    const newMappingRows = [
      ...customerEntityTariffs,
      { chargeName: "", unitType: "", currency: "", shipmentType: "", unitRate: "0" },
    ];
    formik.setFieldValue("customerEntityTariffs", newMappingRows);
  };

  // Handler to delete a row
  const deleteRow = (index) => {
    const newMappingRows = [...customerEntityTariffs];
    newMappingRows.splice(index, 1);
    formik.setFieldValue("customerEntityTariffs", newMappingRows);
  };

  // Handler to update row data
  const updateRow = (index, field, value) => {
    const newMappingRows = [...customerEntityTariffs];
    newMappingRows[index][field] = value;
    formik.setFieldValue("customerEntityTariffs", newMappingRows);
  };

  return (
    <>
    
      <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 1 }}>
        <Button
          startIcon={<Add />}
          onClick={addRow}
          variant="outlined"
          color="primary"
        >
          Add Tariff
        </Button>
      </Box>

      {customerEntityTariffs.map((row, index) => (
        <Grid container spacing={2} key={index} alignItems="center">
          <Grid item xs={12} sm={2} lg={2}>
            <AppAutocomplete
              label="Charge Name"
              id={`customerEntityTariffs-${index}-chargeName`}
              value={row.chargeName}
              options={chargeNameOptions}
              formik={formik}
              onChange={(value) => updateRow(index, "chargeName", value)}
              sx={{ marginTop: "16px", marginBottom: "8px" }}
            />
          </Grid>

          <Grid item xs={12} sm={3} lg={2}>
            <AppAutocomplete
              label="Unit Type"
              id={`customerEntityTariffs-${index}-unitType`}
              value={row.unitType}
              options={unitType}
              formik={formik}
              onChange={(value) => updateRow(index, "unitType", value)}
              sx={{ marginTop: "16px", marginBottom: "8px" }}
            />
          </Grid>

          <Grid item xs={12} sm={3} lg={2}>
            <AppAutocomplete
              label="Currency"
              id={`customerEntityTariffs-${index}-currency`}
              value={row.currency}
              options={currencyOptions}
              formik={formik}
              onChange={(value) => updateRow(index, "currency", value)}
              sx={{ marginTop: "16px", marginBottom: "8px" }}
            />
          </Grid>

          <Grid item xs={12} sm={3} lg={2}>
            <AppAutocomplete
              label="Shipment Type"
              id={`customerEntityTariffs-${index}-shipmentType`}
              value={row.shipmentType}
              options={shipmentTypeOption}
              formik={formik}
              onChange={(value) => updateRow(index, "shipmentType", value)}
              sx={{ marginTop: "16px", marginBottom: "8px" }}
            />
          </Grid>

          <Grid item xs={12} sm={3} lg={2}>
            <InputBox
              label="Unit Rate"
              id={`customerEntityTariffs-${index}-unitRate`}
              value={row.unitRate}
              onChange={(e) => updateRow(index, "unitRate", e.target.value)}
              sx={{ marginTop: "16px", marginBottom: "8px" }}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <IconButton
              color="error"
              onClick={() => deleteRow(index)}
              disabled={customerEntityTariffs.length === 1}
            >
              <Delete />
            </IconButton>
          </Grid>
        </Grid>
      ))}
    </>
  );
}
