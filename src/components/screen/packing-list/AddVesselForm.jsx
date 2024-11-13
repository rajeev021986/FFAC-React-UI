import { CircularProgress, Stack } from '@mui/material';
import React from 'react';
import InputBox from '../../common/InputBox';
import { OutlinedButton } from '../../common/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAddVesselDetailsMutation } from '../../../store/api/packingListDataApi';
import toast from 'react-hot-toast';


export default function AddVesselForm({setOpen}) {
  const [loader, setLoader] = React.useState(false);
  const [addVesselDetails] = useAddVesselDetailsMutation();

  const formik = useFormik({
    initialValues: {
        imo : '',
        mmsi : '',
        vessel : '',
    },
    validationSchema: Yup.object({
        imo: Yup.number().required('Required'),
        mmsi: Yup.number().required('Required'),
        vessel: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      console.log(values);
      setLoader(true);
        addVesselDetails(values)
        .then((res)=>{
          console.log(res)
            if(res.data.status === 'success'){
                toast.success(res.data.message);
                formik.resetForm();
                setOpen(false);
            }else{
                toast.error(res.data.message);
            }
        })
        .catch((err)=>{
            console.log(err)
            toast.error(err.message);
        })
        .finally(()=>{
          setLoader(false);
        })
    }
  });
  

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between" p={2} >
        <Stack direction="row" spacing={3}>
          <InputBox
            label="IMO"
            id="imo"
            value={formik.values.imo}
            error={formik.errors.imo}
            onChange={formik.handleChange}
            type="number"
          />
          <InputBox
            label="BOL#"
            id="mmsi"
            value={formik.values.mmsi}
            error={formik.errors.mmsi}
            onChange={formik.handleChange}
            type="number"
          />
        </Stack>
        <Stack direction="row" spacing={3}>
          <InputBox
            label="Vessel Name"
            id="vessel"
            value={formik.values.vessel}
            error={formik.errors.vessel}
            onChange={formik.handleChange}
          />
        </Stack>
        <Stack direction="row" spacing={3} justifyContent={"end"}>
          <OutlinedButton color="primary" size="small" onClick={formik.handleSubmit} >
           {loader && <CircularProgress color="primary" size={15} />} Add
          </OutlinedButton>
        </Stack>
      </Stack>
    </div>
  );
}
