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
  disabled = formik?.values?.statusCode === -3,
  togglePayEntry,
  handleTogglePayEntry,
  onAddPayEntry,
  selectedPayEntry,
  setSelectedPayEntry,
}) {
  const modalValidationSchema = Yup.object().shape({
    jobNo: Yup.string().required("Job No. is required"),
    chargeName: Yup.string().required("Charge Name is required"),
    unitType: Yup.string().required("Unit Type is required"),
    unitRate: Yup.string().required("Unit Rate is required"),
    vatApplicable: Yup.string().required("VAT Applicable is required"),
    withHoldingTax: Yup.string().required("With Holding Tax is required"),
  });
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const debounceValue = useDebounce(inputValue, 800); // Custom Hook
  const selectedValue = formik.values.unitType;
  const [filteredOptions, setFilteredOptions] = useState([]);

  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("common_settings");
  const { data: payableSettingData } =
    useGetOptionsSettingsQuery("payble_settings");

  const { data: vatAndHoldingTaxSettingData, refetch } =
    useFetchVatAndHoldingQuery({
      params: { type: "VAT" },
      page: "settings/api",
    });

  console.log(vatAndHoldingTaxSettingData, "vatAndHoldingTaxSettingData");

  const [payableEntry, setPayableEntry] = useState({
    id: null,
    jobNo: formik.values.jobNo,
    chargeName: "",
    unitType: "",
    noOfUnit: "",
    unitRate: "",
    amount: "",
    vatApplicable: "No",
    vatAmount: "",
    withHoldingTax: "No",
    withHoldingAmount: "",
    totalAmount: "",
    new: true,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    if (field === "unitType") {
      setPayableEntry((prevEntry) => ({
        ...prevEntry,
        unitType: value,
      }));
    }
    setPayableEntry((prevEntry) => {
      let updatedEntry = { ...prevEntry, [field]: value };
      const noOfUnit = updatedEntry.noOfUnit
        ? Number(updatedEntry.noOfUnit)
        : 0;
      const unitRate = updatedEntry.unitRate
        ? Number(updatedEntry.unitRate)
        : 0;

      updatedEntry.amount = noOfUnit * unitRate;
      let vatValue = updatedEntry.vatApplicable.replace("%", "");
      if (vatValue && vatValue.toLowerCase() !== "no") {
        const vatRate = parseFloat(vatValue) / 100;
        updatedEntry.vatAmount = (updatedEntry.amount * vatRate).toFixed(2);
      } else {
        updatedEntry.vatAmount = "0.00";
      }

      let withHoldingTax = Number(
        (updatedEntry.withHoldingTax || "0").replace("%", "")
      );
      if (isNaN(withHoldingTax)) {
        withHoldingTax = 0;
      }
      updatedEntry.withHoldingAmount = (
        (updatedEntry.amount * withHoldingTax) /
        100
      ).toFixed(2);
      updatedEntry.totalAmount = (
        updatedEntry.amount +
        Number(updatedEntry.vatAmount) -
        Number(updatedEntry.withHoldingAmount)
      ).toFixed(2);
      return updatedEntry;
    });
  };

  const handleSubmit = async () => {
    try {
      await modalValidationSchema.validate(payableEntry, { abortEarly: false });
      setErrors({}); // Clear errors on successful validation

      const updatedEntry = selectedPayEntry
        ? payableEntry
        : { ...payableEntry, id: Date.now(), new: true };

      const updatedList = selectedPayEntry
        ? formik.values.paybleDetails.map((n) =>
            n.id === updatedEntry.id ? updatedEntry : n
          )
        : [...(formik.values.paybleDetails || []), updatedEntry];

      formik.setFieldValue("paybleDetails", updatedList);
      if (onAddPayEntry) {
        onAddPayEntry(updatedEntry);
        setSelectedPayEntry(updatedEntry);
      }

      // Reset after add
      setPayableEntry({
        id: Date.now(),
        jobNo: "",
        chargeName: "",
        unitType: "",
        noOfUnit: "",
        unitRate: "",
        amount: "",
        vatApplicable: "No",
        vatAmount: "",
        withHoldingTax: "No",
        withHoldingAmount: "",
        totalAmount: "",
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
    setPayableEntry({
      id: Date.now(),
      jobNo: "",
      chargeName: "",
      unitType: "",
      noOfUnit: "",
      unitRate: "",
      amount: "",
      vatApplicable: "No",
      vatAmount: "",
      withHoldingTax: "No",
      withHoldingAmount: "",
      totalAmount: "",
      new: true,
    });
    handleTogglePayEntry();
  };

  useEffect(() => {
    if (togglePayEntry) {
      setPayableEntry((prevEntry) => ({
        ...prevEntry,
        jobNo: formik.values.jobNo,
      }));
    }
  }, [togglePayEntry]);
  useEffect(() => {
    if (payableEntry.unitRate) {
      handleChange("noOfUnit", payableEntry.noOfUnit);
    }
  }, [payableEntry.unitType, payableEntry.noOfUnit]);

  useEffect(() => {
    if (selectedPayEntry) {
      setPayableEntry(selectedPayEntry);
    } else {
      setPayableEntry({
        id: Date.now(),
        jobNo: formik.values.jobNo,
        chargeName: "",
        unitType: "",
        noOfUnit: "",
        unitRate: "",
        amount: "",
        vatApplicable: "No",
        vatAmount: "",
        withHoldingTax: "No",
        withHoldingAmount: "",
        totalAmount: "",
        new: true,
      });
    }
  }, [selectedPayEntry]);
  useEffect(() => {
    const fetchData = async () => {
      if (!payableEntry.jobNo) return;
      setLoading(true);
      try {
        const data = await GetAutoCompleteDataWithLoader(
          "size_type",
          "unitType",
          "size_type",
          debounceValue,
          payableEntry.jobNo
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
  }, [debounceValue, payableEntry.jobNo]);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleChangeUnitType = (event, newValue) => {
    if (newValue) {
      formik.setFieldValue("unitType", newValue.value);
      formik.setFieldValue("noOfUnit", newValue.fullData?.count || "");

      setPayableEntry((prev) => ({
        ...prev,
        unitType: newValue.value,
        noOfUnit: newValue.fullData?.count || "",
      }));
    } else {
      formik.setFieldValue("unitType", "");
      formik.setFieldValue("noOfUnit", "");

      setPayableEntry((prev) => ({
        ...prev,
        unitType: "",
        noOfUnit: "",
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
          {selectedPayEntry ? "Edit Charges" : "Add New Charges"}
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} lg={4}>
            <FormAutoCompleteWithLoader
              label="Job No."
              id="jobNo"
              value={payableEntry.jobNo}
              onChange={(e) => {
                const value = e.target.value;
                handleChange("jobNo", value);
                if (!value) {
                  setPayableEntry((prev) => ({
                    ...prev,
                    unitType: "",
                    noOfUnit: "",
                  }));
                  formik.setFieldValue("unitType", "");
                  formik.setFieldValue("noOfUnit", "");
                }
              }}
              suggestionName="job_no"
              error={errors.jobNo}
            />
          </Grid>
          <Grid item xs={12} lg={8}>
            <FormAutoCompleteWithLoader
              label="Charge Name"
              id="chargeName"
              value={payableEntry.chargeName}
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
                disabled={!payableEntry.jobNo}
                value={
                  options.find((opt) => opt.value === payableEntry.unitType) ||
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
          <Grid item xs={12} lg={4}>
            <TextField
              label="No of Units"
              id="noOfUnit"
              name="noOfUnit"
              value={payableEntry.noOfUnit}
              disabled={true}
              onChange={(e) => handleChange("noOfUnit", e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  fontSize: "14px",
                  height: "43px",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <InputBox
              label={`Unit Rate (${formik?.values?.currency})`}
              id="unitRate"
              value={formatIndianCurrency(payableEntry.unitRate)}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/,/g, "");
                if (!isNaN(rawValue)) {
                  handleChange("unitRate", rawValue);
                }
              }}
              fullWidth
              error={errors.unitRate}
            />
          </Grid>
          {/* Amount */}
          <Grid item xs={12} lg={4}>
            <InputBox
              label="Amount"
              id="amount"
              value={formatIndianCurrency(payableEntry.amount)}
              disabled
              fullWidth
              size="small"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  fontSize: "14px",
                  height: "43px",
                },
              }}
            />
          </Grid>
          {/* VAT Applicable */}
          <Grid item xs={12} lg={4}>
            <SelectBox
              label="VAT Applicable*"
              id="vatApplicable"
              options={vatAndHoldingTaxSettingData?.body?.vatSettings}
              value={payableEntry.vatApplicable}
              // error={formik.errors.vatApplicable}
              error={errors.vatApplicable}
              onChange={(e) => handleChange("vatApplicable", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <InputBox
              label="VAT Amount"
              id="vatAmount"
              value={formatIndianCurrency(payableEntry.vatAmount)}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <SelectBox
              label="With Holding Tax*"
              id="withHoldingTax"
              options={
                vatAndHoldingTaxSettingData?.body?.withHoldingTaxSettings
              }
              value={payableEntry.withHoldingTax}
              error={errors.withHoldingTax}
              onChange={(e) => handleChange("withHoldingTax", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <InputBox
              label="With Holding Amount"
              id="withHoldingAmount"
              value={formatIndianCurrency(payableEntry.withHoldingAmount)}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={12} lg={4}></Grid>
          <Grid item xs={12} lg={4}>
            <InputBox
              label="Total Amount"
              id="totalAmount"
              value={formatIndianCurrency(payableEntry.totalAmount)}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={12} lg={4}></Grid> <Grid item xs={12} lg={4}></Grid>
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
