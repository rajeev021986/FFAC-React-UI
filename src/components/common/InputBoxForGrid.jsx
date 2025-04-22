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
    isEditable,
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
  
    // Remove non-alphanumeric characters
    const cleaned = rawValue.replace(/[^a-zA-Z0-9]/g, '');
  
    if (field === "tflSealNo") {
      let digitsCount = 0;
      let lettersCount = 0;
      let finalValue = '';
  
      for (const char of cleaned) {
        if (/\d/.test(char) && digitsCount < 7) {
          finalValue += char;
          digitsCount++;
        } else if (/[a-zA-Z]/.test(char) && lettersCount < 4) {
          finalValue += char;
          lettersCount++;
        }
  
        if (finalValue.length === 11) break;
      }
  
      setInputValue(finalValue);
      setError(false);
  
      // if (finalValue.length === 11) {
        api.setEditCellValue({ id, field, value: finalValue }, event);
      // }
    } else {
      // For all other fields
      const sanitized = rawValue.replace(/[^a-zA-Z0-9]/g, '');
      setInputValue(sanitized);
      setError(false);
      api.setEditCellValue({ id, field, value: sanitized }, event);
    }
  };
  
  
  
  
  const handleChangeContainerNo = (event) => {
    const rawValue = event.target.value.replace(/[^a-zA-Z0-9]/g, '');
  
    let lettersCount = 0;
    let digitsCount = 0;
    let finalValue = '';
  
    for (let char of rawValue) {
      if (/[a-zA-Z]/.test(char) && lettersCount < 4) {
        finalValue += char;
        lettersCount++;
      } else if (/\d/.test(char) && digitsCount < 7) {
        finalValue += char;
        digitsCount++;
      }
  
      if (lettersCount === 4 && digitsCount === 7) break;
    }
    setInputValue(finalValue);
    setError(false);
  
    // if (finalValue.length === 11) {
      api.setEditCellValue(
        { id, field, value: finalValue },
        event 
      );
    // }
  }; 
  
  
  const handleBlur = () => {
    if (
      (field === "containerNo" || field === "tflSealNo") &&
      inputValue.length !== 11
    ) {
      setError(true); // Show red border if not 11 characters
    } else {
      setError(false); // Hide error if it's valid
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
        // ✅ Prevent edit mode if the field is NOT editable
        if (props?.cellMode === "view" && props?.isEditable !== false) {
          api?.startCellEditMode({ id, field });
        }
      }}
      onMouseLeave={() => {
        // ✅ Only stop edit mode if the field is actually editable
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
                  type={  fieldType}
                  fullWidth
                  disabled={field === "balanceBondAmount" || props.disabled}
                  value={inputValue}
                  onBlur={handleBlur} 
                  onChange={
                    field == "containerNo"
                      ? handleChangeContainerNo
                      : handleChange
                  }
                  inputRef={inputRef}
                  placeholder={placeholder}
                  error={error}
                  // helperText={
                  //   error
                  //     ? "Container number must be exactly 11 characters."
                  //     : " " // ← reserve space
                  // }
                  FormHelperTextProps={{
                    style: {
                      marginTop: 0,
                      minHeight: "2em",
                    },
                  }}
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
