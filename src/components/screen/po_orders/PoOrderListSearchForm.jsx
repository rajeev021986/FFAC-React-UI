import { Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../common/InputBox";
import { OutlinedButton } from "../../common/Button";
import { useFormik } from "formik";
// import { updatePackingListInput } from "../../../store/freatures/packingListSlice";
// import AppDatePicker from "../../common/AppDatePicker";
import { appDateFormat } from "../../utils/date";
import { updatePoOrderListInput } from "../../../store/freatures/PoOrderListSlice";

export default function PoOrderListSearchForm() {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.poOrderList.formData);

  const formik = useFormik({
    initialValues: {
      order_no: inputs.order_no || "",
      supplier: inputs.supplier || "",
      vendor_name: inputs.vendor_name || "",
      profoma_po: inputs.profoma_po || "",
    },
    onSubmit: (values) => {
      console.log(values);
      // values.fromDate = appDateFormat(values.fromDate);
      // values.toDate = appDateFormat(values.toDate);
      dispatch(updatePoOrderListInput(values));
    },
  });
  const handleReset = () => {
    formik.resetForm();
    dispatch(
      updatePoOrderListInput({
        order_no: "",
        supplier: "",
        vendor_name : '',
        profoma_po : ''
      })
    );
  };

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        <Stack direction="row" spacing={3}>
          <InputBox
            label="Order Number"
            id="order_no"
            value={formik.values.order_no}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Supplier"
            id="supplier"
            value={formik.values.supplier}
            onChange={formik.handleChange}
          />
        </Stack>
        <Stack direction="row" spacing={3}>
          <InputBox
            label="Vendor Name"
            id="vendor_name"
            value={formik.values.vendor_name}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Proforma PO"
            id="profoma_po"
            value={formik.values.profoma_po}
            onChange={formik.handleChange}
          />
        </Stack>
        {/* <Stack direction="row" spacing={3}>
          <AppDatePicker 
            label='From Date'
            value={formik.values.fromDate}
            onChange={(newValue) => formik.setFieldValue('fromDate', newValue)}
            id="fromDate"
          />
          <AppDatePicker 
            label='To Date'
            value={formik.values.toDate}
            onChange={(newValue) => formik.setFieldValue('toDate', newValue)}
            id="toDate"
          />
        </Stack> */}
        <Stack direction="row" spacing={3} justifyContent={"end"}>
          <Button color="primary" size="small" onClick={handleReset}>
            reset
          </Button>
          <OutlinedButton
            color="primary"
            size="small"
            onClick={formik.handleSubmit}
          >
            apply
          </OutlinedButton>
        </Stack>
      </Stack>
    </div>
  );
}
