import { TextField } from "@mui/material";
import React from "react";

const styles = {
  root: {
    "& .MuiInputBase-root": {
      borderRadius: "10px",
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
  error,
  ...props
}) {
  return (
    <TextField
      id={id}
      name={id}
      label={label}
      variant="outlined"
      margin="normal"
      fullWidth
      disabled={disabled}
      size="small"
      value={value}
      onChange={onChange}
      inputRef={inputRef}
      helperText={error}
      error={error ? true : false}
      sx={{ ...styles.root, ...sx }}
      {...props}
    />
  );
}
