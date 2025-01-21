import { Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../../common/InputBox";
import { OutlinedButton } from "../../../common/Button";
import { useFormik } from "formik";
import { updateInput } from "../../../../store/freatures/ChargesSlice";
import SelectBox from "../../../common/SelectBox";

export default function ChargesFilters({ setFilterOpen }) {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.chargesStore.formData);

  const formik = useFormik({
    initialValues: {
      chargeName: inputs.chargeName || "",
      chargeCode: inputs.chargeCode || "",
      statusCode: inputs.statusCode || "",
    },
    onSubmit: (values) => {
      dispatch(updateInput(values));
      setFilterOpen(false);
    },
  });
  const handleReset = () => {
    formik.resetForm();
    dispatch(
      updateInput({
        chargeName: "",
        chargeCode: "",
        statusCode: "",
      })
    );
    formik.setValues({
      chargeName: "",
      chargeCode: "",
      statusCode: "",
    });
    setFilterOpen(false);
  };

  const statusOptions = [
    { value: 1, label: "Active" },
    { value: -2, label: "InActive" },
  ];

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
            label="Charge Code"
            id="chargeCode"
            value={formik.values.chargeCode}
            onChange={formik.handleChange}
          />
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
