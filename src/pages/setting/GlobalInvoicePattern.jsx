import React from "react";
import dayjs from "dayjs";
import { DataGrid, GridToolbarColumnsButton } from "@mui/x-data-grid";
import { useGridApiRef } from "@mui/x-data-grid";
import { Box, Grid } from "@mui/material";
import toast from "react-hot-toast";
import CustomToast from "../../components/common/Toast/CustomToast";
import ResetNumberEdit from "../../components/utils/resetNumberEdit";
import { generatePatternPayable } from "../../components/utils/utils";

export default function GlovalInvoicePattern({ value, setvalue, title }) {
  const apiRef = useGridApiRef();

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

  const handleProcessRowUpdate = (newRow, oldRow) => {
    let updatedRow = { ...newRow };

    // If only resetNumber changed
    if (newRow.resetNumber !== oldRow.resetNumber) {
      const invoiceCode = (newRow.invoiceType || "PAY")
        .replace(/[^a-zA-Z]/g, "")
        .substring(0, 3)
        .toUpperCase();

      const newPattern = generatePatternPayable({
        shipmentType: invoiceCode,
        resetNumber: newRow.resetNumber || "Month",
        voucherDigits: 4,
      });

      updatedRow.invoicePattern = newPattern;
      updatedRow.sampleInvoiceNumber = replaceVoucherCodes(newPattern);
    }

    // Perform validation only if invoicePattern changed
    if (newRow.invoicePattern !== oldRow.invoicePattern) {
      const tokenRegex = /[#\$][A-Z0-9]/g;
      const tokensInPattern = newRow.invoicePattern.match(tokenRegex) || [];

      const allowedTokens = [
        "#4",
        "#5",
        "#6",
        "#7",
        "#8",
        "$Z",
        "$N",
        "$M",
        "$D",
        "$Y",
      ];
      const voucherTokens = ["#4", "#5", "#6", "#7", "#8"];
      const monthTokens = ["$Z", "$N", "$M"];

      const hasInvalidToken = tokensInPattern.some(
        (t) => !allowedTokens.includes(t)
      );
      const hasDuplicateTokens =
        new Set(tokensInPattern).size !== tokensInPattern.length;
      const voucherTokensUsed = tokensInPattern.filter((t) =>
        voucherTokens.includes(t)
      );
      const hasOneVoucher = voucherTokensUsed.length === 1;
      const hasMultipleVouchers = voucherTokensUsed.length > 1;
      const hasMultipleDistinctVouchers = new Set(voucherTokensUsed).size > 1;

      const hasYear = tokensInPattern.includes("$Y");
      const hasDay = tokensInPattern.includes("$D");
      const monthTokensUsed = tokensInPattern.filter((t) =>
        monthTokens.includes(t)
      );
      const hasMonthToken = monthTokensUsed.length > 0;
      const hasMultipleDistinctMonthTokens = new Set(monthTokensUsed).size > 1;

      const trimmedPattern = newRow.invoicePattern.trim();
      const startsOrEndsWithDash =
        trimmedPattern.startsWith("-") || trimmedPattern.endsWith("-");
      const disallowedSpecialCharRegex = /[^a-zA-Z0-9#$\-\s]/;
      const hasInvalidSpecialChar = disallowedSpecialCharRegex.test(
        newRow.invoicePattern
      );

      const fragments = trimmedPattern.split(/[\s\-]/);
      const hasInvalidStandaloneSpecial = fragments.some(
        (frag) => !allowedTokens.includes(frag) && !/^[a-zA-Z0-9]+$/.test(frag)
      );

      const standaloneSpecialsRegex = /(^|[^#$])([#$])($|[^0-9A-Z])/g;
      const hasInvalidStandaloneSpecials = standaloneSpecialsRegex.test(
        newRow.invoicePattern
      );
      // Detect copy paste patterns like $Y-$Y or $Z-$Z etc.
      const hasInvalidCopyPattern = tokensInPattern.some(
        (token, i, arr) => token === arr[i + 1]
      );
      let meetsRequired = true;
      let hasDisallowed = false;

      switch (newRow.resetNumber) {
        case "Yearly":
          meetsRequired = hasYear && hasOneVoucher;
          hasDisallowed = tokensInPattern.some((t) =>
            ["$M", "$N", "$Z", "$D"].includes(t)
          );
          break;
        case "Monthly":
          meetsRequired = hasYear && hasMonthToken && hasOneVoucher;
          hasDisallowed = tokensInPattern.includes("$D");
          break;
        case "Daily":
          meetsRequired = hasYear && hasDay && hasMonthToken && hasOneVoucher;
          break;
        case "Never":
          meetsRequired = hasOneVoucher;
          hasDisallowed = false;
          break;
        default:
          break;
      }
      const hasOnlyAllowedTokens = tokensInPattern.every((t) =>
        allowedTokens.includes(t)
      );
      const isValid =
        newRow.resetNumber === "Never"
          ? meetsRequired &&
            !hasInvalidToken &&
            !hasDuplicateTokens &&
            !hasInvalidCopyPattern &&
            !hasInvalidSpecialChar &&
            !hasInvalidStandaloneSpecial &&
            !startsOrEndsWithDash
          : !hasInvalidToken &&
            !hasDisallowed &&
            !hasDuplicateTokens &&
            !hasMultipleVouchers &&
            !hasInvalidCopyPattern &&
            !hasMultipleDistinctVouchers &&
            !hasMultipleDistinctMonthTokens &&
            !startsOrEndsWithDash &&
            !hasInvalidSpecialChar &&
            !hasInvalidStandaloneSpecial &&
            meetsRequired;

      if (!isValid) {
        toast.custom((t) => (
          <CustomToast t={t} message="Invalid invoice pattern" type="error" />
        ));
        return oldRow;
      }

      // Update sample invoice after validation
      updatedRow.sampleInvoiceNumber = replaceVoucherCodes(
        newRow.invoicePattern
      );
    }

    // ✅ Finally update the state
    const updatedRows = value.map((row) =>
      row.id === updatedRow.id ? updatedRow : row
    );
    setvalue(updatedRows);

    return updatedRow;
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "invoiceType",
      headerName: "Invoice Type",
      headerAlign: "center",
      align: "center",
      width: 200,
      editable: false,
      renderCell: (params) => <span>{params.row.invoiceType}</span>,
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
    },
    {
      field: "invoicePattern",
      headerName: "Invoice Pattern",
      headerAlign: "center",
      align: "center",
      flex: 1,
      editable: true,
      renderCell: (params) => <span>{params.row.invoicePattern || ""}</span>,
      renderHeader: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ color: "white" }}>Invoice Pattern</span>
        </div>
      ),
    },
    {
      field: "sampleInvoiceNumber",
      headerName: "Sample Invoice Number",
      width: 250,
      align: "center",
      headerAlign: "center",
      editable: false,
      renderCell: (params) => (
        <span>{params.row.sampleInvoiceNumber || ""}</span>
      ),
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
          onProcessRowUpdateError={(error) => {
            console.error("Row update error:", error);
          }}
          disableRowSelectionOnClick
          autoHeight={false}
          hideFooter
          // slots={{
          //   toolbar: () => (
          //     <Box
          //       sx={{ display: "flex", justifyContent: "space-between", p: 1 }}
          //     >
          //       <GridToolbarColumnsButton />
          //     </Box>
          //   ),
          // }}
        />
      </div>
    </Grid>
  );
}
