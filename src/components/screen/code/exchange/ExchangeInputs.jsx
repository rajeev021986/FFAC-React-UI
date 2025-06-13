import React, { useEffect, useRef, useState } from "react";
import InputBox from "../../../common/InputBox";
import { CircularProgress, Grid, Stack, TextField } from "@mui/material";
import { OutlinedButton, ThemeButton } from "../../../common/Button";
import DateTimeField from "../../../common/DateTime/DateTimeField";
import SelectBox from "../../../common/SelectBox";
import ApiManager from "../../../../services/ApiManager";
import { useGetOptionsSettingsQuery } from "../../../../store/api/settingsApi";
import getFirstError from "../../../common/FieldToastError";

export default function ExchangeInputs({
  formik,
  nav,
  type,
  ExchageSettingsData,
  loading,
}) {
  const FieldRef = useRef(null);

  useEffect(() => {
    if (FieldRef.current) {
      FieldRef.current.focus();
    }
  }, []);
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
  return (
    <Grid container spacing={2} paddingLeft={1} paddingTop={1}>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} marginTop={1}>
        <DateTimeField
          name="fromDate"
          label="From Date"
          id="fromDate"
          value={formik.values.fromDate}
          error={formik.errors.fromDate}
          onChange={formik.setFieldValue}
          inputRef={FieldRef}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} marginTop={1}>
        <DateTimeField
          label="To Date"
          id="toDate"
          value={formik.values.toDate}
          error={formik.errors.toDate}
          onChange={formik.setFieldValue}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} marginTop={1}>
        {/* <InputBox
          label="Currency*"
          id="currency"
          value={formik.values.currency}
          error={formik.errors.currency}
          onChange={formik.handleChange}
        /> */}

        <SelectBox
          label="Currency"
          id="currency"
          options={mergedCurrencyOptions}
          value={formik.values.currency}
          error={formik.errors.currency}
          onChange={formik.handleChange}
        />
      </Grid>
      {formik.values.statusCode == -2 || formik.values.statusCode == 1 ? (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ marginTop: 2 }}>
          <SelectBox
            label="Status"
            id="status"
            options={ExchageSettingsData?.body.status}
            value={formik.values.status}
            error={formik.errors.status}
            onChange={formik.handleChange}
          />
        </Grid>
      ) : (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} marginTop={1}>
          <InputBox
            label="Status"
            id="status"
            disabled={true}
            value={formik.values.status}
            error={formik.errors.status}
            onChange={formik.handleChange}
          />
        </Grid>
      )}
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} marginTop={1}>
        <InputBox
          label="Exchange rate"
          id="usdExchange"
          value={formik.values.usdExchange}
          error={formik.errors.usdExchange}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} marginTop={1}>
        <InputBox
          label="INR exchange."
          id="ugxExchange"
          value={formik.values.ugxExchange}
          error={formik.errors.ugxExchange}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          margin: 1,
          paddingTop: "0px !important",
        }}
      >
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Stack direction="row" spacing={2}>
            <OutlinedButton
              sx={{ fontWeight: "500" }}
              onClick={() => nav("/app/admin/exchangeRate")}
            >
              Close
            </OutlinedButton>
            <ThemeButton
              onClick={async () => {
                const errors = await formik.validateForm();

                if (Object.keys(errors).length > 0) {
                  formik.setTouched(
                    Object.fromEntries(
                      Object.keys(errors).map((key) => [key, true])
                    ),
                    true
                  );
                  getFirstError(errors);
                } else {
                  formik.handleSubmit();
                }
              }}
              sx={{ fontWeight: "500", color: "white !important" }}
            >
              {loading && <CircularProgress size={20} color="white" />}{" "}
              {type == "edit" ? "Update" : "Add"}
            </ThemeButton>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}
