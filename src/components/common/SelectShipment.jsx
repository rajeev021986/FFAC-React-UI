import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FormHelperText } from "@mui/material";
import CustomToast from "./Toast/CustomToast";
import toast from "react-hot-toast";

export default function SelectShipment({
  placeholder = false,
  inputRef,
  sx,
  value,
  onChange,
  label,
  id,
  getPage,
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
        defaultValue={"General/common"}
        name={id}
        value={value}
        label={label}
        onChange={onChange}
        onClick={() => {
          if (options?.length == undefined || options?.length < 1) {
            toast.custom(
              <CustomToast
                message="Please fill job pattern first."
                toast="error"
              />,
              {
                closeButton: false,
              }
            );
          }
        }}
        size="small"
        sx={{
          ...styles.root,
          ...sx,
          "& .MuiSelect-select span::before": {
            content: placeholder ? "'Select an option'" : "''",
            color: "#9090A5",
          },
        }}
        {...props}
        inputRef={inputRef}
      >
        <MenuItem
          defaultValue="General/Common"
          value="General/common"
          disabled={getPage == "editJobEntry"}
          sx={{ fontSize: "14px" }}
      
        >
          <em>General/Common</em>
        </MenuItem>
        {options?.map((option, idx) => (
          <MenuItem disabled ={getPage == "editJobEntry"} key={idx} value={option?.value}>
            {option?.value}
          </MenuItem>
        ))}
      </Select>

      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
}

const styles = {
  root: {
    borderRadius: "10px",
    fontSize: "14px",
  },
};
