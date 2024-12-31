import { Button, Stack } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateInput } from "../../../../store/freatures/ExchangeRateSlice";
import InputBox from "../../../common/InputBox";
import { OutlinedButton } from "../../../common/Button";

export default function ExchangeRateFilters() {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.exchangeRateStore.formData);

  const formik = useFormik({
    initialValues: {
      currency: inputs.currency || "",
      usdExchange: inputs.usdExchange || "",
      ugxExchange: inputs.ugxExchange || "",
    },
    onSubmit: (values) => {
      dispatch(updateInput(values));
    },
  });
  const handleReset = () => {
    formik.resetForm();
    dispatch(
      updateInput({
        currency: "",
        usdExchange: "",
        ugxExchange: "",
      })
    );
  };

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Currency"
            id="currency"
            value={formik.values.currency}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Usd Exchange"
            id="usdExchange"
            value={formik.values.usdExchange}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Ugx Exchange"
            id="ugxExchange"
            value={formik.values.ugxExchange}
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
