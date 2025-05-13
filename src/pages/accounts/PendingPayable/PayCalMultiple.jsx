//
import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CustomToast from "../../../components/common/Toast/CustomToast";
import toast from "react-hot-toast";
import ApiManager from "../../../services/ApiManager";
import Loader from "../../../components/common/Loader/Loader";
import CloseIcon from "@mui/icons-material/Close";
import GetPayDetails from "./getPayDetail";

const PayCalMultiple = ({ open, onClose, data }) => {
  const vendorName = data[0]?.vendorName;
  const payableRefNums = data?.map((item) => item.paybleRefNum).join(", ");

  const usdAmount = data?.reduce((acc, curr) => acc + curr.totalAmount, 0);
  // Get exchange rate from the last item
  const lastExchangeRate = data[data.length - 1]?.exchangeRate || 1;
  // localAmount = usdAmount * exchangeRate of last item
  const localAmount = usdAmount * lastExchangeRate;
  // Same values for "to be paid" as well
  const usdAmountToBePaid = usdAmount;
  const localAmountToBePaid = usdAmount * lastExchangeRate;
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = React.useState({
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
      const paybleIds = data?.map((item) => item.id); // Extract all ids
      setInitialValues({
        multipleSelected: true,
        paybleIds: paybleIds,
        currency: data[0]?.currency || "INR",
        customerName: data[0]?.customerName || "",
        exchangeRate: data[0]?.exchangeRate || 1,
        id: data[0]?.id || "",
        invoiceType: data[0]?.invoiceType || "",
        jobCreatedDate: data[0]?.jobCreatedDate || "",
        paybleCreatedDate: data[0]?.paybleCreatedDate || "",
        paybleRefNum: payableRefNums || "",
        totalAmount: data[0]?.totalAmount || 0,
        vendorInvDate: data[0]?.vendorInvDate || null,
        vendorInvNo: data[0]?.vendorInvNo || "",
        vendorName: vendorName || "",
        usdAmountToBePaid: usdAmountToBePaid || 0,
        usdAmount: usdAmount || 0,
        paymentDate: new Date().toISOString() || null,
        localAmount: localAmount || 0,
        localAmountToBePaid: localAmountToBePaid || 0,
        bankCharges: data[0]?.bankCharges || "",
        paymentType: data[0]?.paymentType || "Cheque",
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
            View Payment Details for RefNo: {payableRefNums || ""}
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

export default PayCalMultiple;
