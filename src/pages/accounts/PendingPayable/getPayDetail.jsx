import { CircularProgress, Grid } from "@mui/material";
import { Stack } from "@mui/material";
import { useFormik } from "formik";
import Tooltip from "@mui/material/Tooltip";
import * as Yup from "yup";
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
import FormAutoComplete from "../../../components/common/AutoComplete/FormAutoComplete";
import SelectBox from "../../../components/common/SelectBox";
import ApiManager from "../../../services/ApiManager";
import { formatIndianCurrency } from "../../../components/utils/utils";

export default function GetPayDetails({
  initialValues,
  page,
  viewPage,
  type = "notcopy",
  onClose,
  refetch,
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
  const validationSchema = Yup.object({
    currency: Yup.string().required("Currency is required!"),
    paymentType: Yup.string().required("Payment Type is required!"),
    paymentDate: Yup.string().required("Payment Date is required!"),
    bankName: Yup.string().when("paymentType", {
      is: (val) => val === "Cheque",
      then: () =>
        Yup.string().required(
          "Bank Name is required when payment type is Cheque"
        ),
      otherwise: () => Yup.string().nullable(),
    }),

    chequeNo: Yup.string().when("paymentType", {
      is: (val) => val === "Cheque",
      then: () =>
        Yup.string().required(
          "Cheque No is required when payment type is Cheque"
        ),
      otherwise: () => Yup.string().nullable(),
    }),

    chequeDate: Yup.string().when("paymentType", {
      is: (val) => val === "Cheque",
      then: () =>
        Yup.string().required(
          "Cheque Date is required when payment type is Cheque"
        ),
      otherwise: () => Yup.string().nullable(),
    }),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          id: values?.id || "",
          vendorName: values?.vendorName || "",
          usdAmount: values?.usdAmount || 0,
          localAmount: values?.localAmount || 0,
          paymentType: values?.paymentType || "",
          paymentDate: values?.paymentDate || new Date().toISOString(),
          currency: values?.currency || "",
          bankName: values?.bankName || "",
          chequeNo: values?.chequeNo || "",
          chequeDate: values?.chequeDate || "",
          usdAmountToBePaid: values?.usdAmountToBePaid || 0,
          localAmountToBePaid: values?.localAmountToBePaid || 0,
          bankCharges: values?.bankCharges || "",
        };
        const multiplePayload = {
          paybleIds: values?.paybleIds || [],
          payment: payload,
        };
        if (initialValues?.multipleSelected === true) {
          const res = await ApiManager.paySelectedIdsHandler(multiplePayload);
          if (res.success) {
            const message = res.message;
            toast.custom(<CustomToast message={message} toast="success" />);
            onClose(); // Close modal after successful update
            refetch();
          } else {
            console.error("Failed to pay", res);
          }
        } else {
          const res = await ApiManager.paySingle(values.id, payload);
          if (res.success) {
            const message = res.message;
            toast.custom(<CustomToast message={message} toast="success" />);
            onClose(); // Close modal after successful update
            refetch();
          } else {
            console.error("Failed to pay", res);
          }
        }
      } catch (error) {
        toast.custom(
          <CustomToast message={"Something went wrong!"} toast="error" />
        );
      }
    },
  });

  const { data: customerSettingsData } =
    useGetOptionsSettingsQuery("customer_settings");
  const { data: payableSettingData } =
    useGetOptionsSettingsQuery("payble_settings");
  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("common_settings");

  useEffect(() => {
    if (
      customerSettingsData?.body ||
      jobSettingData?.body ||
      payableSettingData?.body ||
      optionsSettingsData?.body
    ) {
      setDropdownData({
        ...customerSettingsData?.body,
        ...jobSettingData?.body,
        ...payableSettingData?.body,
        ...optionsSettingsData?.body,
      });
    }
  }, [customerSettingsData, payableSettingData, optionsSettingsData]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiManager.fetchAutoCompleteData(
          "",
          "COMPANY_CODE"
        );
        const backendData = await response.body;

        // Extract backend currencies safely
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
                    <Tooltip
                      title={formik.values.paybleRefNum || ""}
                      arrow
                      placement="top"
                    >
                      <div>
                        <InputBox
                          label="Voucher No"
                          id="paybleRefNum"
                          value={formik.values.paybleRefNum}
                          error={formik.errors.paybleRefNum}
                          onChange={formik.handleChange}
                          disabled={true}
                        />
                      </div>
                    </Tooltip>
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <InputBox
                      label="Line/Agent Name"
                      id="vendorName"
                      value={formik.values.vendorName}
                      error={formik.errors.vendorName}
                      onChange={formik.handleChange}
                      disabled={true}
                      // inputRef={payableRef}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <InputBox
                      label="Amount USD"
                      id="usdAmount"
                      value={formatIndianCurrency(formik.values.usdAmount)}
                      error={formik.errors.usdAmount}
                      onChange={formik.handleChange}
                      disabled={true}
                      // onChange={(e) => {
                      //   const value = e.target.value;
                      //   formik.setFieldValue(
                      //     "usdAmount",
                      //     value === "" ? "" : parseFloat(value)
                      //   );
                      // }}
                      // inputRef={payableRef}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <InputBox
                      label="Amount INR"
                      id="localAmount"
                      value={formatIndianCurrency(formik.values.localAmount)}
                      error={formik.errors.localAmount}
                      onChange={formik.handleChange}
                      disabled={true}
                      //  onChange={(e) => {
                      //     const value = e.target.value;
                      //     formik.setFieldValue(
                      //       "localAmount",
                      //       value === "" ? "" : parseFloat(value)
                      //     );
                      //   }}
                      // inputRef={payableRef}
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
                      inputRef={payableRef}
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
                      options={payableSettingData?.body?.paymentType}
                      value={formik.values.paymentType}
                      error={formik.errors.paymentType}
                      onChange={(e) => {
                        const value = e.target.value;
                        formik.setFieldValue("paymentType", value);

                        if (value !== "Cheque") {
                          // Clear cheque-related fields when changing from Cheque to something else
                          formik.setFieldValue("bankName", "");
                          formik.setFieldValue("chequeNo", "");
                          formik.setFieldValue("chequeDate", "");
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <FormAutoComplete
                      label="Bank Name"
                      id="bankName"
                      suggestionName="bank_name"
                      value={formik.values.bankName}
                      error={formik.errors.bankName}
                      onChange={formik.handleChange}
                      disabled={
                        formik.values.paymentType === "Cheque" ? false : true
                      }
                    ></FormAutoComplete>
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <InputBox
                      label="Cheque No."
                      id="chequeNo"
                      value={formik.values.chequeNo}
                      error={formik.errors.chequeNo}
                      onChange={formik.handleChange}
                      disabled={
                        formik.values.paymentType === "Cheque" ? false : true
                      }
                      // inputRef={payableRef}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <DateTimeField
                      label="Cheque Date"
                      name="chequeDate"
                      id="chequeDate"
                      disabled={
                        formik.values.paymentType === "Cheque" ? false : true
                      }
                      value={formik.values.chequeDate}
                      error={formik.errors.chequeDate}
                      onChange={formik.setFieldValue}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <InputBox
                      label="Amount to be paid (USD)"
                      id="usdAmountToBePaid"
                      value={formik.values.usdAmountToBePaid}
                      error={formik.errors.usdAmountToBePaid}
                      onChange={(e) => {
                        const usd = parseFloat(e.target.value) || 0;
                        if (usd > formik.values.usdAmount) {
                          toast.error(
                            "USD amount to be paid cannot exceed the total USD amount."
                          );
                          return;
                        }
                        const tzs = usd * (formik.values.exchangeRate || 1);

                        formik.setFieldValue("usdAmountToBePaid", usd);
                        formik.setFieldValue(
                          "localAmountToBePaid",
                          parseFloat(tzs)
                        );
                      }}
                      disabled={
                        initialValues?.multipleSelected === true &&
                        initialValues?.paybleIds.length > 1
                          ? true
                          : false
                      }
                      // inputRef={payableRef}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <InputBox
                      label="Amount to be paid (INR)"
                      id="localAmountToBePaid"
                      value={formik.values.localAmountToBePaid}
                      error={formik.errors.localAmountToBePaid}
                      onChange={(e) => {
                        const tzs = parseFloat(e.target.value) || 0;
                        const usd = tzs / (formik.values.exchangeRate || 1);
                        if (tzs > formik.values.localAmount) {
                          toast.error(
                            "INR amount to be paid cannot exceed the total INR amount."
                          );
                          return;
                        }
                        formik.setFieldValue("localAmountToBePaid", tzs);
                        formik.setFieldValue(
                          "usdAmountToBePaid",
                          parseFloat(usd)
                        );
                      }}
                      disabled={
                        initialValues?.multipleSelected === true &&
                        initialValues?.paybleIds.length > 1
                          ? true
                          : false
                      }
                      // inputRef={payableRef}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} paddingLeft={2} marginTop={2}>
                    <InputBox
                      label="Bank Charges"
                      id="bankCharges"
                      value={formik.values.bankCharges}
                      error={formik.errors.bankCharges}
                      onChange={formik.handleChange}
                      // inputRef={payableRef}
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
