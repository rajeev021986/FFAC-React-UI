import React, { useState } from "react";
import { MenuItem, Select, TextField } from "@mui/material";

export default function InputBoxForGrid(props) {
  const { id, value, field, api, type, options, onChange } = props;
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
        api.startCellEditMode({ id, field });
        console.log("Hovered over cell", id, props?.cellMode);
      }}
      onMouseLeave={() => {
        console.log("Hover left cell", id, props?.cellMode);
        api.stopCellEditMode({ id, field });
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
              <TextField
                size="small"
                type="text"
                value={inputValue}
                onChange={handleChange}
                sx={{
                  marginBottom: "0px",
                  marginTop: "0px",
                  width: "90%",
                }}
              />
            );
        }
      })()}
    </div>
  );
}
