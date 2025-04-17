import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbarColumnsButton } from "@mui/x-data-grid";
import { Box, Grid } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { OutlinedButton } from "../../components/common/Button";
import toast from "react-hot-toast";
import CustomToast from "../../components/common/Toast/CustomToast";
import { Tooltip, IconButton } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import dayjs from "dayjs";
import { useGridApiRef } from "@mui/x-data-grid";
import ResetNumberEdit from "../../components/utils/resetNumberEdit";
import { reindexRows } from "../../components/utils/utils";
import { validatePattern, generatePattern } from "../../components/utils/utils";
import { MenuItem, Select } from "@mui/material";
import { useGetOptionsSettingsQuery } from "../../store/api/settingsApi";

export default function GlobalDrrpdownSettingVoucher({
  value,
  setvalue,
  title,
}) {
  const [dropdownData, setDropdownData] = useState([]);
  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("common_settings");
  const apiRef = useGridApiRef();

  const handleAddRow = () => {
    if (value.some((item) => item.jobPattern.includes("Type the"))) {
      toast.custom(
        <CustomToast
          message="Please complete the newly added field first"
          toast="error"
        />,
        { closeButton: false }
      );
      return;
    }

    const newRow = {
      shipmentType: "",
      jobPattern: "",
      sampleJobNumber: "",
      resetNumber: "",
    };

    const updated = [...value, newRow];
    setvalue(reindexRows(updated));
  };

  useEffect(() => {
    if (!value.some((row) => row.shipmentType === "General/Common")) {
      const updated = [
        {
          id: 1,
          shipmentType: "General/Common",
          jobPattern: "",
          sampleJobNumber: "",
          resetNumber: "",
        },
        ...value,
      ];
      setvalue(updated);
    }
  }, [value, setvalue]);

  const handleDeleteRow = (id) => {
    const updated = value.filter((item) => item.id !== id);
    toast.custom(
      <CustomToast message="Deleted Successfully" toast="success" />,
      { closeButton: false }
    );
    setvalue(reindexRows(updated));
  };

  const handleProcessRowUpdate = (newRow, oldRow) => {
    let updatedRow = { ...newRow };

    if (
      newRow.resetNumber !== oldRow.resetNumber ||
      newRow.shipmentType !== oldRow.shipmentType
    ) {
      const shipmentCode = (newRow.shipmentType || "GEN")
        .replace(/[^a-zA-Z]/g, "")
        .substring(0, 3)
        .toUpperCase();

      const newPattern = generatePattern({
        shipmentType: shipmentCode,
        resetNumber: newRow.resetNumber || "Month",
        voucherDigits: 4,
      });

      updatedRow.jobPattern = newPattern;
      updatedRow.sampleJobNumber = replaceVoucherCodes(newPattern);
    }

    if (newRow.jobPattern !== oldRow.jobPattern) {
      if (!validatePattern(newRow.jobPattern)) {
        toast.custom(<CustomToast message="Invalid pattern" toast="error" />, {
          closeButton: false,
        });
        updatedRow.jobPattern = oldRow.jobPattern;
      } else {
        updatedRow.sampleJobNumber = replaceVoucherCodes(newRow.jobPattern);
      }
    }

    setvalue((prev) =>
      prev.map((row) => (row.id === newRow.id ? updatedRow : row))
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

  const replaceVoucherCodes = (input) => {
    if (!input) return "";
    const currentDate = dayjs();
    const replacements = {
      "#4": String(1).padStart(4, "0"),
      "#5": String(1).padStart(5, "0"),
      "#6": String(1).padStart(6, "0"),
      "#7": String(1).padStart(7, "0"),
      "#8": String(1).padStart(8, "0"),
      $Z: String(currentDate.month() + 1).padStart(2, "0"),
      $N: currentDate.format("MMM"),
      $M: String(currentDate.month() + 1),
      $D: String(currentDate.date()).padStart(2, "0"),
      $Y: String(currentDate.year()),
    };
    return input.replace(
      /#4|#5|#6|#7|#8|\$Z|\$N|\$M|\$D|\$Y/g,
      (match) => replacements[match] || match
    );
  };

  useEffect(() => {
    if (!value.some((row) => row.shipmentType === "General/Common")) {
      const updated = [
        {
          shipmentType: "General/Common",
          jobPattern: "",
          sampleJobNumber: "",
          resetNumber: "",
        },
        ...value,
      ];
      setvalue(reindexRows(updated));
    }
  }, [value, setvalue]);

  useEffect(() => {
    if (optionsSettingsData?.body) {
      setDropdownData(optionsSettingsData.body.shipmentType);
    }
  }, [optionsSettingsData]);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "shipmentType",
      headerName: "Shipment Type",
      headerAlign: "center",
      align: "center",
      width: 200,
      editable: true,
      renderCell: (params) => <span>{params.row.shipmentType}</span>,
      renderEditCell: (params) => {
        const apiRef = params.api;
        const isGeneral = params.row.shipmentType === "General/Common";
        return (
          <Select
            size="small"
            value={params.value || ""}
            onChange={(e) => {
              const newValue = e.target.value;
              apiRef.current.setEditCellValue({
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
      field: "resetNumber",
      headerName: "Reset Number",
      width: 120,
      editable: true,
      align: "center",
      headerAlign: "center",
      renderEditCell: (params) => (
        <ResetNumberEdit
          id={params.id}
          value={params.value}
          field={params.field}
          api={params.api}
          row={params.row}
        />
      ),
      // renderEditCell: (params) => {
      //   const voucherNumber = params.row.jobPattern || "";
      //   const hasYear = voucherNumber.includes("$Y");
      //   const hasMonth =
      //     voucherNumber.includes("$M") ||
      //     voucherNumber.includes("$Z") ||
      //     voucherNumber.includes("$N");
      //   const hasDay = voucherNumber.includes("$D");
      //   const enableYearly = hasYear;
      //   const enableMonthly = hasYear && hasMonth;
      //   const enableDaily = hasYear && hasMonth && hasDay;
      //   return (
      //     <Select
      //       size="small"
      //       value={params.value || ""}
      //       onChange={(e) => {
      //         const newValue = e.target.value;
      //         const shipmentType = params.row.shipmentType || "GEN";
      //         const voucherDigits = 4; // You can later add UI control for this
      //         const pattern = generatePattern({
      //           shipmentType,
      //           resetNumber: newValue,
      //           voucherDigits,
      //         });
      //         const updatedSample = replaceVoucherCodes(pattern);
      //         params.api.setEditCellValue({
      //           id: params.id,
      //           field: "resetNumber",
      //           value: newValue,
      //         });
      //         setvalue((prevValues) =>
      //           prevValues.map((row) =>
      //             row.id === params.id
      //               ? {
      //                   ...row,
      //                   jobPattern: pattern,
      //                   sampleJobNumber: updatedSample,
      //                 }
      //               : row
      //           )
      //         );
      //       }}
      //       fullWidth
      //     >
      //       <MenuItem value="Never">Never</MenuItem>
      //       <MenuItem value="Yearly" disabled={!enableYearly}>
      //         Yearly
      //       </MenuItem>
      //       <MenuItem value="Month" disabled={!enableMonthly}>
      //         Month
      //       </MenuItem>
      //       <MenuItem value="Daily" disabled={!enableDaily}>
      //         Daily
      //       </MenuItem>
      //     </Select>
      //   );
      // },
    },
    {
      field: "jobPattern",
      headerName: "Job Pattern",
      headerAlign: "center",
      align: "center",
      flex: 1,
      editable: true,
      renderCell: (params) => <span>{params.row.jobPattern || ""}</span>,
      renderHeader: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ color: "white" }}>Job Pattern</span>
          <Tooltip
            title={
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  fontSize: "14px",
                  lineHeight: 1.75,
                }}
              >
                {tooltipText}
              </pre>
            }
          >
            <IconButton size="small">
              <InfoOutlined fontSize="small" color="white" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
    {
      field: "sampleJobNumber",
      headerName: "Sample Job Number",
      width: 250,
      align: "center",
      headerAlign: "center",
      editable: false,
      renderCell: (params) => <span>{params.row.sampleJobNumber || ""}</span>,
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
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
    <Grid item xs={12} md={10} sm={12}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "50px",
        }}
      >
        <h3>{title}</h3>
      </div>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          apiRef={apiRef}
          rows={value}
          editMode="cell"
          columns={columns}
          processRowUpdate={handleProcessRowUpdate}
          experimentalFeatures={{ newEditingApi: true }}
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "primary.main",
              lineHeight: 10,
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
          disableRowSelectionOnClick
          autoHeight={false}
          hideFooter
          slots={{
            toolbar: () => (
              <Box
                sx={{ display: "flex", justifyContent: "space-between", p: 1 }}
              >
                <GridToolbarColumnsButton />
                <OutlinedButton
                  color="primary"
                  size="small"
                  onClick={handleAddRow}
                >
                  Add
                </OutlinedButton>
              </Box>
            ),
          }}
        />
      </div>
    </Grid>
  );
}
