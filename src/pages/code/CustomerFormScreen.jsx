import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material'
import React from 'react'
import { useLocation } from 'react-router-dom'
import ScreenToolbar from '../../components/common/ScreenToolbar';
import ThemedBreadcrumb from '../../components/common/Breadcrumb';
import CustomerForm from '../../components/screen/code/customer/CustomerForm';
import { useFetchCustomerQuery } from '../../store/api/codeDataApi';
export default function CustomerFormScreen() {
  const { state } = useLocation();
  const {
    data: mappingData,
    isError,
    isLoading,
    error,
    isFetching,
  } = useFetchCustomerQuery({
    acode:state?.initialValues?.acode
  });

  
  
const [initialValues, setInitialValues] = React.useState({
  id:state?.initialValues?.id || '',
    city: state?.initialValues?.city || '',
    customerName: state?.initialValues?.customerName || '',
    accountNo: state?.initialValues?.accountNo || '',
    telephone: state?.initialValues?.telephone || '',
    pinNo: state?.initialValues?.pinNo || '',
    accountType: state?.initialValues?.accountType || '',
    vatNo: state?.initialValues?.vatNo || '',
    add1: state?.initialValues?.add1 || '',
    add2: state?.initialValues?.add2 || '',
    add3: state?.initialValues?.add3 || '',
    bankName: state?.initialValues?.bankName || '',
    emailId: state?.initialValues?.emailId || '',
    creditDays: state?.initialValues?.creditDays || '',
    creditAmount: state?.initialValues?.creditAmount || '',
    contactPerson: state?.initialValues?.contactPerson || '',
    country: state?.initialValues?.country || '',
    email : state?.initialValues?.email || '',
    fax: state?.initialValues?.fax || '',
    chargeName: state?.initialValues?.chargeName || '',
    state : state?.initialValues?.state || '',
    paymentType : state?.initialValues?.paymentType || 'cash',
    status : state?.initialValues?.status || 'ACTIVE',
    url : state?.initialValues?.url || '',
    zipCode : state?.initialValues?.zipCode || '',
    customerEntityTariffs: [],
    agreementExpiryDate :state?.initialValues?.agreementExpiryDate || '',
    customerEntityEmailsIds : [],
    ctypelist:'CUSTOMER',
    files: []
  });
  React.useEffect(() => {
    if (!isLoading && !isError && mappingData?.data?.length > 0 && mappingData?.data[0]?.customerEntityTariffs) {
      setInitialValues((prevValues) => ({
        ...prevValues,
        customerEntityTariffs: mappingData.data[0]?.customerEntityTariffs || []
      }));
    }
    else{
      setInitialValues((prevValues) => ({
        ...prevValues,
        customerEntityTariffs: [{ chargeName: "", unitType: "", 	currency: "" ,unitRate :""  }]
      }));
    }
   
  }, [mappingData, isLoading, isError]);

  React.useEffect(() => {
    if (!isLoading && !isError && mappingData?.data?.length > 0 && mappingData?.data[0]?.customerEntityEmailsIds) {
      setInitialValues((prevValues) => ({
        ...prevValues,
        customerEntityEmailsIds: mappingData.data[0]?.customerEntityEmailsIds || []
      }));
    }
    else{
      setInitialValues((prevValues) => ({
        ...prevValues,
        customerEntityEmailsIds: [{  designation :""  }]
      }));
    }
   
  }, [mappingData, isLoading, isError]);
  return (
    <Box>
      <ScreenToolbar leftComps={<div><ThemedBreadcrumb /></div>} rightComps={<div></div>} />
      <Card  sx={{borderWidth : 1,borderColor : "border.main"}}>
        <CardHeader title={
          <Box display="flex" justifyContent={"space-between"}>
            <Typography variant='subtitle3' component='div'>Customer</Typography>
          </Box>
        } />
        <CardContent>
        <CustomerForm
            initialValues={initialValues}/>
        </CardContent>
      </Card>
    </Box>
  )
}
