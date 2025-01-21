import React, { useState } from "react";
import {
  TextField,
  Chip,
  Box,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import { Search, Clear, FilterAltOutlined } from "@mui/icons-material";
const Chips = {
  isApproved: {
    chipLabel: "Status",
    chipvalues: [
      { value: 1, label: "Active" },
      { value: -2, label: "In Active" },
      { value: 0, label: "New & Pen Doc" },
      { value: -1, label: "Rejected" },
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
    chipLabel: "Vessel Name",
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
        return `${Chips[key]?.chipLabel || key}: ${
          Chips[key]?.chipvalues?.find((a) => a.value == value).label || value
        }`;
      }
      return null;
    })
    .filter((filter) => filter);

  // Clear the filter when the end button is clicked
  const endButtonHandler = () => {
    formattedFilter.length > 0 ? onFilterReset() : onFocus();
  };

  const handleDeleteChip = (index) => {
    const updatedFilters = { ...filters };
    delete updatedFilters[Object.keys(updatedFilters)[index]];
    onFilterChange(updatedFilters);
  };

  return (
    <Box sx={styles.input} ref={inputRef} onClick={onFocus}>
      <Box sx={styles.field}>
        <Box sx={styles.startIcon}>
          <Search color="primary" />
        </Box>
        <Box>
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
      <Box>
        <IconButton
          aria-label=""
          onClick={endButtonHandler}
          sx={{ padding: "5px" }}
        >
          {formattedFilter.length > 0 ? <Clear /> : <FilterAltOutlined />}
        </IconButton>
      </Box>
    </Box>
  );
};

const styles = {
  input: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "5px",
    alignItems: "center",
    padding: "2px",
    border: "1px solid #ccc",
    borderRadius: "25px",
    cursor: "text",
    "& .MuiTextField-root": {
      flex: "1",
    },
    "& .MuiChip-root": {
      margin: "2px",
    },
  },
  field: {
    display: "flex",
    flex: "1",
    alignItems: "center",
  },
  startIcon: {
    display: "flex",
    alignItems: "center",
    padding: "5px",
  },
};

export default InputWithChips;
