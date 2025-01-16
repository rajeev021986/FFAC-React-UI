import EditIcon from "@mui/icons-material/Edit";
import BiotechIcon from "@mui/icons-material/Biotech";
import { GridDeleteIcon } from "@mui/x-data-grid";
import CustomToast from "../../../common/Toast/CustomToast";
import toast from "react-hot-toast";

export const getPortGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav("editport", { state: { id: params.row.id, type: "Edit" } });
      },
      icon: <EditIcon />,
    },
    {
      label: "Audit",
      onClick: (params) => {
        setModal({ open: true, type: "audit", data: params.row });
      },
      icon: <BiotechIcon />,
    },
    {
      label: "Delete",
      onClick: (params) => {
        if (params.row.statusCode == -2) {
          setModal({
            open: true,
            type: "delete",
            data: {
              who: "Port",
              deleteName: params.row.newPortName,
              id: params.row.id,
            },
          });
        } else {
          toast.custom(
            <CustomToast message="Only for Inactive Port" toast="error" />,
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
