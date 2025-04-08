import React, { useState } from "react";
import { DataGrid, GridToolbarColumnsButton } from "@mui/x-data-grid";
import { Box, Grid, TextField } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { OutlinedButton } from "../../components/common/Button";
import toast from "react-hot-toast";
import CustomToast from "../../components/common/Toast/CustomToast";
import { useSelector } from "react-redux";
import { getTheme } from "../../config/theme";

export default function GlobalDrrpdownSetting({ value, setvalue, title }) {
  const handleAddRow = () => {
    if (value.some((item) => item.value.includes("Type the"))) {
      toast.custom(
        <CustomToast
          message="Please complete the newly added field first"
          toast="error"
        />,
        {
          closeButton: false,
        }
      );
      return;
    }

    const newId = value.length
      ? Math.max(...value.map((item) => item.id)) + 1
      : 1;
    setvalue((prevStatus) => [
      ...prevStatus,
      {
        id: newId,
        value: `Type the option`,
      },
    ]);
  };

  const handleDeleteRow = (id) => {
    setvalue((prevStatus) => prevStatus.filter((item) => item.id !== id));
  };
  const handleProcessRowUpdate = (newRow, oldRow) => {
    const updatedRows = value.map((row) =>
      row.id === newRow.id ? { ...row, ...newRow } : row
    );
    setvalue(updatedRows);
    return newRow;
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "value",
      headerName: "Value",
      width: 150,
      editable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <DeleteIcon
          style={{ cursor: "pointer", color: "red" }}
          onClick={() => handleDeleteRow(params.id)}
        />
      ),
    },
  ];

  const theme = getTheme(
    useSelector((state) => state.dashboard.theme),
    useSelector((state) => state.dashboard.mode)
  );
  console.log(theme, "theme");
  return (
    <Grid item xs={12} md={3} sm={6}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "50px",
        }}
      >
        <h3>{title}</h3>
        <OutlinedButton color="primary" size="small" onClick={handleAddRow}>
          Add
        </OutlinedButton>
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={value}
          columns={columns}
          processRowUpdate={handleProcessRowUpdate}
          experimentalFeatures={{ newEditingApi: true }}
          disableRowSelectionOnClick
          autoHeight={false}
          hideFooter
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "primary.main",
              lineHeight: 10,
            },
            "& .MuiDataGrid-cell": {
              whiteSpace: "normal",
              wordWrap: "break-word",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              color: "#fff",
              fontSize: "14px",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "14px",
            },
          }}
          slots={{
            toolbar: () => (
              <Box sx={{ display: "flex", justifyContent: "flex-start", p: 1 }}>
                <GridToolbarColumnsButton />
              </Box>
            ),
          }}
                 // components={{
          //     Toolbar: () => (
          //       <Box sx={{ display: "flex", justifyContent: "flex-start", p: 1 }}>
          //         <GridToolbarColumnsButton />
          //       </Box>
          //     ),
          //   }}
        />
      </div>
    </Grid>
  );
}
