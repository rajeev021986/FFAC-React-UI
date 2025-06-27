import { TextField } from "@mui/material";
import React from "react";

const styles = {
  root: {
    "& .MuiInputBase-root": {
      borderRadius: "10px",
      fontSize: "14px",
      padding: "3px 0",
    },
  },
};

/*
    @param value : string
    @param onChange : function
*/
export default function InputBox({
  sx,
  value,
  disabled = false,
  onChange,
  inputRef,
  label,
  id,
  minRows,
  multiline = false,
  error,
  type,
  ...props
}) {
  return (
    <TextField
      id={id}
      name={id}
      label={label}
      type={type}
      variant="outlined"
      fullWidth
      disabled={disabled}
      size="small"
      value={value}
      onChange={onChange}
      inputRef={inputRef}
      helperText={error}
      minRows={minRows}
      multiline={multiline}
      autoComplete="off"
      error={error ? true : false}
      
      // sx={{ ...styles.root, ...sx }}
      {...props}
      sx={{

        ...styles.root,
        ...sx,
        // Hide arrows in Chrome, Safari, Edge, Opera
        '& input[type=number]::-webkit-outer-spin-button': {
          WebkitAppearance: 'none',
          margin: 0,
        },
        '& input[type=number]::-webkit-inner-spin-button': {
          WebkitAppearance: 'none',
          margin: 0,
        },
        // Hide arrows in Firefox
        '& input[type=number]': {
          MozAppearance: 'textfield',
        },
      }}
    />
  );
}
