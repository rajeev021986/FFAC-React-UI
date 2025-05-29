import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import CustomerForm from "../../components/screen/code/customer/CustomerForm";
import ApiManager from "../../services/ApiManager";
import Loader from "../../components/common/Loader/Loader";
import toast from "react-hot-toast";
import CustomToast from "../../components/common/Toast/CustomToast";

import { useFetchCustomerQuery } from "../../store/api/codeDataApi";
import { useGetOptionsSettingsQuery } from "../../store/api/settingsApi";

export default function CustomerFormScreen({ page }) {
  const [loading, setLoading] = useState(true);
  const { state } = useLocation();

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
    countryId: "",
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
    statusCode: "",
    agreementExpiryDate: "",
    customerEntityTariffs: [],
    customerEntityEmailsIds: [],
    bankDetails: [],
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
          countryId: res.body?.countryId || "",
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
          statusCode: res.body?.statusCode,
          agreementExpiryDate: res.body?.agreementExpiryDate || "",
          customerEntityTariffs: res.body?.customerEntityTariffs || [],
          customerEntityEmailsIds: res.body?.customerEntityEmailsIds || [],
          bankDetails: res.body?.bankDetails || [],
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
    <Box sx={{ padding: 0, margin: 0 }}>
      <Stack sx={{ padding: "8px 0px" }}>
        <ScreenToolbar
          leftComps={
            <div>
              <ThemedBreadcrumb />
            </div>
          }
          rightComps={<div></div>}
        />
      </Stack>

      {loading ? (
        <Loader />
      ) : (
        <Card
          sx={{ borderWidth: 1, borderColor: "border.main", padding: "0px" }}
        >
          <CardContent
            sx={{
              margin: "0px",
              padding: "0px ! important",
            }}
          >
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
