// DocumentViewModal.jsx
import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
// import AddEditForm from "../AddReceievevaleForm/AddEditForm";
import CustomToast from "../../../components/common/Toast/CustomToast";
import toast from "react-hot-toast";
import ApiManager from "../../../services/ApiManager";
import Loader from "../../../components/common/Loader/Loader";
import CloseIcon from "@mui/icons-material/Close";
import ViewPageForm from "./ViewForm";

const RecieveableViewModal = ({ viewType, open, onClose, data }) => {
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = React.useState({
    consigneeName: "",
    creditCost: "",
    currency: "",
    customerName: "",
    customerId: "",
    debitCost: "",
    exchangeRate: "",
    jobId: "",
    jobNo: "",
    netCost: "",
    paybleRefNo: "",
    profitLoss: "",
    totalRevenue: "",
    containerTypeDTO: [],
    paybleDetails: [],
    costDetails: [],
    totalAmount: 0,
    vatAmount: 0,
    totalAmount: 0,
    type: "",
    status: "",
    statusCode: 0,
  });

  const fetchPayableData = async () => {
    try {
      const res = await ApiManager.getReceivableEntryDeatils(data?.id);
      let status = "";
      if (res.body?.status) {
        status =
          res.body?.status.charAt(0).toUpperCase() +
          res.body?.status.slice(1).toLowerCase();
      }
      setInitialValues({
        id: res.body?.id || "",
        jobId: res.body.jobId || "",
        consigneeName: res.body.consigneeName || "",
        creditCost: res.body.creditCost || 0,
        currency: res.body.currency || "",
        customerName: res.body.customerName || "",
        customerId: res.body.customerId || "",
        debitCost: res.body.debitCost || 0,
        exchangeRate: res.body.exchangeRate || "",
        jobNo: res.body.jobNo || "",
        netCost: res.body.netCost || "",
        paybleRefNo: res.body.paybleRefNo || "",
        profitLoss: res.body.profitLoss || 0,
        totalRevenue: res.body.totalRevenue || 0,
        type: res.body.type || "",
        containerTypeDTO: res.body.containerTypeDTO || [],
        costDetails: res.body.costDetails || [],
        details: res.body?.receivableDetails || [],
        status: res.body?.status || "",
        statusCode: res.body?.statusCode || 0,
        amount: res.body?.amount || 0,
        vatAmount: res.body?.vatAmount || 0,
        totalAmount: res.body?.totalAmount || 0,
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
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="auto">
          <DialogTitle>
            View Receivable Entry
            <IconButton
              onClick={onClose}
              sx={{ position: "absolute", top: 8, right: 8, color: "grey.600" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <ViewPageForm initialValues={initialValues} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default RecieveableViewModal;
