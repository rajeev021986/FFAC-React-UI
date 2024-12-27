import {
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import WarningIcon from '@mui/icons-material/Warning'; 
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import InputBox from "../../../common/InputBox";
import { OutlinedButton, ThemeButton } from "../../../common/Button";
import AppAutocomplete from "../../../common/AppAutocomplete";
import ApiManager from "../../../../services/ApiManager";
import PopupAlert from "../../../common/Alert/PopupAlert";
import toast from "react-hot-toast";
import SelectBox from "../../../common/SelectBox";
import {
  USER_STATUS_OPTIONS,
  PAYMENTTYPE_OPTIONS,
  ACCOUNT_TYPE_OPTIONS,
} from "../../../../data/options";
import ThemeTabs from "../../../common/Tab/ThemeTab";
import AddMapping from "./AddMapping";
import FileScreen from "./filesGrid";
import { CustomerValidationSchema } from "./validationSchema";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  useAddCustomerMutation,
  useGetCustomerAuditQuery,
  useUpdateCustomerMutation,
} from "../../../../store/api/codeDataApi";
import { useLocation, useNavigate } from "react-router-dom";
import AuditTimeline from "../../../AuditTimeLine";
import UploadFile from "../../../UploadFile";
import { UploadFileOutlined } from "@mui/icons-material";
import { useGetOptionsSettingsQuery } from "../../../../store/api/settingsApi";
import { ToastMessage } from "../../../utils/toastMessage";

export default function CustomerForm({
  initialValues,
  page,
  type = "notcopy",
  // optionsSettingsData,
  // customerSettingsData,
}) {
  const [options, setOptions] = useState([]);
  const [enquiryAuditDetails, setEnquiryAuditDetails] = useState([]);
  const [optionsCity, setCityOptions] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState(initialValues.files || []);
  const [addCustomer, { isLoading }] = useAddCustomerMutation();
  const [loading, setLoading] = useState(false);
  const [enquiryFileDetails, setEnquiryFileDetails] = useState([]);
  const [updateCustomer] = useUpdateCustomerMutation();
  const [dropdownData, setDropdownData] = useState({});
  const location = useLocation();

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
    validationSchema: CustomerValidationSchema(),
    onSubmit: async (values) => {
      if (!values.id || type == "copy") {
        let emails = values.customerEntityEmailsIds.map((item) =>
          item?.new ? { ...item, id: null, new: false } : item
        );
        let tariffs = values.customerEntityTariffs.map((item) =>
          item?.new ? { ...item, id: null, new: false } : item
        );
        try {
          delete values.id;
          values.isApproved = !dropdownData?.approvalRequest;
          values.status = "";
          if (values.paymentType === "cash") {
            delete values.creditAmount;
            delete values.creditDays;
          }
          let response = await addCustomer({
            ...values,
            customerEntityEmailsIds: emails,
            customerEntityTariffs: tariffs,
          }).unwrap();

          // Handle response and display toast messages
          if (response.code == "SUCCESS") {
            toast.success(response.message);
            ToastMessage("Pending Document");
            nav("/app/entity/customer");
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          if (error.status === 409) {
            toast.error(error.data.message);
          } else {
            toast.error("An error occurred while submitting the form.");
          }
        }
      } else {
        try {
          if (values.paymentType === "cash") {
            delete values.creditAmount;
            delete values.creditDays;
          }

          let emails = values.customerEntityEmailsIds.map((item) =>
            item?.new ? { ...item, id: null, new: false } : item
          );
          let tariffs = values.customerEntityTariffs.map((item) =>
            item?.new ? { ...item, id: null, new: false } : item
          );
          let response = await updateCustomer({
            ...values,
            customerEntityEmailsIds: emails,
            customerEntityTariffs: tariffs,
          }).unwrap();

          // Handle response and display toast messages
          if (response.code == "SUCCESS") {
            toast.success(response.message);
            nav("/app/entity/customer");
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          toast.error("An error occurred while submitting the form.");
        }
      }
    },
  });

  const handleSalesOptionChange = async (query) => {
    console.log(query);
    ApiManager.getSalesOptions("salesname", query)
      .then((response) => {
        setOptions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCityOptionChange = async (query) => {
    console.log(query);
    ApiManager.getCityOptions("city", query)
      .then((response) => {
        setCityOptions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let shouldShowTabs = Object.values(formik.values?.customerName).some(
    (value) => value !== ""
  );
  const reloadDataHandler = async () => {
    try {
      setLoading(true);
      const res = await ApiManager.getAuditDetails(initialValues.id);
      setEnquiryAuditDetails(res);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  // const getFile = async () => {
  //   const payload ={}
  //   const response = ApiManager.getFileCustomerDocument(payload)
  //     .then(() => console.log("don"))
  //     .catch(() => console.log("error"));
  //   if ((response.code === "SUCCESS")) {
  //     setEnquiryAuditDetails(response);
  //   }
  // };
  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("common_settings");
  const { data: customerSettingsData } =
    useGetOptionsSettingsQuery("customer_settings");
  const customToast = () => (
    <div style={{ color: 'black', fontSize: '16px', display: 'flex', alignItems: 'center' }}>
      <WarningIcon style={{ marginRight: '8px', color: 'yellow', fontSize: '20px' }} />
      Document is pending
    </div>
  );
  useEffect(() => {
    if (optionsSettingsData?.body || customerSettingsData?.body) {
      setDropdownData({
        ...optionsSettingsData?.body,
        ...customerSettingsData?.body,
      });
    }
  }, [optionsSettingsData]);
  const handleApproveRequest = async () => {
    if (formik.values.status == "Pending_Documents") {
      toast.custom(customToast, {
        style: {
          backgroundColor: '#FFEB3B',
          color: 'black',
        },
        closeButton: false,
      });
      return;
    }
    try {
      const response = await ApiManager.approveCustomerApprove(
        initialValues.id,
        "customer"
      );
      nav("/app/entity/approve");
      toast.success("Approved");
    } catch (error) {
      toast.error("Error");
    }
  };
  const handleRejectRequest = async () => {
    if (!formik.values.rejectRemarks) {
      toast.error("Please enter reject remarks");
      return
    }
    try {
      const response = await ApiManager.rejectCustomerApprove(
        initialValues.id,
        "customer",
        formik.values.rejectRemarks
      );
      nav("/app/entity/approve");
      toast.success("Rejected");
    } catch (error) {
      toast.error("Error");
    }
  };
  const disabled = page == "customer" ? false : true;
  const getFirstError = (errors) => {
    for (const key in errors) {
      if (Array.isArray(errors[key])) {
        for (const item of errors[key]) {
          const nestedError = getFirstError(item);
          if (nestedError) return nestedError;
        }
      } else if (typeof errors[key] === "object") {
        const nestedError = getFirstError(errors[key]);
        if (nestedError) return nestedError;
      } else {
        return errors[key];
      }
    }
    return null;
  };

  const currentError = getFirstError(formik.errors);

  return (
    <>
      {currentError && <div style={{ color: "red" }}>{currentError}</div>}
      {!shouldShowTabs || type == "copy" ? (
        <>
          {" "}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Customer Name"
                id="customerName"
                value={formik.values.customerName}
                disabled={disabled}
                error={formik.errors.customerName}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="TIN No."
                id="tinNo"
                value={formik.values.tinNo}
                error={formik.errors.tinNo}
                onChange={formik.handleChange}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="VAT No."
                id="vatNo"
                value={formik.values.vatNo}
                error={formik.errors.vatNo}
                onChange={formik.handleChange}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Status"
                id="status"
                // options={dropdownData?.status}
                disabled={true}
                error={formik.errors.status}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Address 1."
                id="add1"
                value={formik.values.add1}
                error={formik.errors.add1}
                onChange={formik.handleChange}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Address 2."
                id="add2"
                value={formik.values.add2}
                error={formik.errors.add2}
                onChange={formik.handleChange}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Address 3."
                id="add3"
                value={formik.values.add3}
                error={formik.errors.add3}
                onChange={formik.handleChange}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="PoNo"
                id="poNo"
                value={formik.values.poNo}
                error={formik.errors.poNo}
                onChange={formik.handleChange}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="City"
                id="city"
                value={formik.values.city}
                error={formik.errors.city}
                onChange={formik.handleChange}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Country"
                id="country"
                value={formik.values.country}
                error={formik.errors.country}
                onChange={formik.handleChange}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Province"
                id="province"
                value={formik.values.province}
                error={formik.errors.province}
                onChange={formik.handleChange}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Contact Person"
                id="contactPerson"
                value={formik.values.contactPerson}
                error={formik.errors.contactPerson}
                onChange={formik.handleChange}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Email Id "
                id="emailId"
                value={formik.values.emailId}
                error={formik.errors.emailId}
                onChange={formik.handleChange}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Telephone"
                id="telephone"
                value={formik.values.telephone}
                error={formik.errors.telephone}
                onChange={formik.handleChange}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Fax"
                id="fax"
                value={formik.values.fax}
                error={formik.errors.fax}
                onChange={formik.handleChange}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Bank Name"
                id="bankName"
                value={formik.values.bankName}
                error={formik.errors.bankName}
                onChange={formik.handleChange}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Account No."
                id="accountNo"
                value={formik.values.accountNo}
                error={formik.errors.accountNo}
                onChange={formik.handleChange}
                disabled={disabled}
              />
            </Grid>
            {/* customer type */}
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Customer Type"
                id="customerType"
                value={formik.values.customerType}
                error={formik.errors.customerType}
                onChange={formik.handleChange}
                disabled={disabled}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <RadioGroup
                id="paymentType"
                name="paymentType" // add name attribute here
                value={formik.values.paymentType}
                onChange={formik.handleChange}
                disabled={disabled}
                row
              >
                <FormControlLabel
                  disabled={disabled}
                  value="cash"
                  control={<Radio />}
                  label="Cash"
                />
                <FormControlLabel
                  disabled={disabled}
                  value="credit"
                  control={<Radio />}
                  label="Credit"
                />
              </RadioGroup>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Credit Days"
                id="creditDays"
                value={formik.values.creditDays}
                error={formik.errors.creditDays}
                onChange={formik.handleChange}
                disabled={formik.values.paymentType === "cash" || disabled}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Credit Amount"
                id="creditAmount"
                value={formik.values.creditAmount}
                error={formik.errors.creditAmount}
                onChange={formik.handleChange}
                disabled={formik.values.paymentType === "cash" || disabled}
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  marginBottom: 2,
                }}
              >
                <ThemeTabs
                  tabData={[
                    { label: "Tariff", value: "1", disable: false },
                    { label: "Email", value: "2", disable: false },
                  ]}
                >
                  <AddMapping
                    formik={formik}
                    disabled={disabled}
                    dropdownData={dropdownData}
                  />
                  <FileScreen formik={formik} disabled={disabled} />
                </ThemeTabs>
              </Box>
            </Grid>

            {page == "customer" && (
              <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                  <OutlinedButton
                    sx={{ fontWeight: "500", borderRadius: "12px" }}
                  >
                    Cancel
                  </OutlinedButton>
                  <ThemeButton
                    onClick={formik.handleSubmit}
                    sx={{ fontWeight: "500", borderRadius: "12px" }}
                  >
                    {isLoading && <CircularProgress size={20} color="white" />}{" "}
                    Save
                  </ThemeButton>
                </Stack>
              </Grid>
            )}
            {page == "customerApprove" && (
              <Grid item xs={12}>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={2}>
                    <ThemeButton
                      sx={{ fontWeight: "500", backgroundColor: "red" }}
                      onClick={() => handleRejectRequest()}
                    >
                      {isLoading && (
                        <CircularProgress size={20} color="white" />
                      )}{" "}
                      Approve reject
                    </ThemeButton>
                    <ThemeButton
                      sx={{ fontWeight: "500" }}
                      onClick={() => handleApproveRequest()}
                    >
                      {isLoading && (
                        <CircularProgress size={20} color="white" />
                      )}{" "}
                      Approve request
                    </ThemeButton>
                  </Stack>
                </Stack>
              </Grid>
            )}

            <PopupAlert alertConfig={alertConfig} />
          </Grid>
        </>
      ) : (
        <>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Edit Customer" value="1" />
                  <Tab label="Upload Documents" value="2" />
                  <Tab label="Audit Logs" value="3" />
                </TabList>
              </Box>
              <TabPanel value="1">
                {" "}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Customer Name"
                      id="customerName"
                      value={formik.values.customerName}
                      disabled={disabled}
                      error={formik.errors.customerName}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="TIN No."
                      id="tinNo"
                      value={formik.values.tinNo}
                      error={formik.errors.tinNo}
                      onChange={formik.handleChange}
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="VAT No."
                      id="vatNo"
                      value={formik.values.vatNo}
                      error={formik.errors.vatNo}
                      onChange={formik.handleChange}
                      disabled={disabled}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Status"
                      id="status"
                      // options={dropdownData?.status}
                      disabled={!initialValues.isApproved || disabled}
                      value={formik.values.status}
                      error={formik.errors.status}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Address 1."
                      id="add1"
                      value={formik.values.add1}
                      error={formik.errors.add1}
                      onChange={formik.handleChange}
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Address 2."
                      id="add2"
                      value={formik.values.add2}
                      error={formik.errors.add2}
                      onChange={formik.handleChange}
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Address 3."
                      id="add3"
                      value={formik.values.add3}
                      error={formik.errors.add3}
                      onChange={formik.handleChange}
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="PoNo"
                      id="poNo"
                      value={formik.values.poNo}
                      error={formik.errors.poNo}
                      onChange={formik.handleChange}
                      disabled={disabled}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="City"
                      id="city"
                      value={formik.values.city}
                      error={formik.errors.city}
                      onChange={formik.handleChange}
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Country"
                      id="country"
                      value={formik.values.country}
                      error={formik.errors.country}
                      onChange={formik.handleChange}
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Province"
                      id="province"
                      value={formik.values.province}
                      error={formik.errors.province}
                      onChange={formik.handleChange}
                      disabled={disabled}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Contact Person"
                      id="contactPerson"
                      value={formik.values.contactPerson}
                      error={formik.errors.contactPerson}
                      onChange={formik.handleChange}
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Email Id "
                      id="emailId"
                      value={formik.values.emailId}
                      error={formik.errors.emailId}
                      onChange={formik.handleChange}
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Telephone"
                      id="telephone"
                      value={formik.values.telephone}
                      error={formik.errors.telephone}
                      onChange={formik.handleChange}
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Fax"
                      id="fax"
                      value={formik.values.fax}
                      error={formik.errors.fax}
                      onChange={formik.handleChange}
                      disabled={disabled}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Bank Name"
                      id="bankName"
                      value={formik.values.bankName}
                      error={formik.errors.bankName}
                      onChange={formik.handleChange}
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Account No."
                      id="accountNo"
                      value={formik.values.accountNo}
                      error={formik.errors.accountNo}
                      onChange={formik.handleChange}
                      disabled={disabled}
                    />
                  </Grid>
                  {/* customer type */}
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Customer Type"
                      id="customerType"
                      value={formik.values.customerType}
                      error={formik.errors.customerType}
                      onChange={formik.handleChange}
                      disabled={disabled}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <RadioGroup
                      id="paymentType"
                      name="paymentType" // add name attribute here
                      value={formik.values.paymentType}
                      onChange={formik.handleChange}
                      disabled={disabled}
                      row
                    >
                      <FormControlLabel
                        disabled={disabled}
                        value="cash"
                        control={<Radio />}
                        label="Cash"
                      />
                      <FormControlLabel
                        disabled={disabled}
                        value="credit"
                        control={<Radio />}
                        label="Credit"
                      />
                    </RadioGroup>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Credit Days"
                      id="creditDays"
                      value={formik.values.creditDays}
                      error={formik.errors.creditDays}
                      onChange={formik.handleChange}
                      disabled={
                        formik.values.paymentType === "cash" || disabled
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Credit Amount"
                      id="creditAmount"
                      value={formik.values.creditAmount}
                      error={formik.errors.creditAmount}
                      onChange={formik.handleChange}
                      disabled={
                        formik.values.paymentType === "cash" || disabled
                      }
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        marginBottom: 2,
                      }}
                    >
                      <ThemeTabs
                        tabData={[
                          { label: "Tariff", value: "1", disable: false },
                          { label: "Email", value: "2", disable: false },
                        ]}
                      >
                        <AddMapping
                          formik={formik}
                          disabled={disabled}
                          dropdownData={dropdownData}
                        />
                        <FileScreen formik={formik} disabled={disabled} />
                      </ThemeTabs>
                    </Box>
                  </Grid>
                  {formik.values.status.toLowerCase() === "rejected" ||
                  page == "customerApprove" ? (
                    <Grid item xs={12}>
                      <TextField
                        label="Reject Remarks"
                        name="rejectRemarks"
                        value={formik.values.rejectRemarks}
                        error={formik.errors.rejectRemarks}
                        onChange={formik.handleChange}
                        disabled={!disabled}
                        multiline
                        rows={4}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                  ) : (
                    <></>
                  )}

                  {page == "customer" && (
                    <Grid item xs={12}>
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="space-between"
                      >
                        <Stack direction="row" spacing={2}>
                          <OutlinedButton sx={{ fontWeight: "500" }}>
                            Cancel
                          </OutlinedButton>
                          <ThemeButton
                            onClick={formik.handleSubmit}
                            sx={{ fontWeight: "500" }}
                          >
                            {isLoading && (
                              <CircularProgress size={20} color="white" />
                            )}{" "}
                            Save
                          </ThemeButton>
                        </Stack>
                      </Stack>
                    </Grid>
                  )}
                  {page == "customerApprove" && (
                    <Grid item xs={12}>
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="space-between"
                      >
                        <Stack direction="row" spacing={2}>
                          <OutlinedButton
                            sx={{ fontWeight: "500" }}
                            onClick={() => nav(-1)}
                          >
                            Cancel
                          </OutlinedButton>
                          <ThemeButton
                            sx={{ fontWeight: "500", backgroundColor: "red" }}
                            onClick={() => handleRejectRequest()}
                          >
                            {isLoading && (
                              <CircularProgress size={20} color="white" />
                            )}{" "}
                            Approve reject
                          </ThemeButton>
                          <ThemeButton
                            sx={{ fontWeight: "500" }}
                            onClick={() => handleApproveRequest()}
                          >
                            {isLoading && (
                              <CircularProgress size={20} color="white" />
                            )}{" "}
                            Approve request
                          </ThemeButton>
                        </Stack>
                      </Stack>
                    </Grid>
                  )}

                  <PopupAlert alertConfig={alertConfig} />
                </Grid>
              </TabPanel>
              <TabPanel value="2">
                <UploadFile
                  customer_id={initialValues.id}
                  disabled={disabled}
                  dropdownData={dropdownData.documentType}
                  sourceType="CUSTOMER"
                />
              </TabPanel>
              <TabPanel value="3">
                <AuditTimeline
                  auditDetails={enquiryAuditDetails}
                  reloadDataHandler={reloadDataHandler}
                  loading={loading}
                />
              </TabPanel>
            </TabContext>
          </Box>
        </>
      )}
    </>
  );
}
