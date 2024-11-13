import { Button, Stack } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputBox from '../../common/InputBox';
import { OutlinedButton } from '../../common/Button';
import { useFormik } from 'formik';
import AppDatePicker from '../../common/AppDatePicker';
import { appDateFormat } from '../../utils/date';
import { updateServiceInvoiceInput } from '../../../store/freatures/serviceInvoiceSlice';


export default function SISearchForm() {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.serviceInvoice.formData);


  const formik = useFormik({
    initialValues: {
      invoice_no : inputs?.invoice_no,
      mbl_no : inputs?.mbl_no,
      fromDate: inputs?.fromDate,
      toDate: inputs?.toDate,
    },
    onSubmit: (values) => {
      console.log(values);
      values.fromDate = appDateFormat(values.fromDate);
      values.toDate = appDateFormat(values.toDate);
      dispatch(updateServiceInvoiceInput(values));
    }
  });
  const handleReset = () => {
    formik.resetForm();
    dispatch(updateServiceInvoiceInput({
      invoice_no: '',
      mbl_no: '',
      fromDate: '',
      toDate: '',
    }));
  };

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        <Stack direction="row" spacing={3}>
          <InputBox
            label="Invoice No"
            id="invoice_no"
            value={formik.values.invoice_no}
            onChange={formik.handleChange}
          />
          <InputBox
            label="MBL#"
            id="mbl_no"
            value={formik.values.mbl_no}
            onChange={formik.handleChange}
          />
        </Stack>
        <Stack direction="row" spacing={3}>
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
        </Stack>
        <Stack direction="row" spacing={3} justifyContent={"end"}>
          <Button color="primary" size="small" onClick={handleReset} >reset</Button>
          <OutlinedButton color="primary" size="small" onClick={formik.handleSubmit} >
            apply
          </OutlinedButton>
        </Stack>
      </Stack>
    </div>
  );
}
