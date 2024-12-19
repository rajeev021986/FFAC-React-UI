import { KeyOutlined } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import BiotechIcon from '@mui/icons-material/Biotech';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import { GridDeleteIcon } from "@mui/x-data-grid";
import toast from "react-hot-toast";

export const getUserListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        console.log("Tsting", params.row);
        nav(`/app/admin/users/editUser/${params.row.userId}`, {
          state: { formAction: "edit", initialValues: params.row },
        });
      },
      icon: <EditIcon />,
    },
    {
      label: "Audit",
      onClick: (params) => {
        console.log("Audit clicked for", params.row);
        setModal({ open: true, type: "audit", data: params.row });
      },
      icon: <BiotechIcon />,
    },
    {
      label: "Delete",
      onClick: (params) => {
        console.log("Delete Tsting for", params.row);
        setModal({ open: true, type: "delete", data: params.row.id });
      },
      icon: <GridDeleteIcon />,
    },
    {
      label: "Reset Pass",
      onClick: (params) => {
        console.log("Reset Tsting clicked for", params.row);
        setModal({ open: true, type: "reset", data: params.row });
      },
      icon: <KeyOutlined />,
    },
  ];
};



export const newUserListGridActions = (nav, setModal) => {
  return [
    {
      label: "Approve",
      onClick: (params) => {
        console.log("Edit clicked for", params.row);
        // userid : params.row.emailid
        let data = { ...params.row, }
        if (data.status !== "APPROVED") {
          delete data.status;
          nav(`/app/admin_master/user_management/form`, {
            state: { formAction: "verify", initialValues: data },
          });
        }
        else {
          toast.error("Already Approved")
        }
      },
      icon: <EditIcon />,
    },
    {
      label: "Reject",
      onClick: (params) => {

        if (params.row.status !== "APPROVED") {
          setModal({
            open: true,
            type: "reject",
            data: params.row,
          })
        }
        else {
          toast.error("Already Approved")
        }
      },
      icon: <ThumbDownAltOutlinedIcon />,
    },
  ];
};



