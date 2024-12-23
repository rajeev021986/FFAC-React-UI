import { Biotech } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";

export const getVoyageListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        console.log("Edit clicked for", params.row);
        nav(`editvoyage`, {
          state: { formAction: "edit", initialValues: params.row },
        });
      },
      icon: <EditIcon />,
    },
    {
      label: "Audit",
      onClick: (params) => {
        setModal({ type: "audit", open: true, data: params.row });
      },
      icon: <Biotech />,
    },
  ];
};
