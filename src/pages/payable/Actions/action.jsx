import toast from "react-hot-toast";
import CustomToast from "../../../components/common/Toast/CustomToast";
import EditIconDropdown from "../../../components/common/commonIconDropdown/EditIconDropdown/EditIconDropdown";
import AuditIconDropdown from "../../../components/common/commonIconDropdown/AuditIconDropdown/AuditIconDropdown";
import DeleteIconDropdown from "../../../components/common/commonIconDropdown/DeleteIconDropdown/DeleteIconDropdown";
import PrintIcon from "@mui/icons-material/Print";

export const getPayableListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav(`editpayable`, {
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
        if (params.row.statusCode == -2 || params.row.statusCode == -1) {
          setModal({
            open: true,
            type: "delete",
            data: {
              who: "Payable",
              deleteName: params.row.customerName,
              id: params.row.id,
            },
          });
        } else {
          toast.custom(
            <CustomToast
              message="Only for Inactive and Rejected Payable"
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

    {
      label: "Print",
      onClick: (params) => {
        setModal({
          open: true,
          type: "print",
          data: {
            who: "Print PDF",
            data: params.row,
          },
        });
      },
      icon: <PrintIcon sx={{ width: "20px", marginTop: "2px" }} />,
    },
  ];
};
