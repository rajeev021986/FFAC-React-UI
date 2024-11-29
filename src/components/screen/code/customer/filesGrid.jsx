import React from "react";
import { Grid, Button, IconButton } from "@mui/material";
import InputBox from "../../../common/InputBox";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function filesGrid({ formik }) {
  const customerEntityEmailsIds = formik.values.customerEntityEmailsIds || [
    { emailId: "", designation: "" },
  ];
  // Handler to update row data
  const updateRow = (index, field, value) => {
    const newMappingRows = [...customerEntityEmailsIds];
    newMappingRows[index][field] = value;
    formik.setFieldValue("customerEntityEmailsIds", newMappingRows);
  };

  // Add new handler for adding rows
  const addNewRow = () => {
    const newMappingRows = [...customerEntityEmailsIds, { emailId: "", designation: "" }];
    formik.setFieldValue("customerEntityEmailsIds", newMappingRows);
  };

  // Add delete handler
  const deleteRow = (index) => {
    const newMappingRows = customerEntityEmailsIds.filter((_, i) => i !== index);
    formik.setFieldValue("customerEntityEmailsIds", newMappingRows);
  };

  return (
    <>
      {customerEntityEmailsIds.map((row, index) => (
        <Grid container spacing={2} key={index} alignItems="center">

          <Grid item xs={12} sm={3} lg={4}>
            <InputBox
              label="Designation"
              id={`customerEntityEmailsIds-${index}-designation`}
              value={row.designation}
              onChange={(e) => updateRow(index, "designation", e.target.value)}
              sx={{ marginTop: "16px", marginBottom: "8px" }}
              error={formik.errors?.customerEntityEmailsIds?.[index]?.designation}
            />
          </Grid>
          <Grid item xs={12} sm={3} lg={5}>
            <InputBox
              label="Email ID"
              id={`customerEntityEmailsIds-${index}-emailId`}
              value={row.emailId}
              onChange={(e) => updateRow(index, "emailId", e.target.value)}
              sx={{ marginTop: "16px", marginBottom: "8px" }}
              error={formik.errors?.customerEntityEmailsIds?.[index]?.emailId}
            />
          </Grid>
          <Grid item xs={12} sm={1} lg={1}>
           
              <IconButton 
                onClick={() => deleteRow(index)}
                color="error"
                sx={{ marginTop: "16px" }}
              >
                <RemoveIcon />
              </IconButton>
          </Grid>

        </Grid>
      ))}
      
      <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addNewRow}
        >
          Add Email
        </Button>
      </Grid>
    </>
  );
}
