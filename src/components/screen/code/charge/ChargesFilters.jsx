import { Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../../common/InputBox";
import { OutlinedButton } from "../../../common/Button";
import { useFormik } from "formik";
import { updateInput } from "../../../../store/freatures/ChargesSlice";

export default function ChargesFilters() {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.chargesStore.formData);

  const formik = useFormik({
    initialValues: {
      chargeName: inputs.chargeName || "",
      chargeFor: inputs.chargeFor || "",
      chargeCode: inputs.chargeCode || "",
    },
    onSubmit: (values) => {
      dispatch(updateInput(values));
    },
  });
  const handleReset = () => {
    formik.resetForm();
    dispatch(
      updateInput({
        chargeName: "",
        chargeFor: "",
        chargeCode: "",
      })
    );
  };

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Charge Name"
            id="chargeName"
            value={formik.values.chargeName}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Charge For"
            id="chargeFor"
            value={formik.values.chargeFor}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Charge Code"
            id="chargeCode"
            value={formik.values.chargeCode}
            onChange={formik.handleChange}
          />
        </Stack>
        <Stack direction="row" spacing={3} justifyContent={"end"}>
          <Button
            color="primary"
            size="small"
            onClick={handleReset}
            sx={{ borderRadius: "12px" }}
          >
            reset
          </Button>
          <OutlinedButton
            color="primary"
            size="small"
            onClick={formik.handleSubmit}
            sx={{ borderRadius: "12px" }}
          >
            apply
          </OutlinedButton>
        </Stack>
      </Stack>
    </div>
  );
}
