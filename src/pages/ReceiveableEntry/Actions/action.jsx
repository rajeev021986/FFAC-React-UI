import toast from "react-hot-toast";
import CustomToast from "../../../components/common/Toast/CustomToast";
import EditIconDropdown from "../../../components/common/commonIconDropdown/EditIconDropdown/EditIconDropdown";
import AuditIconDropdown from "../../../components/common/commonIconDropdown/AuditIconDropdown/AuditIconDropdown";
import DeleteIconDropdown from "../../../components/common/commonIconDropdown/DeleteIconDropdown/DeleteIconDropdown";

export const getReceiveableEntryGridActionApprove = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav(`EditreceiveableEntry`, {
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
              who: "Payable",
              deleteName: params.row,
              id: params.row.id,
            },
          });
        } else {
          toast.custom(
            <CustomToast
              message="Only for Cancelled and Rejected Receivable"
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
