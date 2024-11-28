import { Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../../common/InputBox";
import { updateInput } from "../../../../store/freatures/CustomerSlice";
import { OutlinedButton } from "../../../common/Button";
import { useFormik } from "formik";

export default function FilterForm() {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.codeCustomer.formData);

  const formik = useFormik({
    initialValues: {
      acode: inputs.acode || "",
      city: inputs.city || "",
      cname: inputs.cname || "",
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
        acode: "",
        city: "",
        cname: "",
        country: "",
      })
    );
  };

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        {/* <InputBox
            label="Code"
            id="acode"
            value={formik.values.acode}
            onChange={formik.handleChange}
          /> */}
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Customer Name"
            id="cname"
            value={formik.values.cname}
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
          <Button color="primary" size="small" onClick={handleReset}>
            reset
          </Button>
          <OutlinedButton
            color="primary"
            size="small"
            onClick={formik.handleSubmit}
          >
            apply
          </OutlinedButton>
        </Stack>
      </Stack>
    </div>
  );
}
