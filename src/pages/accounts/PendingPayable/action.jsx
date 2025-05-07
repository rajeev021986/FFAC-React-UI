import AuditIconDropdown from "../../../components/common/commonIconDropdown/AuditIconDropdown/AuditIconDropdown";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export const getPendingPaymentApprovalGridActions = (nav, setModal) => {
  return [
    {
      label: "Audit",
      onClick: (params) => {
        setModal({ open: true, type: "audit", data: params.row });
      },
      icon: <AuditIconDropdown />,
    },
    {
      label: "Pay",
      onClick: (params) => {
        setModal({ open: true, type: "audit", data: params.row });
      },
      icon: <AttachMoneyIcon sx={{ width: "23px", marginTop: "5px" }} />,
    },
  ];
};
