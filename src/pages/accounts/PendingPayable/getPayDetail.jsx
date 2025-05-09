import { CircularProgress, Grid } from "@mui/material";
import { Stack } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import InputBox from "../../../components/common/InputBox";
import { ThemeButton } from "../../../components/common/Button";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  useAddPaybleEntryMutation,
  useUpdatePaybleEntryMutation,
} from "../../../store/api/payableApi";

import { useNavigate } from "react-router-dom";
import { useGetOptionsSettingsQuery } from "../../../store/api/settingsApi";
import CustomToast from "../../../components/common/Toast/CustomToast";
import getFirstError from "../../../components/common/FieldToastError";
import EditIconForHeader from "../../../components/common/commonIcons/EditIcons/EditIconForHeader";
import { formView } from "../../../store/freatures/payableEntrySlice";
import { useDispatch, useSelector } from "react-redux";
import DateTimeField from "../../../components/common/DateTime/DateTimeField";
import FormAutoCompleteWithLoader from "../../../components/common/AutoComplete/FormAutoCompletewithLoader";
import SelectBox from "../../../components/common/SelectBox";

import { payableValidationSchema } from "../../payable/Actions/ValidationSchema";

export default function GetPayDetails({
  initialValues,
  page,
  viewPage,
  type = "notcopy",
}) {
  //
  const invoiceTypeRef = useRef(null);
  const payableRef = useRef(null);
  const [addPaybleEntry, { isLoading }] = useAddPaybleEntryMutation();
  const [updatePaybleEntry, { isUpdateLoading }] =
    useUpdatePaybleEntryMutation();

  const { data: jobSettingData } = useGetOptionsSettingsQuery("job_settings");
  const [mergedCurrencyOptions, setMergedCurrencyOptions] = useState([]);
  const actionsSelector = useSelector((s) => s?.payableAction);

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
    if (
      viewPage === "view" ||
      formik?.values?.statusCode === -3 ||
      formik?.values?.statusCode === 1
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [viewPage]);

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

  const { data: customerSettingsData } =
    useGetOptionsSettingsQuery("customer_settings");
  const { data: payableSettingData } =
    useGetOptionsSettingsQuery("payble_settings");

  useEffect(() => {
    if (
      customerSettingsData?.body ||
      jobSettingData?.body ||
      payableSettingData?.body
    ) {
      setDropdownData({
        ...customerSettingsData?.body,
        ...jobSettingData?.body,
        ...payableSettingData?.body,
      });
    }
  }, [customerSettingsData, payableSettingData]);

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

  const [chargesData, setChargesData] = useState([]);
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

  return (
    <>
      <Box sx={{ width: "100%", padding: 0, margin: 0 }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab
                label="Payments Details"
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
              <Box sx={{ width: "100%", paddingRight: 2 }}>
                <Grid container sx={{ padding: 0, margin: 0 }}>
                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <SelectBox
                      label="Voucher No."
                      id="voucherNo"
                      options={dropdownData?.voucherNo}
                      value={formik.values.voucherNo}
                      error={formik.errors.voucherNo}
                      onChange={formik.handleChange}
                      inputRef={invoiceTypeRef}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <InputBox
                      label="Line Agent Name"
                      id="lineAgentName"
                      value={formik.values.lineAgentName}
                      error={formik.errors.lineAgentName}
                      onChange={formik.handleChange}
                      inputRef={payableRef}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <InputBox
                      label="Amount USD"
                      id="usdAmount"
                      value={formik.values.usdAmount}
                      error={formik.errors.usdAmount}
                      onChange={formik.handleChange}
                      inputRef={payableRef}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <InputBox
                      label="Amount TZS"
                      id="usdAmount"
                      value={formik.values.usdAmount}
                      error={formik.errors.usdAmount}
                      onChange={formik.handleChange}
                      inputRef={payableRef}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <DateTimeField
                      label="Payment Date"
                      name="paymentDate"
                      id="paymentDate"
                      value={formik.values.paymentDate}
                      error={formik.errors.paymentDate}
                      onChange={formik.setFieldValue}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <SelectBox
                      label="Payment In Currency"
                      id="currency"
                      options={mergedCurrencyOptions}
                      value={formik.values.currency}
                      error={formik.errors.currency}
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <SelectBox
                      label="Payment Type"
                      id="paymentType"
                      options={mergedCurrencyOptions}
                      value={formik.values.paymentType}
                      error={formik.errors.paymentType}
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <SelectBox
                      label="Bank Name"
                      id="currency"
                      options={mergedCurrencyOptions}
                      value={formik.values.currency}
                      error={formik.errors.currency}
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <SelectBox
                      label="Cheque No."
                      id="chequeNo"
                      options={mergedCurrencyOptions}
                      value={formik.values.chequeNo}
                      error={formik.errors.chequeNo}
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <SelectBox
                      label="Cheque Date"
                      id="chequeDate"
                      options={mergedCurrencyOptions}
                      value={formik.values.chequeDate}
                      error={formik.errors.chequeDate}
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <InputBox
                      label="Amount to be paid(USD)"
                      id="amountPaidToUSD"
                      value={formik.values.amountPaidToUSD}
                      error={formik.errors.amountPaidToUSD}
                      onChange={formik.handleChange}
                      inputRef={payableRef}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <InputBox
                      label="Amount to be paid(TZS)"
                      id="amountPaidToTZS"
                      value={formik.values.amountPaidToTZS}
                      error={formik.errors.amountPaidToTZS}
                      onChange={formik.handleChange}
                      inputRef={payableRef}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <InputBox
                      label="Bank Charges"
                      id="bankCharges"
                      value={formik.values.bankCharges}
                      error={formik.errors.bankCharges}
                      onChange={formik.handleChange}
                      inputRef={payableRef}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>

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
                      Pay
                    </ThemeButton>
                  </Stack>
                </Stack>
              </Grid>
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
}
