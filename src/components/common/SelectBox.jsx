import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FormHelperText } from '@mui/material';

export default function SelectBox({
    sx,
    value,
    onChange,
    label,
    id,
    helperText,
    options,
    error,
    fullWidth=true,
    ...props
}) {

  return (
      <FormControl fullWidth={fullWidth} size="small" error={error ? true : false} >
        <InputLabel id={`${id}-simple-select-label`}>{label}</InputLabel>
        <Select
          labelId={`${id}-simple-select-label`}
          id={id}
          name={id}
          value={value}
          label={label}
          onChange={onChange}
          size="small"
          sx={{ ...styles.root, ...sx}}
          {...props}
        >
             <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {
                options?.map((option,idx) => {
                    return (
                        <MenuItem key={idx} value={option?.value}>{option?.label || option?.value}</MenuItem>
                    )
                })
            }
        </Select>
        <FormHelperText>{error}</FormHelperText>
      </FormControl>
  );
}


const styles = {
  root : {
    borderRadius: '10px',
  }
}