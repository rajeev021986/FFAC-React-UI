import React, { useEffect, useState } from "react";
import {
  TextField,
  Autocomplete,
  Box,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { GetAutoCompleteData } from "../../utils/GetAutoCompleteData";

function FormAutoComplete(props) {
  const {
    label,
    id,
    suggestionName,
    dataLabel,
    value,
    error,
    onChange,
    disabled,
  } = props;

  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await GetAutoCompleteData(
          suggestionName,
          id,
          !dataLabel ? suggestionName : dataLabel
        );
        setOptions(data);
        setFilteredOptions(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [suggestionName, id]);

  const handleInputChange = (event, newValue) => {
    setLoading(false);
    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(newValue.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleSelectionChange = (event, newValue) => {
    if (newValue) {
      const { fullData } = newValue;
      const selectedAddress =
        fullData.address1?.trim() ||
        fullData.address2?.trim() ||
        fullData.address3?.trim() ||
        "";
      const selectedCity = fullData.city || "";
      const selectedCountry = fullData.country || "";
      const formattedAddress = selectedAddress
        ? `${selectedAddress}, ${selectedCity}, ${selectedCountry}`
        : "";
      onChange({
        target: { name: id, value: newValue.value, formattedAddress },
      });
    } else {
      onChange({ target: { name: id, value: null, formattedAddress: "" } });
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Autocomplete
        sx={{
          border: "none ! important",
        }}
        size="small"
        id={id}
        noOptionsText="Type to Search"
        value={options.find((option) => option.value == value) || null}
        onInputChange={handleInputChange}
        onChange={handleSelectionChange}
        options={filteredOptions}
        getOptionLabel={(option) => option.label || ""}
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
                height: "43px", // Increase height here
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
            {...params}
          />
        )}
        renderOption={(props, option) => (
          <MenuItem {...props} key={option.value} sx={{ fontSize: "14px" }}>
            {option.label}
          </MenuItem>
        )}
        disabled={disabled}
        // noOptionsText={
        //   filteredOptions?.length === 0 ? "No data available" : "Loading..."
        // }
      />
    </Box>
  );
}

export default FormAutoComplete;
