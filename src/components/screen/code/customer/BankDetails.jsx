import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { useRef } from "react";
import InputBoxForGrid from "../../../common/InputBoxForGrid";
import { Delete } from "@mui/icons-material";
import { StyledDataGrid } from "../../../common/Grid/styles";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import InputBoxForGridTab from "../../../common/InputBoxForGridTab";
import AutoCompleteInput from "../../../common/AutoCompletInput";

export default function CustomerBankDetails({
  formik,
  dropdownData,
  disabled,
}) {
  const bankDetails = formik.values.bankDetails || [];

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
      bankName: "",
      bankAddress: "",
      accountNo: "",
      currency: "",
      swiftCode: "",
      new: true,
    };
    formik.setFieldValue("bankDetails", [...bankDetails, newRow]);
    setFocus();
  };
  const deleteRow = (id) => {
    const updatedRows = bankDetails.filter((row) => row.id !== id);
    formik.setFieldValue("bankDetails", updatedRows);
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
      field: "bankName",
      headerName: "Bank Name",
      flex: 1,
      editable: false,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <InputBoxForGridTab
            value={params.value}
            field={params.field}
            id={params.id}
            error ={
              formik.errors.bankDetails?.[params.rowIndex]?.bankName
            }
            formik={formik}
            api={params.api}
            arrayName="bankDetails"
            inputRef={newRowRef}
          />
        );
      },
    },
    {
      field: "bankAddress",
      headerName: "Bank Address",
      flex: 1,
      editable: false,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <InputBoxForGridTab
            value={params.value}
            field={params.field}
            id={params.id}
            error ={
              formik.errors.bankDetails?.[params.rowIndex]?.bankName
            }
            formik={formik}
            api={params.api}
            arrayName="bankDetails"
          />
        );
      },
    },
    {
      field: "accountNo",
      headerName: "AccountNo",
      flex: 1,
      editable: false,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <InputBoxForGridTab
            value={params.value}
            field={params.field}
            id={params.id}
            formik={formik}
            error ={
              formik.errors.bankDetails?.[params.rowIndex]?.accountNo
            }
            api={params.api}
            arrayName="bankDetails"
            type="number"
          />
        );
      },
    },
    {
      field: "currency",
      headerName: "Currency",
      flex: 1,
      editable: false,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          // <InputBoxForGridTab
          //   value={params.value}
          //   field={params.field}
          //   id={params.id}
          //   formik={formik}
          //   api={params.api}
          //   arrayName="bankDetails"
          // />

          <AutoCompleteInput
            id="currency"
            suggestionName="currency"
            value={params.value}
            error={
              formik.errors.bankDetails?.[params.rowIndex]?.currency
            }
            onChange={(newValue) => {
              const rowIndex = formik.values.bankDetails.findIndex(
                (entity) => entity.id === params.id
              );
              formik.setValues({
                ...formik.values,
                bankDetails: formik.values.bankDetails.map(
                  (entity, index) =>
                    index === rowIndex
                      ? { ...entity, currency: newValue }
                      : entity
                ),
              });
            }}
          />
        );
      },
    },
    {
      field: "swiftCode",
      headerName: "Swift Code",
      flex: 1,
      editable: false,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <InputBoxForGridTab
            value={params.value}
            field={params.field}
            id={params.id}
            formik={formik}
            api={params.api}
            error ={
              formik.errors.bankDetails?.[params.rowIndex]?.swiftCode
            }
            
            arrayName="bankDetails"
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      headerAlign: "center",
      align: "center",
      flex: 0,
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
    },
  ];

  // Handler to commit changes
  const handleProcessRowUpdate = (newRow, oldRow) => {
    const updatedRows = bankDetails.map((row) =>
      row.id === newRow.id ? { ...row, ...newRow } : row
    );
    formik.setFieldValue("bankDetails", updatedRows);
    return newRow;
  };

  return (
    <Box sx={{ width: "100%", textAlign: "right" }}>
      <Box
        sx={{
          height: 400,
        }}
      >
        <StyledDataGrid
          rows={bankDetails}
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
