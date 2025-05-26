import EditIconDropdown from "../../../components/common/commonIconDropdown/EditIconDropdown/EditIconDropdown";

export const getReceiveableEntryGridActionApprove = (nav, params) => {
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
  ];
};
