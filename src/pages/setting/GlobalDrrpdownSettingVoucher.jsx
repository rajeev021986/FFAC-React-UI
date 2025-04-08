import React, { useState, useEffect } from "react";
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
import { useGetOptionsSettingsQuery } from "../../store/api/settingsApi";
export default function GlobalDrrpdownSettingVoucher({
  value,
  setvalue,
  title,
}) {
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

    const newId = value.length
      ? Math.max(...value.map((item) => item.id)) + 1
      : 1;

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

  // const handleDeleteRow = (id) => {
  //   setvalue((prevStatus) => prevStatus.filter((item) => item.id !== id));
  // };
  const handleDeleteRow = (id) => {
    const rowToDelete = value.find((item) => item.id === id);
    if (rowToDelete?.shipmentType === "General/Common") {
      toast.custom(
        <CustomToast
          message="This default row cannot be deleted"
          toast="error"
        />,
        { closeButton: false }
      );
      return;
    }

    setvalue((prevStatus) => prevStatus.filter((item) => item.id !== id));
  };

  const handleProcessRowUpdate = (newRow, oldRow) => {
    const updatedRow = {
      ...newRow,
      sampleJobNumber: replaceVoucherCodes(newRow.jobPattern),
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
    console.log(input, "input");
    const currentDate = dayjs();
    const replacements = {
      "#4": String(1).padStart(4, "0"),
      "#5": String(1).padStart(5, "0"),
      "#6": String(1).padStart(6, "0"),
      "#7": String(1).padStart(7, "0"),
      "#8": String(1).padStart(8, "0"),
      $Z: String(currentDate.month() + 1).padStart(2, "0"), // Zero-padded month
      $N: currentDate.format("MMM"), // Three-letter month name
      $M: String(currentDate.month() + 1), // Month number
      $D: String(currentDate.date()).padStart(2, "0"), // Zero-padded day
      $Y: String(currentDate.year()), // Year
    };

    return input.replace(
      /#4|#5|#6|#7|#8|\$Z|\$N|\$M|\$D|\$Y/g,
      (match) => replacements[match] || match
    );
  };
  console.log(replaceVoucherCodes, "replace");
  const handleDropdownChange = (id, newValue) => {
    setvalue((prevValues) =>
      prevValues.map((row) =>
        row.id === id ? { ...row, shipmentType: newValue } : row
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

  useEffect(() => {
    // Ensure "General/Common" row exists at all times
    if (!value.some((row) => row.shipmentType === "General/Common")) {
      setvalue([
        {
          id: 0,
          shipmentType: "General/Common",
          jobPattern: "",
          sampleJobNumber: "",
          resetNumber: "",
        },
        ...value,
      ]);
    }
  }, [value, setvalue]);

  const [dropdownData, setDropdownData] = useState([]);
  console.log(dropdownData, "dropdownData");
  const [disabled, setDisabled] = useState(false);
  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("common_settings");

  console.log(optionsSettingsData, "optionsSettingsData");

  useEffect(() => {
    if (optionsSettingsData?.body) {
      setDropdownData(optionsSettingsData?.body?.shipmentType);
    }
  }, [optionsSettingsData]);

  console.log(value, "value");
  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "shipmentType",
      headerName: "Shipment Type",
      width: 200,
      editable: true,
      renderCell: (params) => <span>{params.row.shipmentType}</span>,
      renderEditCell: (params) => {
        const isGeneral = params.row.shipmentType === "General/Common";

        return (
          <Select
            size="small"
            value={params.value || ""}
            onChange={(e) => {
              const newValue = e.target.value;
              params.api.setEditCellValue({
                id: params.id,
                field: "shipmentType",
                value: newValue,
              });
            }}
            fullWidth
            disabled={isGeneral}
          >
            <MenuItem value="General/Common" disabled>
              General/Common
            </MenuItem>
            {dropdownData?.map((option, idx) => {
              const isSelectedElsewhere = value.some(
                (row) =>
                  row.shipmentType === option.value && row.id !== params.row.id
              );

              return (
                <MenuItem
                  key={idx}
                  value={option.value}
                  disabled={isSelectedElsewhere}
                >
                  {option.value}
                </MenuItem>
              );
            })}
          </Select>
        );
      },
    },
    {
      field: "jobPattern",
      headerName: "Job Pattern",
      width: 250,
      editable: true,
      preProcessEditCellProps: (params) => {
        const value = params.props.value || "";

        const allowedHash = ["#4", "#5", "#6", "#7", "#8"];
        const allowedDollar = ["$Z", "$N", "$M", "$D", "$Y"];

        const hashMatches = value.match(/#\d/g) || [];
        const dollarMatches = value.match(/\$\w/g) || [];

        const hasRequiredHash = value.includes("#");

        const allHashesValid =
          hashMatches.every((code) => allowedHash.includes(code)) &&
          !value.match(/#\d{2,}/); // prevent #48, #55 etc

        const allDollarsValid =
          dollarMatches.every((code) => allowedDollar.includes(code)) &&
          !value.match(/\$\w{2,}/); // prevent $YZ, $MM etc

        let errorMessage = "";

        if (!hasRequiredHash) {
          errorMessage = "Pattern must include one of: #4, #5, #6, #7, or #8";
        } else if (!allHashesValid) {
          errorMessage =
            "Invalid # code. Only #4 to #8 allowed. No multi-digit values like #48.";
        } else if (!allDollarsValid) {
          errorMessage =
            "Invalid $ code. Only $Z, $N, $M, $D, $Y allowed. Only one letter after $.";
        }

        if (errorMessage) {
          toast.custom(<CustomToast message={errorMessage} toast="error" />, {
            closeButton: false,
          });
        }

        return {
          ...params.props,
          error: !!errorMessage,
        };
      },

      renderHeader: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span>Job Pattern</span>
          <Tooltip
            title={<pre style={{ whiteSpace: "pre-wrap" }}>{tooltipText}</pre>}
            arrow
          >
            <IconButton size="small">
              <InfoOutlined fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },

    {
      field: "sampleJobNumber",
      headerName: "Sample Job Number",
      width: 250,
      renderCell: (params) => <span>{params.row.sampleJobNumber || ""}</span>,
    },
    {
      field: "resetNumber",
      headerName: "Reset Number",
      width: 120,
      editable: true,
      renderEditCell: (params) => {
        const voucherNumber = params.row.jobPattern || "";

        const hasYear = voucherNumber.includes("$Y");
        const hasMonth =
          voucherNumber.includes("$M") ||
          voucherNumber.includes("$Z") ||
          voucherNumber.includes("$N");
        const hasDay = voucherNumber.includes("$D");

        const enableYearly = hasYear;
        const enableMonthly = hasYear && hasMonth;
        const enableDaily = hasYear && hasMonth && hasDay;

        return (
          <Select
            size="small"
            value={params.value || ""}
            onChange={(e) => {
              const newValue = e.target.value;
              params.api.setEditCellValue({
                id: params.id,
                field: "resetNumber",
                value: newValue,
              });
            }}
            fullWidth
          >
            <MenuItem value="Never">Never</MenuItem>
            <MenuItem value="Yearly" disabled={!enableYearly}>
              Yearly
            </MenuItem>
            <MenuItem value="Month" disabled={!enableMonthly}>
              Month
            </MenuItem>
            <MenuItem value="Daily" disabled={!enableDaily}>
              Daily
            </MenuItem>
          </Select>
        );
      },
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => {
        const isGeneral = params.row.shipmentType === "General/Common";
        return isGeneral ? null : (
          <DeleteIcon
            style={{ cursor: "pointer", color: "red" }}
            onClick={() => handleDeleteRow(params.id)}
          />
        );
      },
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
          key={value.length}
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
