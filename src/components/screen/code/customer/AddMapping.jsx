import React, { useEffect, useRef, useState } from "react";
import { Box, Button, IconButton, styled, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Delete } from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AutoCompleteInput from "../../../common/AutoCompletInput";
import ApiManager from "../../../../services/ApiManager";
import { StyledDataGrid } from "../../../common/Grid/styles";
import SelectBox from "../../../common/SelectBox";
import InputBoxForGrid from "../../../common/InputBoxForGrid";
import { useGetOptionsSettingsQuery } from "../../../../store/api/settingsApi";

export default function AddMapping({ formik, dropdownData, disabled }) {
  const [mergedCurrencyOptions, setMergedCurrencyOptions] = useState([]);
  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("common_settings");
  const customerEntityTariffs = formik.values.customerEntityTariffs || [
    {
      id: 1,
      chargeId: "",
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

  const shipmentTypeOptions = dropdownData?.shipmentType || [
    { label: "IMPORT LOCAL", value: "IMPORT_LOCAL" },
    { label: "IMPORT TRANSIT", value: "IMPORT_TRANSIT" },
    { label: "EXPORT LOCAL", value: "EXPORT_LOCAL" },
    { label: "EXPORT TRANSIT", value: "EXPORT_TRANSIT" },
    { label: "AIR IMPORT LOCAL", value: "AIR_IMPORT_LOCAL" },
    { label: "AIR EXPORT LOCAL", value: "AIR_EXPORT_LOCAL" },
  ];

  const newRowRef = useRef(null);
  const setFocus = () => {
    setTimeout(() => {
      if (newRowRef.current) {
        newRowRef.current.focus();
      }
    }, 1000);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiManager.fetchAutoCompleteData(
          "",
          "COMPANY_CODE"
        );
        const backendData = await response.body;

        // Extract backend currencies safely
        const backendCurrencies = Array.from(
          new Set(
            (backendData || []).map((item) => item.currency).filter(Boolean)
          )
        ).map((curr) => ({ id: curr, value: curr }));

        // Get setting currencies safely
        const settingCurrencies = optionsSettingsData?.body?.currencyType || [];

        // Merge both arrays avoiding duplicates (based on `value`)
        const mergedCurrencies = [
          ...backendCurrencies,
          ...settingCurrencies.filter(
            (setting) =>
              !backendCurrencies.some((item) => item.value === setting.value)
          ),
        ];

        setMergedCurrencyOptions(mergedCurrencies);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [optionsSettingsData?.body?.currencyType]);
  // Handler to add a new row
  const addRow = () => {
    const newRow = {
      id: Date.now(),
      chargeId: "",
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
    setFocus();
  };

  const deleteRow = (id) => {
    const updatedRows = customerEntityTariffs.filter((row) => row.id !== id);
    formik.setFieldValue("customerEntityTariffs", updatedRows);
  };

  const updateRowValue = (params, e, name) => {
    const rowIndex = formik.values[name].findIndex(
      (entity) => entity.id === params.id
    );
    formik.setValues({
      ...formik.values,
      [name]: formik.values[name].map((entity, index) =>
        index === rowIndex
          ? { ...entity, [params.field]: e.target.value }
          : entity
      ),
    });
  };

  // Columns for DataGrid
  const columns = [
    {
      field: "chargeId",
      headerName: "Charge Name",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <AutoCompleteInput
            id="chargeId"
            suggestionName="charge_name"
            value={params.row?.chargeId}
            error={
              formik.errors.customerEntityTariffs?.[params.rowIndex]?.chargeId
            }
            onChange={(newValue) => {
              const rowIndex = formik.values.customerEntityTariffs.findIndex(
                (entity) => entity.id == params.id
              );
              // setTimeout(() => {
              formik.setValues({
                ...formik.values,
                customerEntityTariffs: formik.values.customerEntityTariffs.map(
                  (entity, index) =>
                    index === rowIndex
                      ? { ...entity, chargeId: newValue }
                      : entity
                ),
              });
              // }, 1500);
            }}
            inputRef={newRowRef}
          />
        );
      },
    },
    {
      field: "unitType",
      headerName: "Unit Type",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Tooltip
          title={params.value ? `${params.value}` : "This field is empty"}
          arrow
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            {" "}
            <SelectBox
              size="small"
              sx={{
                marginTop: "0px",
                marginBottom: "0px",
                fontSize: "14px",
              }}
              options={unitTypeOptions}
              value={params.value}
              placeholder={true}
              onChange={(e) =>
                updateRowValue(params, e, "customerEntityTariffs")
              }
            />
          </div>
        </Tooltip>
      ),
    },

    {
      field: "currency",
      headerName: "Currency",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <SelectBox
              placeholder={true}
              size="small"
              sx={{
                marginTop: "0px",
                marginBottom: "0px",
                fontSize: "14px",
              }}
              options={mergedCurrencyOptions}
              value={params.value}
              onChange={(e) =>
                updateRowValue(params, e, "customerEntityTariffs")
              }
            />
          </div>
        );
      },
    },
    {
      field: "shipmentType",
      headerName: "Shipment Type",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Tooltip
          title={params.value ? `${params.value}` : "This field is empty"}
          arrow
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            {" "}
            <SelectBox
              size="small"
              sx={{
                marginTop: "0px",
                marginBottom: "0px",
                fontSize: "14px",
              }}
              options={shipmentTypeOptions}
              value={params.value}
              placeholder={true}
              onChange={(e) =>
                updateRowValue(params, e, "customerEntityTariffs")
              }
            />
          </div>
        </Tooltip>
      ),
    },
    {
      field: "unitRate",
      headerName: "Unit Rate",
      flex: 1,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderCell: (params) => (
        <Tooltip
          title={params.value ? `${params.value}` : "This field is empty"}
          arrow
        >
          <InputBoxForGrid {...params} fieldType="number" />
        </Tooltip>
      ),
      renderEditCell: (params) => (
        <Tooltip
          title={params.value ? `${params.value}` : "This field is empty"}
          arrow
        >
          <InputBoxForGrid {...params} fieldType="number" />
        </Tooltip>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 0,
      renderHeader: () => (
        <IconButton color="white">
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
    <Box sx={{ width: "100%", textAlign: "right" }}>
      <Box
        sx={{
          height: 400,
        }}
      >
        <StyledDataGrid
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
