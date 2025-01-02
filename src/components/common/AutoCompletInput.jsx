import React, { useState } from "react";
import {
  TextField,
  Autocomplete,
  Box,
  CircularProgress,
  MenuItem,
} from "@mui/material";

function AutoCompleteInput({
  label,
  id,
  suggestionName,
  value,
  error,
  onChange,
  fetchSuggestions,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

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
          width: "70%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        renderInput={(params) => (
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
              style: { border: "none" },
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <MenuItem {...props} key={option}>
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
