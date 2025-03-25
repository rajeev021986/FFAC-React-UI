import { useEffect, useRef } from "react";

import { Grid, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";

//  Components
import InputBox from "../../components/common/InputBox";
import SelectBox from "../../components/common/SelectBox";
import DateTimeField from "../../components/common/DateTime/DateTimeField";

// Setting Data
import { useGetOptionsSettingsQuery } from "../../store/api/settingsApi";
import FormAutoComplete from "../../components/common/AutoComplete/FormAutoComplete";

export default function LineVessel({ formik }) {
  let disabled = null;
  const { data: jobSettingData } = useGetOptionsSettingsQuery("job_settings");

  const FieldRef = useRef(null);
  useEffect(() => {
    if (FieldRef.current) {
      FieldRef.current.focus();
    }
  }, []);

  console.log(formik.values, "formik.values");

  return (
    <Box sx={{ width: "100%", typography: "body1", margin: 0, padding: 0 }}>
      <Grid container sx={{ margin: 0, padding: 0, paddingRight: 1 }}>
        <Grid paddingLeft={1} marginTop={2} container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormAutoComplete
              label="Shipping Line"
              id="shippingLine"
              suggestionName="line_name"
              value={formik.values.shippingLine}
              error={formik.errors.shippingLine}
              onChange={formik.handleChange}
              inputRef={FieldRef}
            ></FormAutoComplete>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <DateTimeField
              name="eta"
              label="ETA"
              id="eta"
              value={formik?.values?.eta}
              error={formik?.errors?.eta}
              onChange={formik?.setFieldValue}
              inputRef={FieldRef}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <DateTimeField
              name="arrivalDate"
              label="Arrival Date"
              id="arrivalDate"
              value={formik?.values?.arrivalDate}
              error={formik?.errors?.arrivalDate}
              onChange={formik?.setFieldValue}
              inputRef={FieldRef}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <DateTimeField
              name="berthingDate"
              label="Berthing Date"
              id="berthingDate"
              value={formik?.values?.berthingDate}
              error={formik?.errors?.berthingDate}
              onChange={formik?.setFieldValue}
              inputRef={FieldRef}
            />
          </Grid>
        </Grid>

        <Grid container>
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
              label="Loading Vessel"
              id="loadingVessel"
              value={formik.values.loadingVessel}
              error={formik.errors.loadingVessel}
              onChange={formik.handleChange}
              disabled={disabled}
            />
          </Grid>

          <Grid
            paddingLeft={1}
            marginTop={2}
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
          >
            <FormAutoComplete
              label="Loading Voyage"
              id="loadingVoyage"
              suggestionName="vessel"
              value={formik.values.loadingVoyage}
              error={formik.errors.loadingVoyage}
              onChange={formik.handleChange}
              inputRef={FieldRef}
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
            <InputBox
              label="Discharging Vessel"
              id="dischargingVessel"
              value={formik.values.dischargingVessel}
              error={formik.errors.dischargingVessel}
              onChange={formik.handleChange}
              disabled={disabled}
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
            <FormAutoComplete
              label="Discharge Voyage"
              id="dischargeVoyage"
              suggestionName="vessel"
              value={formik.values.dischargeVoyage}
              error={formik.errors.dischargeVoyage}
              onChange={formik.handleChange}
              inputRef={FieldRef}
            ></FormAutoComplete>
          </Grid>
        </Grid>

        <Grid container>
          {/* Select */}
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
              label="Vessel/Local Agent"
              id="vesselAgent"
              suggestionName="line_name"
              value={formik.values.vesselAgent}
              error={formik.errors.vesselAgent}
              onChange={formik.handleChange}
              inputRef={FieldRef}
            ></FormAutoComplete>
          </Grid>

          {/* Select */}
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
              label="Type"
              id="type"
              options={jobSettingData?.body.lineVesselType}
              value={formik.values.type}
              error={formik.errors.type}
              onChange={formik.handleChange}
              disabled={disabled}
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
              label="Vessel Berthed At"
              id="vesselBerthedAt"
              value={formik.values.vesselBerthedAt}
              error={formik.errors.vesselBerthedAt}
              onChange={formik.handleChange}
              disabled={disabled}
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
              label="ICD Transfer"
              id="icdName"
              options={jobSettingData?.body.ICDTransfer}
              value={formik.values.icdName}
              error={formik.errors.icdName}
              onChange={formik.handleChange}
              disabled={disabled}
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
            <DateTimeField
              name="icdTransferDate"
              label="ICD TransferDate"
              id="icdTransferDate"
              value={formik?.values?.icdTransferDate}
              error={formik?.errors?.icdTransferDate}
              onChange={formik?.setFieldValue}
              inputRef={FieldRef}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
