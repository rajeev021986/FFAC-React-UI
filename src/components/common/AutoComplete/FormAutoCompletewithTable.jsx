import React, { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';

import {
  TextField,
  Autocomplete,
  Box,
  CircularProgress,
  Paper,
} from "@mui/material";
import useDebounce from "../../../hooks/useDebounce";
import { GetAutoCompleteDataWithCountry } from "../../utils/GetAutoCompleteDataCountry";
import toast from "react-hot-toast";
import CustomToast from "../Toast/CustomToast";

function FormAutoCompleteWithTable(props) {
  const { label, id, suggestionName, dataLabel, error, formik } = props;

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const debounceValue = useDebounce(inputValue, 800);
  const theme = useTheme();

  useEffect(() => {
    if (!debounceValue) return; // Avoid API call on empty input
    const fetchData = async () => {
      setLoading(true);
      try {
        const searchQuery = inputValue.trim() === "" ? "" : debounceValue;
        const data = await GetAutoCompleteDataWithCountry(
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
        toast.custom(
          <CustomToast message={"Something went wrong!"} toast="error" />
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debounceValue, suggestionName, id, dataLabel]);

  // Sync inputValue when formik value changes
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
      setSelectedOption(newValue);
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
  };
  console.log("options", options);

  return (
    <Box sx={{ width: "100%" }}>
      <Autocomplete
        size="small"
        id={id}
        options={options}
        getOptionLabel={(option) => option.fullData?.country || ""}
        isOptionEqualToValue={(option, value) =>
          option.fullData?.country === value.fullData?.country
        }
        onInputChange={(event, newValue) => setInputValue(newValue)}
        inputValue={inputValue}
        value={selectedOption}
        onChange={handleSelectionChange}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant="outlined"
            placeholder="Type to search"
            fullWidth
            error={Boolean(error)}
            helperText={error}
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
                backgroundColor: theme.palette.primary.main, 
                color: theme.palette.common.white,

                padding: "8px",
                borderBottom: "1px solid #ddd",
                position: "sticky",
                top: "-15px",
                zIndex: 2, // Ensure it stays above the list
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: "14px",
                  // fontWeight: "bold",
                }}
              >
                Country
              </span>
              <span
                style={{
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Port
              </span>
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
