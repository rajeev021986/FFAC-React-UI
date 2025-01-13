import EditIcon from "@mui/icons-material/Edit";

export const getConsigneeListGridActionsConsigneeApprovel = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav(`approveRequest`, {state: {formAction: "edit", initialValues: params.row},
  
        });
      },
      icon: <EditIcon />,
    },
  ];
};
