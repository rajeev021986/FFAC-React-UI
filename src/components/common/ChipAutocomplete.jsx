import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function ChipAutocomplete({
    sx,
    preValue,
    onChange,
    formik,
    label,
    id,
    helperText,
    options,
    error,
    placeholder,
    ...props
}) {
  
  const handleChange = (event,newValue) => {
    formik.setFieldValue(id, newValue);
    if (onChange) {
        onChange(newValue);
    }
  };


  return (
    <Autocomplete
      fullWidth
      multiple
      id={id}
      options={options}
      value={formik.values[id]}
      onChange={handleChange}
      disableCloseOnSelect
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.label}
          </li>
        );
      }}
      style={{ ...sx, ...styles.root }}
      {...props}
      renderInput={(params) => (
        <TextField {...params} label={label} sx={styles.input} placeholder={placeholder} />
      )}
    />
  );
}


const styles = {
    root : {
        "& .MuiAutocomplete-inputRoot" :{
            borderRadius: '10px',
        }
    },
    input : {
        '& .MuiInputBase-root':{
          borderRadius: '10px',
        }
      }
  }