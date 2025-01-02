import { Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../../common/InputBox";
import { updateInput } from "../../../../store/freatures/icdSlice";
import { OutlinedButton } from "../../../common/Button";
import { useFormik } from "formik";

export default function FilterForm() {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.icd.formData);
  

  const formik = useFormik({
    initialValues: {
      icdCode: inputs.icode || "",
      icdName: inputs.iname || "",
      email: inputs.email || "",
    },
    onSubmit: (values) => {
      dispatch(updateInput(values));
    },
  });
  const handleReset = () => {
    formik.resetForm();
    dispatch(
      updateInput({
        icdCode: "",
        icdName: "",
        email: "",
      })
    );
  };

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
       
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Icd Name"
            id="icdName"
            value={formik.values.icdName}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Code"
            id="icdCode"
            value={formik.values.icdCode}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Email"
            id="email"
            value={formik.values.email}
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
