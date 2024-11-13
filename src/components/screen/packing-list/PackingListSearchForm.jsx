import { Button, Stack } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputBox from '../../common/InputBox';
import { OutlinedButton } from '../../common/Button';
import { useFormik } from 'formik';
import { updatePackingListInput } from '../../../store/freatures/packingListSlice';
import AppDatePicker from '../../common/AppDatePicker';
import { appDateFormat } from '../../utils/date';


export default function PackingListSearchForm() {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.packingList.formData);


  const formik = useFormik({
    initialValues: {
      packing_list_no: inputs.packing_list_no || '',
      bl_no: inputs.bl_no || '',
      fromDate : inputs.fromDate || '',
      toDate : inputs.toDate || ''
    },
    onSubmit: (values) => {
      values.fromDate = appDateFormat(values.fromDate);
      values.toDate = appDateFormat(values.toDate);
      dispatch(updatePackingListInput(values));
    }
  });
  const handleReset = () => {
    formik.resetForm();
    dispatch(updatePackingListInput({
        packing_list_no: '',
        bl_no: '',
        fromDate: '',
        toDate: '',
    }));
  };

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        <Stack direction="row" spacing={3}>
          <InputBox
            label="Packing List No"
            id="packing_list_no"
            value={formik.values.packing_list_no}
            onChange={formik.handleChange}
          />
          <InputBox
            label="BOL#"
            id="bl_no"
            value={formik.values.bl_no}
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
