import { Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../../components/common/InputBox";
import { updateInput } from "../../../store/freatures/paymentApprovalSlice";
import { OutlinedButton } from "../../../components/common/Button";
import { useFormik } from "formik";
import SelectBox from "../../../components/common/SelectBox";

export default function FilterForm({ setFilterOpen }) {
  const dispatch = useDispatch();
  const statusOptions = [
    { value: 100, label: "Paid" },
    { value: 101, label: "Unpaid" },
  ];
  const inputs = useSelector((state) => state.accountsPendingPayments.formData);
  const formik = useFormik({
    initialValues: inputs || {
      vendorName: inputs.vendorName || "",
      invoiceType: inputs.invoiceType || "",
      paybleRefNum: inputs.paybleRefNum || "",
      jobNo: inputs.jobNo || "",
      customerName: inputs.customerName || "",
      vendorInvNo: inputs.vendorInvNo || "",
      // totalAmount: inputs.totalAmount || "",
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
        vendorName: "",
        invoiceType: "",
        paybleRefNum: "",
        jobNo: "",
        customerName: "",
        vendorInvNo: "",
        // totalAmount: "",
        currency: "",
      })
    );
    formik.setValues({
      vendorName: "",
      invoiceType: "",
      paybleRefNum: "",
      jobNo: "",
      customerName: "",
      vendorInvNo: "",
      // totalAmount: "",
      currency: "",
    });
  };

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Vendor Name"
            id="vendorName"
            value={formik.values.vendorName}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Invoice Type"
            id="invoiceType"
            value={formik.values.invoiceType}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Payble Ref. No."
            id="paybleRefNum"
            value={formik.values.paybleRefNum}
            onChange={formik.handleChange}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <InputBox
            label="Job No."
            id="jobNo"
            value={formik.values.jobNo}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Customer Name"
            id="customerName"
            value={formik.values.customerName}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Vendor InvNo."
            id="vendorInvNo"
            value={formik.values.vendorInvNo}
            onChange={formik.handleChange}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Currency"
            id="currency"
            value={formik.values.currency}
            onChange={formik.handleChange}
          />
          <SelectBox
            sx={{ marginLeft: "8px !important" }}
            label="Status"
            id="paymentStatus"
            options={statusOptions}
            value={formik.values.statusCode}
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
