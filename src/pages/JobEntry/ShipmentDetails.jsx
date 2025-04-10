import { useEffect, useRef } from "react";
import { Grid, TextField, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";

// Components
import InputBox from "../../components/common/InputBox";
import DateTimeField from "../../components/common/DateTime/DateTimeField";

// Setting Data
import { useGetOptionsSettingsQuery } from "../../store/api/settingsApi";
import SelectBox from "../../components/common/SelectBox";
import FormAutoComplete from "../../components/common/AutoComplete/FormAutoComplete";
import FormAutoCompleteWithTable from "../../components/common/AutoComplete/FormAutoCompletewithTable";

export default function ShipmentDetails({ formik }) {
  let disabled = null;

  const { data: jobSettingData } = useGetOptionsSettingsQuery("job_settings");

  const FieldRef = useRef(null);
  useEffect(() => {
    if (FieldRef.current) {
      FieldRef.current.focus();
    }
  }, []);

  return (
    <Box sx={{ width: "100%", typography: "body1", margin: 0, padding: 0 }}>
      <Grid container sx={{ margin: 0, padding: 0, paddingRight: 1 }}>
        <Grid paddingLeft={1} marginTop={2} container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormAutoCompleteWithTable
              label="Origin Country"
              id="originCountry"
               suggestionName="country"
              value={formik.values.originCountry}
              error={formik.errors.originCountry}
              onChange={formik.handleChange}
              inputRef={FieldRef}
              formik={formik}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            {/* <FormAutoComplete
              label="Port Of Loading"
              id="portOfLoading"
              suggestionName="port_name"
              value={formik.values.portOfLoading}
              error={formik.errors.portOfLoading}
              onChange={formik.handleChange}
              inputRef={FieldRef}
            /> */}
            <InputBox
            label="Port Of Loading"
              id="portOfLoading"
              suggestionName="port_name"
              value={formik.values.portOfLoading}
              error={formik.errors.portOfLoading}
              onChange={formik.handleChange}
              inputRef={FieldRef}
              disabled={true}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormAutoComplete
              label="Port Of Discharge"
              id="portOfDischarge"
              suggestionName="port_name"
              value={formik.values.portOfDischarge}
              error={formik.errors.portOfDischarge}
              onChange={formik.handleChange}
              inputRef={FieldRef}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormAutoComplete
              label="Place Of Delivery"
              id="placeOfDelivery"
              suggestionName="port_name"
              value={formik.values.placeOfDelivery}
              error={formik.errors.placeOfDelivery}
              onChange={formik.handleChange}
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
              label="Destination ICD"
              id="icdDestination"
              value={formik.values.icdDestination}
              error={formik.errors.icdDestination}
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
            <InputBox
              label="Total No OfPkgs."
              id="totalNoOfPackages"
              value={formik.values.totalNoOfPackages}
              error={formik.errors.totalNoOfPackages}
              disabled={disabled}
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
              label="Total Gr.Wt."
              id="totalGrWt"
              value={formik.values.totalGrWt}
              error={formik.errors.totalGrWt}
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
              label="CBM"
              id="cbm"
              value={formik.values.cbm}
              error={formik.errors.cbm}
              onChange={formik.handleChange}
              disabled={disabled}
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
              label="Marks"
              id="marks"
              value={formik.values.marks}
              error={formik.errors.marks}
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
              label="Description"
              id="description"
              value={formik.values.description}
              error={formik.errors.description}
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
              label="P.O. No."
              id="poNo"
              value={formik.values.poNo}
              error={formik.errors.poNo}
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
              label="Currency"
              id="currency"
              options={jobSettingData?.body.currency}
              value={formik.values.currency}
              error={formik.errors.currency}
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
              label="FOB value"
              id="fobValue"
              value={formik.values.fobValue}
              error={formik.errors.fobValue}
              onChange={formik.handleChange}
              disabled={disabled}
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
            <DateTimeField
              name="preAssessmentDate"
              label="Pre Assessement Date"
              id="preAssessmentDate"
              value={formik.values.preAssessmentDate}
              error={formik.errors.preAssessmentDate}
              onChange={formik.setFieldValue}
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
            <DateTimeField
              name="finalAssessmentDate"
              label="Final Assessement Date"
              id="finalAssessmentDate"
              value={formik.values.finalAssessmentDate}
              error={formik.errors.finalAssessmentDate}
              onChange={formik.setFieldValue}
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
              label="Route Code"
              id="routeCode"
              options={jobSettingData?.body.routeCode}
              value={formik.values.routeCode}
              error={formik.errors.routeCode}
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
              name="loadingDateForAirShipment"
              label="Loading Date For Air Shipment"
              id="loadingDateForAirShipment"
              value={formik.values.loadingDateForAirShipment}
              error={formik.errors.loadingDateForAirShipment}
              onChange={formik.setFieldValue}
              inputRef={FieldRef}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
