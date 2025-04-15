import EditIconDropdown from "../../../../components/common/commonIconDropdown/EditIconDropdown/EditIconDropdown";

export const getLooseCargoListGridActions = (setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        setModal({
          open: true,
          type: "edit",
          data: params.row,
        });
      },
      icon: <EditIconDropdown />,
    },
  ];
};
