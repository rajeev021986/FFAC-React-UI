import { Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../../common/InputBox";
import { OutlinedButton } from "../../../common/Button";
import { useFormik } from "formik";
import { updateBondInput } from "../../../../store/freatures/bondSlice";
import SelectBox from "../../../common/SelectBox";

export default function BondFilterForm({ setFilterOpen }) {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.bond.formData);

  const formik = useFormik({
    initialValues: { ...inputs },
    onSubmit: (values) => {
      dispatch(updateBondInput(values));
    },
  });
  const handleReset = () => {
    setFilterOpen(false);
    formik.resetForm();
    dispatch(
      updateBondInput({
        bondNumber: "",
        bondType: "",
        statusCode: "",
      })
    );
    formik.setValues({
      bondNumber: "",
      bondType: "",
      statusCode: "",
    });
  };
  const StatusOptions = [
    { label: "Active", value: 1 },
    { label: "InActive", value: -2 },
    { label: "New & Pen Doc", value: 0 },
    { label: "Rejected", value: -1 },
  ];

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        <Stack
          direction="row"
          flexWrap="wrap"
          justifyContent="space-between"
          spacing={2}
          gap={2}
        >
          <InputBox
            label="Bond Number"
            id="bondNumber"
            value={formik.values.bondNumber}
            onChange={formik.handleChange}
            sx={{ width: "48%" }}
          />
          <InputBox
            label="Bond Type"
            id="bondType"
            value={formik.values.bondType}
            onChange={formik.handleChange}
            sx={{ width: "48%", marginLeft: "0px !important" }}
          />
          <div style={{ width: "48%", marginLeft: "0px" }}>
            <SelectBox
              label="Status"
              id="statusCode"
              options={StatusOptions}
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
