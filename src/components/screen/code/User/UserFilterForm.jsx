import React, { useState } from "react";
import {
  Button,
  Stack,
  MenuItem,
  Select,
  TextField,
  Grid,
} from "@mui/material";
import { OutlinedButton } from "../../../common/Button";

const UserFilterForm = () => {
  const [filters, setFilters] = useState([
    { fieldName: "userId", operator: "=", value: "", logicalOperator: "" },
    { fieldName: "firstName", operator: "=", value: "", logicalOperator: "AND" },
    { fieldName: "lastName", operator: "=", value: "", logicalOperator: "AND" },
    { fieldName: "status", operator: "=", value: "", logicalOperator: "AND" },
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
  };

  return (
    <div>
      <Grid container spacing={3} direction="column">
        <Grid container item spacing={1} wrap="wrap">
          {filters.map((filter, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              {filter.fieldName === "status" ? (
                <Select
                  label={filter.fieldName}
                  value={filter.value}
                  onChange={(e) =>
                    handleInputChange(index, "value", e.target.value)
                  }
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "36px",
                      borderRadius: "8px",
                      padding: "0",
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.8rem",
                      top: "-6px",
                    },
                    "& .MuiSelect-select": {
                      fontSize: "0.9rem",
                      padding: "4px 8px",
                    },
                  }}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              ) : (
                <TextField
                  label={filter.fieldName}
                  value={filter.value}
                  onChange={(e) =>
                    handleInputChange(index, "value", e.target.value)
                  }
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "36px",
                      borderRadius: "8px",
                      padding: "0",
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.8rem",
                      top: "-6px",
                    },
                    "& .MuiInputBase-input": {
                      fontSize: "0.9rem",
                      padding: "4px 8px",
                    },
                  }}
                />
              )}
            </Grid>
          ))}
        </Grid>

        <Grid container item justifyContent="flex-end" spacing={3}>
          <Grid item>
            <Button
              color="primary"
              size="small"
              onClick={handleReset}
              sx={{ borderRadius: "12px" }}
            >
              reset
            </Button>
          </Grid>
          <Grid item>
            <OutlinedButton
              color="primary"
              size="small"
              onClick={handleApply}
              sx={{ borderRadius: "12px" }}
            >
              apply
            </OutlinedButton>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserFilterForm;
