import { Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../../common/InputBox";
import { updateInput } from "../../../../store/freatures/consigneeSlice";
import { OutlinedButton } from "../../../common/Button";
import { useFormik } from "formik";

export default function FilterForm() {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.consignee.formData);


  const formik = useFormik({
    initialValues: {
      city: inputs.city || "",
      consigneeName: inputs.consigneeName || "",
      country: inputs.country || "",
    },
    onSubmit: (values) => {
      dispatch(updateInput(values));
    },
  });
  const handleReset = () => {
    formik.resetForm();
    dispatch(
      updateInput({
        city: "",
        consigneeName: "",
        country: "",
      })
    );
  };

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
       
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Consignee Name"
            id="consigneeName"
            value={formik.values.consigneeName}
            onChange={formik.handleChange}
          />
          <InputBox
            label="City"
            id="city"
            value={formik.values.city}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Country"
            id="country"
            value={formik.values.country}
            onChange={formik.handleChange}
          />
        </Stack>
        <Stack direction="row" spacing={3} justifyContent={"end"}>
          <Button color="primary" size="small" onClick={handleReset} sx={{borderRadius: '12px'}}>
            reset
          </Button>
          <OutlinedButton
            color="primary"
            size="small"
            onClick={formik.handleSubmit}
            sx={{borderRadius: '12px'}}
          >
            apply
          </OutlinedButton>
        </Stack>
      </Stack>
    </div>
  );
}
