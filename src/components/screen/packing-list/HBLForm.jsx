import React, { useState, useEffect } from "react";
import { Button, IconButton, Grid, Box } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import InputBox from "../../common/InputBox";
import AppDatePicker from "../../common/AppDatePicker";

export default function HBLForm({ data, onChange }) {
  const [hblRows, setHblRows] = useState([{ hbl: "", hblDate: "" }]);
  console.log("hblDatahblDatahblData", data);

  useEffect(() => {
    if (data && data.length > 0) {
      setHblRows(data);
    }
  }, [data]);

  // Handler to add a new row
  const addRow = () => {
    const newHblRows = [...hblRows, { hbl: "", hblDate: "" }];
    setHblRows(newHblRows);
    onChange(newHblRows);
  };

  // Handler to delete a row
  const deleteRow = (index) => {
    const newHblRows = [...hblRows];
    newHblRows.splice(index, 1);
    setHblRows(newHblRows);
    onChange(newHblRows);
  };

  // Handler to update row data
  const updateRow = (index, field, value) => {
    const newHblRows = [...hblRows];
    newHblRows[index][field] = value;
    setHblRows(newHblRows);
    onChange(newHblRows);
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 1 }}>
        <Button
          startIcon={<Add />}
          onClick={addRow}
          variant="outlined"
          color="primary"
        >
          Add HBL
        </Button>
      </Box>

      {hblRows.map((row, index) => (
        <Grid container spacing={2} key={index} alignItems="center">
          <Grid item xs={12} sm={5}>
            <InputBox
              label="HBL"
              id={`hbl-${index}`}
              value={row.hbl}
              error={false} // Add your error handling logic here
              disabled={false}
              onChange={(e) => updateRow(index, "hbl", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={5}>
            <AppDatePicker
              id={`hblDate-${index}`}
              label="HBL Date"
              value={row.hblDate}
              onChange={(value) => updateRow(index, "hblDate", value)}
              disabled={false}
              sx={{ marginTop: "16px", marginBottom: "8px" }}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <IconButton
              color="error"
              onClick={() => deleteRow(index)}
              disabled={hblRows.length === 1}
            >
              <Delete />
            </IconButton>
          </Grid>
        </Grid>
      ))}
    </>
  );
}
