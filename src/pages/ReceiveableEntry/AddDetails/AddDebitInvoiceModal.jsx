import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import {
  Typography,
  Modal,
  Box,
  Grid,
  IconButton,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  FormHelperText,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InputBox from "../../../components/common/InputBox";
import { ThemeButton } from "../../../components/common/Button";
import FormAutoCompleteWithLoader from "../../../components/common/AutoComplete/FormAutoCompletewithLoader";
import SelectBox from "../../../components/common/SelectBox";
import { useGetOptionsSettingsQuery } from "../../../store/api/settingsApi";
import { formatIndianCurrency } from "../../../components/utils/utils";
import { GetAutoCompleteDataWithLoader } from "../../../components/utils/GetAutoCompleteDataWithLoader";
import useDebounce from "../../../hooks/useDebounce";
import { useFetchVatAndHoldingQuery } from "../../../store/api/settingAuditAPI";
import ApiManager from "../../../services/ApiManager";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
};

export default function AddPayableEntryModal({
  formik,
  disabled,
  togglePayEntry,
  handleTogglePayEntry,
  onAddPayEntry,
  selectedPayEntry,
  setSelectedPayEntry,
  type,
}) {
  const modalValidationSchema = Yup.object().shape({
    chargeName: Yup.string().required("Charge Name is required"),
  });
  const [options, setOptions] = useState([]);
  const [mergedCurrencyOptions, setMergedCurrencyOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const debounceValue = useDebounce(inputValue, 800); // Custom Hook
  const [filteredOptions, setFilteredOptions] = useState([]);

  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("common_settings");
  const { data: payableSettingData } =
    useGetOptionsSettingsQuery("payble_settings");
  const { data: jobSettingData } = useGetOptionsSettingsQuery("job_settings");

  const { data: vatAndHoldingTaxSettingData, refetch } =
    useFetchVatAndHoldingQuery({
      params: { type: "VAT" },
      page: "settings/api",
    });

  const [invoiceEntry, setInvoiceEntry] = useState({
    id: 0,
    paybleDetailId: 0,
    customerName: "",
    currency: "",
    chargeName: "",
    // receivableRefNo: "",
    receivableAmount: 0,
    exRate: 0,
    vatApplicable: "",
    vat: 0,
    unitType: "",
    numOfUnits: 0,
    unitRate: 0,
    new: true,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setInvoiceEntry((prevEntry) => ({
      ...prevEntry,
      [field]: value,
    }));
  };
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
  const handleSubmit = async () => {
    try {
      await modalValidationSchema.validate(invoiceEntry, { abortEarly: false });
      setErrors({}); // Clear errors on successful validation

      const updatedEntry = selectedPayEntry
        ? invoiceEntry
        : { ...invoiceEntry, id: Date.now(), new: true };

      const updatedList = selectedPayEntry
        ? formik.values.costDetails.map((n) =>
            n.id === updatedEntry.id ? updatedEntry : n
          )
        : [...(formik.values.costDetails || []), updatedEntry];

      formik.setFieldValue("details", updatedList);
      if (onAddPayEntry) {
        onAddPayEntry(updatedEntry);
        setSelectedPayEntry(updatedEntry);
      }

      // Reset after add
      setInvoiceEntry({
        id: Date.now(),
        paybleDetailId: 0,
        customerName: "",
        currency: "",
        chargeName: "",
        // receivableRefNo: "",
        receivableAmount: 0,
        exRate: 0,
        vatApplicable: "",
        vat: 0,
        unitType: "",
        numOfUnits: 0,
        unitRate: 0,
        new: true,
      });

      handleTogglePayEntry();
    } catch (validationError) {
      if (validationError.inner) {
        const fieldErrors = {};
        validationError.inner.forEach((err) => {
          fieldErrors[err.path] = err.message;
        });
        setErrors(fieldErrors);
      }
    }
  };
  const handleClose = () => {
    setInvoiceEntry({
      id: Date.now(),
      paybleDetailId: 0,
      customerName: "",
      currency: "",
      chargeName: "",
      // receivableRefNo: "",
      receivableAmount: 0,
      exRate: 0,
      vatApplicable: "",
      vat: 0,
      unitType: "",
      numOfUnits: 0,
      unitRate: 0,
      new: true,
    });
    handleTogglePayEntry();
  };

  useEffect(() => {
    if (selectedPayEntry) {
      setInvoiceEntry(selectedPayEntry);
    } else {
      setInvoiceEntry({
        id: Date.now(),
        paybleDetailId: 0,
        customerName: "",
        currency: "",
        chargeName: "",
        // receivableRefNo: "",
        receivableAmount: 0,
        exRate: 0,
        vatApplicable: "",
        vat: 0,
        unitType: "",
        numOfUnits: 0,
        unitRate: 0,
        new: true,
      });
    }
  }, [selectedPayEntry]);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };
  return (
    <Modal
      keepMounted
      open={togglePayEntry}
      onClose={handleClose}
      aria-labelledby="add-payable-entry"
    >
      <Box sx={modalStyle}>
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8, color: "grey.600" }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" gutterBottom>
          {selectedPayEntry ? "Edit Debit Note" : "Add Debit Note"}
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} lg={4}>
            <FormAutoCompleteWithLoader
              label="Customer Name"
              id="customerName"
              value={invoiceEntry?.customerName || ""}
              error={errors.customerName}
              onChange={(e) => handleChange("customerName", e.target.value)}
              suggestionName="customer_name"
            />
          </Grid>
          <Grid item xs={12} lg={8}>
            <FormAutoCompleteWithLoader
              label="Charge Name"
              id="chargeName"
              value={invoiceEntry?.chargeName || ""}
              onChange={(e) => handleChange("chargeName", e.target.value)}
              suggestionName="charge_name"
              error={errors.chargeName}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <InputBox
              label="Amount"
              id="receivableAmount"
              value={invoiceEntry?.receivableAmount || ""}
              error={errors.receivableAmount}
              onChange={(e) => handleChange("receivableAmount", e.target.value)}
              fullWidth
            />
          </Grid>
          {/* <Grid item xs={12} lg={4}>
            <InputBox
              label="Receivable Ref No."
              id="receivableRefNo"
              value={invoiceEntry?.receivableRefNo || ""}
              error={errors.receivableRefNo}
              onChange={(e) => handleChange("receivableRefNo", e.target.value)}
              fullWidth
            />
          </Grid> */}
          <Grid item xs={12} lg={4}>
            <SelectBox
              label="Currency"
              id="currency"
              options={mergedCurrencyOptions}
              value={invoiceEntry?.currency || ""}
              error={errors.currency}
              onChange={(e) => handleChange("currency", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <FormAutoCompleteWithLoader
              label="Ex. Rate"
              id="exchangeRate"
              value={invoiceEntry?.exRate || ""}
              onChange={(e) => handleChange("exRate", e.target.value)}
              error={errors.exRate}
              suggestionName="usd_exchange"
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <SelectBox
              label="Unit Type"
              id="unitType"
              options={jobSettingData?.body?.unitTypes}
              value={invoiceEntry?.unitType || ""}
              error={errors.unitType}
              onChange={(e) => handleChange("unitType", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <SelectBox
              label="VAT Applicable"
              id="vatApplicable"
              options={vatAndHoldingTaxSettingData?.body?.vatSettings || []}
              value={invoiceEntry?.vatApplicable || ""}
              error={errors.vatApplicable}
              onChange={(e) => handleChange("vatApplicable", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <InputBox
              label="VAT Amount"
              id="vat"
              value={invoiceEntry?.vat || ""}
              error={errors.vat}
              onChange={(e) => handleChange("vat", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <InputBox
              label="Number of Units"
              id="numOfUnits"
              value={invoiceEntry?.numOfUnits || ""}
              error={errors.numOfUnits}
              onChange={(e) => handleChange("numOfUnits", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <InputBox
              label="Unit Rate"
              id="unitRate"
              value={invoiceEntry?.unitRate || ""}
              error={errors.unitRate}
              onChange={(e) => handleChange("unitRate", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            
          </Grid>
          {/* Button */}
          <Grid item xs={4}>
            <ThemeButton
              onClick={handleSubmit}
              disabled={disabled}
              fullWidth
              sx={{ fontWeight: 500 }}
            >
              {selectedPayEntry ? "Update" : "Add"}
            </ThemeButton>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

const styles = {
  root: {
    borderRadius: "10px",
    fontSize: "14px",
  },
};
