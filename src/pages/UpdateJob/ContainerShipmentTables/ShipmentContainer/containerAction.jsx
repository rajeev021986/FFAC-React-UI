import EditIconDropdown from "../../../../components/common/commonIconDropdown/EditIconDropdown/EditIconDropdown";

export const getContaienrListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav(`containerNumber`, {
          state: { formAction: "edit", initialValues: params.row },
        });
      },
      icon: <EditIconDropdown />,
    },
  ];
};
