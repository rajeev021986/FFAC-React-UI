import { CircularProgress, Grid } from "@mui/material";
import { Radio, RadioGroup, Stack, TextField, Tooltip } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import InputBox from "../../../components/common/InputBox";
import { OutlinedButton, ThemeButton } from "../../../components/common/Button";
import ApiManager from "../../../services/ApiManager";
import PopupAlert from "../../../components/common/Alert/PopupAlert";
import toast from "react-hot-toast";
import SelectBox from "../../../components/common/SelectBox";
import ThemeTabs from "../../../components/common/Tab/ThemeTab";
import AddMapping from "../../../components/screen/code/customer/AddMapping";
import { CustomerValidationSchema } from "../../../components/screen/code/customer/validationSchema";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import {
  useAddCustomerMutation,
  useUpdateCustomerMutation,
} from "../../../store/api/codeDataApi";

import { useNavigate } from "react-router-dom";
import { useGetOptionsSettingsQuery } from "../../../store/api/settingsApi";
import CustomToast from "../../../components/common/Toast/CustomToast";
import FormAutoComplete from "../../../components/common/AutoComplete/FormAutoComplete";
import getFirstError from "../../../components/common/FieldToastError";
import CustomerBankDetails from "../../../components/screen/code/customer/BankDetails";
import EditIconForHeader from "../../../components/common/commonIcons/EditIcons/EditIconForHeader";
import DocumentIcon from "../../../components/common/commonIcons/DocumentIcons/DocumentIcon";
import AuditIcon from "../../../components/common/commonIcons/AuditIcon/AuditIcon";

export default function AddEditForm({ initialValues, page, type = "notcopy" }) {
  const [addCustomer, { isLoading }] = useAddCustomerMutation();
  const [loaderApprove, setLoaderApprove] = useState({
    approve: false,
    reject: false,
  });
  const [updateCustomer] = useUpdateCustomerMutation();
  const [dropdownData, setDropdownData] = useState({});
  const [rejectError, setRejectError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const nav = useNavigate();
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
    validationSchema: CustomerValidationSchema(),
    onSubmit: async (values) => {
      if (!values.id || type == "copy") {
        let emails = values.customerEntityEmailsIds.map((item) =>
          item?.new ? { ...item, id: null, new: false } : item
        );
        let tariffs = values.customerEntityTariffs.map((item) =>
          item?.new ? { ...item, id: null, new: false } : item
        );
        let bank = values.bankDetails.map((item) =>
          item?.new ? { ...item, id: null, new: false } : item
        );
        try {
          delete values.id;
          values.statusCode = dropdownData?.approvalRequest ? 0 : 1;
          values.status = "";

          if (values.paymentType === "cash") {
            delete values.creditAmount;
            delete values.creditDays;
          }
          values.tinNo = values?.tinNo?.trim() || null;
          values.vatNo = values?.vatNo?.trim() || null;
          let response = await addCustomer({
            ...values,
            customerEntityEmailsIds: emails,
            customerEntityTariffs: tariffs,
            bankDetails: bank,
          }).unwrap();

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
          if (values.paymentType === "cash") {
            delete values.creditAmount;
            delete values.creditDays;
          }
          values.tinNo = values.tinNo.trim() || null;
          values.vatNo = values.vatNo.trim() || null;

          let emails = values.customerEntityEmailsIds.map((item) =>
            item?.new ? { ...item, id: null, new: false } : item
          );
          let tariffs = values.customerEntityTariffs.map((item) =>
            item?.new ? { ...item, id: null, new: false } : item
          );
          let bank = values.bankDetails.map((item) =>
            item?.new ? { ...item, id: null, new: false } : item
          );
          Boolean(values.status == "Active") && (values.statusCode = 1);
          Boolean(values.status == "Inactive") && (values.statusCode = -2);
          let response = await updateCustomer({
            ...values,
            customerEntityEmailsIds: emails,
            customerEntityTariffs: tariffs,
            bankDetails: bank,
          }).unwrap();

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

  const handleApproveRequest = async () => {
    setRejectError(false);
    try {
      setLoaderApprove((prevState) => ({
        ...prevState,
        approve: true,
      }));
      const response = await ApiManager.approveCustomerApprove(
        initialValues.id,
        "customer"
      );
      const message = response.message;
      nav("/app/entity/approve");
      toast.custom(<CustomToast message={message} toast="success" />, {
        closeButton: false,
      });
    } catch (error) {
      toast.custom(
        <CustomToast
          message="Error occurred while approve customer"
          toast="error"
        />,
        {
          closeButton: false,
        }
      );
    }
    setLoaderApprove((prevState) => ({
      ...prevState,
      approve: false,
    }));
  };

  const handleRejectRequest = async () => {
    if (!formik.values.rejectRemarks) {
      setRejectError(true);
      toast.custom(
        <CustomToast message="Reject remarks to be filled!" toast="warn" />,
        {
          closeButton: false,
        }
      );
      return;
    }
    try {
      setLoaderApprove((prevState) => ({
        ...prevState,
        reject: true,
      }));
      const response = await ApiManager.rejectCustomerApprove(
        initialValues.id,
        "customer",
        formik.values.rejectRemarks
      );
      const message = response.message;
      nav("/app/entity/approve");

      toast.custom(<CustomToast message={message} toast="success" />, {
        closeButton: false,
      });
    } catch (error) {
      toast.custom(
        <CustomToast
          message="Error occurred while reject customer"
          toast="error"
        />,
        {
          closeButton: false,
        }
      );
    }
    setLoaderApprove((prevState) => ({
      ...prevState,
      reject: false,
    }));
  };

  const disabled =
    page == "customer" || page == "customerApprove" ? false : true;

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
    <Box sx={{ width: "100%", padding: 0, margin: 0 }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          {type === "add" ? (
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab
                label="Payable Details"
                value="1"
                icon={<EditIconForHeader />}
                iconPosition="start"
                sx={{ textTransform: "capitalize", minHeight: "50px" }}
              />
            </TabList>
          ) : (
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab
                label="Job Entry Details"
                value="1"
                icon={<EditIconForHeader />}
                iconPosition="start"
                sx={{ textTransform: "capitalize", minHeight: "50px" }}
              />
              <Tab
                label="Document Details"
                value="2"
                icon={<DocumentIcon />}
                iconPosition="start"
                sx={{ textTransform: "capitalize", minHeight: "50px" }}
                disabled={isDisabled}
              />
              <Tab
                label="Audit Logs"
                value="3"
                icon={<AuditIcon />}
                iconPosition="start"
                sx={{ textTransform: "capitalize", minHeight: "50px" }}
                disabled={isDisabled}
              />
            </TabList>
          )}
        </Box>

        <TabPanel value="1" sx={{ padding: 0 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              padding: 0,
              margin: 0,
            }}
          >
            <Box sx={{ width: "20%", paddingRight: 2 }}>
              <Grid container sx={{ padding: 0, margin: 0 }}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  paddingLeft={1}
                  marginTop={2}
                >
                  <InputBox
                    label="Invoice Type*"
                    id="customerName"
                    value={formik.values.customerName}
                    error={formik.errors.customerName}
                    onChange={formik.handleChange}
                    inputRef={customerNameRef}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  paddingLeft={1}
                  marginTop={2}
                >
                  <InputBox
                    label="Payable Ref. No.*"
                    id="customerName"
                    value={formik.values.customerName}
                    error={formik.errors.customerName}
                    onChange={formik.handleChange}
                    inputRef={customerNameRef}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  paddingLeft={1}
                  marginTop={2}
                >
                  <InputBox
                    label="Job No."
                    id="customerName"
                    value={formik.values.customerName}
                    error={formik.errors.customerName}
                    onChange={formik.handleChange}
                    inputRef={customerNameRef}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  paddingLeft={1}
                  marginTop={2}
                >
                  <InputBox
                    label="Invoice Date."
                    id="customerName"
                    value={formik.values.customerName}
                    error={formik.errors.customerName}
                    onChange={formik.handleChange}
                    inputRef={customerNameRef}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  paddingLeft={1}
                  marginTop={2}
                >
                  <InputBox
                    label="Vendor Name"
                    id="customerName"
                    value={formik.values.customerName}
                    error={formik.errors.customerName}
                    onChange={formik.handleChange}
                    inputRef={customerNameRef}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  paddingLeft={1}
                  marginTop={2}
                >
                  <InputBox
                    label="Vendor Invoice No."
                    id="customerName"
                    value={formik.values.customerName}
                    error={formik.errors.customerName}
                    onChange={formik.handleChange}
                    inputRef={customerNameRef}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  paddingLeft={1}
                  marginTop={2}
                >
                  <InputBox
                    label="Vendor Invoice Date"
                    id="customerName"
                    value={formik.values.customerName}
                    error={formik.errors.customerName}
                    onChange={formik.handleChange}
                    inputRef={customerNameRef}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  paddingLeft={1}
                  marginTop={2}
                >
                  <InputBox
                    label="Currency"
                    id="customerName"
                    value={formik.values.customerName}
                    error={formik.errors.customerName}
                    onChange={formik.handleChange}
                    inputRef={customerNameRef}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  paddingLeft={1}
                  marginTop={2}
                >
                  <InputBox
                    label="Ex. Rate"
                    id="customerName"
                    value={formik.values.customerName}
                    error={formik.errors.customerName}
                    onChange={formik.handleChange}
                    inputRef={customerNameRef}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  paddingLeft={1}
                  marginTop={2}
                >
                  <InputBox
                    label="Amount"
                    id="customerName"
                    value={formik.values.customerName}
                    error={formik.errors.customerName}
                    onChange={formik.handleChange}
                    inputRef={customerNameRef}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  paddingLeft={1}
                  marginTop={2}
                >
                  <InputBox
                    label="VAT"
                    id="customerName"
                    value={formik.values.customerName}
                    error={formik.errors.customerName}
                    onChange={formik.handleChange}
                    inputRef={customerNameRef}
                  />
                </Grid>
              </Grid>

              {page === "payable" && (
                <>
                  <Grid item xs={12} sx={{ marginLeft: 1, marginTop: 4 }}>
                    <Stack direction="row" spacing={2}>
                      <OutlinedButton
                        sx={{ fontWeight: "500" }}
                        onClick={() => nav("/app/entity/customer")}
                      >
                        Close
                      </OutlinedButton>
                      <ThemeButton
                        onClick={formik.handleSubmit}
                        sx={{
                          fontWeight: "500",
                          borderRadius: "12px",
                          color: "white !important",
                        }}
                      >
                        {isLoading && (
                          <CircularProgress size={20} color="white" />
                        )}{" "}
                        Add
                      </ThemeButton>
                    </Stack>
                  </Grid>
                  {/* 
                  <Grid item xs={12}>
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="space-between"
                    >
                      <Stack direction="row" spacing={2}>
                        <ThemeButton
                          sx={{
                            fontWeight: "500",
                            backgroundColor: "red",
                            color: "white !important",
                          }}
                          onClick={handleRejectRequest}
                        >
                          {loaderApprove.reject && (
                            <CircularProgress size={20} color="white" />
                          )}{" "}
                          Reject
                        </ThemeButton>
                        <ThemeButton
                          sx={{
                            fontWeight: "500",
                            color: "white !important",
                          }}
                          onClick={handleApproveRequest}
                        >
                          {loaderApprove.approve && (
                            <CircularProgress size={20} color="white" />
                          )}{" "}
                          Approve
                        </ThemeButton>
                      </Stack>
                    </Stack>
                  </Grid> */}
                </>
              )}
              <PopupAlert alertConfig={alertConfig} />
            </Box>

            <Box sx={{ width: "80%" }}>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  margin: "8px",
                }}
              >
                <CustomerBankDetails
                  formik={formik}
                  dropdownData={dropdownData}
                />
              </Box>
            </Box>
          </Box>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
