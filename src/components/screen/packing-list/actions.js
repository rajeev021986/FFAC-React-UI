import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from '@mui/icons-material/Delete';

export const getPackingListGridActions = (nav, setModal) => {
  return [
    {
      label: "BOL",
      onClick: (params) => {
        if (params.row.bl_no === "" && params.row.pl_status === "FINAL") {
          nav(`/app/spr/packing_list/bol`, {
            state: {
              mode: "add",
              packinglistno: params.row.packing_list_no,
              id: null,
            },
          });
        } else {
          nav(`/app/spr/packing_list/bol`, {
            state: {
              mode: "modify",
              packinglistno: null,
              id: params.row.serial_id_bl,
            },
          });
        }
      },
      icon: <EditIcon />,
    },
    {
      label: "PL",
      onClick: (params) => {
        nav(`/app/spr/packing_list/form`, {
          state: { formAction: "edit", initialValues: params.row },
        });
      },
      icon: <EditIcon />,
    },
    {
      label: "Aduit",
      onClick: (params) => {
        setModal({ open: true, type: "audit", data: params.row });
      },
      icon: <EditIcon />,
    },
  ];
};
