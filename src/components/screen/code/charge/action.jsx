import EditIcon from "@mui/icons-material/Edit";
import { GridDeleteIcon } from "@mui/x-data-grid";
import CustomToast from "../../../common/Toast/CustomToast";
import toast from "react-hot-toast";
import BiotechIcon from "@mui/icons-material/Biotech";
export const getChargesListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav(`editcharges`, {
          state: { type: "Edit", id: params.row.id },
        });
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
        if (params.row.statusCode == -2 || params.row.statusCode == -1) {
          setModal({
            open: true,
            type: "delete",
            data: {
              who: "Charge",
              deleteName: params.row.charge,
              id: params.row.id,
            },
          });
        } else {
          toast.custom(
            <CustomToast
              message="Only for Inactive and Rejected Charge"
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
