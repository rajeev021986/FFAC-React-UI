import EditIcon from "@mui/icons-material/Edit";
import { GridDeleteIcon } from "@mui/x-data-grid";

export const getChargesListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        console.log("Edit clicked for", params.row);
        nav(`editcharges`, {
          state: { type: "Edit", id: params.row.id },
        });
      },
      icon: <EditIcon />,
    },
    {
      label: "Delete",
      onClick: (params) => {
        setModal({
          open: true,
          type: "delete",
          data: {
            who: "Charges",
            deleteName: params.row.chargeName,
            id: params.row.id,
          },
        });
      },
      icon: <GridDeleteIcon />,
    },
  ];
};
