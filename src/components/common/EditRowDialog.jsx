import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

const EditRowDialog = ({ state, EditRowDialogopen, handleClose }) => {
  const [formValues, setFormValues] = useState({});
  useEffect(() => {
    setFormValues({ ...state?.data });
  }, [state]);
  const handleChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSubmit = () => {
    const updatedValues = state?.formik.values[state.tabName].map((item) =>
      item.id === state?.data.id ? formValues : item
    );
    state.formik.setFieldValue(state.tabName, updatedValues);
  };

  return (
    <>
      <Dialog
        open={EditRowDialogopen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{state?.tabName}</DialogTitle>
        <DialogContent>
          {state?.columns
            ?.filter((field) => field.field !== "actions")
            .map((field) => (
              <div key={field.field} style={{ marginTop: "16px" }}>
                {field.fieldType === "input" && (
                  <TextField
                    label={field.headerName}
                    fullWidth
                    size="small"
                    value={formValues[field.field] || ""}
                    onChange={(e) => handleChange(field.field, e.target.value)}
                    {...field}
                  />
                )}
                {field.fieldType === "dropdown" && (
                  <TextField
                    label={field.headerName}
                    fullWidth
                    select
                    size="small"
                    value={formValues[field.field] || ""}
                    onChange={(e) => handleChange(field.field, e.target.value)}
                    {...field}
                  >
                    {field.options.map((option) => (
                      <MenuItem key={option.id} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </div>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
          <Button
            onClick={() => {
              handleSubmit();
              handleClose();
            }}
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditRowDialog;
