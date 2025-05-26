import React, { useState, useEffect } from "react";
import {
  TextField,
  Autocomplete,
  Box,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { GetAutoCompleteDataWithLoader } from "../../utils/GetAutoCompleteDataWithLoader";
import useDebounce from "../../../hooks/useDebounce";

function FormAutoCompleteWithLoader(props) {
  const {
    label,
    id,
    suggestionName,
    dataLabel,
    value,
    error,
    onChange,
    show,
    name,
    disabled,
    other,
  } = props;
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const debounceValue = useDebounce(inputValue, 800); // Custom Hook

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await GetAutoCompleteDataWithLoader(
          suggestionName,
          id,
          dataLabel || suggestionName,
          debounceValue,
          other || ""
        );
        const validData = data.filter((item) => item.label?.trim() !== "");
        setOptions(validData);
        setFilteredOptions(validData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debounceValue, suggestionName, id, dataLabel,value]);

  const handleInputChange = (event, newValue) => {
    setInputValue(newValue);
  };

  const handleSelectionChange = (event, newValue) => {
    if (newValue) {
      onChange({
        target: {
          name: id,
          value: name == true ? newValue.value : newValue.fullData?.id,
          label: newValue.label,
          count: newValue?.fullData?.count || 0,
          fullData: newValue.fullData,
        },
      });
    } else {
      onChange({
        target: {
          name: id,
          value: null,
          label: "",
          fullData: null,
          count: 0,
        },
      });
    }
  };
  const selectedOption =
    options.find(
      (option) =>
        option?.value == value ||
        option?.fullData?.id == value ||
        option?.label == value
    ) || null;
  return (
    <Box sx={{ width: "100%" }}>
      <Autocomplete
        sx={{
          border: "none !important",
        }}
        size="small"
        id={id}
        disabled={disabled}
        value={
          id == "exchangeRate"
            ? options.find((option) => option.value == value) || null
            : selectedOption
        }
        // value={selectedOption}
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
                    <CircularProgress color="inherit" size={15} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <MenuItem
            {...props}
            key={option.value || "87343874"}
            sx={{ fontSize: "14px" }}
          >
            {option.label}
          </MenuItem>
        )}
        noOptionsText={inputValue ? "No results found" : "Type to search..."}
      />
    </Box>
  );
}

export default FormAutoCompleteWithLoader;
