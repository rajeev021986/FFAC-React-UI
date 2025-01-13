import React, { useState } from "react";
import InputBox from "./InputBox";
import { TextField } from "@mui/material";

export default function InputBoxForGrid(props) {
  const { id, value, field, api } = props;
  const [inputValue, setInputValue] = useState(value || "");

  const handleChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    api.setEditCellValue({ id, field, value: newValue }, event);
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
      <TextField
        size="small"
        type="text"
        value={inputValue}
        onChange={handleChange}
        sx={{
          marginBottom: "0px",
          marginTop: "0px",
          width:"90%"
        }}
      />
    </div>
  );
}
