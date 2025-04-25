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
import { CustomerValidationSchema } from "../../../components/screen/code/customer/validationSchema";
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
import { USER_MANAGEMENT_COLUMNS } from "../../../data/columns/user";
import { useFetchUsersQuery } from "../../../store/api/userDataApi";
import { getUserListGridActions } from "../../../components/screen/user-management/action";
import { dashboardSetPagination } from "../../../store/freatures/dashboardSlice";
import DateTimeField from "../../../components/common/DateTime/DateTimeField";
import FormAutoCompleteWithLoader from "../../../components/common/AutoComplete/FormAutoCompletewithLoader";
import SelectBox from "../../../components/common/SelectBox";

export default function AddEditForm({ initialValues, page, type = "notcopy" }) {
  const [addCustomer, { isLoading }] = useAddCustomerMutation();
  const actionsSelector = useSelector((s) => s?.payableAction);
  const [loaderApprove, setLoaderApprove] = useState({
    approve: false,
    reject: false,
  });
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

  const handleActionClick = async (actionName) => {
    if (actionName === "New Entry") {
      nav("addpayable", {
        replace: true,
        state: { formAction: "add" },
      });
    }
  };

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

  const { data: UserData } = useFetchUsersQuery({
    params: query,
    payload,
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
            <Box sx={{ width: "40%", paddingRight: 2 }}>
              <Grid container sx={{ padding: 0, margin: 0 }}>
                <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                  <InputBox
                    label="Invoice Type*"
                    id="invoiceType"
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
                  <InputBox
                    label="Vendor Invoice Date"
                    id="vendorInvoiceDate"
                    value={formik.values.vendorInvoiceDate}
                    error={formik.errors.vendorInvoiceDate}
                    onChange={formik.handleChange}
                    inputRef={payableRef}
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
                    id="exChangeRate"
                    value={formik.values.exChangeRate}
                    error={formik.errors.exChangeRate}
                    onChange={formik.handleChange}
                    inputRef={payableRef}
                  />
                </Grid>

                <Grid item xs={12} lg={12} paddingLeft={1} marginTop={2}></Grid>
              </Grid>

              <PopupAlert alertConfig={alertConfig} />
            </Box>

            <Box sx={{ width: "60%", padding: 2 }}>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  overflow: "hidden",
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
                    <Typography>{"Invoice Currency (TZS/USD)"}</Typography>
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

                  <Grid item xs={12} lg={4}>
                    <Typography>VAT</Typography>
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

                  <Grid item xs={12} lg={4}>
                    <Typography>With holding Tax</Typography>
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

                  <Grid item xs={12} lg={4}>
                    <Typography>Net amount payable</Typography>
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
                <IconButton onClick={() => dispatch(formView("grid"))}>
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
                columns={USER_MANAGEMENT_COLUMNS}
                count={20}
                handlePage={handlePage}
                data={UserData?.body?.data}
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
                <PayableEntryList formik={formik} dropdownData={dropdownData} />
              </Box>
            </Box>
          )}

          {page === "payable" && (
            <>
              <Box sx={{ display: "flex", gap: "10px", padding: "15px" }}>
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
      </TabContext>
    </Box>
  );
}
