import { Biotech } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { GridDeleteIcon } from "@mui/x-data-grid";
import CustomToast from "../../common/Toast/CustomToast";
import toast from "react-hot-toast";

export const getVesselListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav(`editvessel`, {
          state: { formAction: "edit", initialValues: params.row },
        });
      },
      icon: <EditIcon />,
    },
    {
      label: "Audit",
      onClick: (params) => {
        // nav(`editvessel`, {
        //   state: { formAction: "edit", initialValues: params.row },
        // });
        setModal({ type: "audit", open: true, data: params.row });
      },
      icon: <Biotech />,
    },
    {
      label: "Delete",
      onClick: (params) => {
        if (params.row.statusCode == -2) {
          setModal({
            open: true,
            type: "delete",
            data: {
              who: "Vessel",
              deleteName: params.row.vesselName,
              id: params.row.id,
            },
          });
        } else {
          toast.custom(
            <CustomToast message="Only for Inactive Vessel" toast="error" />,
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
