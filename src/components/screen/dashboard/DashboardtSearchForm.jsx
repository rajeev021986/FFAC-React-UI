import { Button, Stack } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputBox from '../../common/InputBox';
import { OutlinedButton } from '../../common/Button';
import { useFormik } from 'formik';
import { dashboardUpdateInput } from '../../../store/freatures/dashboardSlice';


export default function DashboardSearchForm() {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.dashboard.formData);


  const formik = useFormik({
    initialValues: {
      fileno : inputs?.fileno || "",
      mblno : inputs?.mblno || "",
    },
    onSubmit: (values) => {
      console.log(values);
      dispatch(dashboardUpdateInput(values));
    }
  });
  const handleReset = () => {
    formik.resetForm();
    dispatch(dashboardUpdateInput({
      fileno: '',
      mblno: '',
    }));
  };

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        <Stack direction="row" spacing={3}>
          <InputBox
            label="Shipment No"
            id="fileno"
            value={formik.values.invoice_no}
            onChange={formik.handleChange}
          />
          <InputBox
            label="MBL#"
            id="mblno"
            value={formik.values.mblno}
            onChange={formik.handleChange}
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
