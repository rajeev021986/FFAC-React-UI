import React, { useState } from "react";
import {
  TextField,
  Chip,
  Box,
  InputAdornment,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { Search, Clear, FilterAltOutlined } from "@mui/icons-material";
import DateField from "../../../components/common/DateTime/DateField";
const Chips = {
  statusCode: {
    chipLabel: "Status",
    chipvalues: [
      { value: 1, label: "Active" },
      { value: -2, label: "In Active" },
      { value: 0, label: "New & Pen Doc" },
      { value: -1, label: "Rejected" },
      { value: -3, label: "Cancel" },
    ],
  },
  customerName: {
    chipLabel: "Customer Name",
  },
  isDoc: {
    chipLabel: "Document Status",
    chipvalues: [
      { value: true, label: "Available" },
      { value: false, label: "Pending" },
    ],
  },
  tinNo: {
    chipLabel: "TIN NO",
  },
  bondType: {
    chipLabel: "Bond Type",
  },
  bondNumber: {
    chipLabel: "Bond Number",
  },
  vatNo: {
    chipLabel: "VAT NO",
  },
  vendorName: {
    chipLabel: "Vendor Name",
  },
  vrnNo: {
    chipLabel: "VRN NO",
  },
  icdCode: {
    chipLabel: "ICD Code",
  },
  icdName: {
    chipLabel: "ICD Name",
  },
  newPortName: {
    chipLabel: "Port Name",
  },
  country: {
    chipLabel: "Country",
  },
  vessel: {
    chipLabel: "Vessel",
  },
  lname: {
    chipLabel: "Line Name",
  },
  vname: {
    chipLabel: "Vessel Name",
  },
  currency: {
    chipLabel: "Currency",
  },
  usdExchange: {
    chipLabel: "USD Exchange",
  },
  chargeName: {
    chipLabel: "Charge Name",
  },
  chargeCode: {
    chipLabel: "Charge Code",
  },
  city: {
    chipLabel: "City",
  },
  consigneeName: {
    chipLabel: "Consignee Name",
  },
  name: {
    chipLabel: "Name",
  },
  statusCode: {
    chipLabel: "Status",
    chipvalues: [
      { value: 1, label: "Active" },
      { value: -2, label: "In Active" },
      { value: 0, label: "Pending" },
      { value: -3, label: "Cancel" },
      { value: -1, label: "Rejected" },
    ],
  },
  paymentStatus: {
    chipLabel: "Payment Status",
    chipvalues: [
      { value: 101, label: "Unpaid" },
      { value: 100, label: "Paid" },
    ],
  },
};

const InputWithChips = ({
  placeholder,
  filters = [],
  onFilterChange,
  onFilterReset,
  inputRef,
  onFocus,
}) => {
  const formattedFilter = Object.entries(filters)
    .map(([key, value]) => {
      if (value !== "") {
        return `${Chips[key]?.chipLabel || key}: ${Chips[key]?.chipvalues?.find((a) => a?.value == value)?.label || value
          }`;
      }
      return null;
    })
    .filter((filter) => filter);

  const endButtonHandler = () => {
    formattedFilter.length > 0 ? onFilterReset() : onFocus();
  };

  const handleDeleteChip = (index) => {
    const updatedFilters = {
      ...Object.fromEntries(
        Object.entries(filters).filter(
          ([key, value]) =>
            value !== null && value !== undefined && value !== ""
        )
      ),
    };
    delete updatedFilters[Object.keys(updatedFilters)[index]];
    onFilterChange(updatedFilters);
  };
  const [invoiceDate, setInvoiceDate] = useState('');

  return (

    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <Box sx={styles.input} ref={inputRef} onClick={onFocus}>
        <Box sx={styles.field}>
          <Box sx={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {formattedFilter.map((chip, index) => (
              <Chip
                key={index}
                variant="outlined"
                color="primary"
                size="small"
                label={chip}
                onDelete={() => handleDeleteChip(index)}
              />
            ))}
            {formattedFilter.length === 0 && (
              <Typography variant="body2" color="textSecondary">
                {placeholder}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={styles.startIcon}>
          <Search sx={{ color: "#9c27b0" }} /> 
        </Box>
      </Box>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value=""
          label="Status"
          sx={{
            borderRadius: "8px",
            bgcolor: "#fff",
            '& .MuiSelect-select': {
              padding: '7.5px 14px',
            }
          }}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="pending">New</MenuItem>
          <MenuItem value="paid">Active</MenuItem>
          <MenuItem value="overdue">Pending</MenuItem>
        </Select>
      </FormControl>

      <DateField
        label="Invoice Date*"
        name="invoiceDate"
        id="invoiceDate"
      />

      <IconButton onClick={endButtonHandler} sx={{ padding: "6px" }}>
        {formattedFilter.length > 0 ? <Clear /> : <FilterAltOutlined />}
      </IconButton>
    </Box>

  );
};

const styles = {
  input: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    padding: "6px 12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    minWidth: 200,
    backgroundColor: "#fff",
  },
  field: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
  },
  startIcon: {
    paddingLeft: "8px",
    display: "flex",
    alignItems: "center",
  },
};


export default InputWithChips;
