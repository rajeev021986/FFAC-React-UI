import EditIcon from "@mui/icons-material/Edit";

export const getShipperListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        console.log("Edit clicked for", params.row);
        nav(`editshipper`, {state: {formAction: "edit", initialValues: params.row},
  
        });
      },
      icon: <EditIcon />,
    },
  ];
};
