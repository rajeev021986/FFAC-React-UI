import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export const getPendingPaymentApprovalGridActions = (nav, setModal) => {
  return [
    {
      label: "Pay",
      onClick: (params) => {
        setModal({ open: true, type: "Pay", data: params.row });
      },
      icon: <AttachMoneyIcon sx={{ width: "23px", marginTop: "5px" }} />,
    },
    {
      label: "Cancel",
      onClick: (params) => {
        setModal({ open: true, type: "cancel", data: params.row });
      },
      icon: <CancelOutlinedIcon sx={{ width: "20px", marginTop: "5px" }} />,
    },
  ];
};
