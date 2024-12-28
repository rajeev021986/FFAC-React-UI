import React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { Delete } from "@mui/icons-material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';

export default function FilesGrid({ formik, disabled }) {
  const customerEntityEmailsIds = formik.values.customerEntityEmailsIds || [
    { id: 1, emailId: "", designation: "" },
  ];

  // Handler to add a new row
  const addNewRow = () => {
    const newRow = { id: Date.now(), emailId: "", designation: "", new: true };
    formik.setFieldValue("customerEntityEmailsIds", [
      ...customerEntityEmailsIds,
      newRow,
    ]);
  };

  // Handler to delete a row
  const deleteRow = (id) => {
    const updatedRows = customerEntityEmailsIds.filter((row) => row.id !== id);
    formik.setFieldValue("customerEntityEmailsIds", updatedRows);
  };

  // Handle row updates
  const handleProcessRowUpdate = (newRow, oldRow) => {
    const updatedRows = customerEntityEmailsIds.map((row) =>
      row.id === newRow.id ? { ...row, ...newRow } : row
    );
    formik.setFieldValue("customerEntityEmailsIds", updatedRows);
    return newRow;
  };

  // Columns for DataGrid
  const columns = [
    {
      field: "designation",
      headerName: "Designation",
      flex: 1,
      editable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "emailId",
      headerName: "Email ID",
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
          <AddCircleIcon onClick={addNewRow} />
        </IconButton>),
      renderCell: (params) => (
        <Button
          color="error"
          onClick={() => deleteRow(params.row.id)}
          disabled={disabled}
        >
          <Delete />
        </Button>
      ),
      headerAlign: "center",
      align: "center",
    },
  ];

  return (
    <Box sx={{ width: "100%", marginTop: 2 }}>
      <Box sx={{ textAlign: "right", mb: 2 }}>
          {/* <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addNewRow}
            disabled={disabled}
            sx={{ borderRadius: "17px 18px 18px 17px", margin: "5px" }}
          >
            Add Email
          </Button> */}
      </Box>
      <Box sx={{ height: 400 }}>
        <DataGrid
          rows={customerEntityEmailsIds}
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
