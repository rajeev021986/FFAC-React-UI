import { Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../../common/InputBox";
import { updateInput } from "../../../../store/freatures/icdSlice";
import { OutlinedButton } from "../../../common/Button";
import { useFormik } from "formik";
import SelectBox from "../../../common/SelectBox";
import { MarginRounded } from "@mui/icons-material";

export default function IcdFilterForm({ setFilterOpen }) {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.icd.formData);

  const formik = useFormik({
    initialValues: {
      icdCode: inputs.icode || "",
      icdName: inputs.iname || "",
      email: inputs.email || "",
    },
    onSubmit: (values) => {
      dispatch(updateInput(values));
      setFilterOpen(false);
    },
  });
  const handleReset = () => {
    formik.resetForm();
    setFilterOpen(false);
    dispatch(
      updateInput({
        icdCode: "",
        icdName: "",
        email: "",
      })
    );
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
            label="Icd Name"
            id="icdName"
            value={formik.values.icdName}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Icd Code"
            id="icdCode"
            value={formik.values.icdCode}
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
            apply
          </OutlinedButton>
        </Stack>
      </Stack>
    </div>
  );
}
