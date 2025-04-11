import React from "react";
import { Button, Stack } from "@mui/material";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../../../components/common/InputBox";
import { updateInput } from "../../../../store/freatures/vehicleSlice";
import { OutlinedButton } from "../../../../components/common/Button";

export default function FilterForm({ setFilterOpen }) {
  const dispatch = useDispatch();
  const inputs = useSelector((s) => s?.vehicle?.formData);

  const formik = useFormik({
    initialValues: inputs || {
      chasisNo: inputs.chasisNo || "",
      engineType: inputs.engineType || "",
      driverCellNo: inputs.driverCellNo || "",
      clerkName: inputs.clerkName || "",
      clerkTelNo: inputs.clerkTelNo || ""
    },
    onSubmit: (values) => {
      dispatch(updateInput(values));
    },
  });

  const handleApply = (event) => {
    setFilterOpen(false);
    formik.handleSubmit(event);
  };

  const handleReset = () => {
    setFilterOpen(false);
    dispatch(
      updateInput({
        chasisNo: "",
        engineType: "",
        driverCellNo: "",
        clerkName: "",
        clerkTelNo: ""
      })
    );
    formik.setValues({
      chasisNo: "",
      engineType: "",
      driverCellNo: "",
      clerkName: "",
      clerkTelNo: ""
    });
  };

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Chasis No."
            id="chasisNo"
            value={formik.values.chasisNo}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Engine Type"
            id="engineType"
            value={formik.values.engineType}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Driver Cell No."
            id="driverCellNo"
            value={formik.values.driverCellNo}
            onChange={formik.handleChange}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Clerk Name"
            id="clerkName"
            value={formik.values.clerkName}
            onChange={formik.handleChange}
          />

          <InputBox
            label="Clerk Tel No."
            id="clerkTelNo"
            value={formik.values.clerkTelNo}
            onChange={formik.handleChange}
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
            Reset
          </Button>
          <OutlinedButton
            color="primary"
            size="small"
            onClick={(e) => handleApply(e)}
            sx={{ borderRadius: "12px" }}
          >
            Apply
          </OutlinedButton>
        </Stack>
      </Stack>
    </div>
  );
}
