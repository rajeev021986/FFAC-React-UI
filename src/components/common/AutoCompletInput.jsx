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
import { GetAutoCompleteData } from "../utils/GetAutoCompleteData";

function AutoCompleteInput({
  label,
  id,
  suggestionName,
  value,
  error,
  onChange,
  ...props
}) {
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [loading, setLoading] = useState(false);
  const tooltipMessage = value ? value : "This field is empty";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await GetAutoCompleteData(suggestionName, id);
        setOptions(data);
        setFilteredOptions(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = async (event, newValue) => {
    setLoading(false);
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(newValue.toLowerCase())
    );

    setFilteredOptions(filtered);
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
        options={filteredOptions}
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
              placeholder="Type to search"
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
          filteredOptions.length === 0 ? "No data available" : "Loading..."
        }
      />
    </Box>
  );
}

export default AutoCompleteInput;
