import React, { useState, useEffect } from "react";
import { Typography, Modal, Box, Grid, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InputBox from "../../../components/common/InputBox";
import { ThemeButton } from "../../../components/common/Button";

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

export default function AddEntry({
  formik,
  disabled = formik?.values?.statusCode === -3,
  togglePayEntry,
  handleTogglePayEntry,
  onAddPayEntry,
  selectedPayEntry,
}) {
  const [payableEntry, setPayableEntry] = useState({
    id: null,
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

  useEffect(() => {
    if (selectedPayEntry) {
      setPayableEntry(selectedPayEntry);
    } else {
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
    }
  }, [selectedPayEntry]);

  const handleChange = (field, value) =>
    setPayableEntry((prev) => ({ ...prev, [field]: value }));

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
      : [...formik.values.paybleDetails, updatedEntry];

    formik.setFieldValue("paybleDetails", updatedList);
    onAddPayEntry(updatedEntry);
    handleTogglePayEntry();
  };

  const handleClose = () => {
    handleTogglePayEntry();
  };

  return (
    <Modal
      keepMounted
      open={togglePayEntry}
      onClose={handleTogglePayEntry}
      aria-labelledby="add-note-modal-title"
      aria-describedby="add-note-modal-description"
    >
      <Box
        sx={{
          ...modalStyle,
          position: "relative",
          p: 3,
          boxSizing: "border-box",
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8, color: "grey.600" }}
        >
          <CloseIcon />
        </IconButton>

        <Typography id="add-note-modal-title" variant="h6" gutterBottom>
          {selectedPayEntry ? "Edit Payable Entry" : "Add Payable Entry"}
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} lg={4}>
            <InputBox
              label="Invoice Type"
              id="jobNo"
              value={payableEntry.jobNo}
              onChange={(e) => handleChange("jobNo", e.target.value)}
              disabled={disabled}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} lg={4}>
            <InputBox
              label="Charge Name"
              id="chargeName"
              value={payableEntry.chargeName}
              onChange={(e) => handleChange("chargeName", e.target.value)}
              disabled={disabled}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} lg={4}>
            <InputBox
              label="Unit Type"
              id="unitType"
              value={payableEntry.unitType}
              onChange={(e) => handleChange("unitType", e.target.value)}
              disabled={disabled}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} lg={4}>
            <InputBox
              label="No of units"
              id="noOfUnit"
              value={payableEntry.noOfUnit}
              onChange={(e) => handleChange("noOfUnit", e.target.value)}
              disabled={disabled}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} lg={4}>
            <InputBox
              label="Unit rate"
              id="unitRate"
              value={payableEntry.unitRate}
              onChange={(e) => handleChange("unitRate", e.target.value)}
              disabled={disabled}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} lg={4}>
            <InputBox
              label="Amount"
              id="amount"
              value={payableEntry.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              disabled={disabled}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} lg={4}>
            <InputBox
              label="Vat Applicable"
              id="vatApplicable"
              value={payableEntry.vatApplicable}
              onChange={(e) => handleChange("vatApplicable", e.target.value)}
              disabled={disabled}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} lg={4}>
            <InputBox
              label="Vat Amount"
              id="vatAmount"
              value={payableEntry.vatAmount}
              onChange={(e) => handleChange("vatAmount", e.target.value)}
              disabled={disabled}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} lg={4}>
            <InputBox
              label="With Holding Tax"
              id="withHoldingTax"
              value={payableEntry.withHoldingTax}
              onChange={(e) => handleChange("withHoldingTax", e.target.value)}
              disabled={disabled}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} lg={4}>
            <InputBox
              label="With Holding Amount"
              id="withHoldingAmount"
              value={payableEntry.withHoldingAmount}
              onChange={(e) =>
                handleChange("withHoldingAmount", e.target.value)
              }
              disabled={disabled}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} lg={4}>
            <InputBox
              label="Total Amount"
              id="totalAmount"
              value={payableEntry.totalAmount}
              onChange={(e) => handleChange("totalAmount", e.target.value)}
              disabled={disabled}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} lg={4}></Grid>

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
