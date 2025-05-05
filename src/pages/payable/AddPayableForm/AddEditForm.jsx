import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/material";
import { useFormik } from "formik";
import CloseIcon from "@mui/icons-material/Close";
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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  useAddPaybleEntryMutation,
  useUpdatePaybleEntryMutation,
} from "../../../store/api/payableApi";

import { useNavigate } from "react-router-dom";
import { useGetOptionsSettingsQuery } from "../../../store/api/settingsApi";
import CustomToast from "../../../components/common/Toast/CustomToast";
import getFirstError from "../../../components/common/FieldToastError";
import EditIconForHeader from "../../../components/common/commonIcons/EditIcons/EditIconForHeader";
import DocumentIcon from "../../../components/common/commonIcons/DocumentIcons/DocumentIcon";
import AuditIcon from "../../../components/common/commonIcons/AuditIcon/AuditIcon";
import PayableEntryList from "./PayableEntryList";
import {
  formView,
  payableSetSortModal,
} from "../../../store/freatures/payableEntrySlice";
import { useDispatch, useSelector } from "react-redux";
import {
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import PayableCardView from "../../../components/common/PayableCard/PayableCard";
import { getUserListGridActions } from "../../../components/screen/user-management/action";
import { dashboardSetPagination } from "../../../store/freatures/dashboardSlice";
import DateTimeField from "../../../components/common/DateTime/DateTimeField";
import FormAutoCompleteWithLoader from "../../../components/common/AutoComplete/FormAutoCompletewithLoader";
import SelectBox from "../../../components/common/SelectBox";

import { Delete } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddPayableEntryModal from "./AddPayableEntryModal";
import { payableValidationSchema } from "../Actions/ValidationSchema";

import UploadFile from "../../../components/UploadFile";
import AuditTimeLine from "../../../components/AuditTimeLine";
import { menuConfigUrl } from "../../../store/menuConfigUrl";
import { formatIndianCurrency } from "../../../components/utils/utils";

export default function AddEditForm({
  initialValues,
  page,
  viewPage,
  type = "notcopy",
}) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1200,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };
  const payableRef = useRef(null);
  const invoiceTypeRef = useRef(null);

  const [addPaybleEntry, { isLoading }] = useAddPaybleEntryMutation();
  const [updatePaybleEntry, { isUpdateLoading }] =
    useUpdatePaybleEntryMutation();
  const { data: jobSettingData } = useGetOptionsSettingsQuery("job_settings");

  const actionsSelector = useSelector((s) => s?.payableAction);
  const [loaderApprove, setLoaderApprove] = useState({
    approve: false,
    reject: false,
  });
  console.log("initialValues", initialValues);
  
  const dispatch = useDispatch();
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

  useEffect(() => {
    if (viewPage === "view" || formik?.values?.statusCode === -3 || formik?.values?.statusCode === 1) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [viewPage]);
  
  useEffect(() => {
    if (invoiceTypeRef.current) {
      invoiceTypeRef.current.focus();
    }
  }, []);
  
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: payableValidationSchema(),
    onSubmit: async (values) => {
      if (!values.id || type == "copy") {
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
    if (!actionsSelector.view) {
      dispatch(formView("card"));
    }
  }, [actionsSelector.view, dispatch]);

  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(dashboardSetPagination({ page, pageSize }));
  };

  const muiTextFieldStyles = {
    root: {
      "& .MuiInputBase-root": {
        borderRadius: "10px",
        fontSize: "14px",
        padding: "3px 0",
      },
    },
  };

  const FieldRef = useRef(null);
  useEffect(() => {
    if (FieldRef.current) {
      FieldRef.current.focus();
    }
  }, []);

  const CurrencyData = [
    {
      label: "TZS",
      value: "TZS",
    },
    {
      label: "USD",
      value: "USD",
    },
  ];

  //
  const [chargesData, setChargesData] = useState([]);
  const [togglePayEntry, setToggleNotes] = useState(false);
  const [selectedPayEntry, setSelectedPayEntry] = useState(null);

  const disabled =
  formik?.values?.statusCode === 1 || formik?.values?.statusCode === -3 || viewPage === "view" ? true : false;

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
    // localStorage.setItem("chargesData", JSON.stringify(updatedNotes));
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
      // renderCell: (params) => {
      //   const createdBy = params.row?.new
      //     ? localStorage.getItem("userId") || "Unknown User"
      //     : params.row?.createdBy || "";

      //   return <span>{createdBy}</span>;
      // },
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
console.log("formik.values.statusCode", formik.values.statusCode);

  return (
    <>
      <Box sx={{ width: "100%", padding: 0, margin: 0 }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            {type === "add" ? (
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab
                  label="Payable Details"
                  value="1"
                  icon={<EditIconForHeader />}
                  iconPosition="start"
                  sx={{ textTransform: "capitalize", minHeight: "50px" }}
                />
              </TabList>
            ) : (
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab
                  label="Payable Details"
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
                  // disabled={formik.values.statusCode === -3}
                />
                <Tab
                  label="Audit Logs"
                  value="3"
                  icon={<AuditIcon />}
                  iconPosition="start"
                  sx={{ textTransform: "capitalize", minHeight: "50px" }}
                  // disabled={formik.values.statusCode === -3}
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
                      id="customerName"
                      value={formik.values.customerName}
                      error={formik.errors.customerName}
                      onChange={formik.handleChange}
                      inputRef={payableRef}
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <FormAutoCompleteWithLoader
                      label="Job No."
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
                      label="Invoice Date"
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
                      label="Vendor Name"
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
                  {/* <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      "&:hover": {
                        borderColor: "#000",
                      },
                      "&:focus-within": {
                        borderColor: " #166de0",
                        borderWidth: "2px",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none", // hides MUI default border
                        borderRight: "1px solid #ccc",
                      },

                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#041238", // border color on hover
                      },

                      "& .MuiInputLabel-root": {
                        backgroundColor: "#fff",
                        paddingRight: "5px",
                        maxWidth: "calc(100% - 57px)",
                      },
                      "& .css-1uf3ruz-MuiFormControl-root-MuiTextField-root .MuiInputBase-root":
                        {
                          borderRadius: "0",
                          height: "39px",
                        },
                    }}
                  >
                     <InputBox
                      label="Vendor Invoice No."
                      id="vendorInvoiceNo"
                      value={formik.values.vendorInvoiceNo}
                      error={formik.errors.vendorInvoiceNo}
                      onChange={formik.handleChange}
                      inputRef={payableRef}
                      disabled={isDisabled}
                    />
                    <IconButton
                      color="primary"
                      aria-label="upload"
                      onClick={() =>
                        formik.values.vendorInvoiceNo && handleOpen("Vendor Invoice Doc")
                      }
                      style={{
                        cursor: formik.values.vendorInvoiceNo
                          ? "pointer"
                          : "not-allowed",
                        color: formik.values.vendorInvoiceNo ? "#1976d2" : "#999",
                        textDecoration: formik.values.vendorInvoiceNo
                          ? "underline"
                          : "none",
                        pointerEvents: formik.values.vendorInvoiceNo ? "auto" : "none",
                      }}
                    >
                      <CloudUploadIcon />
                    </IconButton>
                  </Box>
                </Grid> */}
                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <DateTimeField
                      name="vendorInvoiceDate"
                      label="Vendor Invoice Date"
                      id="vendorInvoiceDate"
                      value={formik.values.vendorInvoiceDate}
                      error={formik.errors.vendorInvoiceDate}
                      onChange={formik.setFieldValue}
                      inputRef={payableRef}
                      disabled={isDisabled}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <SelectBox
                      label="Currency"
                      id="currency"
                      options={CurrencyData}
                      value={formik.values.currency}
                      error={formik.errors.currency}
                      onChange={formik.handleChange}
                      disabled={isDisabled}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <InputBox
                      label="Ex. Rate"
                      id="exchangeRate"
                      value={
                        getFormData?.currency === "TZS"
                          ? 1
                          : formatIndianCurrency(formik.values.exchangeRate)
                      }
                      error={formik.errors.exchangeRate}
                      onChange={formik.handleChange}
                      inputRef={payableRef}
                      disabled={
                        getFormData?.currency === "TZS" || viewPage === "view" || isDisabled
                      }
                    />
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
                      <Typography>{"TZS"}</Typography>
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
                          getFormData?.currency === "TZS"
                            ? formatIndianCurrency(getAmountData?.amount * 1)
                            : formatIndianCurrency(getAmountData?.amount *
                                Number(getFormData?.exchangeRate)) || 0
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
                          getFormData?.currency === "TZS"
                            ? formatIndianCurrency(getAmountData?.vatAmount * 1)
                            : formatIndianCurrency(getAmountData?.vatAmount *
                                getFormData?.exchangeRate) || 0
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
                        value={formatIndianCurrency(getAmountData?.withHoldingAmount)}
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
                          getFormData?.currency === "TZS"
                            ? formatIndianCurrency(getAmountData?.withHoldingAmount * 1)
                            : formatIndianCurrency(getAmountData?.withHoldingAmount *
                                getFormData?.exchangeRate || 0)
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
                          getFormData?.currency === "TZS"
                            ? formatIndianCurrency(getAmountData?.totalAmount * 1)
                            : formatIndianCurrency(getAmountData?.totalAmount *
                                getFormData?.exchangeRate || 0)
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

            {actionsSelector?.view === "card" ? (
              <Box
                sx={{
                  width: "100%",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "3px",
                }}
              >
                <PayableCardView
                  uniqueId="id"
                  columns={PAYABLE_COLUMNS}
                  count={20}
                  handlePage={handlePage}
                  data={chargesData}
                  paginationModel={actionsSelector.pagination}
                  loading={isLoading}
                  actions={getUserListGridActions(nav, payableSetSortModal)}
                  page=""
                  handleEditClick={handleEditClick}
                  handleDeleteClick={handleDeleteNote}
                  disabled={isDisabled}
                />
              </Box>
            ) : (
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
            )}
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
                          onClick={() => nav(-1)}
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
          <TabPanel value="2" sx={{ padding: "0px" }}>
            <UploadFile
              customer_id={initialValues.id}
              disabled={isDisabled}
              dropdownData={dropdownData.jobDocumentType}
              sourceType="PAYBLE_ENTRY"
            />
          </TabPanel>

          <TabPanel value="3" sx={{ padding: "0px" }}>
            <AuditTimeLine
              id={initialValues.id}
              page="payble/entry"
              service={menuConfigUrl.document}
            />
          </TabPanel>
        </TabContext>
      </Box>
      {/* <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <Button
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: 10,
                right: 8,
                color: "red",
                backgroundColor: "transparent",
              }}
            >
              <CloseIcon color="red" />
            </Button>
            <UploadFile
              customer_id={initialValues.id}
              isNotShowType={true}
              sourceType={"JOB_DETAIL"}
              type={SourceType}
            />
          </Box>
        </Modal> */}
      <AddPayableEntryModal
        togglePayEntry={togglePayEntry}
        handleTogglePayEntry={handleTogglePayEntry}
        formik={formik}
        onAddPayEntry={handleAddPayEntry}
        selectedPayEntry={selectedPayEntry}
        setSelectedPayEntry={setSelectedPayEntry}
      />
    </>
  );
}
