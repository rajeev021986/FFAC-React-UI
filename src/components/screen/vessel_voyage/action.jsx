import { Biotech } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import CustomToast from "../../common/Toast/CustomToast";
import toast from "react-hot-toast";
import { GridDeleteIcon } from "@mui/x-data-grid";
import EditIconDropdown from "../../common/commonIconDropdown/EditIconDropdown/EditIconDropdown";
import AuditIconDropdown from "../../common/commonIconDropdown/AuditIconDropdown/AuditIconDropdown";

export const getVoyageListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav(`editvoyage`, {
          state: { formAction: "edit", initialValues: params.row },
        });
      },
      icon: <EditIconDropdown />,
    },
    {
      label: "Audit",
      onClick: (params) => {
        setModal({ type: "audit", open: true, data: params.row });
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
              who: "Voyage",
              deleteName: params.row.vessel,
              id: params.row.id,
            },
          });
        } else {
          toast.custom(
            <CustomToast message="Only for Inactive Voyage" toast="error" />,
            {
              closeButton: false,
            }
          );
          return;
        }
      },
      icon: <GridDeleteIcon />,
    },
  ];
};
