import React, { useState } from "react";
import { DataGrid, GridToolbarColumnsButton } from "@mui/x-data-grid";
import { Box, Grid, TextField } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { OutlinedButton } from "../../components/common/Button";
import toast from "react-hot-toast";
import CustomToast from "../../components/common/Toast/CustomToast";
import { Tooltip, IconButton } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import dayjs from "dayjs";
import { MenuItem, Select } from "@mui/material";
export default function GlobalDrrpdownSettingVoucher({ value, setvalue, title }) {
  
  



const handleAddRow = () => {
    if (value.some((item) => item.jobPattern.includes("Type the"))) {
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
  
    const newId = value.length ? Math.max(...value.map((item) => item.id)) + 1 : 1;
  
    setvalue((prevStatus) => [
      ...prevStatus,
      {
        id: newId,
        shipmentType: "", // Add a default value
        jobPattern: "", // Ensure a new JobPattern is added
        sampleJobNumber: "",
        resetNumber: "",
      },
    ]);
  
    console.log("New Row Added:", value);
  };
  

  const handleDeleteRow = (id) => {
    setvalue((prevStatus) => prevStatus.filter((item) => item.id !== id));
  };
  const handleProcessRowUpdate = (newRow, oldRow) => {
    console.log("🔄 Processing Row Update", newRow); // Debugging
  
    // Update the row with the new values
    const updatedRow = {
      ...newRow,
      sampleJobNumber: replaceVoucherCodes(newRow.jobPattern), // Update sample number
    };
  
    setvalue((prevValues) =>
      prevValues.map((row) => (row.id === newRow.id ? updatedRow : row))
    );
  
    return updatedRow;
  };
  

  const tooltipText = `
  #4 : 4 Digit Voucher Number (Zero Padded)
  #5 : 5 Digit Voucher Number (Zero Padded)
  #6 : 6 Digit Voucher Number (Zero Padded)
  #7 : 7 Digit Voucher Number (Zero Padded)
  #8 : 8 Digit Voucher Number (Zero Padded)
  $Z : Month Number (Zero Padded)
  $N : Month Name
  $M : Month Number
  $D : Day of the Month (Zero Padded)
  $Y : Year (Current Year)
  `;

// Function to replace special codes with values
const replaceVoucherCodes = (input) => {
  if (!input) return ""; // Prevents errors when input is undefined
console.log(input,"input")
  const currentDate = dayjs();
  const replacements = {
    "#4": String(currentDate.date()).padStart(4, "0"),
    "#5": String(currentDate.date()).padStart(5, "0"),
    "#6": String(currentDate.date()).padStart(6, "0"),
    "#7": String(currentDate.date()).padStart(7, "0"),
    "#8": String(currentDate.date()).padStart(8, "0"),
    "$Z": String(currentDate.month() + 1).padStart(2, "0"), // Zero-padded month
    "$N": currentDate.format("MMM"), // Three-letter month name (Apr, May, etc.)
    "$M": String(currentDate.month() + 1), // Month number (not zero-padded)
    "$D": String(currentDate.date()).padStart(2, "0"), // Zero-padded day
    "$Y": String(currentDate.year()), // Year
  };

  return input.replace(/#4|#5|#6|#7|#8|\$Z|\$N|\$M|\$D|\$Y/g, (match) => replacements[match] || match);
};
console.log(replaceVoucherCodes,"replace")
const handleDropdownChange = (id, newValue) => {
    setvalue((prevValues) =>
      prevValues.map((row) =>
        row.id === id ? { ...row, resetNumber: newValue } : row
      )
    );
  };
  

  // shipmentType - vovhernAME
  // vOCUHERnUM -JOBpATTERN
  // saplevoc - sampleJobNumber,
 // createdDate -getTodayDate,

const handleInputChange = (id, newValue) => {
    console.log("Row ID:", id, "New Value:", newValue);
  
    setvalue((prevValues) => {
      const updatedValues = prevValues.map((row) =>
        row.id === id
          ? {
              ...row,
              VoucherNumber: newValue,
              sampleVoucherNumber: replaceVoucherCodes(newValue),
            }
          : row
      );
  
      console.log("Updated State:", updatedValues); // Debugging
      return updatedValues;
    });
  };
  


console.log(value,"value")
const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "shipmentType",
      headerName: "shipment Type ",
      width: 150,
      editable: true,
    },
    {
      field: "jobPattern",
      headerName: "JobPattern",
      width: 250,
      editable: true, // ✅ MUI will now handle editing automatically
      renderHeader: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span>JobPattern</span>
          <Tooltip title={<pre style={{ whiteSpace: "pre-wrap" }}>{tooltipText}</pre>} arrow>
            <IconButton size="small">
              <InfoOutlined fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
    {
      field: "sampleJobNumber",
      headerName: "Sample JobNumber",
      width: 250,
      renderCell: (params) => <span>{params.row.sampleJobNumber || ""}</span>,
    },
    {
        field: "resetNumber",
        headerName: "Reset Number",
        width: 150,
        editable: true,
        renderCell: (params) => {
          const voucherNumber = params.row.jobPattern || "";
    
          // Check if voucher number contains relevant placeholders
          const hasMonth = voucherNumber.includes("$N") || voucherNumber.includes("$M") || voucherNumber.includes("$Z");
          const hasDay = voucherNumber.includes("$D");
          const hasYear = voucherNumber.includes("$Y");
    
          return (
            <Select
              size="small"
              value={params.row.resetNumber || ""}
              onChange={(e) => handleDropdownChange(params.row.id, e.target.value)}
              fullWidth
            >
              <MenuItem value="Month" disabled={!hasMonth}>Month</MenuItem>
              <MenuItem value="Daily" disabled={!hasDay}>Daily</MenuItem>
              <MenuItem value="Yearly" disabled={!hasYear}>Yearly</MenuItem>
            </Select>
          );
        },
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
  

  return (
    <Grid item xs={12} md={12} sm={12}>
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
          key ={value.length}
          rows={value}
          columns={columns}
          processRowUpdate={handleProcessRowUpdate}
          experimentalFeatures={{ newEditingApi: true }}
          sx={{
            backgroundColor: "white.main",
            "& .MuiDataGrid-main": { overflow: "auto" },
          }}
          disableRowSelectionOnClick
          autoHeight={false}
          hideFooter
          slots={{
            toolbar: () => (
              <Box sx={{ display: "flex", justifyContent: "flex-start", p: 1 }}>
                <GridToolbarColumnsButton />
              </Box>
            ),
          }}
        //   components={{
        //       Toolbar: () => (
        //         <Box sx={{ display: "flex", justifyContent: "flex-start", p: 1 }}>
        //           <GridToolbarColumnsButton />
        //         </Box>
        //       ),
        //     }}
        />
      </div>
    </Grid>
  );
}
