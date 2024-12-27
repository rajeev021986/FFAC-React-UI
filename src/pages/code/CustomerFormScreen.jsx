import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import CustomerForm from "../../components/screen/code/customer/CustomerForm";
import { useFetchCustomerQuery } from "../../store/api/codeDataApi";
import ApiManager from "../../services/ApiManager";
import Loader from "../../components/common/Loader/Loader";
import { useGetOptionsSettingsQuery } from "../../store/api/settingsApi";
export default function CustomerFormScreen({ page }) {
  const [customerDatas, setcustomerDatas] = useState({});
  const [loading, setLoading] = useState(true);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const { state } = useLocation();
  // console.log(state, 'state')
  const [initialValues, setInitialValues] = React.useState({
    id: "",
    customerName: "",
    tinNo: "",
    vatNo: "",
    status: "",
    add1: "",
    add2: "",
    add3: "",
    poNo: "",
    city: "",
    country: "",
    province: "",
    contactPerson: "",
    emailId: "",
    telephone: "",
    fax: "",
    bankName: "",
    accountNo: "",
    customerType: "",
    companyCode: "",
    paymentType: "cash",
    creditDays: "",
    creditAmount: "",
    rejectRemarks: "",
    isApproved: false,
    agreementExpiryDate: "",
    customerEntityTariffs: [],
    customerEntityEmailsIds: [],
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
        const res = await ApiManager.getCustomerDeatils(
          state?.initialValues?.id
        );
        console.log("customerdata", res);
        setcustomerDatas(res.body);
        setInitialValues({
          id: res.body?.id || "",
          customerName: res.body?.customerName || "",
          tinNo: res.body?.tinNo || "",
          vatNo: res.body?.vatNo || "",
          status: res.body?.status || "",
          add1: res.body?.add1 || "",
          add2: res.body?.add2 || "",
          add3: res.body?.add3 || "",
          poNo: res.body?.poNo || "",
          city: res.body?.city || "",
          country: res.body?.country || "",
          province: res.body?.province || "",
          contactPerson: res.body?.contactPerson || "",
          emailId: res.body?.emailId || "",
          telephone: res.body?.telephone || "",
          fax: res.body?.fax || "",
          bankName: res.body?.bankName || "",
          accountNo: res.body?.accountNo || "",
          customerType: res.body?.customerType || "",
          companyCode: res.body?.companyCode || "",
          paymentType: res.body?.paymentType || "cash",
          creditDays: res.body?.creditDays || "",
          creditAmount: res.body?.creditAmount || "",
          rejectRemarks: res.body?.rejectRemarks || "",
          isApproved: res.body?.isApproved || false,
          agreementExpiryDate: res.body?.agreementExpiryDate || "",
          customerEntityTariffs: res.body?.customerEntityTariffs || [],
          customerEntityEmailsIds: res.body?.customerEntityEmailsIds || [],
        });
        setLoading(false);
        console.log(res, "res");
      } catch (error) {
        console.error(error, "error");
        // setLoading(false)
      }
    };
    if (settingsLoaded && state?.initialValues?.id) {
      fetchCustomerDetails();
    } else {
      setLoading(false);
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
      <ScreenToolbar
        leftComps={
          <div>
            <ThemedBreadcrumb />
          </div>
        }
        rightComps={<div></div>}
      />
      {loading || optionsLoading || customerSettingsLoading ? (
        <Loader />
      ) : (
        <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
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
              page={page}
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
