import { Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../../common/InputBox";
import { updateInput } from "../../../../store/freatures/consigneeSlice";
import { OutlinedButton } from "../../../common/Button";
import { useFormik } from "formik";
import SelectBox from "../../../common/SelectBox";

export default function ConsigneFilterForm({ setFilterOpen }) {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.consignee.formData);

  const formik = useFormik({
    initialValues: {
      standard_free_days: inputs.standard_free_days || "",
      consignee_name: inputs.consignee_name || "",
      standard_rate: inputs.standard_rate || "",
      statusCode: inputs.statusCode || "",
      isDoc: inputs.isDoc || "",
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
        standard_free_days: "",
        consignee_name: "",
        standard_rate: "",
        statusCode: "",
        isDoc: "",
      })
    );
    formik.setValues({
      standard_free_days: "",
      consignee_name: "",
      standard_rate: "",
      statusCode: "",
      isDoc: "",
    });
  };

  const statusOptions = [
    { value: 1, label: "Active" },
    { value: -2, label: "InActive" },
  ];
  const documentOptions = [
    { value: false, label: "Pending" },
    { value: true, label: "Available" },
  ];

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Consignee Name"
            id="consignee_name"
            value={formik.values.consignee_name}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Free Days"
            id="standard_free_days"
            value={formik.values.standard_free_days}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Rate"
            id="standard_rate"
            value={formik.values.standard_rate}
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
          <div style={{ width: "48%", marginLeft: "0px" }}>
            <SelectBox
              label="Doc Status"
              id="isDoc"
              options={documentOptions}
              value={formik.values.isDoc}
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
            Reset
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
