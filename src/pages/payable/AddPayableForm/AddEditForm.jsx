import {
  CircularProgress,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/material";
import { useFormik } from "formik";
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
  useAddCustomerMutation,
  useUpdateCustomerMutation,
} from "../../../store/api/codeDataApi";

import { useAddPaybleEntryMutation } from "../../../store/api/payableApi";

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
import { useFetchUsersQuery } from "../../../store/api/userDataApi";
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

// import UploadFile from "../../../components/UploadFile";
// import AuditTimeLine from "../../../components/AuditTimeLine";
// import { menuConfigUrl } from "../../../store/menuConfigUrl";

export default function AddEditForm({ initialValues, page, type = "notcopy" }) {
  const [addPaybleEntry, { isLoading }] = useAddPaybleEntryMutation();
  const actionsSelector = useSelector((s) => s?.payableAction);

  // const [loaderApprove, setLoaderApprove] = useState({
  //   approve: false,
  //   reject: false,
  // });

  const [updateCustomer] = useUpdateCustomerMutation();
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

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: payableValidationSchema(),
    onSubmit: async (values) => {
      if (!values.id || type == "copy") {
        try {
          delete values.id;
          values.statusCode = dropdownData?.approvalRequest ? 0 : 1;
          values.status = "";
          let response = await addPaybleEntry({
            ...values,
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
          Boolean(values.status == "Active") && (values.statusCode = 1);
          Boolean(values.status == "Inactive") && (values.statusCode = -2);
          let response = await updateCustomer({
            ...values,
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
  console.log(getFormData, "getFormData");

  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("common_settings");
  const { data: customerSettingsData } =
    useGetOptionsSettingsQuery("customer_settings");
  const { data: jobSettingData } = useGetOptionsSettingsQuery("job_settings");

  useEffect(() => {
    if (
      optionsSettingsData?.body ||
      customerSettingsData?.body ||
      jobSettingData?.body
    ) {
      setDropdownData({
        ...optionsSettingsData?.body,
        ...customerSettingsData?.body,
        ...jobSettingData?.body,
      });
    }
  }, [optionsSettingsData, customerSettingsData]);

  // const handleApproveRequest = async () => {
  //   setRejectError(false);
  //   try {
  //     setLoaderApprove((prevState) => ({
  //       ...prevState,
  //       approve: true,
  //     }));
  //     const response = await ApiManager.approveCustomerApprove(
  //       initialValues.id,
  //       "customer"
  //     );
  //     const message = response.message;
  //     nav("/app/entity/approve");
  //     toast.custom(<CustomToast message={message} toast="success" />, {
  //       closeButton: false,
  //     });
  //   } catch (error) {
  //     toast.custom(
  //       <CustomToast
  //         message="Error occurred while approve customer"
  //         toast="error"
  //       />,
  //       {
  //         closeButton: false,
  //       }
  //     );
  //   }
  //   setLoaderApprove((prevState) => ({
  //     ...prevState,
  //     approve: false,
  //   }));
  // };

  // const handleRejectRequest = async () => {
  //   if (!formik.values.rejectRemarks) {
  //     setRejectError(true);
  //     toast.custom(
  //       <CustomToast message="Reject remarks to be filled!" toast="warn" />,
  //       {
  //         closeButton: false,
  //       }
  //     );
  //     return;
  //   }
  //   try {
  //     setLoaderApprove((prevState) => ({
  //       ...prevState,
  //       reject: true,
  //     }));
  //     const response = await ApiManager.rejectCustomerApprove(
  //       initialValues.id,
  //       "customer",
  //       formik.values.rejectRemarks
  //     );
  //     const message = response.message;
  //     nav("/app/entity/approve");

  //     toast.custom(<CustomToast message={message} toast="success" />, {
  //       closeButton: false,
  //     });
  //   } catch (error) {
  //     toast.custom(
  //       <CustomToast
  //         message="Error occurred while reject customer"
  //         toast="error"
  //       />,
  //       {
  //         closeButton: false,
  //       }
  //     );
  //   }
  //   setLoaderApprove((prevState) => ({
  //     ...prevState,
  //     reject: false,
  //   }));
  // };

  // const handleActionClick = async (actionName) => {
  //   if (actionName === "New Entry") {
  //     nav("addpayable", {
  //       replace: true,
  //       state: { formAction: "add" },
  //     });
  //   }
  // };

  useEffect(() => {
    getFirstError(formik.errors);
  }, [formik.errors]);
  const payableRef = useRef(null);

  useEffect(() => {
    if (payableRef.current) {
      payableRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!actionsSelector.view) {
      dispatch(formView("card"));
    }
  }, [actionsSelector.view, dispatch]);

  const query = {
    page: actionsSelector?.pagination?.page + 1,
    size: actionsSelector?.pagination?.pageSize,
    sortBy:
      actionsSelector.sortModel.length > 0
        ? actionsSelector.sortModel[0].field
        : actionsSelector?.sortBy?.split("*")[0],
    sortOrder:
      actionsSelector.sortModel.length > 0
        ? actionsSelector?.sortModel[0]?.sort
        : actionsSelector?.sortBy?.split("*")[1] || "",
  };

  const payload = Object.entries(actionsSelector?.formData)
    .filter(([key, value]) => value)
    .map(([key, value]) => {
      return {
        fieldName: key,
        operator: "=",
        value: value,
        logicalOperator: "and",
      };
    });
  Boolean(actionsSelector?.status?.length > 0) &&
    payload.push({
      fieldName: "status",
      operator: "=",
      value: actionsSelector?.status[0],
      logicalOperator: "and",
    });

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
        // width: "300px",
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

  const invoiceTypeData = [
    {
      label: "Tax",
      value: "Tax",
    },
    {
      label: "Performa",
      value: "Performa",
    },
  ];
  //
  const [chargesData, setChargesData] = useState([]);
  const [togglePayEntry, setToggleNotes] = useState(false);
  const [selectedPayEntry, setSelectedNote] = useState(null);

  const disabled = formik?.values?.statusCode === -3;

  const handleEditClick = (note) => {
    setSelectedNote(note);
    setToggleNotes(true);
  };

  const handleTogglePayEntry = () => {
    setToggleNotes((prev) => !prev);
    if (togglePayEntry) {
      setSelectedNote(null);
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
    setSelectedNote(null);
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = chargesData.filter((note) => note.id !== id);
    setChargesData(updatedNotes);
    formik.setFieldValue("chargesData", updatedNotes);
    localStorage.setItem("chargesData", JSON.stringify(updatedNotes));
  };

  const handleFetchPayable = () => {
    const storePayableData =
      JSON.parse(localStorage.getItem("paybleDetails")) || [];
    const apiPayableData = formik?.values?.chargesData || [];
    const appendData = [...apiPayableData, ...storePayableData].reduce(
      (acc, pay) => {
        if (!acc.some((n) => n.id === pay.id)) {
          acc.push(pay);
        }
        return acc;
      },
      []
    );
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
      renderCell: (params) => {
        const createdBy = params.row?.new
          ? localStorage.getItem("userId") || "Unknown User"
          : params.row?.createdBy || "";

        return <span>{createdBy}</span>;
      },
    },

    {
      flex: 1,
      field: "chargeName",
      headerName: "Charge Name",
      headerAlign: "center",
      align: "center",
      editable: false,
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
        <IconButton color="white" onClick={handleTogglePayEntry}>
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
              <Box sx={{ width: "40%", paddingRight: 2 }}>
                <Grid container sx={{ padding: 0, margin: 0 }}>
                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <SelectBox
                      label="Invoice Type*"
                      id="invoiceType"
                      options={invoiceTypeData}
                      value={formik.values.invoiceType}
                      error={formik.errors.invoiceType}
                      onChange={formik.handleChange}
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
                      inputRef={FieldRef}
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
                      inputRef={FieldRef}
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
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <InputBox
                      label="Ex. Rate"
                      id="exchangeRate"
                      value={formik.values.exchangeRate}
                      error={formik.errors.exchangeRate}
                      onChange={formik.handleChange}
                      inputRef={payableRef}
                      disabled={getFormData?.currency === "TZS"}
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
                        value={getAmountData?.amount}
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
                            ? getAmountData?.amount * 1
                            : getAmountData?.amount *
                                Number(getFormData?.exchangeRate) || 0
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
                        value={getAmountData?.vatAmount}
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
                            ? getAmountData?.vatAmount * 1
                            : getAmountData?.vatAmount *
                                getFormData?.exchangeRate || 0
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
                        value={getAmountData?.withHoldingAmount}
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
                            ? getAmountData?.withHoldingAmount * 1
                            : getAmountData?.withHoldingAmount *
                                getFormData?.exchangeRate || 0
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
                        value={getAmountData?.totalAmount}
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
                            ? getAmountData?.totalAmount * 1
                            : getAmountData?.totalAmount *
                                getFormData?.exchangeRate || 0
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
                  <IconButton onClick={handleTogglePayEntry}>
                    <AddIcon color="primary" />
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
                    //
                    chargesData={chargesData}
                    PAYABLE_COLUMNS={PAYABLE_COLUMNS}
                  />
                </Box>
              </Box>
            )}

            {page === "payable" && (
              <>
                <Box sx={{ display: "flex", gap: "10px", padding: "15px" }}>
                  <OutlinedButton
                    sx={{ fontWeight: "500" }}
                    onClick={() => nav("documentation/paybleEntry")}
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
                    {isLoading && <CircularProgress size={20} color="white" />}
                    Add
                  </ThemeButton>
                </Box>

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
          </TabPanel>

          {/* <TabPanel value="2" sx={{ padding: "0px" }}>
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
              page="job-detail"
              service={menuConfigUrl.document}
            />
          </TabPanel> */}
        </TabContext>
      </Box>

      <AddPayableEntryModal
        togglePayEntry={togglePayEntry}
        handleTogglePayEntry={handleTogglePayEntry}
        formik={formik}
        onAddPayEntry={handleAddPayEntry}
        selectedPayEntry={selectedPayEntry}
      />
    </>
  );
}
