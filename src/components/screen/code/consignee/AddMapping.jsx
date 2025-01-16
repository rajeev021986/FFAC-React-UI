import React,{ useRef }from "react";
import { Box, Button,IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Delete } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";
import { StyledDataGrid } from "../../../common/Grid/styles";

export default function AddMapping({ formik, dropdownData, disabled }) {
  const consigneeEntityFreeDays = formik.values.consigneeEntityFreeDays || [
    { id: 1, item: "", freeDays: "", storageRate: ""},
  ];

  // Static options for dropdowns
  const itemNameOptions = [{ label: "ANODE", value: "ANODE" },
    { label: "CATHODE", value: "CATHODE" },
    { label: "ELECTROLYTE", value: "ELECTROLYTE"},
    { label: "COPPER CEMENT", value: "COPPER CEMENT" },
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
      item: "",
      freeDays: "",
      storageRate: "",
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
    const updatedRows = consigneeEntityFreeDays.map((row) =>
      row.id === newRow.id ? { ...row, ...newRow } : row
    );
    formik.setFieldValue("consigneeEntityFreeDays", updatedRows);
    return newRow;
  };

  return (
    <Box sx={{ width: "100%", textAlign:"right" }}>
      <Box
              sx={{
                height: 400,
              }}
            >
      <Button
        startIcon={<Add />}
        onClick={addRow}
        variant="outlined"
        color="primary"
        disabled={disabled}
      >
        Add Free Days
      </Button>
      <Box sx={{ height: 400, marginTop: 2 }}>
        <StyledDataGrid
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
    </Box>
  );
}
