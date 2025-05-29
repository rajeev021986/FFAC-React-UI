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

function FormAutoCompleteBond(props) {
  const { label, id, suggestionName, dataLabel, value, error, onChange, size } =
    props;

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
          debounceValue
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
  }, [debounceValue, suggestionName, id, dataLabel]);

  const handleInputChange = (event, newValue) => {
    setInputValue(newValue);
  };

  const handleSelectionChange = (event, newValue) => {
    if (newValue) {
      onChange({
        target: { 
           name: id,
          //  value: newValue.value
           value: newValue.fullData?.id ,
           id: newValue.fullData?.id,
          
          },
        fullData: newValue.fullData, // Pass the entire bond data
      });
    } else {
      onChange({
        target: { name: id, value: null,id:"" },
        fullData: null,
      });
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Autocomplete
        sx={{
          border: "none !important",
          marginTop: "5px !important",
        }}
        size="small"
        id={id}
        value={options.find((option) => option.fullData?.id === value) || null}
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

export default FormAutoCompleteBond;
