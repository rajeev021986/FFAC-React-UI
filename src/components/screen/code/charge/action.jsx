import EditIcon from "@mui/icons-material/Edit";
import { GridDeleteIcon } from "@mui/x-data-grid";
import CustomToast from "../../../common/Toast/CustomToast";
import toast from "react-hot-toast";
import BiotechIcon from "@mui/icons-material/Biotech";
import EditIconForHeader from "../../../common/commonIcons/EditIcons/EditIconForHeader";
import DeleteIconDropdown from "../../../common/commonIconDropdown/DeleteIconDropdown/DeleteIconDropdown";
import AuditIconDropdown from "../../../common/commonIconDropdown/AuditIconDropdown/AuditIconDropdown";
import EditIconDropdown from "../../../common/commonIconDropdown/EditIconDropdown/EditIconDropdown";
export const getChargesListGridActions = (nav, setModal,setModalOpen) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        setModalOpen({ open: true, type: "edit", id: params.row.id }); // open modal with ID
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
              who: "Charge",
              deleteName: params.row.chargeName,
              id: params.row.id,
            },
          });
        } else {
          toast.custom(
            <CustomToast message="Only for Inactive Charge" toast="error" />,
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
