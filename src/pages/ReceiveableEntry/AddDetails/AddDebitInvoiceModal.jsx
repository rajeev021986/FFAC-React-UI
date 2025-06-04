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
import DateTimeField from "../../../components/common/DateTime/DateTimeField";

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
    customerName: Yup.string().required("Customer Name is required"),
    receivableAmount: Yup.string().required("Amount is required"),
    currency: Yup.string().required("Currency is required"),
    exRate: Yup.string().required("Exchange Rate is required"),
    vatApplicable: Yup.string().required("VAT applicable is required"),
    unitType: Yup.string().required("Unit type is required"),
    // numOfUnits: Yup.string().required("Number of units is required"),
    unitRate: Yup.string().required("Unit Rate is required"),
  });
  const [options, setOptions] = useState([]);
  const [mergedCurrencyOptions, setMergedCurrencyOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const debounceValue = useDebounce(inputValue, 800); // Custom Hook
  const [filteredOptions, setFilteredOptions] = useState([]);
  const getFormData = formik?.values;
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
    totalAmount: 0,
    exRate: "",
    vatApplicable: "",
    vat: 0,
    unitType: "",
    numOfUnits: 0,
    unitRate: 0,
    new: true,
    receivableCreatedDate: null,
  });

  const [errors, setErrors] = useState({});

  // const handleChange = (field, value) => {
  //   setInvoiceEntry((prevEntry) => ({
  //     ...prevEntry,
  //     [field]: value,
  //   }));
  // };
  const handleChange = (field, value) => {
    setInvoiceEntry((prevEntry) => {
      const updatedEntry = {
        ...prevEntry,
        [field]: value,
      };
      const unitRate = parseFloat(
        field === "unitRate" ? value : updatedEntry.unitRate
      );
      const vatPercentage = parseFloat(
        field === "vatApplicable" ? value : updatedEntry.vatApplicable
      );
      const numOfUnits = parseFloat(updatedEntry.numOfUnits || 0);

      if (!isNaN(unitRate) && !isNaN(vatPercentage)) {
        updatedEntry.vat = ((unitRate * vatPercentage) / 100).toFixed(2);
      }
      if (!isNaN(unitRate) && !isNaN(numOfUnits)) {
        updatedEntry.receivableAmount = unitRate * numOfUnits;
      }
      updatedEntry.totalAmount =
        updatedEntry.receivableAmount - updatedEntry.vat;

      return updatedEntry;
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      if (!invoiceEntry?.customerName) return;
      setLoading(true);
      try {
        const data = await GetAutoCompleteDataWithLoader(
          "unit_type",
          "unitTypeReceviable",
          "unit_type",
          debounceValue,
          // invoiceEntry?.customerName
          "Ananth"
        );
        const validData = data.filter((item) => item.label?.trim() !== "");
        setOptions(validData);
        setFilteredOptions(validData);
      } catch (err) {
        console.error("Error fetching unit types:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debounceValue, invoiceEntry?.customerName]);
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
        totalAmount: 0,
        exRate: "",
        vatApplicable: "",
        vat: 0,
        unitType: "",
        numOfUnits: 0,
        unitRate: 0,
        new: true,
        receivableCreatedDate: null,
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
      totalAmount: 0,
      exRate: "",
      vatApplicable: "",
      vat: 0,
      unitType: "",
      numOfUnits: 0,
      unitRate: 0,
      receivableCreatedDate: null,
      new: true,
    });
    handleTogglePayEntry();
  };
  useEffect(() => {
    if (invoiceEntry.currency !== "USD") {
      setInvoiceEntry((prevEntry) => ({
        ...prevEntry,
        exRate: 1,
      }));
    }
  }, [invoiceEntry.currency]);

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
        totalAmount: 0,
        exRate: "",
        vatApplicable: "",
        vat: 0,
        unitType: "",
        numOfUnits: 0,
        unitRate: 0,
        new: true,
        receivableCreatedDate: null,
      });
    }
  }, [selectedPayEntry]);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };
   const handleChangeUnitType = (event, newValue) => {
    if (newValue) {
      setInvoiceEntry((prev) => ({
        ...prev,
        unitType: newValue.value,
        numOfUnits: newValue.fullData?.count || "",
      }));
    } else {
      setInvoiceEntry((prev) => ({
        ...prev,
        unitType: "",
        numOfUnits: "",
      }));
    }
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
          {formik.values.type === "debit_note"
            ? selectedPayEntry
              ? "Edit Debit Note"
              : "Add Debit Note"
            : formik.values.type === "tax_invoice"
            ? selectedPayEntry
              ? "Edit Tax Invoice"
              : "Add Tax Invoice"
            : null}
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
            <Box sx={{ width: "100%" }}>
              <Autocomplete
                id="unitType"
                size="small"
                disabled={!invoiceEntry?.customerName}
                value={
                  options.find((opt) => opt.value === invoiceEntry.unitType) ||
                  null
                }
                onInputChange={handleInputChange}
                onChange={handleChangeUnitType}
                options={filteredOptions}
                getOptionLabel={(option) => option.label || ""}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Unit Type"
                    placeholder="Type to search"
                    variant="outlined"
                    error={Boolean(errors.unitType)}
                    helperText={errors.unitType}
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "14px",
                        height: "43px",
                      },
                    }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? (
                            <CircularProgress color="inherit" size={15} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <MenuItem {...props} key={option.value}>
                    {option.label}
                  </MenuItem>
                )}
                noOptionsText={
                  inputValue ? "No results found" : "Type to search..."
                }
              />
            </Box>
          </Grid>
          {/* <Grid item xs={12} lg={4}>
          
            <SelectBox
              label="Unit Type"
              id="unitType"
              options={jobSettingData?.body?.unitTypes}
              value={invoiceEntry?.unitType || ""}
              error={errors.unitType}
              onChange={(e) => handleChange("unitType", e.target.value)}
            />
          </Grid> */}
          <Grid item xs={12} lg={4}>
            <InputBox
              label="No. of Units"
              id="numOfUnits"
              disabled={true}
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
          {/* <Grid item xs={12} lg={4}>
            <SelectBox
              label="Currency"
              id="currency"
              options={mergedCurrencyOptions}
              value={invoiceEntry?.currency || ""}
              error={errors.currency}
              onChange={(e) => handleChange("currency", e.target.value)}
            />
          </Grid> */}
          <Grid item xs={12} lg={4}>
            <SelectBox
              label="Currency"
              id="currency"
              options={mergedCurrencyOptions}
              value={invoiceEntry?.currency || ""}
              error={errors.currency}
              onChange={(e) => {
                const value = e.target.value;
                handleChange("currency", value);
                if (value === "USD") {
                  // Clear currency-related fields when changing from USD to something else
                  handleChange("exRate", null);
                  // formik.setFieldValue("exRate", null);
                }
              }}
              // disabled={isDisabled}
            />
          </Grid>

          <Grid item xs={12} lg={4}>
            {invoiceEntry?.currency === "TZS" ||
            invoiceEntry?.currency === "INR" ? (
              <InputBox
                label="Ex. Rate"
                id="exRate"
                value={
                  invoiceEntry?.currency === "TZS" ||
                  invoiceEntry?.currency === "INR"
                    ? 1
                    : formatIndianCurrency(invoiceEntry?.exRate)
                }
                error={errors.exRate}
                onChange={(e) => handleChange("exRate", e.target.value)}
                disabled={
                  invoiceEntry?.currency === "TZS" ||
                  invoiceEntry?.currency === "INR"
                }
              />
            ) : (
              <FormAutoCompleteWithLoader
                label="Ex. Rate"
                id="exRate"
                value={invoiceEntry?.exRate || ""}
                error={errors.exRate}
                onChange={(e) => handleChange("exRate", e.target.value)}
                suggestionName="usd_exchange"
                name={true}
                other={invoiceEntry?.currency}
              />
            )}
          </Grid>
          {/* <Grid item xs={12} lg={4}>
            <FormAutoCompleteWithLoader
              label="Ex. Rate"
              id="exRate"
              value={invoiceEntry?.exRate || ""}
              onChange={(e) => handleChange("exRate", e.target.value)}
              error={errors.exRate}
              suggestionName="usd_exchange"
            />
          </Grid> */}
          <Grid item xs={12} lg={4}>
            <InputBox
              label="Amount"
              id="receivableAmount"
              value={invoiceEntry?.receivableAmount || ""}
              error={errors.receivableAmount}
              onChange={(e) => handleChange("receivableAmount", e.target.value)}
              fullWidth
              disabled={true}
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
              disabled={true}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <InputBox
              label="Total Amount"
              id="totalAmount"
              value={invoiceEntry?.totalAmount || ""}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <DateTimeField
              name="date"
              label="Date"
              id="receivableCreatedDate"
              value={invoiceEntry?.receivableCreatedDate || ""}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12} lg={8}></Grid>
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
