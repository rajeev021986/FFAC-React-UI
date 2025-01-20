import { CircularProgress, Grid, Stack } from "@mui/material";
import React, { useEffect } from "react";
import InputBox from "../../../common/InputBox";
import BondFilterForm from "./BondFilterForm";
import BondEditGrid from "./BondGrid";
import SelectBox from "../../../common/SelectBox";
import { OutlinedButton, ThemeButton } from "../../../common/Button";
import { useNavigate } from "react-router-dom";
import getFirstError from "../../../common/FieldToastError";

export default function BondValue({
  formik,
  optionsSettingsData,
  type,
  loading,
}) {
  const nav = useNavigate();
  useEffect(() => {
    getFirstError(formik.errors);
  }, [formik.errors]);
  return (
    <Grid container sx={{ padding: 0, margin: 0, paddingRight: "8px" }}>
      <Grid container sx={{ margin: 0 }}>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          paddingLeft={1}
          marginTop={2}
        >
          <InputBox
            label="Bond Number*"
            id="bondNumber"
            value={formik.values.bondNumber}
            error={formik.errors.bondNumber}
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
          paddingLeft={1}
          marginTop={2}
        >
          <InputBox
            label="Bond Type*"
            id="bondType"
            value={formik.values.bondType}
            error={formik.errors.bondType}
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
          paddingLeft={1}
          marginTop={2}
        >
          <InputBox
            label="Opening Balance"
            id="openingBalance"
            value={formik.values.openingBalance}
            error={formik.errors.openingBalance}
            onChange={formik.handleChange}
          />
        </Grid>
        {formik.values.statusCode == -2 || formik.values.statusCode == 1 ? (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            sx={{ marginTop: 2 }}
            paddingLeft={1}
          >
            <SelectBox
              label="Status"
              id="status"
              options={optionsSettingsData?.body.status}
              value={formik.values.status}
              error={formik.errors.status}
              onChange={formik.handleChange}
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
            paddingLeft={1}
            marginTop={2}
          >
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
      </Grid>
      <Grid container sx={{ margin: 0 }}>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          paddingLeft={1}
          marginTop={2}
        >
          <InputBox
            label="Remark"
            id="remark"
            value={formik.values.remark}
            error={formik.errors.remark}
            onChange={formik.handleChange}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} paddingLeft={1}>
        <BondEditGrid formik={formik} disabled={false} />
      </Grid>
      <Grid item xs={12} sx={{ margin: 1 }}>
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
              {type == "Edit" ? "Update" : "Add"}
            </ThemeButton>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}
