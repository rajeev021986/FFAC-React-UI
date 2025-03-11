import EditIconDropdown from "../../common/commonIconDropdown/EditIconDropdown/EditIconDropdown";
import AuditIconDropdown from "../../common/commonIconDropdown/AuditIconDropdown/AuditIconDropdown";

export const getJobEntryListGridActionsApprovel = (nav, setModal) => {
  console.log(nav, 98394839)
  return [
    {
      label: "Edit",
      onClick: (params) => {
        console.log(params.row, 495895)
        nav(`approveJobRequest`, {
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
  ];
};
