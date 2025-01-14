import React, { useEffect, useState } from "react";
import {
  TextField,
  Autocomplete,
  Box,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { GetAutoCompleteData } from "../../utils/GetAutoCompleteData";

function FormAutoComplete({
  label,
  id,
  suggestionName,
  value,
  error,
  onChange,
}) {
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [loading, setLoading] = useState(false);

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

  const handleInputChange = (event, newValue) => {
    setLoading(false);
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(newValue.toLowerCase())
    );

    setFilteredOptions(filtered);
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
        options={filteredOptions} // Use the filtered options
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
          filteredOptions.length === 0 ? "No data available" : "Loading..."
        }
      />
    </Box>
  );
}

export default FormAutoComplete;
