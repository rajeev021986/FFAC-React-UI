import { Button, MenuItem, Select, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../../common/InputBox";
import { OutlinedButton } from "../../../common/Button";
import { useFormik } from "formik";
import { updateVendorInput } from "../../../../store/freatures/vendorSlice";
import SelectBox from "../../../common/SelectBox";

export default function VendorFilterForm({ setFilterOpen }) {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.vendor.formData);

  const formik = useFormik({
    initialValues: inputs || {
      tinNo: inputs.tinNo || "",
      vendorName: inputs.vendorName || "",
      vrnNo: inputs.country || "",
      isApproved: inputs.isApproved || "",
      isDoc: inputs.isDoc || "",
    },
    onSubmit: (values) => {
      dispatch(updateVendorInput(values));
      setFilterOpen(false);
    },
  });
  const handleReset = () => {
    setFilterOpen(false);
    dispatch(
      updateVendorInput({
        tinNo: "",
        vendorName: "",
        vrnNo: "",
        isApproved: "",
        isDoc: "",
      })
    );
    formik.setValues({
      tinNo: "",
      vendorName: "",
      vrnNo: "",
      isApproved: "",
      isDoc: "",
    });
  };
  const StatusOptions = [
    { label: "Active", value: 1 },
    { label: "InActive", value: -2 },
    { label: "New & Pen Doc", value: 0 },
    { label: "Rejected", value: -1 },
  ];
  const StatusOptionsDoc = [
    { value: false, label: "Pending" },
    { value: true, label: "Available" },
  ];
  return (
    <div>
      <Stack spacing={4} direction="column" justifyContent="space-between">
        <Stack
          direction="row"
          flexWrap="wrap"
          justifyContent="space-between"
          spacing={2}
          gap={2}
        >
          <InputBox
            label="Vendor Name"
            id="vendorName"
            value={formik.values.vendorName}
            onChange={formik.handleChange}
            sx={{ width: "48%" }}
          />
          <InputBox
            label="Tin No"
            id="tinNo"
            value={formik.values.tinNo}
            onChange={formik.handleChange}
            sx={{ width: "48%", marginLeft: "0px !important" }}
          />
          <InputBox
            label="Vrn No"
            id="vrnNo"
            value={formik.values.vrnNo}
            onChange={formik.handleChange}
            sx={{ width: "48%", marginLeft: "0px !important" }}
          />
          <div style={{ width: "48%", marginLeft: "0px" }}>
            <SelectBox
              label="Status"
              id="isApproved"
              options={StatusOptions}
              value={formik.values.isApproved}
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
              options={StatusOptionsDoc}
              value={formik.values.isDoc}
              onChange={formik.handleChange}
              sx={{ marginLeft: "0px !important" }}
              MenuProps={{
                disablePortal: true,
              }}
            />
          </div>
        </Stack>

        <Stack direction="row" spacing={3} justifyContent="flex-end">
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
            sx={{
              borderRadius: "12px",
              padding: "6px 16px",
              textTransform: "capitalize",
            }}
          >
            Apply
          </OutlinedButton>
        </Stack>
      </Stack>
    </div>
  );
}
