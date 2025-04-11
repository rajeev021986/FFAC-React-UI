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

  const tooltipMessage = value ? value : "This field is empty";
  const [inputValue, setInputValue] = useState(value || "");
  const [error, setError] = useState(false);
  useEffect(() => {
    if (props?.cellMode === "view") {
      setInputValue(props.value);
    }
  }, [props.value]);
  const handleChange = (event) => {
    const rawValue = event.target.value;
  
    // Remove any non-alphanumeric characters
    const sanitizedValue = rawValue.replace(/[^a-zA-Z0-9]/g, '');
  
    setInputValue(sanitizedValue);
    setError(false);
  
    if (field === "tflSealNo") {
      api.setEditCellValue({ id, field, value: sanitizedValue }, event);
    } else {
      api.setEditCellValue({ id, field, value: rawValue }, event);
    }
  };
  
  const handleChangeContainerNo = (event) => {
    let newValue = event.target.value.replace(/[^a-zA-Z0-9]/g, '');
  
    let lettersCount = 0;
    let digitsCount = 0;
    let finalValue = "";
  
    for (let char of newValue) {
      if (/[a-zA-Z]/.test(char) && lettersCount < 4) {
        finalValue += char;
        lettersCount++;
      } else if (/\d/.test(char) && digitsCount < 7) {
        finalValue += char;
        digitsCount++;
      }
  
      // Stop processing if both limits are reached
      if (lettersCount === 4 && digitsCount === 7) break;
    }
  
    setInputValue(finalValue);
  
    const isValid = /^[a-zA-Z]{4}\d{7}$/.test(finalValue);
  
    if (isValid) {
      api.setEditCellValue({ id, field, value: finalValue }, event);
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
                    // maxLength: 11, // Prevents extra characters
                  }}
                  // {...props}
                />
              </Tooltip>
            );
        }
      })()}
    </div>
  );
}
