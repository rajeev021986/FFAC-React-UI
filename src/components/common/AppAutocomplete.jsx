import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';

const AppAutocomplete = ({ label, id, value, formik, options, sx, onChange, error }) => {
  const [inputValue, setInputValue] = useState(value || ''); // Initialize with the initial value or empty string
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (inputValue.length > 2) {
  //     setLoading(true);
  //     handleOptionChange(inputValue);
  //     setLoading(false);
  //   }
  // }, [inputValue]);

  const findSelectedOption = () => {
    if (!value) return null; // Return null if value is empty or undefined
    return options.find(option => option.value === value) || null;
  };

  return (
    <Autocomplete
      id={id}
      value={findSelectedOption()} // Pass the correct option or null
      onChange={(event, newValue) => {
        console.log('newValue', newValue);
        const selectedValue = newValue?.value || ''; // Get the selected value
        if (onChange) {
          onChange(selectedValue);
        } else{
          formik?.setFieldValue(id, selectedValue);
        }
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      inputValue={inputValue} // Sync input field display value
      options={options}
      getOptionLabel={(option) => option?.label || ''}
      isOptionEqualToValue={(option, value) => option?.value === value}
      loading={loading}
      style={{ ...sx, ...styles.root }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          sx={styles.input}
          size="small"
          variant="outlined"
          error={(formik.touched[id] && Boolean(formik.errors[id])) || error}
          helperText={(formik.touched[id] && formik.errors[id]) || error}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

const styles = {
  root: {
    "& .MuiAutocomplete-inputRoot": {
      borderRadius: '10px',
    }
  },
  input: {
    '& .MuiInputBase-root': {
      borderRadius: '10px',
    }
  }
};

export default AppAutocomplete;
