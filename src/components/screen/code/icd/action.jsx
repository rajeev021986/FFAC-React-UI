import EditIcon from "@mui/icons-material/Edit";
import { GridDeleteIcon } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import BiotechIcon from "@mui/icons-material/Biotech";
import CustomToast from "../../../common/Toast/CustomToast";
import EditIconDropdown from "../../../common/commonIconDropdown/EditIconDropdown/EditIconDropdown";
import AuditIconDropdown from "../../../common/commonIconDropdown/AuditIconDropdown/AuditIconDropdown";
import DeleteIconDropdown from "../../../common/commonIconDropdown/DeleteIconDropdown/DeleteIconDropdown";

export const getIcdListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav(`editicd`, {
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
      label: "Delete",
      onClick: (params) => {
        if (params.row.statusCode == -2) {
          setModal({
            open: true,
            type: "delete",
            data: {
              who: "Icd",
              deleteName: params.row.icdName,
              id: params.row.id,
            },
          });
        } else {
          toast.custom(
            <CustomToast message="Only for Inactive Icd" toast="error" />,
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
