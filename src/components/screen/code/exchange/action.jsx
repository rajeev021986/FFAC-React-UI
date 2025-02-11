import EditIcon from "@mui/icons-material/Edit";
import { GridDeleteIcon } from "@mui/x-data-grid";
import CustomToast from "../../../common/Toast/CustomToast";
import toast from "react-hot-toast";
import { Biotech } from "@mui/icons-material";
import EditIconDropdown from "../../../common/commonIconDropdown/EditIconDropdown/EditIconDropdown";
import AuditIconDropdown from "../../../common/commonIconDropdown/AuditIconDropdown/AuditIconDropdown";
import DeleteIconDropdown from "../../../common/commonIconDropdown/DeleteIconDropdown/DeleteIconDropdown";

export const getExchangeRateListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav("editexchangerate", {
          state: { type: "edit", id: params.row.id },
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
              who: "Exchange Rate",
              deleteName: params.row.usdExchange,
              id: params.row.id,
            },
          });
        } else {
          toast.custom(
            <CustomToast
              message="Only for Inactive Exchange Rate"
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
