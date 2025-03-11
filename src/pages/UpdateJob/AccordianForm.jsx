import React, { useState } from "react";
import { Grid, Tooltip, Typography } from "@mui/material";
import InputBox from "../../components/common/InputBox";

const AccordianForm = () => {
  let disabled = null;

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

        {/* <Grid paddingLeft={1} container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <InputBox
              label="TRANSPORTER"
              id="originCountry"
              // value={formik?.values?.originCountry}
              // error={formik?.errors?.originCountry}
              // onChange={formik?.handleChange}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <InputBox
              label="TRUCK/TRAILER NO."
              id="portOfLoading"
              // value={formik.values.portOfLoading}
              // error={formik.errors.portOfLoading}
              // onChange={formik.handleChange}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <InputBox
              label="Driver"
              id="portOfDischarge"
              // value={formik.values.portOfDischarge}
              // error={formik.errors.portOfDischarge}
              // onChange={formik.handleChange}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <InputBox
              label="Agreed Rate"
              id="placeOfDelivery"
              // value={formik.values.placeOfDelivery}
              // error={formik.errors.placeOfDelivery}
              // onChange={formik.handleChange}
              disabled={disabled}
            />
          </Grid>
        </Grid> */}

        <Grid paddingLeft={1} container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <InputBox
              label="TRANSPORTER"
              id="originCountry"
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <InputBox
              label="TRUCK/TRAILER NO."
              id="portOfLoading"
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <InputBox label="Driver" id="portOfDischarge" disabled={disabled} />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <InputBox
              label="Agreed Rate"
              id="placeOfDelivery"
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
              id="destinationIcd"
              // value={formik.values.destinationIcd}
              // error={formik.errors.destinationIcd}
              // onChange={formik.handleChange}
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
            <Tooltip
              // title={!formik.values.totalNoOfPackages ? "Field is mandatory" : ""}
              arrow
            >
              <InputBox
                label="Passport No."
                id="totalNoOfPackages"
                // value={formik.values.totalNoOfPackages}
                // error={formik.errors.totalNoOfPackages}
                // disabled={disabled}
                // onChange={formik.handleChange}
              />
            </Tooltip>
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
              id="totalGrWt"
              // value={formik.values.totalGrWt}
              // error={formik.errors.totalGrWt}
              // onChange={formik.handleChange}
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
              // value={formik.values.marks}
              // error={formik.errors.marks}
              // onChange={formik.handleChange}
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
              label="Tel No."
              id="description"
              // value={formik.values.description}
              // error={formik.errors.description}
              // onChange={formik.handleChange}
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
              id="poNo"
              // value={formik.values.poNo}
              // error={formik.errors.poNo}
              // onChange={formik.handleChange}
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
              label="Reporting Date"
              id="currency"
              // value={formik.values.currency}
              // error={formik.errors.currency}
              // onChange={formik.handleChange}
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
              label="Reporting Time"
              id="reportingTime"
              // value={formik.values.reportingTime}
              // error={formik.errors.reportingTime}
              // onChange={formik.handleChange}
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
              label="ContainerNO"
              id="ContainerNO"
              // value={formik.values.ContainerNO}
              // error={formik.errors.ContainerNO}
              // onChange={formik.handleChange}
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
              label="Transfer Date"
              id="transferDate"
              // value={formik.values.transferDate}
              // error={formik.errors.transferDate}
              // onChange={formik.handleChange}
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
              id="routeCode"
              // value={formik.values.routeCode}
              // error={formik.errors.routeCode}
              // onChange={formik.handleChange}
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
              id="loadingAirDate"
              // value={formik.values.loadingAirDate}
              // error={formik.errors.loadingAirDate}
              // onChange={formik.handleChange}
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
              label="Bond No."
              id="bondNo"
              // value={formik.values.bondNo}
              // error={formik.errors.bondNo}
              // onChange={formik.handleChange}
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
              // value={formik.values.bondAmount}
              // error={formik.errors.bondAmount}
              // onChange={formik.handleChange}
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
              label="Cancellation Date"
              id="cancellationDate"
              // value={formik.values.cancellationDate}
              // error={formik.errors.cancellationDate}
              // onChange={formik.handleChange}
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
              label="Arrival Border"
              id="arrivalBorder"
              // value={formik.values.arrivalBorder}
              // error={formik.errors.arrivalBorder}
              // onChange={formik.handleChange}
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
              label="Crossed Border"
              id="crossedBorder"
              // value={formik.values.crossedBorder}
              // error={formik.errors.crossedBorder}
              // onChange={formik.handleChange}
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
              label="Arrival ICD"
              id="arrivalICD"
              // value={formik.values.arrivalICD}
              // error={formik.errors.arrivalICD}
              // onChange={formik.handleChange}
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
              label="Cargo Release Date"
              id="cargoReleaseDate"
              // value={formik.values.cargoReleaseDate}
              // error={formik.errors.cargoReleaseDate}
              // onChange={formik.handleChange}
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
              label="Depart ICD"
              id="departICD"
              // value={formik.values.departICD}
              // error={formik.errors.departICD}
              // onChange={formik.handleChange}
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
              label="Arrival Customer Place"
              id="arrivalCustomerPlace"
              // value={formik.values.arrivalCustomerPlace}
              // error={formik.errors.arrivalCustomerPlace}
              // onChange={formik.handleChange}
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
              label="Empty Released"
              id="emptyRelease"
              // value={formik.values.emptyRelease}
              // error={formik.errors.emptyRelease}
              // onChange={formik.handleChange}
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
              // value={formik.values.emptyReturnPlace}
              // error={formik.errors.emptyReturnPlace}
              // onChange={formik.handleChange}
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
              // value={formik.values.podNo}
              // error={formik.errors.podNo}
              // onChange={formik.handleChange}
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
              label="DATE"
              id="arrivalCustomerPlace"
              // value={formik.values.arrivalCustomerPlace}
              // error={formik.errors.arrivalCustomerPlace}
              // onChange={formik.handleChange}
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
              label="Empty Return Date"
              id="emptyReturnDate"
              // value={formik.values.emptyReturnDate}
              // error={formik.errors.emptyReturnDate}
              // onChange={formik.handleChange}
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
              label="Certificate of Export"
              id="certificateExport"
              // value={formik.values.certificateExport}
              // error={formik.errors.certificateExport}
              // onChange={formik.handleChange}
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
              id="portGateDate"
              // value={formik.values.portGateDate}
              // error={formik.errors.portGateDate}
              // onChange={formik.handleChange}
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
              label="Nomination Date"
              id="nominationDate"
              // value={formik.values.nominationDate}
              // error={formik.errors.nominationDate}
              // onChange={formik.handleChange}
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
              id="remarks"
              // value={formik.values.remarks}
              // error={formik.errors.remarks}
              // onChange={formik.handleChange}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default AccordianForm;
