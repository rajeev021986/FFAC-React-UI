import React, { useEffect } from "react";
import { TextField, Select, MenuItem } from "@mui/material";

const InputBoxForGridTab = (props) => {
  let {
    value,
    onChange,
    onBlur,
    field,
    id,
    formik,
    api,
    arrayName,
    fieldType = "input",
    options = [],
  } = props;

  const handleBlur = (event) => {
    formik.setValues({
      ...formik.values,
      [arrayName]: formik.values[arrayName].map((a) => {
        if (a.id === id) {
          return { ...a, [field]: event.target.value };
        }
        return a;
      }),
    });
    if (onBlur) onBlur(event);
  };
  useEffect(() => {
    if (formik?.values[arrayName]) {
      const currentItem = formik.values[arrayName].find((a) => a.id === id);
      if (currentItem && currentItem[field] !== value) {
        value = currentItem[field]; 
      }
    }
  }, [formik.values, arrayName, id, field, value]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    api.updateRows([{ id, [field]: newValue }]);
    if (onChange) onChange(event);
  };
  const handleKeyDown = (event) => {
    event.stopPropagation();
  };
  const renderInput = () => {
    switch (fieldType) {
      case "input":
        return (
          <TextField
            value={value || ""}
            placeholder={`Enter ${field}`}
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyDown={handleKeyDown} 
            error={formik?.errors?.[arrayName]?.[id]?.[field] ? true : false}
            fullWidth
            size="small"
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
                textAlign: "center",
              },
            }}
            sx={{
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
            {...props}
          />
        );
      case "dropdown":
        return (
          <Select
            value={value || ""}
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={`Enter ${field}`}
            fullWidth
            onKeyDown={handleKeyDown} 
            displayEmpty
            size="small"
            style={{
              fontSize: "14px",
              borderRadius: "10px",
              textAlign: "center",
              marginTop: "5px",
              marginBottom: "8px",
            }}
            {...props}
          >
            <MenuItem value="" disabled>
              Select {field}
            </MenuItem>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.value}
              </MenuItem>
            ))}
          </Select>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      {renderInput()}
    </div>
  );
};

export default InputBoxForGridTab;
