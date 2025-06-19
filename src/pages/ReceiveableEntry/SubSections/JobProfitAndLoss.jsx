import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  AlertTitle,
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";

// Components
import InputBox from "../../../components/common/InputBox";
import SelectBox from "../../../components/common/SelectBox";
import CostDetails from "./CostDetails";
import PopupAlert from "../../../components/common/Alert/PopupAlert";
import { useGetOptionsSettingsQuery } from "../../../store/api/settingsApi";
import ApiManager from "../../../services/ApiManager";
import FormAutoCompleteWithExchangeLoader from "../../../components/common/AutoComplete/FormAutoCompleteWithExchangeLoader";
import { formatIndianCurrency } from "../../../components/utils/utils";
import FormAutoCompleteWithLoader from "../../../components/common/AutoComplete/FormAutoCompletewithLoader";

const JobProfitAndLoss = ({ formik, job_number }) => {
  const payableRef = useRef(null);
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    title: "",
    message: "",
    severity: "info",
    onConfirm: null,
    onClose: () => setAlertConfig({ ...alertConfig, open: false }),
  });
  const [openDialog, setOpenDialog] = useState({
    open: false,
    title: "",
    message: "",
    severity: "info",
    onConfirm: null,
    onClose: () => setOpenDialog({ ...openDialog, open: false }),
  });
  const { jobNo, currency, exchangeRate } = formik?.values;
  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("common_settings");
  const [mergedCurrencyOptions, setMergedCurrencyOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiManager.fetchAutoCompleteData(
          "",
          "COMPANY_CODE"
        );
        const backendData = await response.body;

        // Extract backend currencies safely
        const backendCurrencies = Array.from(
          new Set(
            (backendData || []).map((item) => item.currency).filter(Boolean)
          )
        ).map((curr) => ({ id: curr, value: curr }));

        // Get setting currencies safely
        const settingCurrencies = optionsSettingsData?.body?.currencyType || [];

        // Merge both arrays avoiding duplicates (based on `value`)
        const mergedCurrencies = [
          ...backendCurrencies,
          ...settingCurrencies.filter(
            (setting) =>
              !backendCurrencies.some((item) => item.value === setting.value)
          ),
        ];

        setMergedCurrencyOptions(mergedCurrencies);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [optionsSettingsData?.body?.currencyType]);

  useEffect(() => {
    if (payableRef?.current) {
      payableRef.current.focus();
    }
  }, []);

  const OPTION_TYPE = [
    {
      label: "Tax Invoice",
      value: "tax_invoice",
    },
    {
      label: "Debit Note",
      value: "debit_note",
    },
  ];

  useEffect(() => {
    if (!formik.values?.currency && !formik.values?.exchangeRate) {
      setOpenDialog({
        open: true,
        title: "Information",
        message:
          "Please select currency and exchange rate to generate Tax Invoice/Debit Note details.",
        severity: "info",
        onConfirm: null,
        onClose: () => setOpenDialog((prev) => ({ ...prev, open: false })),
      });
    }
  }, []);

  useEffect(() => {
    if (formik.values.currency === "INR") {
      formik.setFieldValue("exchangeRate", 1);
    }
  }, [formik.values.currency]);

  return (
    <React.Fragment>
      <AppBar position="static" sx={{ minHeight: "40px", borderRadius: "5px" }}>
        <Toolbar
          sx={{
            minHeight: "40px !important",
            px: 2,
            display: "flex",
            justifyContent: "space-between",
            borderRadius: "8px !important",
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography variant="body1">
              <strong>Job Profit And Loss </strong>
            </Typography>
            <Typography variant="body1"></Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          padding: "4px 0",
          margin: 0,
        }}
      >
        <Box sx={{ width: "100%", paddingRight: 2 }}>
          <Grid container sx={{ padding: 0, margin: 0 }}>
            <Grid item xs={12} lg={3} paddingLeft={0} marginTop={2}>
              <InputBox
                label="Job No"
                id="jobNo"
                name="jobNo"
                value={formik.values.jobNo}
                error={formik.errors.jobNo}
                onChange={formik.handleChange}
                inputRef={payableRef}
                disabled
              />
            </Grid>
            <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
              <FormAutoCompleteWithLoader
                label="Customer Name*"
                id="customerId"
                value={{
                  customerId: formik.values.customerId,
                  customerName: formik.values.customerName,
                }}
                error={formik.errors.customerId}
                idKey="customerId"
                nameKey="customerName"
                onChange={(selected) => {
                  formik.setFieldValue("customerId", selected.customerId || "");
                  formik.setFieldValue(
                    "customerName",
                    selected.customerName || ""
                  );
                }}
                suggestionName="customer_name"
              />
            </Grid>
            <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
              <InputBox
                label="Consignee Name"
                id="consigneeName"
                value={formik.values.consigneeName}
                error={formik.errors.consigneeName}
                onChange={formik.handleChange}
                inputRef={payableRef}
                disabled
              />
            </Grid>

            <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
              <InputBox
                label="Debit (Cost)"
                id="debitCost"
                value={formik.values.debitCost}
                error={formik.errors.debitCost}
                onChange={formik.handleChange}
                inputRef={payableRef}
                disabled
              />
            </Grid>

            <Grid item xs={12} lg={3} paddingLeft={0} marginTop={2}>
              <InputBox
                label="Credit (Cost)"
                id="creditCost"
                value={formik.values.creditCost}
                error={formik.errors.creditCost}
                onChange={formik.handleChange}
                inputRef={payableRef}
                disabled
              />
            </Grid>

            <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
              <InputBox
                label="Net (Cost)"
                id="netCost"
                value={formik.values.netCost}
                error={formik.errors.netCost}
                onChange={formik.handleChange}
                inputRef={payableRef}
                disabled
              />
            </Grid>

            <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
              <InputBox
                label="Total Revenue"
                id="totalRevenue"
                value={formik.values.totalRevenue}
                error={formik.errors.totalRevenue}
                onChange={formik.handleChange}
                inputRef={payableRef}
                disabled
              />
            </Grid>

            <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
              <InputBox
                label="Profit/Loss"
                id="profitLoss"
                value={formik.values.profitLoss}
                error={formik.errors.profitLoss}
                onChange={formik.handleChange}
                inputRef={payableRef}
                disabled
              />
            </Grid>
            <Grid item xs={12} lg={3} paddingLeft={0} marginTop={2}>
              <SelectBox
                label="Invoice Type"
                id="type"
                name="type"
                options={OPTION_TYPE}
                value={formik.values.type}
                disabled={formik.values.id ? true : false}
                error={formik.errors.type}
                onChange={(e) => {
                  const value = e.target.value;
                  if (formik.values.type === value) return;
                  if (
                    formik.values.details?.length === 0 ||
                    formik.values.paybleDetails?.length === 0
                  )
                    return formik.setFieldValue("type", value);
                  setAlertConfig({
                    open: true,
                    title: "Are you sure you want to change Invoice Type?",
                    message:
                      "All the Tax Invoice/Debit Note Details will be cleared if you change invoice type.",
                    severity: "info",
                    confirmText: "Yes",
                    onConfirm: () => {
                      formik.setFieldValue("type", value);
                      formik.setFieldValue("details", []);
                      setAlertConfig((prev) => ({ ...prev, open: false }));
                    },
                    onClose: () => {
                      setAlertConfig((prev) => ({ ...prev, open: false }));
                    },
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
              <SelectBox
                label="Currency"
                id="currency"
                options={mergedCurrencyOptions}
                inputRef={payableRef}
                value={formik.values.currency}
                error={formik.errors.currency}
                onChange={(e) => {
                  const value = e.target.value;

                  if (formik.values.currency === value) return;
                  if (!formik.values.currency) {
                    return formik.setFieldValue("currency", value);
                  }
                  if (
                    formik.values.details?.length === 0 ||
                    formik.values?.paybleDetails?.length === 0
                  )
                    return formik.setFieldValue("currency", value);
                  setAlertConfig({
                    open: true,
                    title: "Are you sure you want to change currency?",
                    message:
                      "All the Tax Invoice/Debit Note Details will be cleared if you change currency.",
                    severity: "info",
                    confirmText: "Yes",
                    onConfirm: () => {
                      formik.setFieldValue("currency", value);
                      formik.setFieldValue("details", []);
                      if (value === "USD") {
                        formik.setFieldValue("exchangeRate", "");
                      }
                      if (value === "INR") {
                        formik.setFieldValue("exchangeRate", 1);
                      }
                      setAlertConfig((prev) => ({ ...prev, open: false }));
                    },
                    onClose: () => {
                      setAlertConfig((prev) => ({ ...prev, open: false }));
                    },
                  });
                }}
                disabled={formik.values.id ? true : false}
              />
            </Grid>
            <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
              {formik.values?.currency === "TZS" ||
              formik.values?.currency === "INR" ? (
                <InputBox
                  label="Ex. Rate"
                  id="exchangeRate"
                  value={
                    formik.values?.currency === "TZS" ||
                    formik.values?.currency === "INR"
                      ? 1
                      : formatIndianCurrency(formik.values.exchangeRate)
                  }
                  error={formik.errors.exchangeRate}
                  onChange={formik.handleChange}
                  inputRef={payableRef}
                  disabled={
                    formik.values?.currency === "TZS" ||
                    formik.values?.currency === "INR"
                  }
                />
              ) : (
                <FormAutoCompleteWithExchangeLoader
                  label="Ex. Rate"
                  id="exchangeRate"
                  value={formik.values.exchangeRate}
                  error={formik.errors.exchangeRate}
                  onChange={formik.handleChange}
                  suggestionName="usd_exchange"
                  name={true}
                  inputRef={payableRef}
                  other={formik.values.currency}
                />
              )}
            </Grid>
            {formik.values.containerTypeDTO &&
              formik.values.containerTypeDTO.length > 0 && (
                <>
                  {formik.values.containerTypeDTO?.map((val, index) => (
                    <Grid
                      item
                      xs={12}
                      lg={3}
                      paddingLeft={index % 5 === 1 ? 0 : 2}
                      marginTop={2}
                      key={index}
                    >
                      <InputBox
                        label={val.type}
                        id={val.type}
                        value={val.count}
                        disabled
                      />
                    </Grid>
                  ))}
                </>
              )}
          </Grid>
          {alertConfig.open && <PopupAlert alertConfig={alertConfig} />}
          <Dialog
            open={openDialog.open}
            onClose={openDialog.onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent sx={{ padding: 0 }}>
              <Alert severity={openDialog.severity}>
                <AlertTitle>{openDialog.title}</AlertTitle>
                {openDialog.message}
              </Alert>
            </DialogContent>
            <DialogActions>
              <Button onClick={openDialog.onClose} color="primary" autoFocus>
                Okay
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>

      {jobNo && currency && exchangeRate ? (
        <CostDetails
          formik={formik}
          selectedInvoiceType={formik.values.type}
          page={"jobProfitAndLoss"}
        />
      ) : null}
    </React.Fragment>
  );
};

export default JobProfitAndLoss;
