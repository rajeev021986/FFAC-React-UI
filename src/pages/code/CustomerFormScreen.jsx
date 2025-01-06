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
import toast from "react-hot-toast";
import CustomToast from "../../components/common/Toast/CustomToast";
export default function CustomerFormScreen({ page }) {
  const [loading, setLoading] = useState(true);
  const { state } = useLocation();

  console.log(state, "state");
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
    isApproved: "",
    agreementExpiryDate: "",
    customerEntityTariffs: [],
    customerEntityEmailsIds: [],
  });

  // Only fetch customer details after settings are loaded
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const res = await ApiManager.getCustomerDeatils(
          state?.initialValues?.id
        );
        let status = "";
        if (res.body?.status) {
          status =
            res.body?.status.charAt(0).toUpperCase() +
            res.body?.status.slice(1).toLowerCase();
          console.log(status, "status");
        }
        setInitialValues({
          id: res.body?.id || "",
          customerName: res.body?.customerName || "",
          tinNo: res.body?.tinNo || "",
          vatNo: res.body?.vatNo || "",
          status: status,
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
          isApproved: res.body?.isApproved,
          agreementExpiryDate: res.body?.agreementExpiryDate || "",
          customerEntityTariffs: res.body?.customerEntityTariffs || [],
          customerEntityEmailsIds: res.body?.customerEntityEmailsIds || [],
        });
        setLoading(false);
      } catch (error) {
        toast.custom(
          <CustomToast
            message="Error occurred while loading form"
            toast="error"
          />,
          {
            closeButton: false,
          }
        );
      }
    };
    if (state?.initialValues?.id) {
      fetchCustomerDetails();
    } else {
      setLoading(false);
    }
  }, [state?.initialValues?.id]);

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
      {loading ? (
        <Loader />
      ) : (
        <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
          <CardContent>
            <CustomerForm
              initialValues={initialValues}
              type={state?.formAction}
              page={page}
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
