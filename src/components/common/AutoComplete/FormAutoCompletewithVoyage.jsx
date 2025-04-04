import React, { useState, useEffect } from "react";
import {
  TextField,
  Autocomplete,
  Box,
  CircularProgress,
  MenuItem,
  Paper,
} from "@mui/material";
import useDebounce from "../../../hooks/useDebounce";
import { GetAutoCompleteDataWithVoyage } from "../../utils/GetAutoCompleteDataWithVoyage";

function FormAutoCompleteWithVoyage(props) {
  const { label, id, suggestionName, dataLabel, value, error, onChange , setFieldValue,formik} =
    props;

  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const debounceValue = useDebounce(inputValue, 800); // Custom Hook

  useEffect(() => {
    if (!debounceValue) return; // Avoid API call on empty input
  
    let isMounted = true; // To prevent state updates on unmounted component
  
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await GetAutoCompleteDataWithVoyage(
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
  

  const handleInputChange = (event, newValue) => {
    setInputValue(newValue);
  };
  const handleSelectionChange = (event, newValue) => {
  
    if (newValue) {
      const { vessel, voyage } = newValue.fullData;
  
      if (id === "loadingVessel") {
        setFieldValue("loadingVessel", vessel);
        setFieldValue("loadingVoyage", voyage || "");
      } else if (id === "loadingVoyage") {
        setFieldValue("loadingVoyage", voyage);
        setFieldValue("loadingVessel", vessel || "");
      } else if (id === "dischargingVessel") {
        setFieldValue("dischargingVessel", vessel);
        setFieldValue("dischargeVoyage", voyage || "");
      } else if (id === "dischargeVoyage") {
        setFieldValue("dischargeVoyage", voyage);
        setFieldValue("dischargingVessel", vessel || "");
      }
    } else {
      // Clear both fields when selection is removed
      setFieldValue(id, "");
      if (id === "loadingVessel") {
        setFieldValue("loadingVoyage", "");
      } else if (id === "loadingVoyage") {
        setFieldValue("loadingVessel", "");
      } else if (id === "dischargingVessel") {
        setFieldValue("dischargeVoyage", "");
      } else if (id === "dischargeVoyage") {
        setFieldValue("dischargingVessel", "");
      }
    }
  };
  

  return (
    <Box sx={{ width: "100%" }}>
      <Autocomplete
        sx={{
          border: "none !important",
        }}
        size="small"
        id={id}
       value={formik.values[id] ? { label: formik.values[id] } : null}
        onInputChange={handleInputChange}
        onChange={handleSelectionChange}
        options={filteredOptions}
        getOptionLabel={(option) =>
          option.label
            ? option.label
            : `${option.fullData?.vessel || ""} - ${
                option.fullData?.voyage || ""
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
        )}renderOption={(props, option) => (
  <Box component="li" {...props} key={option.value}>
    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "1px" }}>
      <span>{option.fullData.vessel}</span>
      <span>{option.fullData.voyage}</span>
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
        position: "sticky",
        top: 0,
        zIndex: 2, // Ensure it stays above the list
      }}
    >
      <span>Vessel</span>
      <span>Voyage</span>
    </Box>

    {/* Scrollable Options List */}
    {props.children}
  </Paper>
)}
        // renderOption={(props, option) => (
        //   <MenuItem
        //     {...props}
        //     key={option.value}
        //     sx={{
        //       display: "flex",
        //       justifyContent: "space-between",
        //       width: "100%",
        //     }}
        //   >
        //     <span style={{ flex: 1 }}>{option.fullData.vessel}</span>
        //     <span style={{ flex: 1, textAlign: "right" }}>
        //       {option.fullData.voyage}
        //     </span>
        //   </MenuItem>
        // )}
        // noOptionsText={inputValue ? "No results found" : "Type to search..."}
      />
    </Box>
  );
}

export default FormAutoCompleteWithVoyage;
