import EditIcon from "@mui/icons-material/Edit";

export const getCustomerListGridActionsCustomerApprovel = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        console.log("Edit clicked for", params.row);
        nav(`editcustomer`, {state: {formAction: "edit", initialValues: params.row},
  
        });
      },
      icon: <EditIcon />,
    },
  ];
};
