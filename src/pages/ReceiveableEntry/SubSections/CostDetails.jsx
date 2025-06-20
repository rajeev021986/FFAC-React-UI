import React, { useState, useEffect } from "react";
import {
  TextField,
  InputAdornment,
  Tooltip,
  Tab,
  Typography,
  Toolbar,
  AppBar,
  Grid,
} from "@mui/material";
import { Box, IconButton, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import {
  Card,
  CardHeader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import dayjs from "dayjs";
import ClearIcon from "@mui/icons-material/Clear";

// Components
import ThemedGrid from "../../../components/common/Grid/ThemedGrid";
import muiTextFieldStyles from "../../../components/muiTextFieldStyles";
import AddPayableEntryModal from "../AddDetails/AddDebitInvoiceModal";
import useDebounce from "../../../hooks/useDebounce";
import { TabList } from "@mui/lab";
import EditIconForHeader from "../../../components/common/commonIcons/EditIcons/EditIconForHeader";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getTheme } from "../../../config/theme";
import { useGridSelector } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import InputBox from "../../../components/common/InputBox";
import FormAutoCompleteWithLoader from "../../../components/common/AutoComplete/FormAutoCompletewithLoader";
import { useGetOptionsSettingsQuery } from "../../../store/api/settingsApi";
import ApiManager from "../../../services/ApiManager";
import SelectBox from "../../../components/common/SelectBox";
import FormAutoCompleteWithExchangeLoader from "../../../components/common/AutoComplete/FormAutoCompleteWithExchangeLoader";
import { formatIndianCurrency } from "../../../components/utils/utils";
import PopupAlert from "../../../components/common/Alert/PopupAlert";
export default function CostDetails({ formik, selectedInvoiceType }) {
  const getButtonText = () => {
    if (selectedInvoiceType === "tax_invoice") return "Add Invoice";
    if (selectedInvoiceType === "debit_note") return "Add Debit";
    return "Add";
  };
  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("common_settings");
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    title: "",
    message:
      "All the Tax Invoice/Debit Note Details will be cleared if you change currency ",
    severity: "info",
    onConfirm: null,
    onClose: () => setAlertConfig({ ...alertConfig, open: false }),
  });
  const [localPagination, setLocalPagination] = useState({
    page: 0,
    pageSize: 10,
  });
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setsearchValue] = useState("");
  const [mergedCurrencyOptions, setMergedCurrencyOptions] = useState([]);
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
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
    readOnly: false,
  });
  const debounceValue = useDebounce(searchValue, 500);
  const handleAdd = (params) => {
    const rowData = params?.row;
    setModal({
      open: true,
      type: "cost_details",
      data: rowData,
      readOnly: false,
    });
  };

  const costDetailsColumns = [
    {
      field: "add",
      headerName: "Add Entry",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const isPaybleIdInDetails = formik.values.details.some(
          (detail) => detail.paybleDetailId === params.row.paybleDetailId
        );
        // const isEditDisabled = params.row.paybleDetailId === null;
        return (
          <button
            disabled={isPaybleIdInDetails || params.row.paybleDetailId === null}
            onClick={() => {
              if (!isPaybleIdInDetails) handleAdd(params);
            }}
            style={{
              padding: "6px 12px",
              cursor: "pointer",
              backgroundColor:
                isPaybleIdInDetails || params.row.paybleDetailId === null
                  ? "#bdbdbd"
                  : "#1976d2",
              // color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor:
                isPaybleIdInDetails || params.row.paybleDetailId === null
                  ? "not-allowed"
                  : "pointer",
              color: "#fff",
              opacity:
                isPaybleIdInDetails || params.row.paybleDetailId === null
                  ? 0.5
                  : 1,
            }}
          >
            {getButtonText()}
          </button>
        );
      },
    },
    {
      field: "chargeName",
      headerName: "Charge Name",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        const value = params.value || "";
        const truncatedValue =
          value.length > 25 ? value.slice(0, 25) + "..." : value;

        return (
          <Tooltip title={value} arrow>
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
              }}
            >
              {truncatedValue}
            </div>
          </Tooltip>
        );
      },
      headerAlign: "center",
      align: "center",
    },
    {
      field: "paybleRefNo",
      headerName: "Payable Ref No",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <div className="word-wrap-cell">
          <Tooltip title={params.value || ""} arrow>
            <span>{params.value || ""}</span>
          </Tooltip>
        </div>
      ),
      headerAlign: "center",
      align: "center",
    },
    {
      field: "paybleCreatedDate",
      headerName: "Payable Date",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
      },
      headerAlign: "center",
      align: "center",
    },
    {
      field: "paybleAmount",
      headerName: "Debit",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <span>{params.value || 0}</span>,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "receivableRefNo",
      headerName: "Receivable Ref No",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <div className="word-wrap-cell">
          <Tooltip title={params.value || ""} arrow>
            <span>{params.value || ""}</span>
          </Tooltip>
        </div>
      ),
      headerAlign: "center",
      align: "center",
    },
    {
      field: "receivableCreatedDate",
      headerName: "Receivable Date",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
      },
      headerAlign: "center",
      align: "center",
    },
    {
      field: "receivableAmount",
      headerName: "Credit",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <span>{params.value || 0}</span>,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "diff",
      headerName: "Diff",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <span>{params.value || 0}</span>,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "purchaseVNo",
    //   headerName: "Purchase VNo",
    //   flex: 1,
    //   minWidth: 200,
    //   renderCell: (params) => <span>{params.value || ""}</span>,
    //   headerAlign: "center",
    //   align: "center",
    // },
  ];

  useEffect(() => {
    if (debounceValue.trim()) {
      const lowerSearch = debounceValue.toLowerCase();
      const filtered = formik.values.costDetails?.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(lowerSearch)
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(formik.values.costDetails);
    }
  }, [debounceValue, formik.values.costDetails]);

  const paginatedCostDetails = React.useMemo(() => {
    const start = localPagination.page * localPagination.pageSize;
    const end = start + localPagination.pageSize;
    return filteredData.slice(start, end) || [];
  }, [filteredData, localPagination]);

  const handleSearchBar = (e) => {
    setsearchValue(e.target.value);
  };
  const theme = useTheme();
  useEffect(() => {
    const details = formik.values.details || [];

    const totalVat = details.reduce(
      (sum, item) => sum + parseFloat(item.vat || 0),
      0
    );
    const totalReceivable = details.reduce(
      (sum, item) => sum + parseFloat(item.receivableAmount || 0),
      0
    );
    const totalCombined = details.reduce(
      (sum, item) => sum + parseFloat(item.totalAmount || 0),
      0
    );

    formik.setFieldValue("vatAmount", totalVat.toFixed(2));
    formik.setFieldValue("amount", totalReceivable.toFixed(2));
    formik.setFieldValue("totalAmount", totalCombined.toFixed(2));
  }, [formik.values.details]);
  return (
    <>
      <Accordion
        defaultExpanded
        style={{
          marginTop: "10px",
          border: "0px",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          style={{
            // padding:"0"
            margin: "0px",
          }}
        >
          <Toolbar
            sx={{
              minHeight: "10px !important",
              display: "flex",
              borderRadius: "18px !important",
            }}
          >
            <Box style={{ margin: "0px" }}>
              <Typography variant="body1">
                <strong
                  style={{
                    color: theme.palette.primary.main,
                    margin: "0px",
                  }}
                >
                  Cost Details{" "}
                </strong>
              </Typography>
            </Box>
          </Toolbar>
        </AccordionSummary>
        <AccordionDetails>
          <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
            <CardHeader
              sx={{ padding: "8px" }}
              title={
                <Stack direction="row" justifyContent="space-between">
                  <Box sx={{ display: "flex", gap: 2, marginTop: "10px" }}>
                    <TextField
                      hiddenLabel
                      id="search"
                      name="search"
                      label="Search"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={searchValue}
                      onChange={handleSearchBar}
                      sx={{ ...muiTextFieldStyles.root }}
                      InputProps={{
                        endAdornment: searchValue && (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setsearchValue("")}
                              edge="end"
                            >
                              <ClearIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Stack>
              }
            />
            <ThemedGrid
              uniqueId="id"
              columns={costDetailsColumns}
              count={filteredData.length || 0}
              handlePage={(model) =>
                setLocalPagination({
                  page: model.page,
                  pageSize: model.pageSize,
                })
              }
              data={paginatedCostDetails || []}
              columnVisibility={{}}
              columnVisibilityHandler={() => {}}
              paginationModel={localPagination}
              hideColumns={true}
              storageKey="CostListDataGrid"
            />
          </Card>
        </AccordionDetails>
      </Accordion>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          padding: "4px 0",
          margin: 0,
        }}
      >
        <Box sx={{ width: "100%", paddingRight: 2 }}>
          <Grid container sx={{ padding: 0, margin: 0 }}>
            <Grid item xs={12} lg={3} paddingLeft={0} marginTop={2}>
              <FormAutoCompleteWithLoader
                label="Customer Name*"
                id="customerId"
                value={{
                  customerId: formik.values.customerId,
                  customerName: formik.values.customerName,
                }}
                error={formik.errors.customerId}
                idKey="customerId"
                nameKey="customerName"
                onChange={(selected) => {
                  formik.setFieldValue("customerId", selected.customerId || "");
                  formik.setFieldValue(
                    "customerName",
                    selected.customerName || ""
                  );
                }}
                suggestionName="customer_name"
              />
            </Grid>
            <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
              <SelectBox
                label="Currency"
                id="currency"
                options={mergedCurrencyOptions}
                value={formik.values.currency}
                error={formik.errors.currency}
                onChange={(e) => {
                  const value = e.target.value;
                  if (formik.values.currency === value) return;

                  if (!formik.values.currency) {
                    return formik.setFieldValue("currency", value);
                  }
                  if (value === "USD") {
                    formik.setFieldValue("exchangeRate", "");
                  }
                  if (formik.values.details?.length === 0)
                    return formik.setFieldValue("currency", value);
                  setAlertConfig({
                    open: true,
                    title: "Are you sure you want to change currency?",
                    message:
                      "All the Tax Invoice/Debit Note Details will be cleared if you change currency.",
                    severity: "info",
                    confirmText: "Yes",
                    onConfirm: () => {
                      formik.setFieldValue("currency", value);
                      if (value === "USD") {
                        formik.setFieldValue("exchangeRate", "");
                      }
                      if (value === "INR") {
                        formik.setFieldValue("c", "1");
                      }
                      formik.setFieldValue("details", []);
                      setAlertConfig((prev) => ({ ...prev, open: false }));
                    },
                    onClose: () => {
                      setAlertConfig((prev) => ({ ...prev, open: false }));
                    },
                  });
                }}
                disabled={formik.values.id ? true : false}
              />
            </Grid>
            <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
              {formik.values?.currency === "TZS" ||
              formik.values?.currency === "INR" ? (
                <InputBox
                  label="Ex. Rate"
                  id="exchangeRate"
                  value={
                    formik.values?.currency === "TZS" ||
                    formik.values?.currency === "INR"
                      ? 1
                      : formatIndianCurrency(formik.values.exchangeRate)
                  }
                  error={formik.errors.exchangeRate}
                  onChange={formik.handleChange}
                  disabled={
                    formik.values?.currency === "TZS" ||
                    formik.values?.currency === "INR"
                  }
                />
              ) : (
                <FormAutoCompleteWithExchangeLoader
                  label="Ex. Rate"
                  id="exchangeRate"
                  value={formik.values.exchangeRate}
                  error={formik.errors.exchangeRate}
                  onChange={formik.handleChange}
                  suggestionName="usd_exchange"
                  name={true}
                  other={formik.values.currency}
                />
              )}
            </Grid>
            <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
              <InputBox
                label="VAT Amount"
                id="vatAmount"
                value={formik.values.vatAmount}
                error={formik.errors.vatAmount}
                onChange={formik.handleChange}
                disabled
              />
            </Grid>
            <Grid item xs={12} lg={3} paddingLeft={0} marginTop={2}>
              <InputBox
                label="Amount"
                id="amount"
                value={formik.values.amount}
                error={formik.errors.amount}
                onChange={formik.handleChange}
                disabled
              />
            </Grid>
            <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
              <InputBox
                label="Total Amount"
                id="totalAmount"
                value={formik.values.totalAmount}
                error={formik.errors.totalAmount}
                onChange={formik.handleChange}
                disabled
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
      {alertConfig.open && <PopupAlert alertConfig={alertConfig} />}

      <AddPayableEntryModal
        togglePayEntry={modal.open}
        handleTogglePayEntry={() =>
          setModal((prev) => ({ ...prev, open: false }))
        }
        selectedPayEntry={modal.data}
        setSelectedPayEntry={(entry) =>
          setModal((prev) => ({ ...prev, data: entry }))
        }
        formik={formik}
        onAddPayEntry={(entry) => {
          const updatedList = [...(formik.values.details || []), entry];
          formik.setFieldValue("details", updatedList);
        }}
        type={modal.type}
        disabled={false}
      />
    </>
  );
}
