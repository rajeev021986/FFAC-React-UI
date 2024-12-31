import EditIcon from "@mui/icons-material/Edit";
import { GridDeleteIcon } from "@mui/x-data-grid";

export const getExchangeRateListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        console.log("Edit clicked for", params.row);
        nav("editexchangerate", {
          state: { type: "edit", id: params.row.id },
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
            who: "ExchangeRate",
            deleteName: "ExchangeRate",
            id: params.row.id,
          },
        });
      },
      icon: <GridDeleteIcon />,
    },
  ];
};
