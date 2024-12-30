import EditIcon from "@mui/icons-material/Edit";
import { GridDeleteIcon } from "@mui/x-data-grid";
import toast from "react-hot-toast";

export const getCustomerListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        console.log("Edit clicked for", params.row);
        nav(`editcustomer`, {
          state: { formAction: "edit", initialValues: params.row },
        });
      },
      icon: <EditIcon />,
    },
    {
      label: "Delete",
      onClick: (params) => {
        if (
          !(
            params.row.status.toLowerCase() == "rejected" ||
            params.row.status.toLowerCase() == "inactive"
          )
        ) {
          toast.error("Only for Inactive and Rejected Customer");
          return;
        }
        setModal({
          open: true,
          type: "delete",
          data: {
            who: "Customer",
            deleteName: params.row.customerName,
            id: params.row.id,
          },
        });
      },
      icon: <GridDeleteIcon />,
    },
  ];
};
