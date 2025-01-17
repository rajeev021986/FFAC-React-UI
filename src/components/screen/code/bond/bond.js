import EditIcon from "@mui/icons-material/Edit";
import BiotechIcon from "@mui/icons-material/Biotech";
import { GridDeleteIcon } from "@mui/x-data-grid";
import CustomToast from "../../../common/Toast/CustomToast";
import toast from "react-hot-toast";

export const getBondGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav("editBond", { state: { id: params.row.id, type: "Edit" } });
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
      label: "Delete Bond",
      onClick: (params) => {
        if (params.row.statusCode == -2 || params.row.statusCode == -1) {
          setModal({
            open: true,
            type: "delete",
            data: {
              who: "Bond",
              deleteName: params.row.bondNumber,
              id: params.row.id,
            },
          });
        } else {
          toast.custom(
            <CustomToast
              message="Only for Inactive and Rejected bond"
              toast="error"
            />,
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
