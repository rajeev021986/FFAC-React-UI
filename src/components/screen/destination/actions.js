import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIconDropdown from "../../common/commonIconDropdown/EditIconDropdown/EditIconDropdown";
import AuditIconDropdown from "../../common/commonIconDropdown/AuditIconDropdown/AuditIconDropdown";

export const getDestinationGridActions = (setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        setModal({ open: true, type: "edit", data: params.row });
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
