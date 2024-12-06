import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ScreenToolbar from '../../components/common/ScreenToolbar';
import ThemedBreadcrumb from '../../components/common/Breadcrumb';
import CustomerForm from '../../components/screen/code/customer/CustomerForm';
import { useFetchCustomerQuery } from '../../store/api/codeDataApi';
import ApiManager from '../../services/ApiManager';
import Loader from '../../components/common/Loader/Loader';
import { useGetOptionsSettingsQuery } from '../../store/api/settingsApi';
export default function CustomerFormScreen({ page }) {
  const [customerDatas, setcustomerDatas] = useState({});
  const [loading, setLoading] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const { state } = useLocation();
  // console.log(state, 'state')
  const [initialValues, setInitialValues] = React.useState({
    id: '',
    city: '',
    customerName: '',
    accountNo: '',
    telephone: '',
    pinNo: '',
    accountType: '',
    vatNo: '',
    add1: '',
    add2: '',
    add3: '',
    bankName: '',
    emailId: '',
    creditDays: '',
    creditAmount: '',
    contactPerson: '',
    country: '',
    email: '',
    fax: '',
    chargeName: '',
    state: '',
    paymentType: 'cash',
    status: 'ACTIVE',
    url: '',
    zipCode: '',
    customerEntityTariffs: [],
    agreementExpiryDate: '',
    customerEntityEmailsIds: [],
    ctypelist: 'CUSTOMER',
    files: []
  });
  // const {
  //   data: mappingData,
  //   isError,
  //   isLoading,
  //   error,
  //   isFetching,
  // } = useFetchCustomerQuery({
  //   acode: state?.initialValues?.acode
  // });

  // Move settings queries to the top
  const { data: optionsSettingsData, isLoading: optionsLoading } =
    useGetOptionsSettingsQuery("common_settings");
  const { data: customerSettingsData, isLoading: customerSettingsLoading } =
    useGetOptionsSettingsQuery("customer_settings");

  // First useEffect to handle settings loading
  useEffect(() => {
    if (!optionsLoading && !customerSettingsLoading) {
      setSettingsLoaded(true);
    }
  }, [optionsLoading, customerSettingsLoading]);

  // Only fetch customer details after settings are loaded
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        setLoading(true)
        const res = await ApiManager.getCustomerDeatils(state?.initialValues?.id);
        setcustomerDatas(res.body)
        setInitialValues({
          id: res.body?.id || '',
          city: res.body?.city || '',
          customerName: res.body?.customerName || '',
          accountNo: res.body?.accountNo || '',
          telephone: res.body?.telephone || '',
          pinNo: res.body?.pinNo || '',
          accountType: res.body?.accountType || '',
          vatNo: res.body?.vatNo || '',
          add1: res.body?.add1 || '',
          add2: res.body?.add2 || '',
          add3: res.body?.add3 || '',
          bankName: res.body?.bankName || '',
          emailId: res.body?.emailId || '',
          creditDays: res.body?.creditDays || '',
          creditAmount: res.body?.creditAmount || '',
          contactPerson: res.body?.contactPerson || '',
          country: res.body?.country || '',
          email: res.body?.email || '',
          fax: res.body?.fax || '',
          chargeName: res.body?.chargeName || '',
          state: res.body?.state || '',
          paymentType: res.body?.paymentType || 'cash',
          status: res.body?.status || '',
          url: res.body?.url || '',
          zipCode: res.body?.zipCode || '',
          customerEntityTariffs: res.body?.customerEntityTariffs || [],
          agreementExpiryDate: res.body?.agreementExpiryDate || '',
          customerEntityEmailsIds: res.body?.customerEntityEmailsIds || [],
          ctypelist: 'CUSTOMER',
          files: []
        })
        setLoading(false)
        console.log(res, "res");
      } catch (error) {
        console.error(error, "error");
        setLoading(false)
      }
    };
    if (settingsLoaded && state?.initialValues?.id) {
      fetchCustomerDetails();
    }


  }, [settingsLoaded, state?.initialValues?.id]);

  // React.useEffect(() => {
  //   if (!isLoading && !isError && mappingData?.data?.length > 0 && mappingData?.data[0]?.customerEntityTariffs) {
  //     setInitialValues((prevValues) => ({
  //       ...prevValues,
  //       customerEntityTariffs: mappingData.data[0]?.customerEntityTariffs || []
  //     }));
  //   }
  //   else {
  //     setInitialValues((prevValues) => ({
  //       ...prevValues,
  //       customerEntityTariffs: [{ chargeName: "", unitType: "", currency: "", unitRate: "" }]
  //     }));
  //   }

  // }, [mappingData, isLoading, isError]);

  // React.useEffect(() => {
  //   if (!isLoading && !isError && mappingData?.data?.length > 0 && mappingData?.data[0]?.customerEntityEmailsIds) {
  //     setInitialValues((prevValues) => ({
  //       ...prevValues,
  //       customerEntityEmailsIds: mappingData.data[0]?.customerEntityEmailsIds || []
  //     }));
  //   }
  //   else {
  //     setInitialValues((prevValues) => ({
  //       ...prevValues,
  //       customerEntityEmailsIds: [{ designation: "" }]
  //     }));
  //   }

  // }, [mappingData, isLoading, isError]);
  return (
    <Box>
      <ScreenToolbar leftComps={<div><ThemedBreadcrumb /></div>} rightComps={<div></div>} />
      {loading ? <Loader /> : <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
        {/* <CardHeader title={
          <Box display="flex" justifyContent={"space-between"}>
            <Typography variant='subtitle3' component='div'>Customer</Typography>
          </Box>
        } /> */}
        <CardContent>
          <CustomerForm
            optionsSettingsData={optionsSettingsData}
            customerSettingsData={customerSettingsData}
            initialValues={initialValues}
            type={state?.type}
            page={page} />
        </CardContent>
      </Card>}
    </Box>
  )
}
