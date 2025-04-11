import EditIconDropdown from "../../../../components/common/commonIconDropdown/EditIconDropdown/EditIconDropdown";

export const getVehicleListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav(`vehicleNumber`, {
          state: { formAction: "edit", initialValues: params.row },
        });
      },
      icon: <EditIconDropdown />,
    },
  ];
};
