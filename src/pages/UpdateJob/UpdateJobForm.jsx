import {
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import InputBox from "../../components/common/InputBox";
import { OutlinedButton, ThemeButton } from "../../components/common/Button";
import PopupAlert from "../../components/common/Alert/PopupAlert";
import toast from "react-hot-toast";
import { JobEntryValidationSchema } from "./validationSchema";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import { useUpdateCustomerMutation } from "../../store/api/codeDataApi";
import { useNavigate } from "react-router-dom";
import { useGetOptionsSettingsQuery } from "../../store/api/settingsApi";
import CustomToast from "../../components/common/Toast/CustomToast";
import getFirstError from "../../components/common/FieldToastError";
import EditIconForHeader from "../../components/common/commonIcons/EditIcons/EditIconForHeader";

// Components
import { useAddJobEntryMutation } from "../../store/api/jobEntryApi";
import BondDetailsGridForm from "./UpdateJobEntryGrid";
import ContainerDetails from "./UpdateDetailsForm";

export default function UpdateForm({ initialValues, page, type = "notcopy" }) {
  const [addJobEntry, { isLoading }] = useAddJobEntryMutation();
  const [updateCustomer, { isLoading: loadingUpdate }] =
    useUpdateCustomerMutation();
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
    validationSchema: JobEntryValidationSchema(),
    onSubmit: async (values) => {
      console.log(values, "values");
      if (!values.id || type == "copy") {
        try {
          delete values.id;
          values.statusCode = dropdownData?.approvalRequest ? 0 : 1;
          values.status = "";
          values.tinNo = values?.tinNo?.trim() || null;
          values.vatNo = values?.vatNo?.trim() || null;
          let response = await addJobEntry({ ...values }).unwrap();

          const message = response.message;
          if (response.code == "SUCCESS") {
            toast.custom(<CustomToast message={message} toast="warn" />, {
              closeButton: false,
            });
            nav("/app/entity/customer");
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
      } else {
        try {
          setRejectError(false);
          Boolean(values.status == "Active") && (values.statusCode = 1);
          Boolean(values.status == "Inactive") && (values.statusCode = -2);
          let response = await updateCustomer({ ...values }).unwrap();
          const message = response.message;
          if (response.code == "SUCCESS") {
            toast.custom(<CustomToast message={message} toast="success" />, {
              closeButton: false,
            });
            nav(-1);
          } else {
            toast.custom(<CustomToast message={message} toast="warn" />, {
              closeButton: false,
            });
          }
        } catch (error) {
          if (error.status === 409) {
            const message = error.data.message;
            toast.custom(
              <CustomToast message={message} toast="error" />,

              {
                closeButton: false,
              }
            );
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

              {/* <Tab
                    label="Document Details"
                    value="2"
                    sx={{
                      textTransform: "capitalize",
                      minHeight: "50px",
                    }}
                    icon={<DocumentIcon />}
                    iconPosition="start"
                  />
                  <Tab
                    label="Audit Logs"
                    value="3"
                    sx={{
                      textTransform: "capitalize",
                      minHeight: "50px",
                    }}
                    icon={<AuditIcon />}
                    iconPosition="start"
                  /> */}
            </TabList>
          </Box>

          <TabPanel value="1" sx={{ padding: "0px" }}>
            <Grid container sx={{ margin: 0, padding: 0, paddingRight: 1 }}>
              <Grid paddingLeft={1} marginTop={2} container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <InputBox
                    label="Job No."
                    id="jobNo"
                    value={formik.values.jobNo}
                    error={formik.errors.jobNo}
                    onChange={formik.handleChange}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <InputBox
                    label="BL No."
                    id="blNo"
                    value={formik.values.blNo}
                    error={formik.errors.blNo}
                    onChange={formik.handleChange}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <InputBox
                    label="Customer"
                    id="blNo"
                    value={formik.values.blNo}
                    error={formik.errors.blNo}
                    onChange={formik.handleChange}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <InputBox
                    label="Shipping Line DO Collection Date"
                    id="shipmentType"
                    value={formik.values.shipmentType}
                    error={formik.errors.shipmentType}
                    onChange={formik.handleChange}
                    disabled={disabled}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <InputBox
                    label="Custom Release Date"
                    id="moveType"
                    value={formik.values.moveType}
                    error={formik.errors.moveType}
                    onChange={formik.handleChange}
                    disabled={disabled}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <InputBox
                    label="TAX Exemption Certificate"
                    id="mblNo"
                    value={formik.values.mblNo}
                    error={formik.errors.mblNo}
                    onChange={formik.handleChange}
                    disabled={disabled}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <InputBox
                    label="BT Number"
                    id="mblNo"
                    value={formik.values.mblNo}
                    error={formik.errors.mblNo}
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
                  <Tooltip
                    title={
                      !formik.values.customerName ? "Field is mandatory" : ""
                    }
                    arrow
                  >
                    <InputBox
                      label="IDF No."
                      id="customerName"
                      value={formik.values.customerName}
                      disabled={disabled}
                      error={formik.errors.customerName}
                      onChange={formik.handleChange}
                      inputRef={customerNameRef}
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
                    label="Date"
                    id="dateOfReceipt"
                    value={formik.values.dateOfReceipt}
                    error={formik.errors.dateOfReceipt}
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
                    label="Entry Loadged Ref."
                    id="hblNo"
                    value={formik.values.hblNo}
                    error={formik.errors.hblNo}
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
                    label="Entry No."
                    id="hblNo"
                    value={formik.values.hblNo}
                    error={formik.errors.hblNo}
                    onChange={formik.handleChange}
                    disabled={disabled}
                  />
                </Grid>
              </Grid>

              {formik?.values?.status?.toLowerCase() === "rejected" ||
              page == "jobEntryApprove" ? (
                <Grid item xs={12} paddingLeft={1} paddingTop={1}>
                  <TextField
                    label="Reject Remarks"
                    name="rejectRemarks"
                    value={formik.values.rejectRemarks}
                    error={rejectError}
                    helperText={
                      rejectError
                        ? "Reject remarks are required when rejecting a customer*."
                        : formik.errors.rejectRemarks
                    }
                    onChange={formik.handleChange}
                    disabled={page === "jobEntryApprove" ? disabled : !disabled}
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
              ) : (
                <></>
              )}

              <PopupAlert alertConfig={alertConfig} />
            </Grid>
          </TabPanel>
        </TabContext>

        <Grid container sx={{ margin: 0, paddingLeft: 1, paddingRight: 1 }}>
          <BondDetailsGridForm formik={formik} dropdownData={dropdownData} />
        </Grid>

        <TabContext value={detailTab}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", paddingTop: 2 }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
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

        {page == "update-job" && (
          <Grid paddingLeft={6} marginTop={2} marginBottom={2} container spacing={2}>
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
