import EditIcon from "@mui/icons-material/Edit";
import BiotechIcon from "@mui/icons-material/Biotech";
import EditIconDropdown from "../../../common/commonIconDropdown/EditIconDropdown/EditIconDropdown";
import AuditIconDropdown from "../../../common/commonIconDropdown/AuditIconDropdown/AuditIconDropdown";

export const getCustomerListGridActionsCustomerApprovel = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav(`approveRequest`, {
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
  ];
};
