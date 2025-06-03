import React, { useRef } from "react";
import { Box, Button, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AutoCompleteInput from "../../components/common/AutoCompletInput";
import { StyledDataGrid } from "../../components/common/Grid/styles";
import { Delete } from "@mui/icons-material";

export function VesselMapping({ formik, disabled }) {
  const vesselLineEntity = formik.values.vesselLineEntities || [
    { id: 1, vesselId: "", shippingLine: "" },
  ];
  const newRowRef = useRef(null);
  const setFocus = () => {
    setTimeout(() => {
      if (newRowRef.current) {
        newRowRef.current.focus();
      }
    }, 1000);
  };
  // Handler to add a new row
  const addRow = () => {
    const newRow = {
      id: Date.now(),
      vesselId: "",
      shippingLine: "",
      new: true,
    };
    formik.setFieldValue("vesselLineEntities", [...vesselLineEntity, newRow]);
    setFocus();
  };

  // Handler to delete a row
  const deleteRow = (id) => {
    const updatedRows = vesselLineEntity.filter((row) => row.id !== id);
    formik.setFieldValue("vesselLineEntities", updatedRows);
  };

  // Columns for DataGrid
  const columns = [
    {
      field: "vesselId",
      headerName: "Vessel Name",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <AutoCompleteInput
          id="vesselId"
          suggestionName="vessel_name"
          value={params.value}
          error={formik.errors.vesselLineEntities?.[params.rowIndex]?.vesselId}
          onChange={(newValue) => {
            const rowIndex = formik.values.vesselLineEntities.findIndex(
              (entity) => entity.id == params.id
            );
            formik.setValues({
              ...formik.values,
              vesselLineEntities: formik.values.vesselLineEntities.map(
                (entity, index) =>
                  index === rowIndex
                    ? { ...entity, vesselId: newValue }
                    : entity
              ),
            });
          }}
          inputRef={newRowRef}
        />
      ),
    },
    {
      field: "shippingLine",
      headerName: "Shipping Line",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <AutoCompleteInput
            id="shippingLine"
            suggestionName="type"
            value={params.value}
            error={
              formik.errors.vesselLineEntities?.[params.rowIndex]?.shippingLine
            }
            onChange={(newValue) => {
              const rowIndex = formik.values.vesselLineEntities.findIndex(
                (entity) => entity.id === params.id
              );
              formik.setValues({
                ...formik.values,
                vesselLineEntities: formik.values.vesselLineEntities.map(
                  (entity, index) =>
                    index === rowIndex
                      ? { ...entity, shippingLine: newValue }
                      : entity
                ),
              });
            }}
          />
        );
      },
    },

    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <IconButton color="white">
          <AddCircleIcon onClick={addRow} />
        </IconButton>
      ),
      renderCell: (params) => (
        <Button
          color="error"
          onClick={() => deleteRow(params.row.id)}
          disabled={disabled}
        >
          <Delete />
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
    <Box sx={{ width: "100%", marginTop: "8px" }}>
      <Box sx={{ height: 400 }}>
        <StyledDataGrid
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
