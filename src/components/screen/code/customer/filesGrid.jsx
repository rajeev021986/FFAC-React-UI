import React from "react";
import { Grid } from "@mui/material";
import InputBox from "../../../common/InputBox";
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
          <Grid item xs={12} sm={3} lg={6}>
            <InputBox
              label="Email ID"
              id={`customerEntityEmailsIds-${index}-emailId`}
              value={row.emailId}
              onChange={(e) => updateRow(index, "emailId", e.target.value)}
              sx={{ marginTop: "16px", marginBottom: "8px" }}
              error={formik.errors?.customerEntityEmailsIds?.[index]?.emailId}
            />
          </Grid>

        </Grid>
      ))}
    </>
  );
}
