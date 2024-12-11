import EditIcon from "@mui/icons-material/Edit";

export const getCustomerListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        console.log("Edit clicked for", params.row);
        nav(`/fghj/ghjkl`, {state: {formAction: "edit", initialValues: params.row},
       
        });
      },
      icon: <EditIcon />,
    },
  ];
};
