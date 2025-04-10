import EditIconDropdown from "../../common/commonIconDropdown/EditIconDropdown/EditIconDropdown";
import AuditIconDropdown from "../../common/commonIconDropdown/AuditIconDropdown/AuditIconDropdown";
import DocumentIconDropdown from "../../common/commonIconDropdown/DocumentIconDropdown/DocumentIconDropdown";
import AddRateIconDropdown from "../../common/commonIconDropdown/DocumentIconDropdown/AddRateIconDropdown/AddRateIconDropdown";
import CloseIcon from "@mui/icons-material/Close";

export const getJobEntryListGridActionsApprovel = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav(`approveJobRequest`, {
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
      label: "Document",
      onClick: (params) => {
        setModal({ open: true, type: "document", data: params.row });
      },
      icon: <DocumentIconDropdown />,
    },
    {
      label: "Add Rate",
      onClick: (params) => {
        setModal({ open: true, type: "addRate", data: params.row });
      },
      icon: <AddRateIconDropdown />,
    },
    {
      label: "Rejected",
      onClick: (params) => {
        setModal({ open: true, type: "reject", data: params.row });
      },
      icon: <CloseIcon sx={{ width: "20px", marginTop: "5px" }} />,
    },
  ];
};
