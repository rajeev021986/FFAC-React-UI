import CloseIcon from "@mui/icons-material/Close";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EditIconDropdown from "../../../components/common/commonIconDropdown/EditIconDropdown/EditIconDropdown";
import ViewIconDropdown from "../../../components/common/commonIconDropdown/ViewIconDropdown/ViewIconDropDown";

import AuditIconDropdown from "../../../components/common/commonIconDropdown/AuditIconDropdown/AuditIconDropdown";
import ApproveIconDropdown from "../../../components/common/commonIconDropdown/ApproveIconDropdown/ApproveIconDropdown";

export const getPayableListGridActionApprove = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav(`approvePayableRequest`, {
          state: { formAction: "edit", initialValues: params.row },
        });
      },
      icon: <EditIconDropdown />,
    },
    {
      label: "Audit",
      onClick: (params) => {
        setModal({ open: true, type: "audit", data: params.row });
      },
      icon: <AuditIconDropdown />,
    },
    {
      label: "View",
      onClick: (params) => {
        setModal({ open: true, type: "document", data: params.row });
      },
      icon: <ViewIconDropdown />,
    },
    {
      label: "Approve",
      onClick: (params) => {
        setModal({ open: true, type: "approve", data: params.row });
      },
      icon: <ApproveIconDropdown />,
    },
    {
      label: "Reject",
      onClick: (params) => {
        setModal({ open: true, type: "reject", data: params.row });
      },
      icon: <CloseIcon sx={{ width: "20px", marginTop: "5px" }} />,
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
