import EditIcon from "@mui/icons-material/Edit";

export const getAgentListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {

        nav(`/app/code/agent/form`, {state: {formAction: "edit", initialValues: params.row},
        });
      },
      icon: <EditIcon />,
    }
  ];
};
