import React, { useState, useEffect } from "react";
import {
  Typography,
  Modal,
  Box,
  Grid,
  IconButton,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InputBox from "../../../components/common/InputBox";
import { ThemeButton } from "../../../components/common/Button";
import FormAutoCompleteWithLoader from "../../../components/common/AutoComplete/FormAutoCompletewithLoader";

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
  const [payableEntry, setPayableEntry] = useState({
    id: null,
    jobNo:  formik.values.jobNo,
    chargeName: "",
    unitType: "",
    noOfUnit: "",
    unitRate: "",
    amount: "",
    vatApplicable: "",
    vatAmount: "",
    withHoldingTax: "",
    withHoldingAmount: "",
    totalAmount: "",
    new: true,
  });

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
      if (updatedEntry.vatApplicable === "18%") {
        updatedEntry.vatAmount = (updatedEntry.amount * 0.18).toFixed(2);
      } else {
        updatedEntry.vatAmount = 0;
      }
      const withHoldingTax = Number(updatedEntry.withHoldingTax || 0);
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

  const handleSubmit = () => {
    if (!payableEntry.jobNo || !payableEntry.chargeName) {
      alert("Please fill in required fields.");
      return;
    }
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
    setPayableEntry({
      id: Date.now(),
      jobNo: "",
      chargeName: "",
      unitType: "",
      noOfUnit: "",
      unitRate: "",
      amount: "",
      vatApplicable: "",
      vatAmount: "",
      withHoldingTax: "",
      withHoldingAmount: "",
      totalAmount: "",
      new: true,
    });
    handleTogglePayEntry();
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
      vatApplicable: "",
      vatAmount: "",
      withHoldingTax: "",
      withHoldingAmount: "",
      totalAmount: "",
      new: true,
    });
    handleTogglePayEntry();
  };
useEffect(() => { 
if(togglePayEntry){
  setPayableEntry((prevEntry) => ({
    ...prevEntry,
    jobNo: formik.values.jobNo,
  }));
}
  },[togglePayEntry]);


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
        vatApplicable: "",
        vatAmount: "",
        withHoldingTax: "",
        withHoldingAmount: "",
        totalAmount: "",
        new: true,
      });
    }
  }, [selectedPayEntry]);

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
              onChange={(e) => handleChange("jobNo", e.target.value)}
              suggestionName="job_no"
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <FormAutoCompleteWithLoader
              label="Charge Name"
              id="chargeName"
              value={payableEntry.chargeName}
              onChange={(e) => handleChange("chargeName", e.target.value)}
              suggestionName="charge_name"
            />
          </Grid>
          <Grid item xs={12} lg={4}></Grid>
          <Grid item xs={12} lg={4}>
            <FormAutoCompleteWithLoader
              label="Unit Type"
              id="unitType"
              value={payableEntry.unitType}
              onChange={(e) => {
                handleChange("unitType", e.target.value);
                handleChange("noOfUnit", e.target.count || "");
              }}
              suggestionName="size_type"
            />
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
              label="Unit Rate"
              id="unitRate"
              value={payableEntry.unitRate}
              onChange={(e) => handleChange("unitRate", e.target.value)}
              fullWidth
            />
          </Grid>
          {/* Amount */}
          <Grid item xs={12} lg={4}>
            <InputBox
              label="Amount"
              id="amount"
              value={payableEntry.amount}
              disabled
              fullWidth
            />
          </Grid>
          {/* VAT Applicable */}
          <Grid item xs={12} lg={4}>
            <Select
              fullWidth
              id="vatApplicable"
              value={payableEntry.vatApplicable}
              onChange={(e) => handleChange("vatApplicable", e.target.value)}
              disabled={disabled}
              sx={{
                ...styles.root,
                height: "44px",
                "& .MuiSelect-select span::before": {
                  content: "'VAT Applicable'",
                  color: "#9090A5",
                },
              }}
            >
              <MenuItem value="No">No</MenuItem>
              <MenuItem value="18%">18%</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} lg={4}>
            <InputBox
              label="VAT Amount"
              id="vatAmount"
              value={payableEntry.vatAmount}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Select
              fullWidth
              id="withHoldingTax"
              value={payableEntry.withHoldingTax}
              onChange={(e) => handleChange("withHoldingTax", e.target.value)}
              disabled={disabled}
              sx={{
                ...styles.root,
                height: "44px",
                "& .MuiSelect-select span::before": {
                  content: "'With Holding Tax'",
                  color: "#9090A5",
                },
              }}
            >
              <MenuItem value={0}>No</MenuItem>
              <MenuItem value={5}>5%</MenuItem>
              <MenuItem value={10}>10%</MenuItem>
              <MenuItem value={15}>15%</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} lg={4}>
            <InputBox
              label="With Holding Amount"
              id="withHoldingAmount"
              value={payableEntry.withHoldingAmount}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={12} lg={4}></Grid>
          <Grid item xs={12} lg={4}>
            <InputBox
              label="Total Amount"
              id="totalAmount"
              value={payableEntry.totalAmount}
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
