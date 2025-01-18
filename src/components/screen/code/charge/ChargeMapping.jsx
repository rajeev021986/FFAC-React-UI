import React, { useRef } from "react";
import { Box, Button, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Delete } from "@mui/icons-material";
import InputBoxForGrid from "../../../common/InputBoxForGrid";
import { StyledDataGrid } from "../../../common/Grid/styles";

export function ChargeMapping({ formik, disabled }) {
  const mappingDetail = formik.values.mappingDetails || [
    { id: 1, directIncome: "", directExpense: "" },
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
      directIncome: "",
      directExpense: "",
      new: true,
    };
    formik.setFieldValue("mappingDetails", [...mappingDetail, newRow]);
    setFocus();
  };

  // Handler to delete a row
  const deleteRow = (id) => {
    const updatedRows = mappingDetail.filter((row) => row.id !== id);
    formik.setFieldValue("mappingDetails", updatedRows);
  };

  // Columns for DataGrid
  const columns = [
    {
      field: "directIncome",
      headerName: "Direct Income",
      flex: 1,
      editable: true,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <InputBoxForGrid
          {...params}
          placeholder="Enter direct income"
          inputRef={newRowRef}
        />
      ),
      renderEditCell: (params) => (
        <InputBoxForGrid
          {...params}
          placeholder="Enter direct income"
          inputRef={newRowRef}
        />
      ),
    },
    {
      field: "directExpense",
      headerName: "Direct Expense",
      flex: 1,
      editable: true,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <InputBoxForGrid {...params} placeholder="Enter direct expense" />
      ),
      renderEditCell: (params) => (
        <InputBoxForGrid {...params} placeholder="Enter direct expense" />
      ),
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
    const updatedRows = mappingDetail.map((row) =>
      row.id === newRow.id ? { ...row, ...newRow } : row
    );
    formik.setFieldValue("mappingDetails", updatedRows);
    return newRow;
  };

  return (
    <Box sx={{ width: "100%", marginTop: "8px" }}>
      <Box sx={{ height: 400 }}>
        <StyledDataGrid
          rows={mappingDetail}
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
