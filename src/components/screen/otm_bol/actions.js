import EditIcon from "@mui/icons-material/Edit";
import { SendOutlined,DownloadOutlined } from "@mui/icons-material";
// import DeleteIcon from '@mui/icons-material/Delete';

export const getOtmBolGridActions = (nav, setModal) => {
  return [
    {
      label: "Download XML",
      onClick: (params) => {
        console.log("Edit clicked for", params.row);
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
      icon: <DownloadOutlined />,
    },
    {
      label: "Send XML",
      onClick: (params) => {
        console.log("PL clicked for", params.row);
        nav(`/app/spr/packing_list/form`, {
          state: { formAction: "edit", initialValues: params.row },
        });
      },
      icon: <SendOutlined />,
    },
    {
      label: "BOL",
      onClick: (params) => {
        console.log("Audit clicked for", params.row);
        console.log("setModal", setModal);
        nav(`/app/spr/otm_bol/edit`, {
          state: { formAction: "edit", initialValues: params.row },
        });
        // setModal({ open: true, type: "audit", data: params.row });
      },
      icon: <EditIcon />,
    },
  ];
};
