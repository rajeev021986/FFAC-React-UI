import { Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../../common/InputBox";
import { updateInput } from "../../../../store/freatures/CustomerSlice";
import { OutlinedButton } from "../../../common/Button";
import { useFormik } from "formik";
import SelectBox from "../../../common/SelectBox";

export default function FilterForm() {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.codeCustomer.formData);

  const formik = useFormik({
    initialValues: inputs || {
      customerName: inputs.customerName || "",
      tinNo: inputs.tinNo || "",
      vatNo: inputs.vatNo || "",
      isApproved: inputs.isApproved || "",
      isDoc: inputs.isDoc || "",
    },
    onSubmit: (values) => {
      dispatch(updateInput(values));
    },
  });
  const handleReset = () => {
    dispatch(
      updateInput({
        customerName: "",
        tinNo: "",
        vatNo: "",
        isApproved: "",
        isDoc: "",
      })
    );
    formik.setValues({
      customerName: "",
      tinNo: "",
      vatNo: "",
      isApproved: "",
      isDoc: "",
    });
  };

  const statusOptions = [
    { value: 1, label: "Active" },
    { value: -2, label: "InActive" },
    { value: 0, label: "New & Pen Doc" },
    { value: -1, label: "Rejected" },
  ];
  const documentOptions = [
    { value: false, label: "Pending" },
    { value: true, label: "Available" },
  ];

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        {/* <InputBox
            label="Code"
            id="acode"
            value={formik.values.acode}
            onChange={formik.handleChange}
          /> */}
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Customer Name"
            id="customerName"
            value={formik.values.customerName}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Tin No"
            id="tinNo"
            value={formik.values.tinNo}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Vat No"
            id="vatNo"
            value={formik.values.vatNo}
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
              id="isApproved"
              options={statusOptions}
              value={formik.values.isApproved}
              onChange={formik.handleChange}
              sx={{ marginLeft: "0px !important" }}
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
