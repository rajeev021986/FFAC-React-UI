import { Button, Stack } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputBox from '../../common/InputBox';
import { updateInput } from '../../../store/freatures/userManagementSlice';
import { OutlinedButton } from '../../common/Button';
import { useFormik } from 'formik';


export default function FilterForm() {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.userManagement.formData);


  const formik = useFormik({
    initialValues: {
      userid: inputs.userid || '',
      firstname: inputs.firstname || '',
      lastname: inputs.lastname || '',
      companyname: inputs.companyname || '',
      emailid: inputs.emailid || ''
    },
    onSubmit: (values) => {
      dispatch(updateInput(values));
    }
  });
  const handleReset = () => {
    formik.resetForm();
    dispatch(updateInput({
      userid: '',
      firstname: '',
      lastname: '',
      companyname: '',
      emailid: ''
    }));
  };

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        <Stack direction="row" spacing={3}>
          <InputBox
            label="User ID"
            id="userid"
            value={formik.values.userid}
            onChange={formik.handleChange}
          />
          <InputBox
            label="First Name"
            id="firstname"
            value={formik.values.firstname}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Last Name"
            id="lastname"
            value={formik.values.lastname}
            onChange={formik.handleChange}
          />
        </Stack>
        <Stack direction="row" spacing={3}>
          <InputBox
            label="Company Name"
            id="companyname"
            value={formik.values.companyname}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Email"
            id="emailid"
            value={formik.values.emailid}
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
