import React, { useRef, useState, useEffect } from "react";
import {
  TextField,
  Autocomplete,
  Box,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { GetAutoCompleteDataWithLoader } from "../../utils/GetAutoCompleteDataWithLoader";
import useDebounce from "../../../hooks/useDebounce";
import autoCompleteCache from "../../utils/AutoCompleteCache";

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
    idKey,
    nameKey,
    sendLabelOnly,
    className,
  } = props;
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const debounceValue = useDebounce(inputValue, 800); // Custom Hook
  const suggestionRef = useRef({
    suggestionName,
    id,
    dataLabel,
    debounceValue,
    other,
  });

 


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
  }, [debounceValue, suggestionName, id, dataLabel ]);

  const handleInputChange = (event, newValue) => {
    setInputValue(newValue);
  };

  const handleSelectionChange = (event, newValue) => {
    if (newValue) {
      if (sendLabelOnly) {
        // 👇 Only send the label as value
        onChange({
          target: {
            name: id,
            value: newValue.label,
          },
        });
      } else {
        // 👇 Send both id + name
        onChange({
          [idKey]: newValue?.fullData?.id ?? newValue?.value,
          [nameKey]: newValue?.label ?? "",
          label: newValue?.label,
          fullData: newValue?.fullData,
        });
      }
    } else {
      if (sendLabelOnly) {
        onChange({
          target: {
            name: id,
            value: "",
          },
        });
      } else {
        onChange({
          [idKey]: null,
          [nameKey]: "",
          label: "",
          fullData: null,
        });
      }
    }
  };

  const selectedOption =
    options.find(
      (option) =>
        option?.value == value?.[idKey] ||
        option?.fullData?.id == value?.[idKey] ||
        option?.label == value?.[nameKey]
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
          id == "exchangeRate" || id == "jobNo"
            ? options.find((option) => option.value == value) || value
            : selectedOption
        }
        // value={selectedOption}
        onInputChange={handleInputChange}
        onChange={handleSelectionChange}
        options={filteredOptions}
        getOptionLabel={(option) => option.label || value}
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
                height: `${className ? "35px" : "42px"}`,
                marginTop: `${className ? "5px" : ""}`,
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
