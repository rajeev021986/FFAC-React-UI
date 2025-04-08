import React, { useState, useEffect } from "react";
import {
  TextField,
  Autocomplete,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { GetAutoCompleteDataWithLoader } from "../../utils/GetAutoCompleteDataWithLoader";
import useDebounce from "../../../hooks/useDebounce";

function FormAutoCompleteWithTable(props) {
  const {
    label,
    id,
    suggestionName,
    dataLabel,
    value,
    error,
    onChange,
    formik,
  } = props;

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const debounceValue = useDebounce(inputValue, 800); // Custom Hook

  useEffect(() => {
    if (!debounceValue) return; // Avoid API call on empty input
    const fetchData = async () => {
      setLoading(true);
      try {
        const searchQuery = inputValue.trim() === "" ? "" : debounceValue;
        const data = await GetAutoCompleteDataWithLoader(
          suggestionName,
          id,
          dataLabel || suggestionName,
          searchQuery
        );
        setOptions(data);
        if (formik.values.originCountry) {
          const preloadedOption = data.find(
            (item) => item.fullData.country === formik.values.originCountry
          );
          if (preloadedOption) {
            setSelectedOption(preloadedOption);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debounceValue, suggestionName, id, dataLabel]);

  // Sync inputValue when formik value changes (for preloaded data)
  useEffect(() => {
    if (formik.values.originCountry) {
      setInputValue(formik.values.originCountry);
      const matchedOption = options.find(
        (opt) => opt.fullData.country === formik.values.originCountry
      );
      if (matchedOption) {
        setSelectedOption(matchedOption);
      }
    }
  }, [formik.values.originCountry, options]);

  const handleSelectionChange = (event, newValue) => {
    if (newValue) {
      formik.setValues({
        ...formik.values,
        originCountry: newValue.fullData.country,
        portOfLoading: newValue.fullData.port_name,
      });
      setInputValue(newValue.fullData.country);
    } else {
      formik.setValues({
        ...formik.values,
        originCountry: "",
        portOfLoading: "",
      });
      setInputValue("");
      setOptions([]);
      setSelectedOption(null);
    }
    setShowDropdown(false);
  };
  return (
    <Box sx={{ width: "100%" }}>
    <Autocomplete
    sx={{
          border: "none !important",
        }}
           size="small"
           id={id}
    open={showDropdown}
    onOpen={() => setShowDropdown(true)}
    onClose={() => setShowDropdown(false)}
    options={options}
    onFocus={()=>   setShowDropdown(true)}
    getOptionLabel={(option) => option.fullData?.country || ""}
    isOptionEqualToValue={(option, value) => option.fullData?.country === value.fullData?.country}
    onInputChange={(event, newValue) => setInputValue(newValue)}
    inputValue={inputValue}
    value={selectedOption} // Ensure the selected option remains after API call
    onChange={handleSelectionChange}
    renderInput={(params) => (
      <TextField
        {...params}
        label={label}
        variant="outlined"
       placeholder="Type to search"
        fullWidth
        error={Boolean(error)}
        helperText={error}
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
    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "1px" }}>
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
        // backgroundColor: "#f0f0f0",
   backgroundColor: '#166de0',

        padding: "8px",
        borderBottom: "1px solid #ddd",
        position: "sticky",
        top: 0,
        zIndex: 2, // Ensure it stays above the list
      }}
    >
      <span style={{
        color: "white",
        fontSize: "14px",
        // fontWeight: "bold",
      }}>Country Name</span>
      <span style={{
        color: "white",
        fontSize: "14px",
        fontWeight: "bold",
      }}>Port Name</span>
    </Box>

    {/* Scrollable Options List */}
    {props.children}
  </Paper>
)}


  />
 
</Box>
  );
}

export default FormAutoCompleteWithTable; 