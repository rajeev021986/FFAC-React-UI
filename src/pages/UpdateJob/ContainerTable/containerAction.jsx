import EditIconDropdown from "../../../components/common/commonIconDropdown/EditIconDropdown/EditIconDropdown";

export const getContaienrListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav(`editcontainerNumber`, {
          state: { formAction: "edit", initialValues: params.row },
        });
      },
      icon: <EditIconDropdown />,
    },
  ];
};
