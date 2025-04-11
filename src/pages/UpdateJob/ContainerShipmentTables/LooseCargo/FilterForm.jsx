import React from "react";
import { Button, Stack } from "@mui/material";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../../../components/common/InputBox";
import { updateInput } from "../../../../store/freatures/LoseCargoSlice";
import { OutlinedButton } from "../../../../components/common/Button";

export default function FilterForm({ setFilterOpen }) {
  const dispatch = useDispatch();
  const inputs = useSelector((s) => s?.looseCargo?.formData);

  const formik = useFormik({
    initialValues: inputs || {
      trailerNo: inputs.trailerNo || "",
      packageType: inputs.packageType || "",
      transporter: inputs.transporter || "",
      truckNo: inputs.truckNo || "",
      truckTrailerNo: inputs.truckTrailerNo || "",
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
        trailerNo: "",
        packageType: "",
        transporter: "",
        truckNo: "",
        truckTrailerNo: "",
      })
    );
    formik.setValues({
      trailerNo: "",
      packageType: "",
      transporter: "",
      truckNo: "",
      truckTrailerNo: "",
    });
  };

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Trcuk No."
            id="trailerNo"
            value={formik.values.trailerNo}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Package Type"
            id="packageType"
            value={formik.values.packageType}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Transporter"
            id="transporter"
            value={formik.values.transporter}
            onChange={formik.handleChange}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <InputBox
            label="Truck No."
            id="truckNo"
            value={formik.values.truckNo}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Truck Trailer No."
            id="truckTrailerNo"
            value={formik.values.truckTrailerNo}
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
