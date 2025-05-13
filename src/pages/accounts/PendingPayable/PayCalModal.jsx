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
  const [initialValues, setInitialValues] = useState({
    paybleIds: [],
    createdDate: "",
    currency: "",
    customerName: "",
    exchangeRate: 1,
    id: "",
    invoiceType: "",
    jobCreatedDate: "",
    jobNo: "",
    modifiedDate: "",
    paybleCreatedDate: "",
    paybleRefNum: "",
    totalAmount: 0,
    vendorInvDate: "",
    vendorInvNo: "",
    vendorName: "",
    localAmountToBePaid: 0,
    paymentType: "Cheque",
    usdAmountToBePaid: 0,
    paymentDate: new Date().toISOString(),
    localAmount: 0,
    usdAmount: 0,
    multiple: "",
    bankCharges: "",
    chequeDate: "",
    chequeNo: "",
    bankName: "",
    multipleSelected: false,
  });

  useEffect(() => {
    if (data) {
      setInitialValues({
        multipleSelected: false,
        paymentDate: new Date().toISOString() || null,
        createdDate: data?.createdDate,
        currency: data?.currency || "INR",
        customerName: data?.customerName || "",
        exchangeRate: data?.exchangeRate || 1,
        id: data?.id || "",
        invoiceType: data?.invoiceType || "",
        jobCreatedDate: data?.jobCreatedDate || "",
        jobNo: data?.jobNo || "",
        modifiedDate: data?.modifiedDate,
        paybleCreatedDate: data?.paybleCreatedDate || "",
        paybleRefNum: data?.paybleRefNum || "",
        totalAmount: data?.totalAmount || 0,
        vendorInvDate: data?.vendorInvDate || null,
        vendorInvNo: data?.vendorInvNo || "",
        vendorName: data?.vendorName || "",
        usdAmountToBePaid: data?.totalAmount || 0,
        usdAmount: data?.totalAmount || 0,
        localAmount: data?.totalAmount * (data?.exchangeRate || 1) || 0,
        localAmountToBePaid: data?.totalAmount * (data?.exchangeRate || 1) || 0,
        bankCharges: data?.bankCharges || "",
        paymentType: data?.paymentType || "Cheque",
      });
    }
    setLoading(false);
  }, [data]);

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
            View Payment Details for RefNo: {data.paybleRefNum || ""}
            <IconButton
              onClick={onClose}
              sx={{ position: "absolute", top: 8, right: 8, color: "grey.600" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <GetPayDetails
              viewPage="view"
              initialValues={initialValues}
              onClose={onClose}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PayCalModal;
