import { Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../../common/InputBox";
import { OutlinedButton } from "../../../common/Button";
import { useFormik } from "formik";
import { updatePortInput } from "../../../../store/freatures/portSlice";
import SelectBox from "../../../common/SelectBox";
import FormAutoComplete from "../../../common/AutoComplete/FormAutoComplete";

export default function PortFilterForm({ setFilterOpen }) {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.port.formData);

  const formik = useFormik({
    initialValues: {
      newPortName: inputs.newPortName || "",
      country: inputs.country || "",
      statusCode: inputs.statusCode || "",
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
        country: "",
        statusCode: "",
      })
    );
    formik.setValues({
      newPortName: "",
      country: "",
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
          <FormAutoComplete
            label="Country"
            id="country"
            suggestionName="country"
            value={formik.values.country}
            error={formik.errors.country}
            onChange={formik.handleChange}
          ></FormAutoComplete>

          <SelectBox
            label="Status"
            id="statusCode"
            options={statusOptions}
            value={formik.values.statusCode}
            onChange={formik.handleChange}
            sx={{ marginLeft: "5px !important" }}
            MenuProps={{
              disablePortal: true,
            }}
          />
        </Stack>
        <Stack direction="row" spacing={3} justifyContent={"end"}>
          <Button
            color="primary"
            size="small"
            onClick={handleReset}
            sx={{
              borderRadius: "12px",
              padding: "6px 16px",
              textTransform: "capitalize",
              backgroundColor: "#f5f5f5",
              color: "#333",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            reset
          </Button>
          <OutlinedButton
            color="primary"
            size="small"
            onClick={formik.handleSubmit}
            sx={{ borderRadius: "12px" }}
          >
            Apply
          </OutlinedButton>
        </Stack>
      </Stack>
    </div>
  );
}
