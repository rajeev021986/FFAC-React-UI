import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material'
import React from 'react'
import { useLocation } from 'react-router-dom'
import ScreenToolbar from '../../components/common/ScreenToolbar';
import ThemedBreadcrumb from '../../components/common/Breadcrumb';
import { useFetchAgentQuery } from '../../store/api/codeDataApi';
import AgentForm from '../../components/screen/code/agent/AgentForm';


export default function AgentFormScreen() {
  const { state } = useLocation();
  const {
    data,
    isError,
    isLoading,
    error,
    isFetching,
  } = useFetchAgentQuery({
    acode:state.initialValues?.acode
  });
  
const [initialValues, setInitialValues] = React.useState({
    acode:state.initialValues?.acode || '',
    addressl1: state.initialValues?.addressl1 || '',
    addressl2:state.initialValues?.addressl2 || '',
    addressl3: state.initialValues?.addressl3 || '',
    city: state.initialValues?.city || '',
    cname: state.initialValues?.cname || '',
    country: state.initialValues?.country || '',
    email : state.initialValues?.email || '',
    contact_person: state.initialValues?.contact_person || '',
    fax: state.initialValues?.fax || '',
    iesclientcode : state.initialValues?.iesclientcode || '',
    phone : state.initialValues?.phone || '',
    mobile : state.initialValues?.mobile || '',
    panno : state.initialValues?.panno || '',
    state : state.initialValues?.state || '',
    status : state.initialValues?.status || 'ACTIVE',
    url : state.initialValues?.url || '',
    tanno : state.initialValues?.tanno || '',
    zipcode : state.initialValues?.zipcode || '',
    ctypelist:'AGENT',
    atype:[]
  });

  React.useEffect(() => {
    if (!isLoading && !isError && data?.data?.length > 0 && data?.data[0]?.atype) {
      setInitialValues((prevValues) => ({
        ...prevValues,
        atype: data.data[0]?.atype || []
      }));
    }
    else{
      setInitialValues((prevValues) => ({
        ...prevValues,
        atype: []
      }));
    }
  }, [data, isLoading, isError]);

  return (
    <Box>
      <ScreenToolbar leftComps={<div><ThemedBreadcrumb /></div>} rightComps={<div></div>} />
      <Card  sx={{borderWidth : 1,borderColor : "border.main"}}>
        <CardHeader title={
          <Box display="flex" justifyContent={"space-between"}>
            <Typography variant='subtitle3' component='div'>Agent</Typography>
          </Box>
        } />
        <CardContent>
        <AgentForm
            initialValues={initialValues}/>
        </CardContent>
      </Card>
    </Box>
  )
}


const styles = {
  right : {
    display: 'flex',
    alignItems: 'center',
    gap : '10px',
  }
}