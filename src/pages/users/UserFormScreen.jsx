import { Box, Card, CardContent, CardHeader } from '@mui/material'
import React from 'react'
import ScreenToolbar from '../../components/common/ScreenToolbar'
import { useLocation } from 'react-router-dom'
import UserForm from '../../components/screen/user-management/UserForm';
import ThemedBreadcrumb from '../../components/common/Breadcrumb';
import { useFetchUserDetailsQuery } from '../../store/api/userDataApi';

export default function UserFormScreen() {
  const { state } = useLocation();
  const {
    data: UserDeatils,
    isLoading,
    error,
    isError,
    refetch,
  } = useFetchUserDetailsQuery(state.initialValues?.userid);
  
  const [initialValues, setInitialValues] = React.useState({
    usercode:state.initialValues?.usercode || null,
    userid:  state.initialValues?.userid || '',
    emailid:state.initialValues?.emailid || '',
    firstname: state.initialValues?.firstname || '',
    lastname: state.initialValues?.lastname || '',
    password: '',
    confirm_password: '',
    status: state.initialValues?.status || '',
    role: state.initialValues?.role || '',
    companyname: state.initialValues?.companyname || '',
    ctypelist : state.initialValues?.ctypelist || [],
    sprlist: state.initialValues?.sprlist || [],
    filter_movetype : state.initialValues?.filter_movetype || '',
    filter_scac_code : state.initialValues?.filter_scac_code || '',
    send_etachange_alert : state.initialValues?.send_etachange_alert || '',
    send_pan_alert : state.initialValues?.send_pan_alert || ''
  });

  console.log(state);
  return (
    <Box>
      <ScreenToolbar leftComps={<div><ThemedBreadcrumb/></div>} rightComps={<div></div>} />
      <Card>
        <CardHeader title={state?.formAction === 'add' ? 'Add New User' : state?.formAction === "verify" ? "Verify User" :  'Update User'} />
        <CardContent>
          <UserForm
            initialValues={initialValues}
            formAction={state?.formAction}
            refetch={refetch}
          />
        </CardContent>
      </Card>
    </Box>
  )
}
