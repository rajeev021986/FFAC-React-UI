import toast from "react-hot-toast";
import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress, InputAdornment, Tooltip } from "@mui/material";
import { Grid, Stack, TextField } from "@mui/material";
// import { JobEntryValidationSchema } from "./validationSchema";
import ApiManager from "../../services/ApiManager";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// Components
import { OutlinedButton, ThemeButton } from "../../components/common/Button";
import DateTimeField from "../../components/common/DateTime/DateTimeField";
// import CommonTabForm from "./TabForm";
// import AddRateModal from "./RateModal";
import InputBox from "../../components/common/InputBox";
import EditIconForHeader from "../../components/common/commonIcons/EditIcons/EditIconForHeader";
import DocumentIcon from "../../components/common/commonIcons/DocumentIcons/DocumentIcon";
import AuditIcon from "../../components/common/commonIcons/AuditIcon/AuditIcon";
import SelectBox from "../../components/common/SelectBox";
import PopupAlert from "../../components/common/Alert/PopupAlert";
import CustomToast from "../../components/common/Toast/CustomToast";
import FormAutoCompleteWithLoader from "../../components/common/AutoComplete/FormAutoCompletewithLoader";

// API Function Helper
import { useGetOptionsSettingsQuery } from "../../store/api/settingsApi";
import {
  useAddJobEntryMutation,
  useUpdateJobEntryMutation,
} from "../../store/api/jobEntryApi";

import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import { RECEIPTS_ENTRY_COLUMNS } from "../../data/columns/receiptsEntry";
import FormAutoCompleteWithExchangeLoader from "../../components/common/AutoComplete/FormAutoCompleteWithExchangeLoader";
import { formatIndianCurrency } from "../../components/utils/utils";
import {
  useAddCustomerDetailsMutation,
  useAddReceivableReceiptsDetailsMutation,
  useAddReceivableReceiptsMutation,
  useFetchCustomerReceiptsMutation,
  useUpdateReceivableReceiptsMutation,
} from "../../store/api/receiptsApi";
import { useSelector } from "react-redux";
import getFirstError from "../../components/common/FieldToastError";
import { GetAutoCompleteDataWithLoader } from "../../components/utils/GetAutoCompleteDataWithLoader";
import { StyledDataGrid } from "../../components/common/Grid/styles";

export default function ReceiptsEntryForm({
  initialValues,
  page,
  type = "notcopy",
  getUserId,
}) {
  const location = useLocation();
  const primaryColor = useSelector((state) => state.dashboard.theme);
  const [loading, setLoading] = useState(false);

  const [addJobEntry, { isLoading }] = useAddJobEntryMutation();
  const [updateJobEntry, { isLoading: loadingUpdate }] =
    useUpdateJobEntryMutation();
  const [addReceivableReceiptsDetails] =
    useAddReceivableReceiptsDetailsMutation();
  const [updateReceivableReceipts] = useUpdateReceivableReceiptsMutation();
  const [addReceivableReceipts] = useAddReceivableReceiptsMutation();

  const { fetchCustomerReceipts } = useFetchCustomerReceiptsMutation();

  const [mergedCurrencyOptions, setMergedCurrencyOptions] = useState([]);

  const [dropdownData, setDropdownData] = useState({});
  const [rejectError, setRejectError] = useState(false);
  const [showDefaultCurrency, setshowDefaultCurrency] = useState("");
  const [receiptsData, setReceiptsData] = useState([]);
  const [isSelectedShipmentTypeValid, setIsSelectedShipmentTypeValid] =
    useState(false);
  const nav = useNavigate();
  console.log(receiptsData, "receiptsData");
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
  const handlePage = (params) => {
    // let { page, pageSize } = params;
    // dispatch(setPagination({ page, pageSize }));
  };

  const [apiCalled, setApiCalled] = useState(false);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnChange: false,
    //  validationSchema: JobEntryValidationSchema(),
    onSubmit: async (values) => {
      if (isLoading) {
        return;
      }
      values.details = getSelectedRows();

      let hasError = false;
      console.log(values, "values");

      if (!values.id || type == "copy") {
        if (hasError) return;

        try {
          let response = await addReceivableReceipts({
            ...values,
          }).unwrap();
          const message = response.message;
          if (response.code == "SUCCESS") {
            toast.custom(<CustomToast message={message} toast="warn" />, {
              closeButton: false,
            });
            nav("/app/documentation/jobEntry");
          } else {
            toast.custom(<CustomToast message={message} toast="error" />, {
              duration: 1000, // 2 seconds
              closeButton: false,
            });
          }
        } catch (error) {
          if (error.status === 409) {
            const message = error.data.message;
            toast.custom(<CustomToast message={message} toast="error" />, {
              duration: 1000, // 2 seconds

              closeButton: false,
            });
          } else {
            toast.custom(
              <CustomToast
                message="An error occurred while submitting the form."
                toast="error"
              />,
              {
                duration: 2000, // 2 seconds

                closeButton: false,
              }
            );
          }
        }
      } else {
        try {
          if (hasError) return;

          let response = await updateReceivableReceipts({
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
  useEffect(() => {
    const {
      receivablePartyId,
      currency,
      upTo,
      exchangeRate,
      receivablePartyName,
    } = formik.values;

    const allFilled =
      receivablePartyId &&
      receivablePartyName &&
      currency &&
      upTo &&
      exchangeRate !== null &&
      exchangeRate !== "";

    if (allFilled) {
      const payload = {
        receivablePartyId,
        receivablePartyName,
        currency,
        upTo,
        exchangeRate,
      };

      addReceivableReceiptsDetails(payload)
        .unwrap()
        .then((res) => {
          console.log("Customer added:", res);

          setReceiptsData(res);
        })
        .catch((err) => {
          console.error("Error adding customer:", err);
        });
    }
  }, [
    formik.values.receivablePartyId,
    formik.values.currency,
    formik.values.upTo,
    formik.values.exchangeRate,
    // apiCalled,
  ]);
  const gridRef = useRef();

  const [isDisabled, setIsDisabled] = useState(false);
  const getPage = location?.pathname.split("/").slice(-1)[0];
  useEffect(() => {
    const shouldDisable =
      initialValues?.statusCode === -3 &&
      !(getPage === "newEntry" || getPage === "approveJobRequest");
    setIsDisabled(shouldDisable);
  }, [initialValues?.statusCode, getPage]);

  const customerNameRef = useRef(null);

  useEffect(() => {
    if (customerNameRef.current) {
      customerNameRef.current.focus();
    }
  }, []);

  const [selectedIds, setSelectedIds] = useState([]);

  const FieldRef = useRef(null);
  useEffect(() => {
    if (FieldRef.current) {
      FieldRef.current.focus();
    }
  }, []);
  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("common_settings");
  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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
  const handleSelectRow = (data) => {
    console.log(data, "newData");
  };

  const [editedRows, setEditedRows] = useState({});
  const getSelectedRows = () => {
    const allRows = receiptsData?.body?.details || [];
    return selectedIds
      .map((id) => {
        return editedRows[id] || allRows.find((row) => row.uiId === id);
      })
      .filter(Boolean);
  };


  const receiptsEntryColumns = [
    {
      field: "Select",
      headerName: "Select",
      width: 80,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <input
          type="checkbox"
          style={{ cursor: "pointer" }}
          checked={selectedIds.includes(params.row.uiId)}
          onChange={() => {
            gridRef.current?.commitCellChanges();
            getSelectedRows();
            handleCheckboxChange(params.row.uiId);
          }}
        />
      ),
    },
    {
      flex: 1,
      field: "refNo",
      headerName: "Ref.No.",
      width: 110,
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    //   {
    //   flex: 1,
    //   field: "receivablePartyName",
    //   headerName: "Customer Name",
    //   width: 110,
    //   headerAlign: "center",
    //   align: "center",
    //   editable: false,
    // },

    {
      flex: 1,
      field: "date",
      headerName: "Date",
      width: 110,
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "receivableAmount",
      headerName: "Receivable Amount.",
      width: 110,
      headerAlign: "center",
      align: "center",
      minWidth: 100,

      editable: false,
    },
    {
      flex: 1,
      field: "amount",
      headerName: "Rec Amount.",
      width: 110,
      headerAlign: "center",
      align: "center",
      minWidth: 100,

      editable: true,
    },

    {
      flex: 1,
      field: "withHoldingAmount",
      headerName: "W.Tax.Recov.",
      width: 110,
      minWidth: 100,

      headerAlign: "center",
      align: "center",
      editable: true,
      // renderCell: (params) => (
      //   <div className="word-wrap-cell">{params?.value || ""}</div>
      // ),
    },
  ];
  const getFormData = formik?.values;
  console.log(getFormData, "getFormData");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await ApiManager.fetchAutoCompleteData(
          "",
          "EXCHANGE_RATE",
          formik.values.currency
        );
        console.log(response?.body[0], "response");
        formik.setFieldValue(
          "exchangeRate",
          response?.body[0]?.usd_exchange || ""
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formik.values.currency]);
  useEffect(() => {
    if (
      (getFormData?.currency === "TZS" || getFormData?.currency === "INR") &&
      !formik.values.exchangeRate
    ) {
      formik.setFieldValue("exchangeRate", "1");
    }
  }, [getFormData?.currency]);
  console.log(formik.values, "manish");

  return (
    <>
      <Box sx={{ width: "100%", typography: "body1", margin: 0, padding: 0 }}>
        <TabContext value={value}>
          <Box sx={{ borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab
                label="Receipts Payment Details"
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

          <Grid padding={2} container rowSpacing={2} columnSpacing={3}>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <FormAutoCompleteWithLoader
                label="Receipt Party Name*"
                id="receivablePartyId"
                value={{
                  receivablePartyId: formik.values.receivablePartyId,
                  receivablePartyName: formik.values.receivablePartyName,
                }}
                error={formik.errors.receivablePartyId}
                idKey="receivablePartyId"
                nameKey="receivablePartyName"
                onChange={(selected) => {
                  formik.setFieldValue(
                    "receivablePartyId",
                    selected.receivablePartyId || ""
                  );
                  formik.setFieldValue(
                    "receivablePartyName",
                    selected.receivablePartyName || ""
                  );
                }}
                inputRef={FieldRef}
                suggestionName="customer_name"
                disabled={isDisabled}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <SelectBox
                label="Currency"
                id="currency"
                options={mergedCurrencyOptions}
                value={formik.values.currency}
                error={formik.errors.currency}
                onChange={(e) => {
                  const value = e.target.value;
                  formik.setFieldValue("currency", value);
                }}
                disabled={isDisabled}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <DateTimeField
                name="upTo"
                label="UPTO*"
                id="upTo"
                value={formik.values.upTo}
                error={formik.errors.upTo}
                onChange={formik.setFieldValue}
                inputRef={FieldRef}
                disabled={isDisabled}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
              <InputBox
                label="Ex. Rate"
                id="exchangeRate"
                value={
                  getFormData?.currency == "TZS" ||
                  getFormData?.currency == "INR"
                    ? "1"
                    : formatIndianCurrency(formik.values.exchangeRate)
                }
                // value={formik.values.exchangeRate}
                error={formik.errors.exchangeRate}
                onChange={formik.handleChange}
                // inputRef={payableRef}
                disabled={true}
              />
            </Grid>
          </Grid>
          <Grid padding={2} container rowSpacing={2} columnSpacing={3}>
            {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="REC.OUTSTANDING AMOUNT."
                id="recOutstandingAmount"
                value={formik.values.recOutstandingAmount}
                error={formik.errors.recOutstandingAmount}
                onChange={formik.handleChange}
                disabled={isDisabled}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={1} xl={2}>
              <InputBox
                label="DR."
                disabled={true}
                id="dr"
                value={"dr" || formik.values.dr}
                error={formik.errors.dr}
                onChange={formik.handleChange}
                // disabled={isDisabled}
              />
            </Grid> */}
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="REC. AMOUNT"
                id="recAmount"
                value={formik.values.recAmount}
                error={formik.errors.recAmount}
                onChange={formik.handleChange}
                disabled={isDisabled}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <span
                        style={{
                          fontWeight: 500,
                          color: "#555",
                          padding: "12px",
                        }}
                      >
                        Dr
                      </span>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <DateTimeField
                name="Date"
                label=" Date"
                id="date"
                value={formik.values.date}
                error={formik.errors.date}
                onChange={formik.setFieldValue}
                inputRef={FieldRef}
                disabled={isDisabled}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <SelectBox
                label="BANK CHARGES"
                id="chargeType"
                //   options={jobSettingData?.body.bankCharge}
                value={formik.values.chargeType}
                error={formik.errors.chargeType}
                onChange={formik.handleChange}
                disabled={isDisabled}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
              <InputBox
                label="charge"
                id="charge"
                value={formik.values.charge}
                error={formik.errors.charge}
                onChange={formik.handleChange}
                disabled={isDisabled}
              />
            </Grid>
          </Grid>

          <Grid padding={2} container rowSpacing={2} columnSpacing={3}>
            {/* Select */}

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="REC AMOUNT."
                id="recAmount"
                value={formik.values.recAmount}
                error={formik.errors.recAmount}
                onChange={formik.handleChange}
                disabled={isDisabled}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
              <InputBox
                label="WithHolding Tax Recov."
                id="withHoldingTaxRecov"
                value={formik.values.withHoldingTaxRecov}
                error={formik.errors.withHoldingTaxRecov}
                onChange={formik.handleChange}
                disabled={isDisabled}
              />
            </Grid>
          </Grid>

          <Accordion
            style={{
              marginTop: "20px",
              boxShadow: "3px 3px 3px 3px rgba(0,0,0,0.1)",
              padding: "10px",
              margin: "12px",
              borderRadius: "10px",
            }}
            defaultExpanded
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box
                sx={{
                  borderBottom: "2px solid #1976d2", // or any color you want
                  width: "fit-content",
                }}
              >
                <Typography
                  style={{
                    color: primaryColor,
                    fontWeight: "bold",
                    paddingLeft: "4px",
                    // borderBottom: 1,
                    // borderColor: "divider",
                  }}
                  variant="h6"
                >
                  Bank Details
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container rowSpacing={2} columnSpacing={3} marginTop={0}>
                <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
                  <SelectBox
                    label="Mode"
                    id="mode"
                    value={formik.values.mode}
                    error={formik.errors.mode}
                    onChange={formik.handleChange}
                    disabled={isDisabled}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <SelectBox
                    label="Bank Name"
                    id="bankName"
                    value={formik.values.bankName}
                    error={formik.errors.bankName}
                    onChange={formik.handleChange}
                    disabled={isDisabled}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
                  <InputBox
                    label="Cheque No."
                    id="chequeNo"
                    value={formik.values.chequeNo}
                    error={formik.errors.chequeNo}
                    onChange={formik.handleChange}
                    disabled={isDisabled}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <DateTimeField
                    name="Date"
                    label="Cheque Date"
                    id="chequeDate"
                    value={formik.values.chequeDate}
                    error={formik.errors.chequeDate}
                    onChange={formik.setFieldValue}
                    inputRef={FieldRef}
                    disabled={isDisabled}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
                  <InputBox
                    label="REC/PAY.AMOUNT."
                    id="recPayAmount"
                    value={formik.values.recPayAmount}
                    error={formik.errors.recPayAmount}
                    onChange={formik.handleChange}
                    disabled={isDisabled}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <TextField
                    label="Remarks"
                    name="remarks"
                    value={formik.values.remarks}
                    error={formik.errors.remarks}
                    onChange={formik.handleChange}
                    rows={1}
                    multiline
                    maxRows={6}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                <PopupAlert alertConfig={alertConfig} />
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Grid
            style={{
              marginTop: "30px",
              boxShadow: "5px 5px 5px 5px rgba(0,0,0,0.1)",
              padding: "10px",
              margin: "12px",
              borderRadius: "10px",
            }}
          >
            <ThemedGrid
              uniqueId="id"
              columns={receiptsEntryColumns}
              count={receiptsData?.body?.totalElements || 0}
              handlePage={handlePage}
              getRowId={(row) => row?.uiId}
              setEditedRows={setEditedRows}
              editedRows={editedRows}
              data={receiptsData?.body?.details || []}
              columnVisibility={{}}
             
              columnVisibilityHandler={() => {}}
              paginationModel={receiptsData.pagination}
              loading={isLoading}
              editable={true}
              storageKey="ReceiptsEntryDataGrid"
            />
          </Grid>
        </TabContext>
      </Box>
      <Grid item xs={12} padding={2} margin={1}>
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
              onClick={() => nav("/app/accounts/operations/receipts")}
            >
              Close
            </OutlinedButton>

            {!initialValues?.id ? (
              <ThemeButton
                onClick={async () => {
                  const errors = await formik.validateForm();

                  if (Object.keys(errors).length > 0) {
                    formik.setTouched(
                      Object.fromEntries(
                        Object.keys(errors).map((key) => [key, true])
                      ),
                      true
                    );
                    getFirstError(errors); // Show toast from here directly
                  } else {
                    formik.handleSubmit(); // Submit if valid
                  }
                }}
                sx={{
                  fontWeight: "500",
                  color: "white !important",
                }}
              >
                {isLoading && <CircularProgress size={20} color="white" />}
                Submit
              </ThemeButton>
            ) : (
              <ThemeButton
                onClick={async () => {
                  const errors = await formik.validateForm();

                  if (Object.keys(errors).length > 0) {
                    formik.setTouched(
                      Object.fromEntries(
                        Object.keys(errors).map((key) => [key, true])
                      ),
                      true
                    );
                    getFirstError(errors);
                  } else {
                    formik.handleSubmit();
                  }
                }}
                sx={{
                  fontWeight: "500",
                  color: "white !important",
                }}
                disabled={isDisabled}
              >
                {isLoading && <CircularProgress size={20} color="white" />}
                Update
              </ThemeButton>
            )}

            {/* Update Job Button */}
          </Stack>
        </Stack>
      </Grid>
    </>
  );
}
