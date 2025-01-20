import React from "react";
import InputBox from "../../../common/InputBox";
import { CircularProgress, Grid, Stack, TextField } from "@mui/material";
import { OutlinedButton, ThemeButton } from "../../../common/Button";
import DateTimeField from "../../../common/DateTime/DateTimeField";
import SelectBox from "../../../common/SelectBox";

export default function ExchangeInputs({
  formik,
  nav,
  type,
  ExchageSettingsData,
  loading
}) {
  return (
    <Grid container spacing={2} paddingLeft={1}>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} marginTop={2}>
        <DateTimeField
          label="From Date"
          id="fromDate"
          value={formik.values.fromDate}
          error={formik.errors.fromDate}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} marginTop={2}>
        <DateTimeField
          label="To Date"
          id="toDate"
          value={formik.values.toDate}
          error={formik.errors.toDate}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} marginTop={2}>
        <InputBox
          label="Currency*"
          id="currency"
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
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} marginTop={2}>
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
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} marginTop={2}>
        <InputBox
          label="USD Exchange"
          id="usdExchange"
          value={formik.values.usdExchange}
          error={formik.errors.usdExchange}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} marginTop={2}>
        <InputBox
          label="UGX Exchange"
          id="ugxExchange"
          value={formik.values.ugxExchange}
          error={formik.errors.ugxExchanges}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ margin: 1, paddingLeft: "", paddingTop: "0px !important" }}
      >
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Stack direction="row" spacing={2}>
            <OutlinedButton sx={{ fontWeight: "500" }} onClick={() => nav(-1)}>
              Cancel
            </OutlinedButton>
            <ThemeButton
              onClick={formik.handleSubmit}
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
