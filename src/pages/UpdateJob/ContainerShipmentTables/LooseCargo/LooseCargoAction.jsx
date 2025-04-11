import EditIconDropdown from "../../../../components/common/commonIconDropdown/EditIconDropdown/EditIconDropdown";

export const getLooseCargoListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav(`looseCargoNumber`, {
          state: { formAction: "edit", initialValues: params.row },
        });
      },
      icon: <EditIconDropdown />,
    },
  ];
};
