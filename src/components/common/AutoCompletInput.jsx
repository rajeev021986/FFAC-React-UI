import React, { useEffect, useRef, useState } from "react";
import {
  TextField,
  Autocomplete,
  Box,
  CircularProgress,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { GridToolbarColumnsButton } from "@mui/x-data-grid";

function AutoCompleteInput({
  label,
  id,
  suggestionName,
  value,
  error,
  onChange,
  fetchSuggestions,
  ...props
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const tooltipMessage = value ? value : "This field is empty";

  const handleInputChange = async (event, newValue) => {
    console.log("newValue", newValue);
    setLoading(true);
    try {
      const data = await fetchSuggestions(newValue, id);
      if (data) {
        const array = data.map((obj) => obj[suggestionName]);
        console.log(array, "array");
        setSuggestions(array);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }

    //onChange({ target: { name: id, value: newValue } });
  };

  const handleSelectionChange = (event, newValue) => {
    // onChange({ target: { name: id, value: newValue } });
    onChange(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "5px",
        paddingBottom: "8px",
      }}
    >
      <Autocomplete
        id={id}
        value={value}
        onInputChange={handleInputChange}
        onChange={handleSelectionChange}
        options={suggestions}
        getOptionLabel={(option) => option || ""}
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid #ccc",
          borderRadius: "10px",
          paddingLeft: "5px",
        }}
        renderInput={(params) => (
          <Tooltip title={tooltipMessage} arrow>
            <TextField
              {...params}
              label={label}
              error={Boolean(error)}
              helperText={error}
              variant="standard"
              fullWidth
              InputProps={{
                disableUnderline: true,
                ...params.InputProps,
                style: {
                  border: "none",
                  fontSize: "14px",
                },
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
              {...props}
            />
          </Tooltip>
        )}
        renderOption={(props, option) => (
          <MenuItem {...props} key={option} sx={{ fontSize: "14px" }}>
            {option}
          </MenuItem>
        )}
        noOptionsText={
          suggestions.length === 0 ? "No data available" : "Loading..."
        }
      />
    </Box>
  );
}

export default AutoCompleteInput;
