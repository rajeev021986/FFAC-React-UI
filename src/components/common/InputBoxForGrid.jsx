import React, { useEffect, useState } from "react";
import { MenuItem, Select, TextField, Tooltip } from "@mui/material";

export default function InputBoxForGrid(props) {
  const {
    id,
    value,
    field,
    api,
    type,
    options,
    onChange,
    placeholder,
    fieldType = "text",
    inputRef,
  } = props;

  console.log(field,"field")
  const tooltipMessage = value ? value : "This field is empty";
  const [inputValue, setInputValue] = useState(value || "");
  const [error, setError] = useState(false);
  useEffect(() => {
    if (props?.cellMode === "view") {
      setInputValue(props.value);
    }
  }, [props.value]);
  const handleChange = (event) => {
    let isValid = true;
    const newValue = event.target.value;
    if (field == "tflSealNo ") {
      isValid = /^\d{11}$/.test(newValue); // Must be exactly 11 digits
    }

    setInputValue(newValue);
    setError(!isValid);
    if (isValid) {
      api.setEditCellValue({ id, field, value: newValue }, event);
    }
  };
  const handleChangeContainerNo = (event) => {
    const newValue = event.target.value;
    const isValid = /^[A-Za-z]{4}\d{7}$/.test(newValue); // 4 letters + 7 digits
  
    setInputValue(newValue);
    setError(!isValid); // Show error if invalid
  console.log(isValid,"isValid")
    if (isValid) {
      api.setEditCellValue({ id, field, value: newValue }, event);
    }
  };
  
  return (
    <div
      key={id}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
      onMouseEnter={() => {
        if (props?.cellMode === "view") {
          api?.startCellEditMode({ id, field });
        }
      }}
      onMouseLeave={() => {
        if (props?.cellMode === "edit") {
          api?.stopCellEditMode({ id, field });
        }
      }}
    >
      {(() => {
        switch (type) {
          case "dropdown":
            return (
              <Select
                size="small"
                value={inputValue}
                onChange={handleChange}
                sx={{
                  marginBottom: "0px",
                  marginTop: "0px",
                  width: "90%",
                  fontSize: "14px",
                  borderRadius: "10px",
                  textAlign: "center",
                  marginTop: "5px",
                  marginBottom: "8px",
                }}
                {...props}
              >
                {options?.map((a) => (
                  <MenuItem value={a.value}>{a.value}</MenuItem>
                ))}
              </Select>
            );
          default:
            return (
              <Tooltip title={tooltipMessage} arrow>
               <TextField
                  size="small"
                  type={fieldType}
                  fullWidth
                  value={inputValue}
                  onChange={ field == "containerNo"? handleChangeContainerNo :handleChange}
                  inputRef={inputRef}
                  placeholder={placeholder}
                  error={error}
                  helperText={error ? "Must be 4 letters & 7 digits (e.g., ABCD1234567)" : ""}
                  InputProps={{
                    disableUnderline: true,
                    style: {
                      border: "none",
                      fontSize: "14px",
                      borderRadius: "10px",
                      textAlign: "center",
                      marginTop: "5px",
                      marginBottom: "8px",
                    },
                  }}
                  inputProps={{
                    style: { textAlign: "center" },
                    maxLength: 11, // Prevents extra characters
                  }}
                  {...props}
                />
              </Tooltip>
            );
        }
      })()}
    </div>
  );
}
