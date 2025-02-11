import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BiotechIcon from "@mui/icons-material/Biotech";
import { GridDeleteIcon } from "@mui/x-data-grid";
import CustomToast from "../../common/Toast/CustomToast";
import toast from "react-hot-toast";
import EditIconDropdown from "../../common/commonIconDropdown/EditIconDropdown/EditIconDropdown";
import AuditIconDropdown from "../../common/commonIconDropdown/AuditIconDropdown/AuditIconDropdown";
import DeleteIconDropdown from "../../common/commonIconDropdown/DeleteIconDropdown/DeleteIconDropdown";

export const getVendorGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav("editVendor", { state: { id: params.row.id, type: "Edit" } });
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
      label: "Delete",
      onClick: (params) => {
        if (params.row.statusCode == -2 || params.row.statusCode == -1) {
          setModal({
            open: true,
            type: "delete",
            data: {
              who: "Vendor",
              deleteName: params.row.vendorName,
              id: params.row.id,
            },
          });
        } else {
          toast.custom(
            <CustomToast
              message="Only for Inactive and Rejected Vendor"
              toast="error"
            />,
            {
              closeButton: false,
            }
          );
          return;
        }
      },
      icon: <DeleteIconDropdown />,
    },
  ];
};
export const getVendorApproveGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav("editVendorApprove", {
          state: { id: params.row.id, type: "Approve" },
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
