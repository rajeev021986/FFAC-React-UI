import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Box, Card, CardContent, Stack } from "@mui/material";

import ScreenToolbar from "../../../components/common/ScreenToolbar";
import ThemedBreadcrumb from "../../../components/common/Breadcrumb";
import ApiManager from "../../../services/ApiManager";
import Loader from "../../../components/common/Loader/Loader";
import CustomToast from "../../../components/common/Toast/CustomToast";
import AddEditForm from "./AddEditForm";

export default function AddPayableEntry({ page }) {
  const [loading, setLoading] = useState(true);
  const { state } = useLocation();

  const [initialValues, setInitialValues] = React.useState({
    id: "",
    status: "",
    statusCode: "",
    rejectRemarks: "",
    isDoc: "",
    invoiceType: "",
    payableRefNo: "",
    jobNo: "",
    invoiceDate: "",
    vendorName: "",
    vendorInvoiceNo: "",
    vendorInvoiceDate: "",
    currency: "",
    exchangeRate: null,
    invoiceCurrencyAmount: "",
    invoiceCurrencyVat: "",
    invoiceCurrencyWithHoldingTax: "",
    invoiceCurrencyNetAmountPayable: "",
    invoiceCurrencyCostCentre: "",
    shillingAmount: "",
    shillingVat: "",
    shillingWithHoldingTax: "",
    shillingNetAmountPayable: "",
    shillingCostCentre: "",
    paybleDetails: [],
  });

  const fetchPayableData = async () => {
    try {
      const res = await ApiManager.getPayableDeatils(state?.initialValues?.id);
      let status = "";
      if (res.body?.status) {
        status =
          res.body?.status.charAt(0).toUpperCase() +
          res.body?.status.slice(1).toLowerCase();
      }
      setInitialValues({
        id: res.body?.id || "",
        status: res.body?.status,
        statusCode: res.body?.statusCode,
        rejectRemarks: res.body?.rejectRemarks,
        isDoc: res.body?.isDoc,
        invoiceType: res.body?.invoiceType,
        payableRefNo: res.body?.payableRefNo,
        jobNo: res.body?.jobNo,
        invoiceDate: res.body?.invoiceDate,
        vendorName: res.body?.vendorName,
        vendorInvoiceNo: res.body?.vendorInvoiceNo,
        vendorInvoiceDate: res.body?.vendorInvoiceDate,
        currency: res.body?.currency || "INR",
        exchangeRate: res.body?.exchangeRate || null,
        invoiceCurrencyAmount: res.body?.invoiceCurrencyAmount,
        invoiceCurrencyVat: res.body?.invoiceCurrencyVat,
        invoiceCurrencyWithHoldingTax: res.body?.invoiceCurrencyWithHoldingTax,
        invoiceCurrencyNetAmountPayable:
          res.body?.invoiceCurrencyNetAmountPayable,
        invoiceCurrencyCostCentre: res.body?.invoiceCurrencyCostCentre,
        shillingAmount: res.body?.shillingAmount,
        shillingVat: res.body?.shillingVat,
        shillingWithHoldingTax: res.body?.shillingWithHoldingTax,
        shillingNetAmountPayable: res.body?.shillingNetAmountPayable,
        shillingCostCentre: res.body?.shillingCostCentre,
        paybleDetails: res?.body?.paybleDetails || [],
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


  useEffect(() => {
    if (state?.initialValues?.id) {
      fetchPayableData();
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
            <AddEditForm
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
