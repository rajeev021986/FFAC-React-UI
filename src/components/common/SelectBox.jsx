import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FormHelperText } from "@mui/material";

export default function SelectBox({
  placeholder = false,
  inputRef,
  sx,
  value,
  onChange,
  label,
  getPage,
  id,
  helperText,
  options,
  error,
  fullWidth = true,
  ...props
}) {
  return (
    <FormControl
      fullWidth={fullWidth}
      size="small"
      error={error ? true : false}
      sx={{ marginLeft: "0px !important" }}
    >
      <InputLabel id={`${id}-simple-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${id}-simple-select-label`}
        id={id}
        name={id}
        value={value}
        label={label}
        onChange={onChange}
        size="small"
        renderValue={(selected) => {
          const selectedOption = options?.find(
            (opt) => opt.value === selected
          );
          return selectedOption ? selectedOption.label || selectedOption.value : selected;
        }}
        sx={{
          ...styles.root,
          ...sx,
          height: "44px",

          "& .MuiSelect-select span::before": {
            content: placeholder ? "'Select an option'" : "''",
            color: "#9090A5",
          },
        }}
        {...props}
        inputRef={inputRef}
      >
        <MenuItem
          disabled={
            getPage === "editJobEntry" ||
            id === "currency" ||
            id === "vatApplicable" ||
            id === "withHoldingTax" || 
            id === "paymentType"
          }
          sx={{ fontSize: "14px" }}
          value=""
        >
          <em>None</em>
        </MenuItem>
        {options?.map((option, idx) => (
          <MenuItem
            disabled={getPage === "editJobEntry"}
            key={idx}
            value={option?.value}
          >
            {option?.label || option?.value}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}

const styles = {
  root: {
    borderRadius: "10px",
    fontSize: "14px",
  },
};
