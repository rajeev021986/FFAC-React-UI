import React, { useEffect, useRef } from "react";
import InputBox from "../../../common/InputBox";
import { CircularProgress, Grid, Stack, TextField } from "@mui/material";
import { OutlinedButton, ThemeButton } from "../../../common/Button";
import { useNavigate } from "react-router-dom";
import SelectBox from "../../../common/SelectBox";
import FormAutoComplete from "../../../common/AutoComplete/FormAutoComplete";
import getFirstError from "../../../common/FieldToastError";
import FormAutoCompleteWithLoader from "../../../common/AutoComplete/FormAutoCompletewithLoader";
import { useGetOptionsSettingsQuery } from "../../../../store/api/settingsApi";

export default function PortValueForm({
  formik,
  type,
  optionsSettingsData,
  loading,
}) {
  const nav = useNavigate();
    const { data: portSettingsData } = useGetOptionsSettingsQuery("port_settings");
  useEffect(() => {
    getFirstError(formik.errors);
  }, [formik.errors]);

  const FieldRef = useRef(null);
  useEffect(() => {
    if (FieldRef.current) {
      FieldRef.current.focus();
    }
  }, []);
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
            label="Port Name*"
            id="newPortName"
            value={formik.values.newPortName}
            error={formik.errors.newPortName}
            onChange={formik.handleChange}
            inputRef={FieldRef}
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
          <SelectBox
            label="Type*"
            id="type"
            options={portSettingsData?.body?.type}
            value={formik.values.type}
            error={formik.errors.type}
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
          <SelectBox
            label="Base Port"
            id="basePort"
            options={portSettingsData?.body?.basePort}
            value={formik.values.basePort}
            error={formik.errors.basePort}
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
            label="Custom Code"
            id="customCode"
            value={formik.values.customCode}
            error={formik.errors.customCode}
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
            label="IotaCode"
            id="iotaCode"
            value={formik.values.iotaCode}
            error={formik.errors.iotaCode}
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
            label="UnCode"
            id="unCode"
            value={formik.values.unCode}
            error={formik.errors.unCode}
            onChange={formik.handleChange}
          />
        </Grid>
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
          <FormAutoComplete
            label="Country"
            id="country"
            suggestionName="country"
            value={formik.values.country}
            error={formik.errors.country}
            onChange={formik.handleChange}
          ></FormAutoComplete>
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
          <FormAutoComplete
            label="Region"
            id="region"
            suggestionName="region"
            value={formik.values.region}
            error={formik.errors.region}
            onChange={formik.handleChange}
            inputRef={FieldRef}

          ></FormAutoComplete>
        </Grid>
      </Grid>
      <Grid container sx={{ marginTop: 2, paddingLeft: 1 }}>
        <TextField
          id="portDetails"
          name="portDetails"
          label="Port Details"
          variant="outlined"
          multiline
          rows={4}
          value={formik.values.portDetails}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.portDetails && Boolean(formik.errors.portDetails)
          }
          helperText={formik.touched.portDetails && formik.errors.portDetails}
          fullWidth
          InputProps={{ sx: { borderRadius: "10px" } }}
        />
      </Grid>
      <Grid item xs={12} sx={{ margin: 1 }}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Stack direction="row" spacing={2}>
            <OutlinedButton sx={{ fontWeight: "500" }} onClick={() => nav(-1)}>
            Close
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
