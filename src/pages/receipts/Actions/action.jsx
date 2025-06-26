import toast from "react-hot-toast";
import CustomToast from "../../../components/common/Toast/CustomToast";
import EditIconDropdown from "../../../components/common/commonIconDropdown/EditIconDropdown/EditIconDropdown";
import AuditIconDropdown from "../../../components/common/commonIconDropdown/AuditIconDropdown/AuditIconDropdown";
import DeleteIconDropdown from "../../../components/common/commonIconDropdown/DeleteIconDropdown/DeleteIconDropdown";
import PrintIcon from "@mui/icons-material/Print";

export const getReceiptseListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav(`editReceipt`, {
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
        setModal({
          open: true,
          type: "delete",
          data: {
            who: "Payable",
            deleteName: params.row,
            id: params.row.id,
          },
        });
      },
      icon: <DeleteIconDropdown />,
    },

    // {
    //   label: "Print",
    //   onClick: (params) => {
    //     setModal({
    //       open: true,
    //       type: "print",
    //       data: {
    //         who: "Print PDF",
    //         data: params.row,
    //       },
    //     });
    //   },
    //   icon: <PrintIcon sx={{ width: "20px", marginTop: "2px" }} />,
    // },
  ];
};
