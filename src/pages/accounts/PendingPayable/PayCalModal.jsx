//
import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CustomToast from "../../../components/common/Toast/CustomToast";
import toast from "react-hot-toast";
import ApiManager from "../../../services/ApiManager";
import Loader from "../../../components/common/Loader/Loader";
import CloseIcon from "@mui/icons-material/Close";
import GetPayDetails from "./getPayDetail";

const PayCalModal = ({ open, onClose, data }) => {
  const [loading, setLoading] = useState(true);
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
    currency: "TZS",
    exchangeRate: 1,
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
      const res = await ApiManager.getPayableDeatils(data?.id);
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
        currency: res.body?.currency || "TZS",
        exchangeRate: res.body?.exchangeRate || 1,
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
    if (data?.id) {
      fetchPayableData();
    } else {
      setLoading(false);
    }
  }, [data?.id]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Dialog
          open={open}
          onClose={onClose}
          sx={{ width: "60%", margin: "auto" }}
          maxWidth="auto"
        >
          <DialogTitle>
            View Payment Details for RefNo: {"00329-2025-PUR-DIR-BER"}
            <IconButton
              onClick={onClose}
              sx={{ position: "absolute", top: 8, right: 8, color: "grey.600" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <GetPayDetails viewPage="view" initialValues={initialValues} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PayCalModal;
