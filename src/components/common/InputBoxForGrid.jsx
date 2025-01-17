import React, { useState } from "react";
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

  const handleChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    api.setEditCellValue({ id, field, value: newValue }, event);
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
          api.startCellEditMode({ id, field });
        }
      }}
      onMouseLeave={() => {
        if (props?.cellMode === "edit") {
          api.stopCellEditMode({ id, field });
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
                }}
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
                  fullWidth={true}
                  value={inputValue}
                  onChange={handleChange}
                  inputRef={inputRef}
                  placeholder={placeholder}
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
                    style: {
                      textAlign: "center", // Center the placeholder text as well
                    },
                  }}
                />
              </Tooltip>
            );
        }
      })()}
    </div>
  );
}
