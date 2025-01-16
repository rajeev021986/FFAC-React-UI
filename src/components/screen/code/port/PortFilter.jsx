import { Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../../common/InputBox";
import { OutlinedButton } from "../../../common/Button";
import { useFormik } from "formik";
import { updatePortInput } from "../../../../store/freatures/portSlice";
import SelectBox from "../../../common/SelectBox";

export default function PortFilterForm({ setFilterOpen }) {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.port.formData);

  const formik = useFormik({
    initialValues: {
      portName: inputs.newPortName || "",
      city: inputs.countryName || "",
      country: inputs.statusCode || "",
    },
    onSubmit: (values) => {
      dispatch(updatePortInput(values));
    },
  });
  const handleReset = () => {
    setFilterOpen(false);
    formik.resetForm();
    dispatch(
      updatePortInput({
        newPortName: "",
        countryName: "",
        statusCode: "",
      })
    );
    formik.setValues({
      newPortName: "",
      countryName: "",
      statusCode: "",
    });
  };

  const statusOptions = [
    { value: 1, label: "Active" },
    { value: -2, label: "InActive" },
    { value: 0, label: "Pending" },
  ];

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Port Name"
            id="newPortName"
            value={formik.values.newPortName}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Country Name"
            id="countryName"
            value={formik.values.countryName}
            onChange={formik.handleChange}
            sx={{ marginLeft: "5px !important" }}
          />

          <SelectBox
            label="Status"
            id="statusCode"
            options={statusOptions}
            value={formik.values.statusCode}
            onChange={formik.handleChange}
            sx={{ marginLeft: "5px !important" }}
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
