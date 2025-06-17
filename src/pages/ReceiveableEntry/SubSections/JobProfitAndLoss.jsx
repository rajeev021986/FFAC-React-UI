import React, { useEffect, useRef, useState } from "react";
import { AppBar, Box, Grid, Toolbar, Typography } from "@mui/material";

// Components
import InputBox from "../../../components/common/InputBox";
import SelectBox from "../../../components/common/SelectBox";
import CostDetails from "./CostDetails";
import PopupAlert from "../../../components/common/Alert/PopupAlert";
import { useGetOptionsSettingsQuery } from "../../../store/api/settingsApi";
import ApiManager from "../../../services/ApiManager";

const JobProfitAndLoss = ({ formik }) => {
  const payableRef = useRef(null);
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    title: "",
    message:
      "All the Tax Invoice/Debit Note Details will be cleared if you change invoice type ",
    severity: "info",
    onConfirm: null,
    onClose: () => setAlertConfig({ ...alertConfig, open: false }),
  });
  const { jobNo, currency, exRate } = formik?.values;
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
                value={formik.values.jobNo}
                error={formik.errors.jobNo}
                onChange={formik.handleChange}
                inputRef={payableRef}
                disabled
              />
            </Grid>

            <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
              <InputBox
                label="Customer Name"
                id="customerName"
                value={formik.values.customerName}
                error={formik.errors.customerName}
                onChange={formik.handleChange}
                inputRef={payableRef}
                disabled
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
                  if (formik.values.details.length === 0)
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
                value={formik.values.currency}
                error={formik.errors.currency}
                onChange={formik.handleChange}
              />
            </Grid>
            {formik.values.containerTypeDTO &&
              formik.values.containerTypeDTO.length > 0 && (
                <>
                  {formik.values.containerTypeDTO?.map((val, index) => (
                    <Grid
                      item
                      xs={12}
                      lg={3}
                      paddingLeft={2}
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
        </Box>
      </Box>

      {jobNo && currency && exRate ? (
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
