import { Button, Stack } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputBox from '../../common/InputBox';
import { OutlinedButton } from '../../common/Button';
import { useFormik } from 'formik';
import { updatePackingListInput } from '../../../store/freatures/otmBolListSlice';
// import AppDatePicker from '../../common/AppDatePicker';
// import { appDateFormat } from '../../utils/date';


export default function OtmBolSearchForm() {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.otmBolList.formData);


  const formik = useFormik({
    initialValues: {
      bol: inputs.bol || '',
      supplier_name: inputs.supplier_name || '',
      pol : inputs.pol || '',
      pod : inputs.pod || ''
    },
    onSubmit: (values) => {
      // values.fromDate = appDateFormat(values.fromDate);
      // values.toDate = appDateFormat(values.toDate);
      dispatch(updatePackingListInput(values));
    }
  });
  const handleReset = () => {
    formik.resetForm();
    dispatch(updatePackingListInput({
        bol: '',
        supplier_name: '',
        pol: '',
        pod: '',
    }));
  };

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        <Stack direction="row" spacing={3}>
          <InputBox
            label="BOL#"
            id="bol"
            value={formik.values.bol}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Supplier Name"
            id="supplier_name"
            value={formik.values.supplier_name}
            onChange={formik.handleChange}
          />
        </Stack>
        <Stack direction="row" spacing={3}>
          <InputBox
            label="POL"
            id="pol"
            value={formik.values.pol}
            onChange={formik.handleChange}
          />
          <InputBox
            label="POD"
            id="pod"
            value={formik.values.pod}
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
