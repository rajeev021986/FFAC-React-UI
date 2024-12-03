import React, { useState } from "react";
import { Button, Stack, MenuItem, Select, TextField } from "@mui/material";
import { OutlinedButton } from "../../../common/Button";

const UserFilterForm = () => {
  const [filters, setFilters] = useState([
    { fieldName: "userId", operator: "=", value: "", logicalOperator: "" },
    { fieldName: "firstName", operator: "=", value: "", logicalOperator: "OR" },
    { fieldName: "lastName", operator: "=", value: "", logicalOperator: "AND" },
    { fieldName: "status", operator: "=", value: "", logicalOperator: "OR" },
  ]);

  const handleInputChange = (index, field, value) => {
    setFilters((prevFilters) =>
      prevFilters.map((filter, i) =>
        i === index ? { ...filter, [field]: value } : filter
      )
    );
  };

  const handleReset = () => {
    setFilters(filters.map((filter) => ({ ...filter, value: "" })));
  };

  const handleApply = () => {
    console.log("Filters applied:", filters);
    // Add API call logic here
  };

  return (
    <div>
      <Stack spacing={3} direction="column">
        {filters.map((filter, index) => (
          <Stack key={index} direction="row" spacing={2} alignItems="center">
            {/* Field Name Display */}
            <TextField
              label={filter.fieldName}
              value={filter.value}
              onChange={(e) =>
                handleInputChange(index, "value", e.target.value)
              }
              fullWidth
              sx={{
                width: "500px", // Adjust width
                height: "40px", // Adjust height
                "& .MuiInputBase-root": {
                  padding: "0px", // Adjust padding
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.8rem", // Optional: Adjust label size
                },
              }}
            />

            {/* Logical Operator Dropdown */}
            {/* {filter.fieldName !== "userId" && (
              <Select
                value={filter.logicalOperator}
                onChange={(e) => {
                  handleInputChange(index, "logicalOperator", e.target.value);
                }}
                displayEmpty
                sx={{height: '50%' }}
              >
                <MenuItem>AND</MenuItem>
                <MenuItem>OR</MenuItem>
              </Select>
            )} */}
          </Stack>
        ))}
        <Stack direction="row" spacing={3} justifyContent={"end"}>
          <Button color="primary" size="small" onClick={handleReset}>
            reset
          </Button>
          <OutlinedButton color="primary" size="small" onClick={handleApply}>
            apply
          </OutlinedButton>
        </Stack>
      </Stack>
    </div>
  );
};

export default UserFilterForm;
