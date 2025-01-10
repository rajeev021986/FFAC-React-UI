import EditIcon from "@mui/icons-material/Edit";

export const getPartyListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav(`/app/code/party/form`, {state: {formAction: "edit", initialValues: params.row},
        });
      },
      icon: <EditIcon />,
    },
  ];
};
