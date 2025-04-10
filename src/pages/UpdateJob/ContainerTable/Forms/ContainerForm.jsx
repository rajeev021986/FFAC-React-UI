import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import toast from "react-hot-toast";

import { CircularProgress, Typography } from "@mui/material";
import { Stack, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import { useGetOptionsSettingsQuery } from "../../../../store/api/settingsApi";
import CustomToast from "../../../../components/common/Toast/CustomToast";
import getFirstError from "../../../../components/common/FieldToastError";
import EditIconForHeader from "../../../../components/common/commonIcons/EditIcons/EditIconForHeader";

// API's
import { useUpdateContainerNumberMutation } from "../../../../store/api/containerApi";

// Components
import {
  OutlinedButton,
  ThemeButton,
} from "../../../../components/common/Button";
import InputBox from "../../../../components/common/InputBox";
import DateTimeField from "../../../../components/common/DateTime/DateTimeField";

export default function ContainerNumberForm({ initialValues, page }) {
  const [updateContainerNumber, { isLoading }] =
    useUpdateContainerNumberMutation();

  const [dropdownData, setDropdownData] = useState({});
  const nav = useNavigate();
  const [value, setValue] = React.useState("1");

  const [alertConfig, setAlertConfig] = useState({
    open: false,
    title: "",
    message: "",
    severity: "info",
    onConfirm: null,
    onClose: () => setAlertConfig({ ...alertConfig, open: false }),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        values.statusCode = dropdownData?.approvalRequest ? 0 : 1;
        values.status = "";
        let response = await updateContainerNumber({
          ...values,
        }).unwrap();
        const message = response.message;
        if (response.code == "SUCCESS") {
          toast.custom(<CustomToast message={message} toast="success" />, {
            closeButton: false,
          });
          nav("/app/documentation/update/job");
        } else {
          toast.custom(<CustomToast message={message} toast="error" />, {
            closeButton: false,
          });
        }
      } catch (error) {
        if (error.status === 409) {
          const message = error.data.message;
          toast.custom(<CustomToast message={message} toast="error" />, {
            closeButton: false,
          });
        } else {
          toast.custom(
            <CustomToast
              message="An error occurred while submitting the form."
              toast="error"
            />,
            {
              closeButton: false,
            }
          );
        }
      }
    },
  });

  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("common_settings");
  const { data: customerSettingsData } =
    useGetOptionsSettingsQuery("customer_settings");

  useEffect(() => {
    if (optionsSettingsData?.body || customerSettingsData?.body) {
      setDropdownData({
        ...optionsSettingsData?.body,
        ...customerSettingsData?.body,
      });
    }
  }, [optionsSettingsData, customerSettingsData]);

  const disabled = page == "update-job" ? false : true;

  useEffect(() => {
    getFirstError(formik.errors);
  }, [formik.errors]);

  const customerNameRef = useRef(null);
  useEffect(() => {
    if (customerNameRef.current) {
      customerNameRef.current.focus();
    }
  }, []);

  const FieldRef = useRef(null);
  useEffect(() => {
    if (FieldRef.current) {
      FieldRef.current.focus();
    }
  }, []);

  return (
    <>
      <Box sx={{ width: "100%", typography: "body1", margin: 0, padding: 0 }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              aria-label="lab API tabs example"
              sx={{ paddingBottom: "20px" }}
            >
              <Tab
                label="Update Container Details"
                value="1"
                sx={{
                  textTransform: "capitalize",
                  minHeight: "50px",
                }}
                icon={<EditIconForHeader />}
                iconPosition="start"
              />
            </TabList>
          </Box>
          <TabPanel value="1" sx={{ padding: "0px" }}>
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
                    id="transporter"
                    value={formik.values.transporter}
                    onChange={formik.handleChange}
                    disabled={disabled}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <InputBox
                    label="TRUCK/TRAILER NO."
                    id="truckTrailerNoTransporter"
                    value={formik.values.truckTrailerNoTransporter}
                    onChange={formik.handleChange}
                    disabled={disabled}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <InputBox
                    label="Driver"
                    id="driver"
                    value={formik.values.driver}
                    onChange={formik.handleChange}
                    disabled={disabled}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <InputBox
                    label="Agreed Rate"
                    id="agreedRate"
                    value={formik.values.agreedRate}
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
                    value={formik.values.telNo}
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
                    value={formik.values.passportNo}
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
                    value={formik.values.licenceNo}
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
                    value={formik.values.clerkName}
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
                    value={formik.values.clerkTelNo}
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
                    value={formik.values.reportingPlace}
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
                    name="reportingDate"
                    id="reportingDate"
                    value={formik.values.reportingDate}
                    error={formik.errors.reportingDate}
                    onChange={formik.setFieldValue}
                    disabled={disabled}
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
                    label="ContainerNO"
                    id="containerNo"
                    value={formik.values.containerNo}
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
                    name="transferDate"
                    id="transferDate"
                    value={formik.values.transferDate}
                    error={formik.errors.transferDate}
                    onChange={formik.setFieldValue}
                    disabled={disabled}
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
                    label="T1/C1 READY"
                    name="t1C1ReadyDate"
                    id="t1C1ReadyDate"
                    value={formik.values.t1C1ReadyDate}
                    error={formik.errors.t1C1ReadyDate}
                    onChange={formik.setFieldValue}
                    disabled={disabled}
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
                    label="LOADING DATE"
                    name="loadingDate"
                    id="loadingDate"
                    value={formik.values.loadingDate}
                    error={formik.errors.loadingDate}
                    onChange={formik.setFieldValue}
                    disabled={disabled}
                    inputRef={FieldRef}
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
                    value={formik.values.bondNumber}
                    onChange={formik.handleChange}
                    disabled={disabled}
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
                  <InputBox
                    label="Bond Amount"
                    id="bondAmount"
                    value={formik.values.bondAmount}
                    onChange={formik.handleChange}
                    disabled={disabled}
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
                    label="Cancellation Date"
                    name="cancellationDate"
                    id="cancellationDate"
                    value={formik.values.cancellationDate}
                    error={formik.errors.cancellationDate}
                    onChange={formik.setFieldValue}
                    disabled={disabled}
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
                    label="Arrival Border"
                    name="arrivalBorderDate"
                    id="arrivalBorderDate"
                    value={formik.values.arrivalBorderDate}
                    error={formik.errors.arrivalBorderDate}
                    onChange={formik.setFieldValue}
                    disabled={disabled}
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
                  <DateTimeField
                    label="Crossed Border"
                    name="crossedBorderDate"
                    id="crossedBorderDate"
                    value={formik.values.crossedBorderDate}
                    error={formik.errors.crossedBorderDate}
                    onChange={formik.setFieldValue}
                    disabled={disabled}
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
                    label="Arrival ICD"
                    name="arrivalICDDate"
                    id="arrivalICDDate"
                    value={formik.values.arrivalICDDate}
                    error={formik.errors.arrivalICDDate}
                    onChange={formik.setFieldValue}
                    disabled={disabled}
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
                    label="Cargo Release Date"
                    name="cargoReleaseDate"
                    id="cargoReleaseDate"
                    value={formik.values.cargoReleaseDate}
                    error={formik.errors.cargoReleaseDate}
                    onChange={formik.setFieldValue}
                    disabled={disabled}
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
                    label="Depart ICD"
                    name="departICDDate"
                    id="departICDDate"
                    value={formik.values.departICDDate}
                    error={formik.errors.departICDDate}
                    onChange={formik.setFieldValue}
                    disabled={disabled}
                    inputRef={FieldRef}
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
                    name="arrivalCustomerPlaceDate"
                    id="arrivalCustomerPlaceDate"
                    value={formik.values.arrivalCustomerPlaceDate}
                    error={formik.errors.arrivalCustomerPlaceDate}
                    onChange={formik.setFieldValue}
                    disabled={disabled}
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
                    label="Empty Released"
                    name="emptyReleasedDate"
                    id="emptyReleasedDate"
                    value={formik.values.emptyReleasedDate}
                    error={formik.errors.emptyReleasedDate}
                    onChange={formik.setFieldValue}
                    disabled={disabled}
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
                  <InputBox
                    label="Empty Return Place"
                    id="emptyReturnPlace"
                    name="emptyReturnPlace"
                    value={formik.values.emptyReturnPlace}
                    error={formik.errors.emptyReturnPlace}
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
                    name="podNo"
                    value={formik.values.podNo}
                    error={formik.errors.podNo}
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
                    name="podDate"
                    id="podDate"
                    value={formik.values.podDate}
                    error={formik.errors.podDate}
                    onChange={formik.setFieldValue}
                    disabled={disabled}
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
                    label="Empty Return Date"
                    name="emptyReturnDate"
                    id="emptyReturnDate"
                    value={formik.values.emptyReturnDate}
                    error={formik.errors.emptyReturnDate}
                    onChange={formik.setFieldValue}
                    disabled={disabled}
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
                    label="Certificate of Export"
                    name="certificateOfExportDate"
                    id="certificateOfExportDate"
                    value={formik.values.certificateOfExportDate}
                    error={formik.errors.certificateOfExportDate}
                    onChange={formik.setFieldValue}
                    disabled={disabled}
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
                    label="Port Gate In Date"
                    name="portGateInDate"
                    id="portGateInDate"
                    value={formik.values.portGateInDate}
                    error={formik.errors.portGateInDate}
                    onChange={formik.setFieldValue}
                    disabled={disabled}
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
                  <DateTimeField
                    label="Nomination Date"
                    name="nominationDate"
                    id="nominationDate"
                    value={formik.values.nominationDate}
                    error={formik.errors.nominationDate}
                    onChange={formik.setFieldValue}
                    disabled={disabled}
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
                  <InputBox
                    label="Remark"
                    id="remark"
                    name="remark"
                    value={formik.values.remark}
                    error={formik.errors.remark}
                    onChange={formik.handleChange}
                    disabled={disabled}
                  />
                </Grid>
              </Grid>
            </Grid>
          </TabPanel>
        </TabContext>

        {page == "update-job" && (
          <Grid
            paddingLeft={6}
            marginTop={2}
            marginBottom={2}
            container
            spacing={2}
          >
            <Stack
              direction="row"
              spacing={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" spacing={2}>
                <OutlinedButton
                  sx={{ fontWeight: "500" }}
                  onClick={() => nav(-1)}
                >
                  Cancel
                </OutlinedButton>
                <ThemeButton
                  onClick={formik.handleSubmit}
                  sx={{
                    fontWeight: "500",
                    color: "white !important",
                  }}
                >
                  {isLoading && <CircularProgress size={20} color="white" />}
                  Submit
                </ThemeButton>
              </Stack>
            </Stack>
          </Grid>
        )}
      </Box>
    </>
  );
}
