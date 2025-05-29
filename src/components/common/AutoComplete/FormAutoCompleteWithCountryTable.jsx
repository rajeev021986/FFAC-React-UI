import React, { useState, useEffect } from "react";
import {
  TextField,
  Autocomplete,
  Box,
  CircularProgress,
  Paper,
} from "@mui/material";
import useDebounce from "../../../hooks/useDebounce";
import { GetAutoCompleteDataWithCountry } from "../../utils/GetAutoCompleteDataCountry";
import { useTheme } from "@mui/material/styles";

function FormAutoCompleteWithCountryTable(props) {
  const {
    label,
    id,
    suggestionName,
    dataLabel,
    value,
    error,
    onChange,
    setFieldValue,
    formik,
    disabled,
  } = props;
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const debounceValue = useDebounce(inputValue, 800); // Custom Hook

  useEffect(() => {
    if (!debounceValue || debounceValue.length < 3) return; // Avoid API call on empty input

    let isMounted = true; // To prevent state updates on unmounted component

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await GetAutoCompleteDataWithCountry(
          suggestionName,
          id,
          suggestionName,
          debounceValue
        );
        if (isMounted) {
          setOptions(data);
          setFilteredOptions(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup function to prevent unnecessary state updates
    };
  }, [debounceValue]); // ✅ Only triggers when typing

  const theme = useTheme();
  const handleInputChange = (event, newValue) => {
    setInputValue(newValue);
  };
  // const handleSelectionChange = (event, newValue) => {
  //   if (newValue) {
  //     const { country, port_name } = newValue.fullData;

  //     if (id == "originPortId") {
  //       setFieldValue("originPortId", newValue.value);
  //       setFieldValue("portOfLoading", port_name || "");
  //     } else if (id == "portOfLoading") {
  //       setFieldValue("portOfLoading", port_name);
  //       setFieldValue("originPortId", newValue.value || "");
  //     } 
  //   } else {
  //     // Clear both fields when selection is removed
  //     setFieldValue(id, "");
  //     if (id == "originPortId") {
  //       setFieldValue("portOfLoading", "");
  //     } else if (id === "portOfLoading") {
  //       setFieldValue("originPortId", "");
  //     }
  //   }
  // };


  const handleSelectionChange = (event, newValue) => {
    setSelectedOption(newValue); // ✅ Maintain selection
  
    if (newValue) {
      const { country, port_name } = newValue.fullData;
  
      if (id === "originPortId") {
        setFieldValue("originPortId", newValue.value);
        setFieldValue("portOfLoading", port_name || "");
      } else if (id === "portOfLoading") {
        setFieldValue("portOfLoading", port_name);
        setFieldValue("originPortId", newValue.value || "");
      }
    } else {
      setFieldValue(id, "");
      if (id === "originPortId") {
        setFieldValue("portOfLoading", "");
      } else if (id === "portOfLoading") {
        setFieldValue("originPortId", "");
      }
      setSelectedOption(null); // Clear selected option
    }
  };
  useEffect(() => {
    const initializeSelectedOption = async () => {
      const existingId = formik.values[id];
  
      if (existingId && !selectedOption) {
        try {
          const result = await GetAutoCompleteDataWithCountry(
            suggestionName,
            id,
            suggestionName,
            "" // or pass a proper filter if needed
          );
  
          const matched = result.find((opt) => opt.value == existingId);
          if (matched) {
            setSelectedOption(matched);
          }
        } catch (error) {
          console.error("Error pre-filling autocomplete:", error);
        }
      }
    };
  
    initializeSelectedOption();
  }, [formik.values[id]]);
  
  return (
    <Box sx={{ width: "100%" }}>
      <Autocomplete
        sx={{
          border: "none !important",
        }}
        size="small"
        id={id}
        noOptionsText="Type to Search"
        disabled={disabled}
        value={selectedOption}

        // value={formik.values[id] ? { label: formik.values[id] } : null}
        onInputChange={handleInputChange}
        onChange={handleSelectionChange}
        options={filteredOptions}
        getOptionLabel={(option) =>
          option.label
            ? option.label
            : `${option.fullData?.country || ""} - ${
                option.fullData?.port_name || ""
              }`
        }
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
          <Box component="li" {...props} key={option.value}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                padding: "1px",
              }}
            >
              <span>{option.fullData.country}</span>
              <span>{option.fullData.port_name}</span>
            </Box>
          </Box>
        )}
        ListboxComponent={(props) => (
          <Paper
            {...props}
            sx={{
              maxHeight: 300, // Limit height to enable scrolling
              overflowY: "auto",
              border: "1px solid #ddd",
            }}
          >
            {/* Fixed Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                backgroundColor: "#f0f0f0",
                padding: "8px",
                borderBottom: "1px solid #ddd",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white,
                position: "sticky",
                top: 0,
                zIndex: 2, // Ensure it stays above the list
              }}
            >
              <span>Country</span>
              <span>Port</span>
            </Box>

            {/* Scrollable Options List */}
            {props.children}
          </Paper>
        )}
      />
    </Box>
  );
}

export default FormAutoCompleteWithCountryTable;
