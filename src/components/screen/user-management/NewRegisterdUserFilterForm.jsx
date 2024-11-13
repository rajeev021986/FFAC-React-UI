import { Button, Stack } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputBox from '../../common/InputBox';
// import { updateInput } from '../../../store/freatures/userManagementSlice';
import { OutlinedButton } from '../../common/Button';
import { useFormik } from 'formik';
import { updateInput } from '../../../store/freatures/newRegisteredUserSlice';


export default function NewRegisterdUserFilterForm() {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.newRegisteredUser.formData);


  const formik = useFormik({
    initialValues: {
      firstname: inputs.firstname || '',
      lastname: inputs.lastname || '',
      emailid: inputs.emailid || ''
    },
    onSubmit: (values) => {
      dispatch(updateInput(values));
    }
  });
  const handleReset = () => {
    formik.resetForm();
    dispatch(updateInput({
      firstname: '',
      lastname: '',
      emailid: ''
    }));
  };

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        <Stack direction="row" spacing={3}>
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
