import EditIconDropdown from "../../../components/common/commonIconDropdown/EditIconDropdown/EditIconDropdown";

export const getJobUpdateListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav(`edit-job`, {
          state: { formAction: "edit", initialValues: params.row },
        });
      },
      icon: <EditIconDropdown />,
    },
  ];
};
