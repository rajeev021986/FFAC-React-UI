import React from "react";
import { Button, Stack } from "@mui/material";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../../../components/common/InputBox";
import { updateInput } from "../../../../store/freatures/containersSlice";
import { OutlinedButton } from "../../../../components/common/Button";

export default function FilterForm({ setFilterOpen }) {
  const dispatch = useDispatch();
  const inputs = useSelector((s) => s?.containers?.formData);

  const formik = useFormik({
    initialValues: inputs || {
      containerNo: inputs.containerNo || "",
      sizeType: inputs.sizeType || "",
      sealNo: inputs.sealNo || "",
      truckTrailerNo: inputs.truckTrailerNo || ""
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
        containerNo: "",
        sizeType: "",
        sealNo: "",
        truckTrailerNo: ""
      })
    );
    formik.setValues({
      containerNo: "",
      sizeType: "",
      sealNo: "",
      truckTrailerNo: ""
    });
  };

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Container No."
            id="containerNo"
            value={formik.values.containerNo}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Size Type"
            id="sizeType"
            value={formik.values.sizeType}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Seal No."
            id="sealNo"
            value={formik.values.sealNo}
            onChange={formik.handleChange}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
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
