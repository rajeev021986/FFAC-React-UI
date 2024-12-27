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
      customerName: inputs.customerName || "",
      tinNo: inputs.tinNo || "",
      vatNo: inputs.vatNo || "",
    },
    onSubmit: (values) => {
      dispatch(updateInput(values));
    },
  });
  const handleReset = () => {
    formik.resetForm();
    dispatch(
      updateInput({
        customerName: "",
        tinNo: "",
        vatNo: "",
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
            id="customerName"
            value={formik.values.customerName}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Tin No"
            id="tinNo"
            value={formik.values.tinNo}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Vat No"
            id="vatNo"
            value={formik.values.vatNo}
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
