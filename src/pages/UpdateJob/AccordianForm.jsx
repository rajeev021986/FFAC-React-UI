import React, { useEffect, useRef } from "react";
import { Grid, Typography } from "@mui/material";
import InputBox from "../../components/common/InputBox";
import DateTimeField from "../../components/common/DateTime/DateTimeField";

const AccordianForm = ({ formik, index }) => {
  let disabled = null;

  const FieldRef = useRef(null);
  useEffect(() => {
    if (FieldRef.current) {
      FieldRef.current.focus();
    }
  }, []);

  return (
    <div>
      <Grid container sx={{ margin: 0, padding: 0, paddingRight: 1 }}>
        <Typography
          color="primary.main"
          variant="h5"
          gutterBottom
          style={{
            width: "100%",
            margin: "0px ! important",
            paddingLeft: "10px",
            fontSize: "16px",
            marginTop: "10px",
          }}
        >
          Transport Details
        </Typography>

        <Grid paddingLeft={1} container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <InputBox
              label="TRANSPORTER"
              id="originCountry"
              name={`containerDetails[${index}].transporter`}
              value={formik.values.containerDetails[index].transporter}
              onChange={formik.handleChange}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <InputBox
              label="TRUCK/TRAILER NO."
              id="truckTrailerNoTransporter"
              name={`containerDetails[${index}].truckTrailerNoTransporter`}
              value={
                formik.values.containerDetails[index].truckTrailerNoTransporter
              }
              onChange={formik.handleChange}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <InputBox
              label="Driver"
              id="driver"
              name={`containerDetails[${index}].driver`}
              value={formik.values.containerDetails[index].driver}
              onChange={formik.handleChange}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <InputBox
              label="Agreed Rate"
              id="agreedRate"
              name={`containerDetails[${index}].agreedRate`}
              value={formik.values.containerDetails[index].agreedRate}
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
              label="Tel No."
              id="telNo"
              name={`containerDetails[${index}].telNo`}
              value={formik.values.containerDetails[index].telNo}
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
              label="Passport No."
              id="passportNo"
              name={`containerDetails[${index}].passportNo`}
              value={formik.values.containerDetails[index].passportNo}
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
              label="Licence No."
              id="licenceNo"
              name={`containerDetails[${index}].licenceNo`}
              value={formik.values.containerDetails[index].licenceNo}
              onChange={formik.handleChange}
              disabled={disabled}
            />
          </Grid>
        </Grid>

        <Grid marginTop={2} container>
          <Typography
            variant="h5"
            color="primary.main"
            gutterBottom
            style={{
              width: "100%",
              margin: "0px ! important",
              paddingLeft: "10px",
              fontSize: "16px",
            }}
          >
            Operation Clerk Details
          </Typography>
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
              label="Clerk Name"
              id="clerkName"
              name={`containerDetails[${index}].clerkName`}
              value={formik.values.containerDetails[index].clerkName}
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
              label="Clerk Tel No."
              id="clerkTelNo"
              name={`containerDetails[${index}].clerkTelNo`}
              value={formik.values.containerDetails[index].clerkTelNo}
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
              label="Reporting Place"
              id="reportingPlace"
              name={`containerDetails[${index}].reportingPlace`}
              value={formik.values.containerDetails[index].reportingPlace}
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
              label="Reporting Date"
              id="reportingDate"
              name={`containerDetails[${index}].reportingDate`}
              value={formik.values.containerDetails[index].reportingDate}
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
              label="Reporting Time"
              id="reportingTime"
              name={`containerDetails[${index}].reportingTime`}
              value={formik.values.containerDetails[index].reportingTime}
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
              label="ContainerNO"
              id="containerNo"
              name={`containerDetails[${index}].containerNo`}
              value={formik.values.containerDetails[index].containerNo}
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
              label="Transfer Date"
              id="transferDate"
              name={`containerDetails[${index}].transferDate`}
              value={formik.values.containerDetails[index].transferDate}
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
              label="T1/C1 READY"
              id="t1C1ReadyDate"
              name={`containerDetails[${index}].t1C1ReadyDate`}
              value={formik.values.containerDetails[index].t1C1ReadyDate}
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
              label="LOADING DATE"
              id="loadingDate"
              name={`containerDetails[${index}].loadingDate`}
              value={formik.values.containerDetails[index].loadingDate}
              onChange={formik.handleChange}
              disabled={disabled}
            />
          </Grid>
        </Grid>

        <Grid container>
          {/* Keys are not available */}
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
              label="Bond No."
              id="bondNumber"
              name={`containerDetails[${index}].bondNumber`}
              value={formik.values.containerDetails[index].bondNumber}
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
              label="Bond Amount"
              id="bondAmount"
              name={`containerDetails[${index}].bondAmount`}
              value={formik.values.containerDetails[index].bondAmount}
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
              label="Cancellation Date"
              id="cancellationDate"
              name={`containerDetails[${index}].cancellationDate`}
              value={formik.values.containerDetails[index].cancellationDate}
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
              label="Arrival Border"
              id="arrivalBorderDate"
              name={`containerDetails[${index}].arrivalBorderDate`}
              value={formik.values.containerDetails[index].arrivalBorderDate}
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
              label="Crossed Border"
              id="crossedBorderDate"
              name={`containerDetails[${index}].crossedBorderDate`}
              value={formik.values.containerDetails[index].crossedBorderDate}
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
              label="Arrival ICD"
              id="arrivalICDDate"
              name={`containerDetails[${index}].arrivalICDDate`}
              value={formik.values.containerDetails[index].arrivalICDDate}
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
              label="Cargo Release Date"
              id="cargoReleaseDate"
              name={`containerDetails[${index}].cargoReleaseDate`}
              value={formik.values.containerDetails[index].cargoReleaseDate}
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
              label="Depart ICD"
              id="departICDDate"
              name={`containerDetails[${index}].departICDDate`}
              value={formik.values.containerDetails[index].departICDDate}
              onChange={formik.handleChange}
              disabled={disabled}
            />
          </Grid>
        </Grid>

        {/*  */}
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
              label="Arrival Customer Place"
              id="arrivalCustomerPlaceDate"
              name={`containerDetails[${index}].arrivalCustomerPlaceDate`}
              value={
                formik.values.containerDetails[index].arrivalCustomerPlaceDate
              }
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
              label="Empty Released"
              id="emptyReleasedDate"
              name={`containerDetails[${index}].emptyReleasedDate`}
              value={formik.values.containerDetails[index].emptyReleasedDate}
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
              label="Empty Return Place"
              id="emptyReturnPlace"
              name={`containerDetails[${index}].emptyReturnPlace`}
              value={formik.values.containerDetails[index].emptyReturnPlace}
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
              label="POD NO."
              id="podNo"
              name={`containerDetails[${index}].podNo`}
              value={formik.values.containerDetails[index].podNo}
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
              label="Pod DATE"
              id="podDate"
              name={`containerDetails[${index}].podDate`}
              value={formik.values.containerDetails[index].podDate}
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
              label="Empty Return Date"
              id="emptyReturnDate"
              name={`containerDetails[${index}].emptyReturnDate`}
              value={formik.values.containerDetails[index].emptyReturnDate}
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
              label="Certificate of Export"
              id="certificateOfExportDate"
              name={`containerDetails[${index}].certificateOfExportDate`}
              value={
                formik.values.containerDetails[index].certificateOfExportDate
              }
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
              label="Port Gate In Date"
              id="portGateInDate"
              name={`containerDetails[${index}].portGateInDate`}
              value={formik.values.containerDetails[index].portGateInDate}
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
              label="Nomination Date"
              id="nominationDate"
              name={`containerDetails[${index}].nominationDate`}
              value={formik.values.containerDetails[index].nominationDate}
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
              label="Remark"
              id="remark"
              name={`containerDetails[${index}].remark`}
              value={formik.values.containerDetails[index].remark}
              onChange={formik.handleChange}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default AccordianForm;
