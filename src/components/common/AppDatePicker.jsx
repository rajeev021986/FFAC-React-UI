import React from 'react';
import { TextField } from '@mui/material';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';

function AppDatePicker({
  label = 'Select Date',
  value,
  onChange,
  minDate,
  maxDate,
  disableFuture,
  disablePast,
  sx={},
  disabled,
  ...props
}) {
  return (
    
      <LocalizationProvider dateAdapter={AdapterMoment} >
      <MuiDatePicker
        label={label}
        value={value ? moment(value) : null}
        onChange={(newValue) => {
          onChange(newValue ? moment(newValue).format('YYYY-MM-DD') : null);
        }}
        slotProps={{ 
            textField: { size: "small", sx : {'& .MuiInputBase-root':{borderRadius: '10px'},...sx},fullWidth: true, error : Boolean(props?.error), helperText : props?.error}, 
            openPickerButton: { color: 'primary' },
        }}
        disabled={disabled}
        minDate={minDate ? moment(minDate) : undefined}
        maxDate={maxDate ? moment(maxDate) : undefined}
        disableFuture={disableFuture}
        disablePast={disablePast}
        renderInput={(params) => <TextField 
          {...params} {...props} 
          size='small' />}
      />
    </LocalizationProvider>
   
  );
}


export default AppDatePicker;
