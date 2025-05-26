import toast from "react-hot-toast";
import CustomToast from "../../common/Toast/CustomToast";
import EditIconDropdown from "../../common/commonIconDropdown/EditIconDropdown/EditIconDropdown";
import AuditIconDropdown from "../../common/commonIconDropdown/AuditIconDropdown/AuditIconDropdown";
import DeleteIconDropdown from "../../common/commonIconDropdown/DeleteIconDropdown/DeleteIconDropdown";
import PrintIcon from "@mui/icons-material/Print";

export const getJobEntryListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav(`editJobEntry`, {
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
        if (params.row.statusCode == -3 || params.row.statusCode == -1) {
          setModal({
            open: true,
            type: "delete",
            data: {
              who: "Job Entry",
              id: params.row.id,
              data: params.row,
            },
          });
        } else {
          toast.custom(
            <CustomToast
              message="Only for Cancelled and Rejected Job Entry"
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
