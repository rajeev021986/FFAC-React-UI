//
import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CustomToast from "../../../components/common/Toast/CustomToast";
import toast from "react-hot-toast";
import ApiManager from "../../../services/ApiManager";
import Loader from "../../../components/common/Loader/Loader";
import CloseIcon from "@mui/icons-material/Close";
import GetPayDetails from "./getPayDetail";

const PayCalModal = ({ open, onClose, data, refetch }) => {
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
    bankId: "",
    bankName: "",
    statusCode: 101,
    multipleSelected: false,
    statusCode: null,
  });
  useEffect(() => {
    if (data?.statusCode === 100) {
      fetchPayableData();
    } else {
      if (data?.statusCode === 101) {
        setInitialValues({
          multipleSelected: false,
          statusCode: data?.statusCode,
          vendorId: data?.vendorId,
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
          localAmountToBePaid:
            data?.totalAmount * (data?.exchangeRate || 1) || 0,
          bankCharges: data?.bankCharges || "",
          paymentType: data?.paymentType || "Cheque",
        });
      }
    }
    setLoading(false);
  }, [data]);
  const fetchPayableData = async () => {
    try {
      const res = await ApiManager.getPayDetails(data?.id);
      const { paybleInfo, payment } = res.body;
      setInitialValues((prev) => ({
        id: payment?.id ?? "",
        statusCode: payment?.statusCode ?? "",
        vendorName: payment?.vendorName ?? "",
        vendorId: payment?.vendorId ?? "",
        usdAmount: payment?.usdAmount ?? "",
        localAmount: payment?.localAmount ?? "",
        paymentDate: payment?.paymentDate ?? null,
        currency: payment?.currency ?? "",
        paymentType: payment?.paymentType ?? "",
        bankId: payment?.bankId ?? "",
        bankName: payment?.bankName || "",
        chequeNo: payment?.chequeNo ?? "",
        chequeDate: payment?.chequeDate ?? "",
        usdAmountToBePaid: payment?.usdAmountToBePaid ?? "",
        localAmountToBePaid: payment?.localAmountToBePaid ?? "",
        bankCharges: payment?.bankCharges ?? "",
        multiple: payment?.multiple ?? "",
      }));

      if (paybleInfo && Array.isArray(paybleInfo)) {
        setInitialValues((prev) => ({
          ...prev,
          paybleRefNum: paybleInfo.map((item) => item.refNo).join(", "),
          paybleIds: paybleInfo.map((item) => item.id),
        }));
      }

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
              refetch={refetch}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PayCalModal;
