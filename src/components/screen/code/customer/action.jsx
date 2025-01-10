import EditIcon from "@mui/icons-material/Edit";
import { GridDeleteIcon } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import BiotechIcon from "@mui/icons-material/Biotech";
import CustomToast from "../../../common/Toast/CustomToast";

export const getCustomerListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {

        nav(`editcustomer`, {
          state: { formAction: "edit", initialValues: params.row },
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
        if (params.row.isApproved == -2 || params.row.isApproved == -1) {
          setModal({
            open: true,
            type: "delete",
            data: {
              who: "Customer",
              deleteName: params.row.customerName,
              id: params.row.id,
            },
          });
        } else {
          toast.custom(
            <CustomToast
              message="Only for Inactive and Rejected Customer"
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
