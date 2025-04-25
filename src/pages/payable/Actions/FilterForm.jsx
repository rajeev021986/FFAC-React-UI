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
      invoiceType: inputs.invoiceType || "",
      vendorName: inputs.vendorName || "",
      exchangeRate: inputs.exchangeRate || "",
      payableRefNo: inputs.payableRefNo || "",
      vendorInvoiceNo: inputs.vendorInvoiceNo || "",
      statusCode: inputs.statusCode || "",
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
        invoiceType: "",
        vendorName: "",
        exchangeRate: "",
        payableRefNo: "",
        vendorInvoiceNo: "",
        statusCode: "",
        isDoc: "",
      })
    );
    formik.setValues({
      jobNo: "",
      currency: "",
      invoiceType: "",
      vendorName: "",
      exchangeRate: "",
      payableRefNo: "",
      vendorInvoiceNo: "",
      statusCode: "",
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
            label="Invoice Type"
            id="invoiceType"
            value={formik.values.invoiceType}
            onChange={formik.handleChange}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <InputBox
            label="Vendor Name"
            id="vendorName"
            value={formik.values.vendorName}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Currency"
            id="exchangeRate"
            value={formik.values.exchangeRate}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Payable Ref. No."
            id="payableRefNo"
            value={formik.values.payableRefNo}
            onChange={formik.handleChange}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <InputBox
            label="Vendor Invoice No."
            id="vendorInvoiceNo"
            value={formik.values.vendorInvoiceNo}
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
