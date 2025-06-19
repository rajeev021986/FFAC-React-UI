import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import {
  Typography,
  Modal,
  Box,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InputBox from "../../../components/common/InputBox";
import { ThemeButton } from "../../../components/common/Button";
import FormAutoCompleteWithLoader from "../../../components/common/AutoComplete/FormAutoCompletewithLoader";
import SelectBox from "../../../components/common/SelectBox";
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
    receivableAmount: Yup.string().required("Amount is required"),
    vatApplicable: Yup.string().required("VAT applicable is required"),
    unitType: Yup.string().required("Unit type is required"),
    unitRate: Yup.string().required("Unit Rate is required"),
  });
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const debounceValue = useDebounce(inputValue, 800); // Custom Hook
  const [filteredOptions, setFilteredOptions] = useState([]);
  const { data: vatAndHoldingTaxSettingData } = useFetchVatAndHoldingQuery({
    params: { type: "VAT" },
    page: "settings/api",
  });

  const [invoiceEntry, setInvoiceEntry] = useState({
    id: 0,
    paybleDetailId: null,
    chargeName: "",
    mappedCharge: "",
    receivableAmount: 0,
    totalAmount: 0,
    vatApplicable: "",
    vat: 0,
    unitType: "",
    numOfUnits: 0,
    unitRate: 0,
    new: true,
    receivableCreatedDate: null,
  });

  const [errors, setErrors] = useState({});
  const handleChange = (field, value) => {
    setInvoiceEntry((prevEntry) => {
      const updatedEntry = {
        ...prevEntry,
        [field]: value,
      };
      // Parse relevant fields
      const unitRate =
        parseFloat(field === "unitRate" ? value : updatedEntry.unitRate) || 0;
      const vatPercentage = parseFloat(updatedEntry.vatApplicable) || 0;
      const numOfUnits = parseFloat(updatedEntry.numOfUnits) || 0;

      // Calculate receivableAmount
      if (!isNaN(unitRate) && !isNaN(numOfUnits)) {
        updatedEntry.receivableAmount = (unitRate * numOfUnits).toFixed(2);
      } else {
        updatedEntry.receivableAmount = 0;
      }

      // Calculate VAT if vatApplicable is selected
      if (
        !isNaN(vatPercentage) &&
        vatPercentage > 0 &&
        !isNaN(updatedEntry.receivableAmount)
      ) {
        updatedEntry.vat = (
          (updatedEntry.receivableAmount * vatPercentage) /
          100
        ).toFixed(2);
      } else {
        updatedEntry.vat = 0; // Ensure VAT is 0 if no valid vatPercentage or receivableAmount
      }
      updatedEntry.totalAmount = (
        parseFloat(updatedEntry.receivableAmount) + parseFloat(updatedEntry.vat)
      ).toFixed(2);

      return updatedEntry;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!formik.values.customerName) return;
      setLoading(true);
      try {
        const data = await GetAutoCompleteDataWithLoader(
          "unit_type",
          "unitTypeReceviable",
          "unit_type",
          debounceValue,
          formik.values.customerName || ""
          // "Ananth"
        );
        const validData = data?.filter((item) => item.label?.trim() !== "");
        const flatExists = validData.some(
          (item) => item.label?.toLowerCase() === "flat"
        );

        if (!flatExists) {
          validData.push({
            label: "Flat",
            value: "Flat",
            fullData: {
              count: 1,
              unit_type: "Flat",
            },
          });
        }
        setOptions(validData);

        setFilteredOptions(validData);
      } catch (err) {
        console.error("Error fetching unit types:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debounceValue, formik.values.customerName]);

  const handleSubmit = async () => {
    try {
      await modalValidationSchema.validate(invoiceEntry, { abortEarly: false });
      setErrors({}); // Clear errors on successful validation

      const updatedEntry = selectedPayEntry
        ? { ...invoiceEntry, id: Date.now(), new: true }
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
        paybleDetailId: null,
        chargeName: "",
        mappedCharge: "",
        // receivableRefNo: "",
        receivableAmount: 0,
        totalAmount: 0,
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
      paybleDetailId: null,
      chargeName: "",
      // receivableRefNo: "",
      receivableAmount: 0,
      mappedCharge: "",
      totalAmount: 0,
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



  useEffect(() => {
    if (selectedPayEntry && type === "cost_details") {
      const receivableAmount = selectedPayEntry.paybleAmount || 0;
      const vat = selectedPayEntry.paybleVatAmount || 0;
      setInvoiceEntry({
        id: selectedPayEntry.id,
        paybleDetailId: selectedPayEntry.paybleDetailId,
        chargeName: selectedPayEntry.chargeName || "",
        mappedCharge: selectedPayEntry.mappedCharge || "",
        receivableAmount: selectedPayEntry.paybleAmount || 0,
        totalAmount: receivableAmount + vat || 0,
        vatApplicable: selectedPayEntry.paybleVatApplicable || "",
        vat: selectedPayEntry.paybleVatAmount || 0,
        unitType: selectedPayEntry.paybleUnitType || "",
        numOfUnits: selectedPayEntry.paybleNumOfUnit || 0,
        unitRate: parseFloat(selectedPayEntry.paybleUnitRate) || 0,
        new: false,
        receivableCreatedDate: selectedPayEntry.paybleCreatedDate || null,
      });
    } else if (selectedPayEntry && type !== "cost_details") {
      setInvoiceEntry({
        id: selectedPayEntry.id,
        paybleDetailId: selectedPayEntry.paybleDetailId,
        chargeName: selectedPayEntry.chargeName || "",
        mappedCharge: selectedPayEntry.mappedCharge || "",
        receivableAmount: selectedPayEntry.receivableAmount || 0,
        totalAmount: selectedPayEntry.totalAmount || 0,
        vatApplicable: selectedPayEntry.vatApplicable || "",
        vat: selectedPayEntry.vat || 0,
        unitType: selectedPayEntry.unitType || "",
        numOfUnits: selectedPayEntry.numOfUnits || 0,
        unitRate: selectedPayEntry.unitRate || 0,
        new: false,
        receivableCreatedDate: selectedPayEntry.receivableCreatedDate || null,
      });
    } else {
      setInvoiceEntry({
        id: Date.now(),
        paybleDetailId: null,
        chargeName: "",
        mappedCharge: "",
        receivableAmount: 0,
        totalAmount: 0,
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

  useEffect(() => {
    if (invoiceEntry.unitRate) {
      handleChange("numOfUnits", invoiceEntry.numOfUnits);
    }
  }, [invoiceEntry.unitType, invoiceEntry.numOfUnits]);

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
          <Grid item xs={12} lg={8}>
            {formik.values.type === "debit_note" ? (
              <FormAutoCompleteWithLoader
                label="Charge Name"
                id="chargeId"
                suggestionName="charge_name"
                value={{
                  chargeId: invoiceEntry.chargeId,
                  chargeName: invoiceEntry.chargeName,
                }}
                error={errors.chargeName}
                idKey="chargeId"
                nameKey="chargeName"
                disabled={
                  type == "cost_details" && formik.values.type === "debit_note"
                    ? true
                    : false
                }
                onChange={(selected) => {
                  handleChange("chargeId", selected.chargeId);
                  handleChange("chargeName", selected.chargeName);
                }}
              />
            ) : formik.values.type === "tax_invoice" &&
              type == "cost_details" ? (
              <FormAutoCompleteWithLoader
                label="Charge Name"
                id="mappedCharge"
                suggestionName="mapped_charge"
                value={{
                  chargeId: invoiceEntry.chargeId || "",
                  chargeName: invoiceEntry.mappedCharge || "",
                }}
                disabled={
                  type == "cost_details" && formik.values.type === "debit_note"
                    ? true
                    : false
                }
                error={errors.chargeName}
                idKey="chargeId"
                nameKey="chargeName"
                onChange={(selected) => {
                  if (selected?.chargeId) {
                    handleChange("chargeId", selected.chargeId);
                    handleChange("chargeName", selected.chargeName);
                    setInvoiceEntry((prev) => ({
                      ...prev,
                      chargeId: selected.chargeId,
                      mappedCharge: selected.chargeName,
                    }));
                  } else {
                    handleChange("chargeId", "");
                    handleChange("chargeName", "");
                    setInvoiceEntry((prev) => ({
                      ...prev,
                      chargeId: "",
                      mappedCharge: "",
                    }));
                  }
                }}
              />
            ) : (
              <FormAutoCompleteWithLoader
                label="Charge Name"
                id="mappedCharge"
                suggestionName="mapped_charge"
                value={{
                  chargeId: invoiceEntry.chargeId,
                  chargeName: invoiceEntry.chargeName,
                }}
                error={errors.chargeName}
                disabled={
                  type == "cost_details" && formik.values.type === "debit_note"
                    ? true
                    : false
                }
                idKey="chargeId"
                nameKey="chargeName"
                onChange={(selected) => {
                  handleChange("chargeId", selected.chargeId);
                  handleChange("chargeName", selected.chargeName);
                }}
              />
            )}
          </Grid>
          <Grid item xs={12} lg={4}>
            <Box sx={{ width: "100%" }}>
              <Autocomplete
                id="unitType"
                size="small"
                disabled={
                  !formik.values.customerName || type == "cost_details"
                    ? true
                    : false
                }
                value={
                  options.find((opt) => opt.value === invoiceEntry.unitType) ||
                  invoiceEntry.unitType ||
                  ""
                }
                onInputChange={handleInputChange}
                onChange={handleChangeUnitType}
                options={filteredOptions}
                getOptionLabel={(option) =>
                  invoiceEntry.unitType
                    ? invoiceEntry.unitType
                    : option.label || ""
                }
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
                  <MenuItem {...props} key={option?.value}>
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
              disabled={type == "cost_details" ? true : false}
              onChange={(e) => handleChange("unitRate", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <InputBox
              label="Amount"
              id="receivableAmount"
              value={invoiceEntry?.receivableAmount || 0}
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
              disabled={type == "cost_details" ? true : false}
              onChange={(e) => handleChange("vatApplicable", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <InputBox
              label="VAT Amount"
              id="vat"
              value={invoiceEntry?.vat || 0}
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

          <Grid item xs={12} lg={8}></Grid>
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
