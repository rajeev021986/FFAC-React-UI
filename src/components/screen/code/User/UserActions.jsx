import EditIcon from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import RefreshIcon from '@mui/icons-material/Refresh';

export const getUserListGridActions = (nav, setModal) => {
    return [
        {
            label: "Edit",
            onClick: (params="null") => {
                console.log("Edit user for", params);
                // nav(`edituser`, {
                //     state: { formAction: "edit", initialValues: params.row },
                // });
            },
            icon: <EditIcon />,
        },
        {
            label: "Delete",
            onClick: (params) => {
                console.log("Delete user for", params);
                // nav(`edituser`, {
                //     state: { formAction: "edit", initialValues: params.row },
                // });
            },
            icon: <Delete />,
        },
        {
            label: "Reset pass",
            onClick: (params) => {
                console.log("Reset pass user for", params);
                // nav(`edituser`, {
                //     state: { formAction: "edit", initialValues: params.row },
                // });
            },
            icon: <RefreshIcon />,
        },
    ];
};
