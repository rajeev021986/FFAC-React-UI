import { Biotech } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";

export const getVesselListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        console.log("Edit clicked for", params.row);
        nav(`editvessel`, {
          state: { formAction: "edit", initialValues: params.row },
        });
      },
      icon: <EditIcon />,
    },
    {
      label: "Audit",
      onClick: (params) => {
        console.log("Edit clicked for", params.row);
        // nav(`editvessel`, {
        //   state: { formAction: "edit", initialValues: params.row },
        // });
        setModal({ type: "audit", open: true, data: params.row });
      },
      icon: <Biotech />,
    },
  ];
};
