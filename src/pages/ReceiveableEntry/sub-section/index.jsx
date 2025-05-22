import { useFormik } from "formik";
import { CircularProgress, Grid, Stack } from "@mui/material";
import { IconButton, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import InputBox from "../../../components/common/InputBox";
import { OutlinedButton, ThemeButton } from "../../../components/common/Button";
import ApiManager from "../../../services/ApiManager";
import PopupAlert from "../../../components/common/Alert/PopupAlert";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AddIcon from "@mui/icons-material/Add";
import {
  useAddPaybleEntryMutation,
  useUpdatePaybleEntryMutation,
} from "../../../store/api/payableApi";

import { useNavigate } from "react-router-dom";
import { useGetOptionsSettingsQuery } from "../../../store/api/settingsApi";
import CustomToast from "../../../components/common/Toast/CustomToast";
import getFirstError from "../../../components/common/FieldToastError";
import EditIconForHeader from "../../../components/common/commonIcons/EditIcons/EditIconForHeader";
import PayableEntryList from "../../payable/AddPayableForm/PayableEntryList";
import { formView } from "../../../store/freatures/payableEntrySlice";
import { useDispatch, useSelector } from "react-redux";
import {
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import DateTimeField from "../../../components/common/DateTime/DateTimeField";
import FormAutoCompleteWithLoader from "../../../components/common/AutoComplete/FormAutoCompletewithLoader";
import SelectBox from "../../../components/common/SelectBox";

import { Delete } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { payableValidationSchema } from "../../payable/Actions/ValidationSchema";
import { formatIndianCurrency } from "../../../components/utils/utils";

export default function SubSections({
  initialValues,
  page,
  viewPage,
  type = "notcopy",
}) {
  //
  const nav = useNavigate();
  const invoiceTypeRef = useRef(null);
  const payableRef = useRef(null);
  const [addPaybleEntry, { isLoading }] = useAddPaybleEntryMutation();
  const [updatePaybleEntry, { isUpdateLoading }] =
    useUpdatePaybleEntryMutation();

  const { data: jobSettingData } = useGetOptionsSettingsQuery("job_settings");
  const [mergedCurrencyOptions, setMergedCurrencyOptions] = useState([]);
  const [showDefaultCurrency, setshowDefaultCurrency] = useState("");
  const actionsSelector = useSelector((s) => s?.payableAction);
  const [loaderApprove, setLoaderApprove] = useState({
    approve: false,
    reject: false,
  });

  const dispatch = useDispatch();
  const [dropdownData, setDropdownData] = useState({});
  const [rejectError, setRejectError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
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
    validationSchema: payableValidationSchema(),
    onSubmit: async (values) => {
      //
      const invoiceCurrencyAmount = getAmountData?.amount || 0;
      const invoiceCurrencyVat = getAmountData?.vatAmount || 0;
      const invoiceCurrencyWithHoldingTax =
        getAmountData?.withHoldingAmount || 0;
      const invoiceCurrencyNetAmountPayable = getAmountData?.totalAmount || 0;

      const exchangeRate = Number(getFormData?.exchangeRate) || 1;

      const localCurrencyAmount =
        getFormData?.currency === "TZS" || getFormData?.currency === "INR"
          ? invoiceCurrencyAmount
          : invoiceCurrencyAmount * exchangeRate;

      const localCurrencyVat =
        getFormData?.currency === "TZS" || getFormData?.currency === "INR"
          ? invoiceCurrencyVat
          : invoiceCurrencyVat * exchangeRate;

      const localCurrencyWithHoldingTax =
        getFormData?.currency === "TZS" || getFormData?.currency === "INR"
          ? invoiceCurrencyWithHoldingTax
          : invoiceCurrencyWithHoldingTax * exchangeRate;

      const localCurrencyNetAmountPayable =
        getFormData?.currency === "TZS" || getFormData?.currency === "INR"
          ? invoiceCurrencyNetAmountPayable
          : invoiceCurrencyNetAmountPayable * exchangeRate;
      values.invoiceCurrencyAmount = invoiceCurrencyAmount;
      values.invoiceCurrencyVat = invoiceCurrencyVat;
      values.invoiceCurrencyWithHoldingTax = invoiceCurrencyWithHoldingTax;
      values.invoiceCurrencyNetAmountPayable = invoiceCurrencyNetAmountPayable;

      values.localCurrencyAmount = localCurrencyAmount;
      values.localCurrencyVat = localCurrencyVat;
      values.localCurrencyWithHoldingTax = localCurrencyWithHoldingTax;
      values.localCurrencyNetAmountPayable = localCurrencyNetAmountPayable;
      if (!values.id || type === "copy") {
        try {
          values.statusCode = dropdownData?.approvalRequest ? 0 : 1;
          values.status = "";
          let paybleDetailsData = values.paybleDetails.map((item) =>
            item?.new ? { ...item, id: null, new: false } : item
          );
          let response = await addPaybleEntry({
            ...values,
            paybleDetails: paybleDetailsData,
          }).unwrap();

          const message = response.message;
          if (response.code == "SUCCESS") {
            toast.custom(<CustomToast message={message} toast="warn" />, {
              closeButton: false,
            });
            nav("/app/documentation/paybleEntry");
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
          let paybleDetailsData = values.paybleDetails.map((item) =>
            item?.new ? { ...item, id: null, new: false } : item
          );
          Boolean(values.status == "Active") && (values.statusCode = 1);
          Boolean(values.status == "Inactive") && (values.statusCode = -2);
          let response = await updatePaybleEntry({
            ...values,
            paybleDetails: paybleDetailsData,
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
  const getFormData = formik?.values;
  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("common_settings");
  const { data: customerSettingsData } =
    useGetOptionsSettingsQuery("customer_settings");
  const { data: payableSettingData } =
    useGetOptionsSettingsQuery("payble_settings");

  useEffect(() => {
    if (
      optionsSettingsData?.body ||
      customerSettingsData?.body ||
      jobSettingData?.body ||
      payableSettingData?.body
    ) {
      setDropdownData({
        ...optionsSettingsData?.body,
        ...customerSettingsData?.body,
        ...jobSettingData?.body,
        ...payableSettingData?.body,
      });
    }
  }, [optionsSettingsData, customerSettingsData, payableSettingData]);
  useEffect(() => {
    if (formik.values?.currency !== "USD") {
      formik.setFieldValue("exchangeRate", 1);
    }
  }, [formik.values?.currency]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiManager.fetchAutoCompleteData(
          "",
          "COMPANY_CODE"
        );
        const backendData = await response.body;
        setshowDefaultCurrency(backendData?.[0]);
        formik.setFieldValue(
          "currency",
          initialValues.currency
            ? initialValues.currency
            : backendData?.[0].currency
        );
        const backendCurrencies = Array.from(
          new Set(
            (backendData || []).map((item) => item.currency).filter(Boolean)
          )
        ).map((curr) => ({ id: curr, value: curr }));
        // Get setting currencies safely
        const settingCurrencies = optionsSettingsData?.body?.currencyType || [];
        // Merge both arrays avoiding duplicates (based on `value`)
        const mergedCurrencies = [
          ...backendCurrencies,
          ...settingCurrencies.filter(
            (setting) =>
              !backendCurrencies.some((item) => item.value === setting.value)
          ),
        ];

        setMergedCurrencyOptions(mergedCurrencies);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [optionsSettingsData?.body?.currencyType]);

  const handleApproveRequest = async () => {
    setRejectError(false);
    const { vendorInvoiceNo, isDoc } = formik.values;
    // Validation logic
    if (vendorInvoiceNo && !isDoc) {
      toast.custom(
        <CustomToast
          message="Please submit document as invoice type"
          toast="error"
        />,
        {
          closeButton: false,
        }
      );
      return; // Prevent approval
    }
    if (formik.values?.paybleDetails?.length === 0) {
      console.log("no chaolrge");

      toast.custom(
        <CustomToast
          message="Please add payable details before approving"
          toast="error"
        />,
        {
          closeButton: false,
        }
      );
      return; // Prevent approval
    }
    try {
      setLoaderApprove((prevState) => ({
        ...prevState,
        approve: true,
      }));

      const response = await ApiManager.payableApproveHandler(
        initialValues.id,
        "PAYBLE_ENTRY"
      );

      const message = response.message;
      nav("/app/documentation/approvePayable");

      toast.custom(<CustomToast message={message} toast="success" />, {
        closeButton: false,
      });
    } catch (error) {
      toast.custom(
        <CustomToast
          message="Error occurred while approve payable"
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
      const response = await ApiManager.payableRejectHandler(
        initialValues.id,
        "PAYBLE_ENTRY",
        formik.values.rejectRemarks
      );
      const message = response.message;
      nav("/app/documentation/approvePayable");
      toast.custom(<CustomToast message={message} toast="success" />, {
        closeButton: false,
      });
    } catch (error) {
      toast.custom(
        <CustomToast
          message="Error occurred while reject payable"
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

  useEffect(() => {
    getFirstError(formik.errors);
  }, [formik.errors]);

  useEffect(() => {
    if (payableRef?.current) {
      payableRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (invoiceTypeRef.current) {
      invoiceTypeRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!actionsSelector.view) {
      dispatch(formView("card"));
    }
  }, [actionsSelector.view, dispatch]);

  const muiTextFieldStyles = {
    root: {
      "& .MuiInputBase-root": {
        borderRadius: "10px",
        fontSize: "14px",
        padding: "3px 0",
      },
    },
  };

  useEffect(() => {
    if (formik?.values?.currency !== "USD") {
      formik.setFieldValue("exchangeRate", 1);
    }
  }, [formik?.values?.currency]);

  const [chargesData, setChargesData] = useState([]);
  const [togglePayEntry, setToggleNotes] = useState(false);
  const [selectedPayEntry, setSelectedPayEntry] = useState(null);

  const disabled = false;

  const handleEditClick = (data) => {
    setSelectedPayEntry(data);
    setToggleNotes(true);
  };

  const handleTogglePayEntry = () => {
    setToggleNotes((prev) => !prev);
    if (togglePayEntry) {
      setSelectedPayEntry(null);
    }
  };

  const handleAddPayEntry = (newNote) => {
    let updatedNotes;
    if (selectedPayEntry) {
      updatedNotes = chargesData.map((note) =>
        note.id === selectedPayEntry.id ? newNote : note
      );
    } else {
      updatedNotes = [...chargesData, newNote];
    }
    setChargesData(updatedNotes);
    formik.setFieldValue("paybleDetails", updatedNotes);
    setSelectedPayEntry(null);
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = chargesData.filter((note) => note.id !== id);
    setChargesData(updatedNotes);
    formik.setFieldValue("paybleDetails", updatedNotes);
  };

  const handleFetchPayable = () => {
    const apiPayableData = formik?.values?.paybleDetails || [];
    const appendData = [...apiPayableData].reduce((acc, pay) => {
      if (!acc.some((n) => n.id === pay.id)) {
        acc.push(pay);
      }
      return acc;
    }, []);
    setChargesData(appendData);
  };

  useEffect(() => {
    handleFetchPayable();
  }, [formik?.values?.chargesData]);

  const PAYABLE_COLUMNS = [
    {
      flex: 1,
      field: "jobNo",
      headerName: "Job No.",
      headerAlign: "center",
      align: "center",
      editable: false,
    },

    {
      flex: 1.5,
      field: "chargeName",
      headerName: "Charge Name",
      headerAlign: "center",
      align: "center",
      editable: false,
      renderCell: (params) => (
        <div className="word-wrap-cell">
          {params.value?.trim() || ""} {/* Show "N/A" if empty */}
        </div>
      ),
    },
    {
      flex: 1,
      field: "unitType",
      headerName: "Unit Type",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "noOfUnit",
      headerName: "No Unit Units",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "unitRate",
      headerName: "Unit Rate",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "amount",
      headerName: "Amount",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "vatApplicable",
      headerName: "Vat Applicable",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "vatAmount",
      headerName: "Vat Amount",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "withHoldingTax",
      headerName: "With Holding Tax",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "withHoldingAmount",
      headerName: "With holding amount",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "totalAmount",
      headerName: "Total Amount",
      headerAlign: "center",
      align: "center",
      editable: false,
    },

    {
      field: "edit",
      headerName: "Edit",
      flex: 1,
      sortable: false,
      headerAlign: "center",
      renderHeader: () => (
        <IconButton
          disabled={isDisabled}
          color="white"
          onClick={handleTogglePayEntry}
        >
          <AddCircleIcon />
        </IconButton>
      ),
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <EditIcon
            style={{
              cursor: disabled ? "not-allowed" : "pointer",
              color: disabled ? "#ccc" : "#166ee0",
              opacity: disabled ? 0.5 : 1,
            }}
            onClick={() => {
              if (!disabled) handleEditClick(params.row);
            }}
          />
          <Delete
            style={{
              cursor: disabled ? "not-allowed" : "pointer",
              color: disabled ? "#ccc" : "red",
              opacity: disabled ? 0.5 : 1,
            }}
            onClick={() => {
              if (!disabled) handleDeleteNote(params.row.id);
            }}
          />
        </div>
      ),
    },
  ];

  const getPaybleDetailsTotals = (paybleDetails) => {
    const totals = {
      amount: 0,
      vatAmount: 0,
      withHoldingAmount: 0,
      totalAmount: 0,
    };
    paybleDetails.forEach((entry) => {
      totals.amount += Number(entry.amount || 0);
      totals.vatAmount += Number(entry.vatAmount || 0);
      totals.withHoldingAmount += Number(entry.withHoldingAmount || 0);
      totals.totalAmount += Number(entry.totalAmount || 0);
    });
    return {
      amount: totals.amount.toFixed(2),
      vatAmount: totals.vatAmount.toFixed(2),
      withHoldingAmount: totals.withHoldingAmount.toFixed(2),
      totalAmount: totals.totalAmount.toFixed(2),
    };
  };

  const getAmountData = getPaybleDetailsTotals(chargesData);

  return (
    <>
      <Box sx={{ width: "100%", padding: 0, margin: 0 }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab
                label="Cost Center"
                value="1"
                icon={<EditIconForHeader />}
                iconPosition="start"
                sx={{ textTransform: "capitalize", minHeight: "50px" }}
              />
            </TabList>
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
              <Box sx={{ width: "40%", paddingRight: 2 }}>
                <Grid container sx={{ padding: 0, margin: 0 }}>
                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <SelectBox
                      label="Invoice Type*"
                      id="invoiceType"
                      options={dropdownData?.invoiceType}
                      value={formik.values.invoiceType}
                      error={formik.errors.invoiceType}
                      onChange={formik.handleChange}
                      disabled={isDisabled}
                      inputRef={invoiceTypeRef}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <InputBox
                      label="Payable Ref. No.*"
                      id="payableRefNo"
                      value={formik.values.payableRefNo}
                      error={formik.errors.payableRefNo}
                      onChange={formik.handleChange}
                      inputRef={payableRef}
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <FormAutoCompleteWithLoader
                      label="Job No.*"
                      id="jobNo"
                      value={formik.values.jobNo}
                      error={formik.errors.jobNo}
                      onChange={formik.handleChange}
                      suggestionName="job_no"
                      disabled={isDisabled}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <DateTimeField
                      name="invoiceDate"
                      label="Invoice Date*"
                      id="invoiceDate"
                      value={formik.values.invoiceDate}
                      error={formik.errors.invoiceDate}
                      onChange={formik.setFieldValue}
                      inputRef={payableRef}
                      disabled={isDisabled}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <FormAutoCompleteWithLoader
                      label="Vendor Name*"
                      id="vendorName"
                      suggestionName="vendor_name"
                      value={formik.values.vendorName}
                      error={formik.errors.vendorName}
                      onChange={formik.handleChange}
                      disabled={isDisabled}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <InputBox
                      label="Vendor Invoice No."
                      id="vendorInvoiceNo"
                      value={formik.values.vendorInvoiceNo}
                      error={formik.errors.vendorInvoiceNo}
                      onChange={formik.handleChange}
                      inputRef={payableRef}
                      disabled={isDisabled}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <DateTimeField
                      name="vendorInvoiceDate"
                      label="Vendor Invoice Date"
                      id="vendorInvoiceDate"
                      value={formik.values.vendorInvoiceDate}
                      error={formik.errors.vendorInvoiceDate}
                      onChange={formik.setFieldValue}
                      // inputRef={payableRef}
                      disabled={isDisabled}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <SelectBox
                      label="Currency"
                      id="currency"
                      options={mergedCurrencyOptions}
                      value={formik.values.currency}
                      error={formik.errors.currency}
                      onChange={(e) => {
                        const value = e.target.value;
                        formik.setFieldValue("currency", value);
                        if (value === "USD") {
                          // Clear currency-related fields when changing from USD to something else
                          formik.setFieldValue("exchangeRate", null);
                        }
                      }}
                      disabled={isDisabled}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    {getFormData?.currency === "TZS" ||
                    getFormData?.currency === "INR" ? (
                      <InputBox
                        label="Ex. Rate"
                        id="exchangRate"
                        value={
                          getFormData?.currency === "TZS" ||
                          getFormData?.currency === "INR"
                            ? 1
                            : formatIndianCurrency(formik.values.exchangeRate)
                        }
                        // value={formik.values.exchangeRate}
                        error={formik.errors.exchangeRate}
                        onChange={formik.handleChange}
                        inputRef={payableRef}
                        disabled={
                          getFormData?.currency === "TZS" ||
                          getFormData?.currency === "INR" ||
                          viewPage === "view" ||
                          isDisabled
                        }
                      />
                    ) : (
                      <FormAutoCompleteWithLoader
                        label="Ex. Rate"
                        id="exchangeRate"
                        value={formik.values.exchangeRate}
                        error={formik.errors.exchangeRate}
                        onChange={formik.handleChange}
                        suggestionName="usd_exchange"
                        disabled={isDisabled}
                      />
                    )}
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    lg={12}
                    paddingLeft={1}
                    marginTop={2}
                  ></Grid>
                </Grid>

                <PopupAlert alertConfig={alertConfig} />
              </Box>

              <Box sx={{ width: "60%", padding: 2 }}>
                <Box
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    overflow: "hidden",
                    marginLeft: "100px",
                  }}
                >
                  <Grid
                    container
                    sx={{
                      "& > .MuiGrid-item": {
                        border: "1px solid #ccc",
                      },
                      "& > .MuiGrid-item > .MuiTypography-root": {
                        padding: "10px",
                      },
                      "& fieldset": {
                        border: "none",
                      },
                      "&:hover fieldset": {
                        border: "none",
                      },
                      "&.Mui-focused fieldset": {
                        border: "none",
                      },
                    }}
                  >
                    <Grid item xs={12} lg={4}></Grid>
                    <Grid item xs={12} lg={4}>
                      <Typography>{`Invoice Currency (${getFormData?.currency})`}</Typography>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                      <Typography>{showDefaultCurrency?.currency}</Typography>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                      <Typography>Amount</Typography>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                      <TextField
                        hiddenLabel
                        id="amount"
                        name="amount"
                        variant="outlined"
                        value={formatIndianCurrency(getAmountData?.amount)}
                        fullWidth
                        size="small"
                        sx={{
                          ...muiTextFieldStyles.root,
                          width: "100% !important",
                        }}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12} lg={4}>
                      <TextField
                        hiddenLabel
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{ ...muiTextFieldStyles.root }}
                        value={
                          getFormData?.currency === "TZS" ||
                          getFormData?.currency === "INR"
                            ? formatIndianCurrency(getAmountData?.amount * 1)
                            : formatIndianCurrency(
                                getAmountData?.amount *
                                  Number(getFormData?.exchangeRate)
                              ) || 0
                        }
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12} lg={4}>
                      <Typography>VAT</Typography>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                      <TextField
                        hiddenLabel
                        id="vatAmount"
                        name="vatAmount"
                        variant="outlined"
                        value={formatIndianCurrency(getAmountData?.vatAmount)}
                        fullWidth
                        size="small"
                        sx={{
                          ...muiTextFieldStyles.root,
                          width: "100% !important",
                        }}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12} lg={4}>
                      <TextField
                        hiddenLabel
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{ ...muiTextFieldStyles.root }}
                        value={
                          getFormData?.currency === "TZS" ||
                          getFormData?.currency === "INR"
                            ? formatIndianCurrency(getAmountData?.vatAmount * 1)
                            : formatIndianCurrency(
                                getAmountData?.vatAmount *
                                  getFormData?.exchangeRate
                              ) || 0
                        }
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12} lg={4}>
                      <Typography>With holding Tax</Typography>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                      <TextField
                        hiddenLabel
                        id="withHoldingAmount"
                        name="withHoldingAmount"
                        variant="outlined"
                        value={formatIndianCurrency(
                          getAmountData?.withHoldingAmount
                        )}
                        fullWidth
                        size="small"
                        sx={{
                          ...muiTextFieldStyles.root,
                          width: "100% !important",
                        }}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12} lg={4}>
                      <TextField
                        hiddenLabel
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{ ...muiTextFieldStyles.root }}
                        value={
                          getFormData?.currency === "TZS" ||
                          getFormData?.currency === "INR"
                            ? formatIndianCurrency(
                                getAmountData?.withHoldingAmount * 1
                              )
                            : formatIndianCurrency(
                                getAmountData?.withHoldingAmount *
                                  getFormData?.exchangeRate || 0
                              )
                        }
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12} lg={4}>
                      <Typography>Net amount payable</Typography>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                      <TextField
                        hiddenLabel
                        id="totalAmount"
                        name="totalAmount"
                        value={formatIndianCurrency(getAmountData?.totalAmount)}
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{
                          ...muiTextFieldStyles.root,
                          width: "100% !important",
                        }}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12} lg={4}>
                      <TextField
                        hiddenLabel
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{ ...muiTextFieldStyles.root }}
                        value={
                          getFormData?.currency === "TZS" ||
                          getFormData?.currency === "INR"
                            ? formatIndianCurrency(
                                getAmountData?.totalAmount * 1
                              )
                            : formatIndianCurrency(
                                getAmountData?.totalAmount *
                                  getFormData?.exchangeRate || 0
                              )
                        }
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12} lg={4}>
                      <Typography>Cost center</Typography>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                      <TextField
                        hiddenLabel
                        id="amount"
                        name="amount"
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{
                          ...muiTextFieldStyles.root,
                          width: "100% !important",
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} lg={4}>
                      <TextField
                        hiddenLabel
                        id="amount"
                        name="amount"
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{ ...muiTextFieldStyles.root }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>

            <hr style={{ margin: "10px 0" }} />

            <Stack direction="row" justifyContent="right" padding="5px 15px">
              <Box>
                {actionsSelector?.view === "card" && (
                  <IconButton
                    color="primary"
                    onClick={handleTogglePayEntry}
                    disabled={isDisabled}
                  >
                    <AddIcon />
                  </IconButton>
                )}

                <IconButton onClick={() => dispatch(formView("card"))}>
                  <FormatListBulletedOutlined
                    color={
                      actionsSelector.view === "card" ? "primary" : "secondary"
                    }
                  />
                </IconButton>

                <IconButton onClick={() => dispatch(formView("grid"))}>
                  <GridOnOutlined
                    color={
                      actionsSelector.view === "grid" ? "primary" : "secondary"
                    }
                  />
                </IconButton>
              </Box>
            </Stack>

            <Box sx={{ width: "100%" }}>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  margin: "8px",
                }}
              >
                <PayableEntryList
                  formik={formik}
                  dropdownData={dropdownData}
                  disabled={isDisabled}
                  chargesData={chargesData}
                  PAYABLE_COLUMNS={PAYABLE_COLUMNS}
                />
              </Box>
            </Box>

            <Box sx={{ gap: "10px", padding: "15px" }}>
              {formik?.values?.status?.toLowerCase() === "rejected" ||
              page == "payableApprove" ? (
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
                    disabled={page === "payable" ? true : false}
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                      },
                    }}
                  />
                </Grid>
              ) : (
                <></>
              )}
            </Box>

            {viewPage !== "view" &&
              (page == "payable" ? (
                <Box sx={{ display: "flex", gap: "10px", padding: "15px" }}>
                  <Grid item xs={12}>
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
                          onClick={() =>
                            page === "payable"
                              ? nav("/app/documentation/paybleEntry")
                              : nav("/app/documentation/approvePayable")
                          }
                        >
                          Close
                        </OutlinedButton>

                        {!initialValues?.id ? (
                          <ThemeButton
                            onClick={formik.handleSubmit}
                            sx={{
                              fontWeight: "500",
                              color: "white !important",
                            }}
                          >
                            {isLoading && (
                              <CircularProgress size={20} color="white" />
                            )}
                            Submit
                          </ThemeButton>
                        ) : (
                          <ThemeButton
                            onClick={formik.handleSubmit}
                            sx={{
                              fontWeight: "500",
                              color: "white !important",
                            }}
                            disabled={isDisabled}
                          >
                            {isUpdateLoading && (
                              <CircularProgress size={20} color="white" />
                            )}
                            Update
                          </ThemeButton>
                        )}
                      </Stack>
                    </Stack>
                  </Grid>
                </Box>
              ) : (
                <Box sx={{ display: "flex", gap: "10px", padding: "15px" }}>
                  <Grid item xs={12} sx={{ margin: 1 }}>
                    <Stack
                      direction="row"
                      spacing={2}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Stack direction="row" spacing={2}>
                        {/*  */}
                        <OutlinedButton
                          sx={{ fontWeight: "500" }}
                          onClick={() =>
                            page === "payable"
                              ? nav("/app/documentation/paybleEntry")
                              : nav("/app/documentation/approvePayable")
                          }
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
                          )}
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
                          )}
                          Reject
                        </ThemeButton>
                        <ThemeButton
                          sx={{ fontWeight: "500", color: "white !important" }}
                          onClick={() => handleApproveRequest()}
                        >
                          {loaderApprove.approve && (
                            <CircularProgress size={20} color="white" />
                          )}
                          Approve
                        </ThemeButton>
                      </Stack>
                    </Stack>
                  </Grid>
                </Box>
              ))}
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
}
