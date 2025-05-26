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
  Tooltip,
} from "@mui/material";
import { useFormik } from "formik";
import WarningIcon from "@mui/icons-material/Warning";
import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import InputBox from "../../../common/InputBox";
import { OutlinedButton, ThemeButton } from "../../../common/Button";
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
import CustomToast from "../../../common/Toast/CustomToast";
import FormAutoComplete from "../../../common/AutoComplete/FormAutoComplete";
import getFirstError from "../../../common/FieldToastError";
import CustomerBankDetails from "./BankDetails";

import { menuConfigUrl } from "../../../../store/menuConfigUrl";
import EditIconForHeader from "../../../common/commonIcons/EditIcons/EditIconForHeader";
import DocumentIcon from "../../../common/commonIcons/DocumentIcons/DocumentIcon";
import AuditIcon from "../../../common/commonIcons/AuditIcon/AuditIcon";

export default function CustomerForm({
  initialValues,
  page,
  type = "notcopy",
}) {
  const [options, setOptions] = useState([]);
  const [optionsCity, setCityOptions] = useState([]);
  const [addCustomer, { isLoading }] = useAddCustomerMutation();
  const [loaderApprove, setLoaderApprove] = useState({
    approve: false,
    reject: false,
  });
  const [updateCustomer, { isLoading: loadingUpdate }] =
    useUpdateCustomerMutation();
  const [dropdownData, setDropdownData] = useState({});
  const [rejectError, setRejectError] = useState(false);
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
          console.log(values, "mnnnnishh");
          let response = await addCustomer({
            ...values,
            customerEntityEmailsIds: emails,
            customerEntityTariffs: tariffs,
            bankDetails: bank,
          }).unwrap();

          // Handle response and display toast messages
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

          // Handle response and display toast messages
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

  const handleSalesOptionChange = async (query) => {
    ApiManager.getSalesOptions("salesname", query)
      .then((response) => {
        setOptions(response.data);
      })
      .catch((error) => {});
  };

  const handleCityOptionChange = async (query) => {
    ApiManager.getCityOptions("city", query)
      .then((response) => {
        setCityOptions(response.data);
      })
      .catch((error) => {});
  };

  let shouldShowTabs = Object.values(formik.values?.customerName).some(
    (value) => value !== ""
  );
  console.log(formik.values, "formik");
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
  console.log(formik.values?.countryId, "formik");
  return (
    <>
      {type == "add" ? (
        <>
          <Box
            sx={{ width: "100%", typography: "body1", margin: 0, padding: 0 }}
          >
            <TabContext value={value} sx={{ padding: "20px 0" }}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                  sx={{ padding: "0px" }}
                >
                  <Tab
                    label="Customer Details"
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
                {" "}
                <Grid
                  container
                  sx={{ padding: 0, margin: 0, paddingRight: "8px" }}
                >
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
                      <Tooltip
                        title={
                          !formik.values.customerName
                            ? "Field is mandatory"
                            : ""
                        }
                        arrow
                      >
                        <InputBox
                          label="Customer Name*"
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
                        label="TIN No."
                        id="tinNo"
                        value={formik.values.tinNo}
                        error={formik.errors.tinNo}
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
                        label="VAT No."
                        id="vatNo"
                        value={formik.values.vatNo}
                        error={formik.errors.vatNo}
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
                        label="Status"
                        id="status"
                        // options={dropdownData?.status}
                        disabled={true}
                        error={formik.errors.status}
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
                      <Tooltip
                        title={!formik.values.add1 ? "Field is mandatory" : ""}
                        arrow
                      >
                        <InputBox
                          label="Address 1.*"
                          id="add1"
                          value={formik.values.add1}
                          error={formik.errors.add1}
                          onChange={formik.handleChange}
                          disabled={disabled}
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
                        label="Address 2."
                        id="add2"
                        value={formik.values.add2}
                        error={formik.errors.add2}
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
                        label="Address 3."
                        id="add3"
                        value={formik.values.add3}
                        error={formik.errors.add3}
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
                        label="PoNo"
                        id="poNo"
                        value={formik.values.poNo}
                        error={formik.errors.poNo}
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
                        label="City"
                        id="city"
                        value={formik.values.city}
                        error={formik.errors.city}
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
                        label="Province"
                        id="province"
                        value={formik.values.province}
                        error={formik.errors.province}
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
                        label="Country"
                        id="countryId"
                        suggestionName="country"
                        value={formik.values?.countryId}
                        error={formik.errors.countryId}
                        onChange={formik.handleChange}
                      ></FormAutoComplete>
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
                        label="Contact Person"
                        id="contactPerson"
                        value={formik.values.contactPerson}
                        error={formik.errors.contactPerson}
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
                        label="Email Id "
                        id="emailId"
                        value={formik.values.emailId}
                        error={formik.errors.emailId}
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
                        label="Telephone"
                        id="telephone"
                        value={formik.values.telephone}
                        error={formik.errors.telephone}
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
                        label="Fax"
                        id="fax"
                        value={formik.values.fax}
                        error={formik.errors.fax}
                        onChange={formik.handleChange}
                        disabled={disabled}
                      />
                    </Grid>
                  </Grid>
                  <Grid container>
                    {/* customer type */}
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
                        label="Customer Type"
                        id="customerType"
                        options={customerSettingsData?.body.customerType}
                        value={formik.values.customerType}
                        error={formik.errors.customerType}
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
                      container
                      justifyContent="start"
                      alignItems="center"
                    >
                      <RadioGroup
                        id="paymentType"
                        name="paymentType" // add name attribute here
                        value={formik.values.paymentType}
                        // onChange={formik.handleChange}
                        onChange={(e) => {
                          formik.setFieldValue("creditAmount", "");
                          formik.setFieldValue("creditDays", "");
                          formik.setFieldError("creditAmount", "");
                          formik.setFieldError("creditDays", "");
                          formik.setFieldValue("paymentType", e.target.value);
                        }}
                        disabled={disabled}
                        row
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
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
                        label="Credit Days"
                        id="creditDays"
                        value={
                          formik.values.paymentType === "credit"
                            ? formik.values.creditDays
                            : ""
                        }
                        error={formik.errors.creditDays}
                        onChange={formik.handleChange}
                        disabled={
                          formik.values.paymentType === "cash" || disabled
                        }
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
                        label="Credit Amount"
                        id="creditAmount"
                        value={
                          formik.values.paymentType === "credit"
                            ? formik.values.creditAmount
                            : ""
                        }
                        error={formik.errors.creditAmount}
                        onChange={formik.handleChange}
                        disabled={
                          formik.values.paymentType === "cash" || disabled
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      margin: "8px 8px 0px 8px",
                    }}
                  >
                    <ThemeTabs
                      tabData={[
                        { label: "Tariffs", value: "1", disable: false },
                        { label: "Email", value: "2", disable: false },
                        { label: "Bank Details", value: "3", disable: false },
                      ]}
                    >
                      <AddMapping
                        formik={formik}
                        disabled={disabled}
                        dropdownData={dropdownData}
                      />
                      <FileScreen
                        formik={formik}
                        disabled={disabled}
                        dropdownData={dropdownData}
                      />
                      <CustomerBankDetails
                        formik={formik}
                        disabled={disabled}
                        dropdownData={dropdownData}
                      />
                    </ThemeTabs>
                  </Box>
                </Grid>
                {page == "customer" && (
                  <Grid item xs={12} sx={{ margin: 1 }}>
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
                        Adds
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
                          sx={{
                            fontWeight: "500",
                            backgroundColor: "red",
                            color: "white !important",
                          }}
                          onClick={() => handleRejectRequest()}
                        >
                          {loaderApprove.reject && (
                            <CircularProgress size={20} color="white" />
                          )}{" "}
                          Reject
                        </ThemeButton>
                        <ThemeButton
                          sx={{ fontWeight: "500", color: "white !important" }}
                          onClick={() => handleApproveRequest()}
                        >
                          {loaderApprove.approve && (
                            <CircularProgress size={20} color="white" />
                          )}{" "}
                          Approve
                        </ThemeButton>
                      </Stack>
                    </Stack>
                  </Grid>
                )}
                <PopupAlert alertConfig={alertConfig} />
              </TabPanel>
            </TabContext>
          </Box>
        </>
      ) : (
        <>
          <Box
            sx={{ width: "100%", typography: "body1", margin: 0, padding: 0 }}
          >
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                  sx={{ paddingBottom: "20px" }}
                >
                  <Tab
                    label="Customer Details"
                    value="1"
                    sx={{
                      textTransform: "capitalize",
                      minHeight: "50px",
                    }}
                    icon={<EditIconForHeader />}
                    iconPosition="start"
                  />
                  <Tab
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
                  />
                </TabList>
              </Box>
              <TabPanel value="1" sx={{ padding: "0px" }}>
                {" "}
                <Grid container sx={{ margin: 0, padding: 0, paddingRight: 1 }}>
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
                          !formik.values.customerName
                            ? "Field is mandatory"
                            : ""
                        }
                        arrow
                      >
                        <InputBox
                          label="Customer Name*"
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
                        label="TIN No."
                        id="tinNo"
                        value={formik.values.tinNo}
                        error={formik.errors.tinNo}
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
                        label="VAT No."
                        id="vatNo"
                        value={formik.values.vatNo}
                        error={formik.errors.vatNo}
                        onChange={formik.handleChange}
                        disabled={disabled}
                      />
                    </Grid>

                    {initialValues.statusCode == -2 ||
                    initialValues.statusCode == 1 ? (
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
                          // disabled={!initialValues.statusCode || disabled}
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
                        title={!formik.values.add1 ? "Field is mandatory" : ""}
                        arrow
                      >
                        <InputBox
                          label="Address 1.*"
                          id="add1"
                          value={formik.values.add1}
                          error={formik.errors.add1}
                          onChange={formik.handleChange}
                          disabled={disabled}
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
                        label="Address 2."
                        id="add2"
                        value={formik.values.add2}
                        error={formik.errors.add2}
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
                        label="Address 3."
                        id="add3"
                        value={formik.values.add3}
                        error={formik.errors.add3}
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
                        label="PoNo"
                        id="poNo"
                        value={formik.values.poNo}
                        error={formik.errors.poNo}
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
                        label="City"
                        id="city"
                        value={formik.values.city}
                        error={formik.errors.city}
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
                        label="Province"
                        id="province"
                        value={formik.values.province}
                        error={formik.errors.province}
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
                        label="Country"
                        id="countryId"
                        suggestionName="country"
                        value={formik.values.countryId}
                        error={formik.errors.countryId}
                        onChange={formik.handleChange}
                      ></FormAutoComplete>
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
                        label="Contact Person"
                        id="contactPerson"
                        value={formik.values.contactPerson}
                        error={formik.errors.contactPerson}
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
                        label="Email Id "
                        id="emailId"
                        value={formik.values.emailId}
                        error={formik.errors.emailId}
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
                        label="Telephone"
                        id="telephone"
                        value={formik.values.telephone}
                        error={formik.errors.telephone}
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
                        label="Fax"
                        id="fax"
                        value={formik.values.fax}
                        error={formik.errors.fax}
                        onChange={formik.handleChange}
                        disabled={disabled}
                      />
                    </Grid>
                  </Grid>
                  <Grid container>
                    {/* customer type */}
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
                        label="Customer Type"
                        id="customerType"
                        options={customerSettingsData?.body.customerType}
                        value={formik.values.customerType}
                        error={formik.errors.customerType}
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
                      container
                      justifyContent="start"
                      alignItems="center"
                      paddingLeft={1}
                      marginTop={2}
                    >
                      <RadioGroup
                        id="paymentType"
                        name="paymentType" // add name attribute here
                        value={formik.values.paymentType}
                        onChange={(e) => {
                          formik.setFieldValue("creditAmount", "");
                          formik.setFieldValue("creditDays", "");
                          formik.setFieldError("creditAmount", "");
                          formik.setFieldError("creditDays", "");
                          formik.setFieldValue("paymentType", e.target.value);
                        }}
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
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      sx={{
                        borderBottom: 1,
                        border: "1px solid #0000001f",
                        borderRadius: "10px",
                        margin: "8px 8px 0px 8px",
                      }}
                    >
                      <ThemeTabs
                        tabData={[
                          { label: "Tariff", value: "1", disable: false },
                          { label: "Email", value: "2", disable: false },
                          { label: "Bank Details", value: "3", disable: false },
                        ]}
                      >
                        <AddMapping
                          formik={formik}
                          disabled={disabled}
                          dropdownData={dropdownData}
                        />
                        <FileScreen
                          formik={formik}
                          disabled={disabled}
                          dropdownData={dropdownData}
                        />
                        <CustomerBankDetails
                          formik={formik}
                          disabled={disabled}
                          dropdownData={dropdownData}
                        />
                      </ThemeTabs>
                    </Box>
                  </Grid>

                  {formik.values.statusCode === -1 ||
                  page == "customerApprove" ? (
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
                        disabled={
                          page === "customerApprove" ? disabled : !disabled
                        }
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
                    <Grid item xs={12} sx={{ margin: 1 }}>
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
                            Close
                          </OutlinedButton>
                          <ThemeButton
                            onClick={formik.handleSubmit}
                            sx={{
                              fontWeight: "500",
                              color: "white !important",
                            }}
                          >
                            {isLoading && (
                              <CircularProgress size={20} color="white" />
                            )}{" "}
                            Update
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
                        margin={1}
                      >
                        <Stack direction="row" spacing={2}>
                          <OutlinedButton
                            sx={{ fontWeight: "500" }}
                            onClick={() => nav(-1)}
                          >
                            Close
                          </OutlinedButton>
                          <ThemeButton
                            onClick={(event) => {
                              setRejectError(false);
                              formik.handleSubmit(event.target.value);
                            }}
                            sx={{
                              fontWeight: "500",
                              color: "white !important",
                            }}
                          >
                            {loadingUpdate && (
                              <CircularProgress size={20} color="white" />
                            )}{" "}
                            Update
                          </ThemeButton>
                          <ThemeButton
                            sx={{
                              fontWeight: "500",
                              backgroundColor: "red",
                              color: "white !important",
                            }}
                            onClick={() => handleRejectRequest()}
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
                            onClick={() => handleApproveRequest()}
                          >
                            {loaderApprove.approve && (
                              <CircularProgress size={20} color="white" />
                            )}{" "}
                            Approve
                          </ThemeButton>
                        </Stack>
                      </Stack>
                    </Grid>
                  )}

                  <PopupAlert alertConfig={alertConfig} />
                </Grid>
              </TabPanel>
              <TabPanel value="2" sx={{ padding: "0px" }}>
                <UploadFile
                  customer_id={initialValues.id}
                  disabled={disabled}
                  dropdownData={dropdownData.documentType}
                  sourceType="CUSTOMER"
                />
              </TabPanel>
              <TabPanel value="3" sx={{ padding: "0px" }}>
                <AuditTimeline
                  id={initialValues.id}
                  page="customer"
                  service={menuConfigUrl.entity}
                />
              </TabPanel>
            </TabContext>
          </Box>
        </>
      )}
    </>
  );
}
