import React, { useRef } from "react";
import { Box, Button, TextField, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { Delete } from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import IconButton from "@mui/material/IconButton";
import { StyledDataGrid } from "../../../common/Grid/styles";
import SelectBox from "../../../common/SelectBox";
import InputBoxForGrid from "../../../common/InputBoxForGrid";

export default function FilesGrid({ formik, disabled, dropdownData }) {
  const designation = dropdownData?.designation;
  const customerEntityEmailsIds = formik.values.customerEntityEmailsIds || [
    { id: 1, emailId: "", designation: "" },
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
  const addNewRow = () => {
    const newRow = { id: Date.now(), emailId: "", designation: "", new: true };
    formik.setFieldValue("customerEntityEmailsIds", [
      ...customerEntityEmailsIds,
      newRow,
    ]);
    setFocus();
  };

  // Handler to delete a row
  const deleteRow = (id) => {
    const updatedRows = customerEntityEmailsIds.filter((row) => row.id !== id);
    formik.setFieldValue("customerEntityEmailsIds", updatedRows);
  };

  // Handle row updates
  const handleProcessRowUpdate = (newRow, oldRow) => {
    const updatedRows = customerEntityEmailsIds?.map((row) =>
      row.id === newRow.id ? { ...row, ...newRow } : row
    );
    formik.setFieldValue("customerEntityEmailsIds", updatedRows);
    return newRow;
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
      field: "designation",
      headerName: "Designation",
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
              placeholder={true}
              size="small"
              sx={{
                marginTop: "0px",
                marginBottom: "0px",
                fontSize: "14px",
              }}
              options={designation}
              value={params.value}
              onChange={(e) =>
                updateRowValue(params, e, "customerEntityEmailsIds")
              }
              inputRef={newRowRef}
            />
          </div>
        </Tooltip>
      ),
    },
    {
      field: "emailId",
      headerName: "Emsssail",
      flex: 1,
      editable: true,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Tooltip
          title={params.value ? `${params.value}` : "This field is empty"}
          arrow
        >
          <InputBoxForGrid
            {...params}
            placeholder="Enter emails separated by commas"
          />
        </Tooltip>
      ),
      renderEditCell: (params) => (
        <Tooltip
          title={params.value ? `${params.value}` : "This field is empty"}
          arrow
        >
          <InputBoxForGrid
            {...params}
            placeholder="Enter emails separated by commas"
          />
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
          <AddCircleIcon onClick={addNewRow} />
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
      headerAlign: "center",
      align: "center",
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ height: 400 }}>
        <StyledDataGrid
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
