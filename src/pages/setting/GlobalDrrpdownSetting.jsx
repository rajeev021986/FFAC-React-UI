import React from "react";
import { DataGrid, GridToolbarColumnsButton } from "@mui/x-data-grid";
import { Box, Grid } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { OutlinedButton } from "../../components/common/Button";
import toast from "react-hot-toast";
import CustomToast from "../../components/common/Toast/CustomToast";

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

    const newId = value.length + 1;
    setvalue((prevStatus) => [
      ...prevStatus,
      {
        id: newId,
        value: `Type the option`,
      },
    ]);
  };

  const handleDeleteRow = (id) => {
    const updated = value.filter((item) => item.id !== id);
    const reIndexed = updated.map((item, index) => ({
      ...item,
      id: index + 1,
    }));
    setvalue(reIndexed);
    toast.custom(
      <CustomToast message="Click Save to confirm deletion" toast="info" />,
      {
        closeButton: false,
      }
    );
  };

  const handleProcessRowUpdate = (newRow, oldRow) => {
    const updatedRows = value.map((row) =>
      row.id === newRow.id ? { ...row, ...newRow } : row
    );
    setvalue(updatedRows);
    return newRow;
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "value",
      headerName: "Value",
      align: "center",
      headerAlign: "center",
      width: 150,
      editable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      headerAlign: "center",
      width: 100,
      renderCell: (params) => (
        <DeleteIcon
          style={{ cursor: "pointer", color: "red" }}
          onClick={() => handleDeleteRow(params.id)}
        />
      ),
    },
  ];

  return (
    <Grid item xs={12} md={4} sm={6}>
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
              height: "38px !important",
            },
            "& .MuiDataGrid-cell": {
              whiteSpace: "normal",
              wordWrap: "break-word",
              fontSize: "14px",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              color: "#fff",
              fontSize: "14px",
            },
            "& .MuiDataGrid-sortIcon": {
              color: "#fff",
            },
            "& .MuiDataGrid-menuIconButton .MuiSvgIcon-root": {
              fill: "#fff",
            },
          }}
        />
      </div>
    </Grid>
  );
}
