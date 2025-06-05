import { Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../../components/common/InputBox";
import { updateInput } from "../../../store/freatures/payableEntrySlice";
import { OutlinedButton } from "../../../components/common/Button";
import SelectBox from "../../../components/common/SelectBox";
import { useFormik } from "formik";

export default function FilterForm({ setFilterOpen }) {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.codeCustomer.formData);

  const formik = useFormik({
    initialValues: inputs || {
      jobNo: inputs.jobNo || "",
      currency: inputs.currency || "",
      customerName: inputs.customerName || "",
      companyCode: inputs.companyCode || "",
      exchangeRate: inputs.exchangeRate || "",
      consigneeName: inputs.consigneeName || "",
      receivableRefNo: inputs.receivableRefNo || "",
      status: inputs.status || "",
      isDoc: inputs.isDoc || "",
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
        jobNo: "",
        currency: "",
        customerName: "",
        companyCode: "",
        exchangeRate: "",
        consigneeName: "",
        receivableRefNo: "",
        status: "",
        isDoc: "",
      })
    );
    formik.setValues({
      jobNo: "",
      currency: "",
      customerName: "",
      companyCode: "",
      exchangeRate: "",
      consigneeName: "",
      receivableRefNo: "",
      status: "",
      isDoc: "",
    });
  };

  const statusOptions = [
    { value: 1, label: "Pending" },
    { value: -2, label: "Approve" },
    { value: -1, label: "Rejected" },
  ];

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Job No."
            id="jobNo"
            value={formik.values.jobNo}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Currency"
            id="currency"
            value={formik.values.currency}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Customer Name"
            id="customerName"
            value={formik.values.customerName}
            onChange={formik.handleChange}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <InputBox
            label="Company Code"
            id="companyCode"
            value={formik.values.companyCode}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Consignee Name"
            id="consigneeName"
            value={formik.values.consigneeName}
            onChange={formik.handleChange}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <InputBox
            label="Receivable RefNo"
            id="receivableRefNo"
            value={formik.values.receivableRefNo}
            onChange={formik.handleChange}
          />
          <SelectBox
            sx={{ marginLeft: "8px !important" }}
            label="Status"
            id="status"
            options={statusOptions}
            value={formik.values.status}
            onChange={formik.handleChange}
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
