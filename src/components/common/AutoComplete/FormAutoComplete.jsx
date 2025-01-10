import React, { useState } from "react";
import {
  TextField,
  Autocomplete,
  Box,
  CircularProgress,
  MenuItem,
} from "@mui/material";

function FormAutoComplete({
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
    setLoading(true);
    try {
      const data = await fetchSuggestions(newValue, id);
      if (data) {
        const array = data.map((obj) => obj[suggestionName]);
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
    <Box sx={{ width: "100%" }}>
      <Autocomplete
        sx={{
          border: "none ! important",
        }}
        size="small"
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
            placeholder="Type to search"
            error={Boolean(error)}
            helperText={error}
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                fontSize: "14px",
              },
            }}
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

export default FormAutoComplete;
