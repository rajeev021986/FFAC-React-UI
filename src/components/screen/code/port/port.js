import EditIcon from "@mui/icons-material/Edit";
import BiotechIcon from "@mui/icons-material/Biotech";
import { GridDeleteIcon } from "@mui/x-data-grid";

export const getPortGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav("editPort", { state: { id: params.row.id, type: "Edit" } });
      },
      icon: <EditIcon />,
    },
    {
      label: "Audit",
      onClick: (params) => {
        setModal({ open: true, type: "audit", data: params.row });
      },
      icon: <BiotechIcon />,
    },
    {
      label: "Delete Port",
      onClick: (params) => {
        setModal({
          open: true,
          type: "delete",
          data: {
            who: "Port",
            deleteName: params.row.newPortName,
            id: params.row.id,
          },
        });
      },
      icon: <GridDeleteIcon />,
    },
  ];
};
