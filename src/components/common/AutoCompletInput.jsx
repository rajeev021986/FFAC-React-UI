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
    onChange({ target: { name: id, value: newValue } });
  };

  return (
    <Box>
      <Autocomplete
        id={id}
        value={value}
        onInputChange={handleInputChange}
        onChange={handleSelectionChange}
        options={suggestions}
        getOptionLabel={(option) => option || ""}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={Boolean(error)}
            helperText={error}
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
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
