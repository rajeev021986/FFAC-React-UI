import EditIcon from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIconDropdown from "../../../common/commonIconDropdown/EditIconDropdown/EditIconDropdown";
import DeleteIconDropdown from "../../../common/commonIconDropdown/DeleteIconDropdown/DeleteIconDropdown";

export const getUserListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params = "null") => {
        // nav(`edituser`, {
        //     state: { formAction: "edit", initialValues: params.row },
        // });
      },
      icon: <EditIconDropdown />,
    },
    {
      label: "Delete",
      onClick: (params) => {
        // nav(`edituser`, {
        //     state: { formAction: "edit", initialValues: params.row },
        // });
      },
      icon: <DeleteIconDropdown />,
    },
    {
      label: "Reset pass",
      onClick: (params) => {
        // nav(`edituser`, {
        //     state: { formAction: "edit", initialValues: params.row },
        // });
      },
      icon: <RefreshIcon />,
    },
  ];
};
