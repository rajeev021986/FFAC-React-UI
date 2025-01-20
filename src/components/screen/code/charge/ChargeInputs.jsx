import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import InputBox from "../../../common/InputBox";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-hot-toast";
import { GridDeleteIcon } from "@mui/x-data-grid";
import SelectBox from "../../../common/SelectBox";
import { OutlinedButton, ThemeButton } from "../../../common/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { ChargeMapping } from "./ChargeMapping";
import InputBoxForGridTab from "../../../common/InputBoxForGridTab";
import { StyledDataGrid } from "../../../common/Grid/styles";
import getFirstError from "../../../common/FieldToastError";
import { TabContext, TabList, TabPanel } from "@mui/lab";

export default function ChargeInputs({
  formik,
  ChargeSettingsData,
  type,
  loading,
  nav,
}) {
  const newRowRef = useRef(null);
  const setFocus = () => {
    setTimeout(() => {
      if (newRowRef.current) {
        newRowRef.current.focus();
      }
    }, 1000);
  };

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const addNewRow = () => {
    const hasEmptyFields = formik.values.mappingDetails.some((row) =>
      Object.values(row).some(
        (value) => value === "" || value === null || value === undefined
      )
    );
    if (false) {
      toast.error("Please fill in all fields before adding a new row.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    const newRow = {
      id: Date.now(),
      directExpense: "",
      directIncome: "",
      new: true,
    };
    formik.setFieldValue("mappingDetails", [
      ...formik.values.mappingDetails,
      newRow,
    ]);
    setFocus();
  };
  const deleteRow = (id) => {
    const updatedRows = formik.values.mappingDetails.filter(
      (row) => row.id !== id
    );
    formik.setFieldValue("mappingDetails", updatedRows);
  };
  const handleProcessRowUpdate = (newRow) => {
    const updatedRows = formik.values.mappingDetails.map((row) =>
      row.id === newRow.id ? { ...row, ...newRow } : row
    );
    formik.setFieldValue("mappingDetails", updatedRows);
    return newRow;
  };
  const columns = [
    {
      field: "directIncome",
      headerName: "Direct Income",
      flex: 1,
      editable: false,
      renderCell: (params) => {
        return (
          <InputBoxForGridTab
            value={params.value}
            field={params.field}
            id={params.id}
            formik={formik}
            api={params.api}
            arrayName="mappingDetails"
            inputRef={newRowRef}
          />
        );
      },
    },
    {
      field: "directExpense",
      headerName: "Direct Expense",
      flex: 1,
      editable: false,
      renderCell: (params) => {
        return (
          <InputBoxForGridTab
            value={params.value}
            field={params.field}
            id={params.id}
            formik={formik}
            api={params.api}
            arrayName="mappingDetails"
          />
        );
      },
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
        <IconButton color="error" onClick={() => deleteRow(params.row.id)}>
          <GridDeleteIcon />
        </IconButton>
      ),
    },
  ];
  useEffect(() => {
    getFirstError(formik.errors);
  }, [formik.errors]);
  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{ paddingLeft: 1, paddingRight: 1, paddingTop: 2 }}
      >
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          sx={{ marginTop: 2, paddingTop: "0px !important" }}
        >
          <InputBox
            label="Charge Name *"
            id="chargeName"
            value={formik.values.chargeName}
            error={formik.errors.chargeName}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          sx={{ marginTop: 2, paddingTop: "0px !important" }}
        >
          <InputBox
            label="Charge For"
            id="chargeFor"
            value={formik.values.chargeFor}
            error={formik.errors.chargeFor}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          sx={{ marginTop: 2, paddingTop: "0px !important" }}
        >
          <InputBox
            label="Charge Code"
            id="chargeCode"
            value={formik.values.chargeCode}
            error={formik.errors.chargeCode}
            onChange={formik.handleChange}
          />
        </Grid>
        {type == "new" &&
        formik.values.statusCode != -2 &&
        formik.values.statusCode != 1 ? (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            sx={{ marginTop: 2, paddingTop: "0px !important" }}
          >
            <InputBox
              label="Status"
              id="status"
              value={formik.values.status}
              error={formik.errors.status}
              onChange={formik.handleChange}
              disabled={true}
            />
          </Grid>
        ) : (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            sx={{ marginTop: 2, paddingTop: "0px !important" }}
          >
            <SelectBox
              label="Status"
              id="status"
              options={ChargeSettingsData?.body.status}
              value={formik.values.status}
              error={formik.errors.status}
              onChange={formik.handleChange}
            />
          </Grid>
        )}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          sx={{ marginTop: 2, paddingTop: "0px !important" }}
        >
          <InputBox
            label="Mapped Charge"
            id="mappedCharge"
            value={formik.values.mappedCharge}
            error={formik.errors.mappedCharge}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          sx={{ marginTop: 2, paddingTop: "0px !important" }}
        >
          <InputBox
            label="VAT Applicable"
            id="vatApplicable"
            value={formik.values.vatApplicable}
            error={formik.errors.vatApplicable}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          sx={{ marginTop: 2, paddingTop: "0px !important" }}
        >
          <InputBox
            label="Charge Details"
            id="chargeDetails"
            value={formik.values.chargeDetails}
            error={formik.errors.chargeDetails}
            onChange={formik.handleChange}
          />
        </Grid>
        <Box
          sx={{
            width: "100%",
            typography: "body1",
            border: "1px solid #ccc",
            borderRadius: "10px",
            margin: "8px 0px 8px 16px",
          }}
        >
          <TabContext value={value}>
            <Box>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab
                  label="Mapping Details"
                  value="1"
                  sx={{
                    fontSize: "1rem",
                    textTransform: "capitalize",
                  }}
                />
              </TabList>
            </Box>
            <TabPanel
              value="1"
              sx={{ margin: "0px !important", padding: "0px !important" }}
            >
              {" "}
              <Box
                sx={{ width: "100%", marginTop: 1, padding: "0px !important" }}
                paddingInline={2}
              >
                <Box sx={{ height: 400 }}>
                  <StyledDataGrid
                    rows={formik.values.mappingDetails}
                    columns={columns.map((column) => ({
                      ...column,
                      headerAlign: "center",
                      align: "center",
                    }))}
                    disableSelectionOnClick
                    processRowUpdate={handleProcessRowUpdate}
                    experimentalFeatures={{ newEditingApi: true }}
                    getRowId={(row) => row.id}
                    disableColumnMenu
                  />
                </Box>
              </Box>
            </TabPanel>
          </TabContext>
        </Box>

        <Grid
          item
          xs={12}
          sx={{
            margin: "0px !important",
            paddingTop: "0px !important",
            paddingBottom: 1,
          }}
        >
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Stack direction="row" spacing={2}>
              <OutlinedButton
                sx={{ fontWeight: "500" }}
                onClick={() => nav("/app/admin/charges")}
              >
                Cancel
              </OutlinedButton>
              <ThemeButton
                onClick={formik.handleSubmit}
                sx={{ fontWeight: "500", color: "white !important" }}
              >
                {loading && <CircularProgress size={20} color="white" />}{" "}
                {type == "Edit" ? "Update" : "Add"}
              </ThemeButton>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
