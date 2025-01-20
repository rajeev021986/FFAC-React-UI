import { Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../../common/InputBox";
import { updateInput } from "../../../../store/freatures/icdSlice";
import { OutlinedButton } from "../../../common/Button";
import { useFormik } from "formik";
import SelectBox from "../../../common/SelectBox";

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
    { value: 0, label: "Pending" },
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
            label="Code"
            id="icdCode"
            value={formik.values.icdCode}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Email"
            id="email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            width: "65.7%",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "48%", marginLeft: "0px" }}>
            <SelectBox
              label="Status"
              id="statusCode"
              options={statusOptions}
              value={formik.values.statusCode}
              onChange={formik.handleChange}
              sx={{ marginLeft: "0px !important" }}
              MenuProps={{
                disablePortal: true,
              }}
            />
          </div>
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
