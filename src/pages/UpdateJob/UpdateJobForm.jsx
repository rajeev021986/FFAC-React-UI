import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import toast from "react-hot-toast";

import { AppBar, CircularProgress, Toolbar, Typography } from "@mui/material";
import { MenuItem, Select, Stack, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import { useGetOptionsSettingsQuery } from "../../store/api/settingsApi";
import CustomToast from "../../components/common/Toast/CustomToast";
import getFirstError from "../../components/common/FieldToastError";
import EditIconForHeader from "../../components/common/commonIcons/EditIcons/EditIconForHeader";

import { useUpdateJobDetailsEntryMutation } from "../../store/api/jobEntryApi";

// Components
import { OutlinedButton, ThemeButton } from "../../components/common/Button";
import InputBox from "../../components/common/InputBox";
import PopupAlert from "../../components/common/Alert/PopupAlert";
import BondDetailsGridForm from "./UpdateJobEntryGrid";
import ContainerDetails from "./UpdateDetailsForm";
import DateTimeField from "../../components/common/DateTime/DateTimeField";

export default function UpdateForm({ initialValues, page, type = "notcopy" }) {
  const [updateJobDetailsEntry, { isLoading }] =
    useUpdateJobDetailsEntryMutation();
  const [dropdownData, setDropdownData] = useState({});
  const [rejectError, setRejectError] = useState(false);
  const nav = useNavigate();
  const [detailTab, setdetailTab] = useState("1");
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
      let bondData = values.bondDetails.map((item) =>
        item?.new ? { ...item, id: null, new: false } : item
      );
      try {
        values.statusCode = dropdownData?.approvalRequest ? 0 : 1;
        values.status = "";
        let response = await updateJobDetailsEntry({
          ...values,
          bondDetails: bondData,
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
              onChange={handleChange}
              aria-label="lab API tabs example"
              sx={{ paddingBottom: "20px" }}
            >
              <Tab
                label="Update Job Details"
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
              <AppBar position="static">
                <Toolbar
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Typography variant="body1">
                      <strong>JOB NO: </strong> {formik.values.jobNo}
                    </Typography>
                    <Typography variant="body1">
                      <strong>MBL NO: </strong> {formik.values.mblNo}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Customer: </strong> {formik.values.customer}
                    </Typography>
                  </Box>

                  {/* <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body1">
                        <strong>SCT</strong>
                      </Typography>
                      <Select
                        name="sct"
                        id="sct"
                        value={formik.values.sct}
                        onChange={formik.handleChange}
                        error={Boolean(formik.errors.sct)}
                        disabled={disabled || false}
                        size="small"
                        sx={{ backgroundColor: "#fff", minWidth: 80 }}
                      >
                        <MenuItem value="" disabled>
                          Select Type
                        </MenuItem>{" "}
                        <MenuItem value="NO">NO</MenuItem>
                        <MenuItem value="YES">YES</MenuItem>
                      </Select>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body1">
                        <strong>URGENT</strong>
                      </Typography>
                      <Select
                        name="urgent"
                        value={formik.values.urgent}
                        onChange={formik.handleChange}
                        error={Boolean(formik.errors.urgent)}
                        disabled={disabled || false}
                        defaultValue="NO"
                        size="small"
                        sx={{ backgroundColor: "#fff", minWidth: 80 }}
                      >
                        <MenuItem value="NO">NO</MenuItem>
                        <MenuItem value="YES">YES</MenuItem>
                      </Select>
                    </Box>
                  </Box> */}
                </Toolbar>
              </AppBar>

              <Grid paddingLeft={1} marginTop={2} container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <DateTimeField
                    label="Shipping Line DO Collection Date"
                    name="shippingLineDOCollectionDate"
                    id="shippingLineDOCollectionDate"
                    value={formik.values.shippingLineDOCollectionDate}
                    error={formik.errors.shippingLineDOCollectionDate}
                    onChange={formik.setFieldValue}
                    inputRef={FieldRef}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <DateTimeField
                    label="Custom Release Date"
                    name="customReleaseDate"
                    id="customReleaseDate"
                    value={formik.values.customReleaseDate}
                    error={formik.errors.customReleaseDate}
                    onChange={formik.setFieldValue}
                    inputRef={FieldRef}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <DateTimeField
                    label="TAX Exemption Certificate"
                    name="taxExemptionCertificateDate"
                    id="taxExemptionCertificateDate"
                    value={formik.values.taxExemptionCertificateDate}
                    error={formik.errors.taxExemptionCertificateDate}
                    onChange={formik.setFieldValue}
                    inputRef={FieldRef}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <InputBox
                    label="BT Number"
                    id="btNumber"
                    value={formik.values.btNumber}
                    error={formik.errors.btNumber}
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
                    label="IDF No."
                    id="idfNo"
                    value={formik.values.idfNo}
                    disabled={disabled}
                    error={formik.errors.idfNo}
                    onChange={formik.handleChange}
                    inputRef={customerNameRef}
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
                    label="IDF Date"
                    name="idfDate"
                    id="idfDate"
                    value={formik.values.idfDate}
                    error={formik.errors.idfDate}
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
                  <InputBox
                    label="Entry Loadged Ref."
                    id="entryLoadgedRef"
                    value={formik.values.entryLoadgedRef}
                    error={formik.errors.entryLoadgedRef}
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
                    label="Entry Loadged Ref. Date"
                    name="entryLoadgedDate"
                    id="entryLoadgedDate"
                    value={formik.values.entryLoadgedDate}
                    error={formik.errors.entryLoadgedDate}
                    onChange={formik.setFieldValue}
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
                    label="Entry No."
                    id="entryNo"
                    value={formik.values.entryNo}
                    error={formik.errors.entryNo}
                    onChange={formik.handleChange}
                    disabled={disabled}
                    inputRef={customerNameRef}
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
                    label="Entry Date"
                    name="entryDate"
                    id="entryDate"
                    value={formik.values.entryDate}
                    error={formik.errors.entryDate}
                    onChange={formik.setFieldValue}
                    inputRef={FieldRef}
                  />
                </Grid>
              </Grid>

              <PopupAlert alertConfig={alertConfig} />
            </Grid>
          </TabPanel>
        </TabContext>

        <Grid container sx={{ margin: 0, paddingLeft: 1, paddingRight: 1 }}>
          <BondDetailsGridForm formik={formik} dropdownData={dropdownData} />
        </Grid>

        {formik.values.containerDetails?.length > 0 && (
          <TabContext value={detailTab}>
            <Box
              sx={{ borderBottom: 1, borderColor: "divider", paddingTop: 2 }}
            >
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab
                  label="Container Details / Update Details"
                  value="1"
                  sx={{
                    width: "100%",
                    typography: "body1",
                    borderBottom: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: "10px",
                  }}
                  iconPosition="start"
                />
              </TabList>
            </Box>
            <TabPanel value="1" sx={{ paddingBottom: "15px" }}>
              <ContainerDetails formik={formik} />
            </TabPanel>
          </TabContext>
        )}

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
