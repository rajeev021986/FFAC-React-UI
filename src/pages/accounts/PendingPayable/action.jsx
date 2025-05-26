import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import toast from "react-hot-toast";
import CustomToast from "../../../components/common/Toast/CustomToast";

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
    {
      label: "Reject",
      onClick: (params) => {
        if (params.row.statusCode !== 100) {
          setModal({
            open: true,
            type: "reject",
            data: params.row,
          });
        } else {
          toast.custom(
            <CustomToast message="Can't rejected paid entry" toast="error" />,
            {
              closeButton: false,
            }
          );
        }
      },
      icon: <ThumbDownAltOutlinedIcon />,
    },
  ];
};
