import { Chip } from "@mui/material"
import { appDateFormat } from "../../components/utils/date"


export const USER_MANAGEMENT_COLUMNS = [
    { field: 'usercode', headerName: 'User Code', width: 90 },
    {
        field: 'userid',
        headerName: 'User Id',
        width: 110,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'firstname',
        headerName: 'First name',
        width: 150,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'lastname',
        headerName: 'Last name',
        width: 150,
        headerAlign: 'center',
        align : 'center'
    },
    {
        flex: 1,
        field: 'companyname',
        headerName: 'Company Name',
        width: 110,
        headerAlign: 'center',
        align : 'center'
    },
    {
        flex: 1,
        field: 'emailid',
        headerName: 'Email',
        width: 110,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'role',
        headerName: 'Role',
        width: 110,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 110,
        headerAlign: 'center',
        align : 'center'
    },
    {
        flex: 1,
        field: 'lastmodifiedby',
        headerName: 'Updated By',
        width: 110,
        headerAlign: 'center',
        align : 'center'
    },
    {
        flex: 1,
        field: 'lastmodifieddate',
        headerName: 'Updated At',
        width: 110,
        headerAlign: 'center',
        align : 'center',
        cellType: 'date',
        renderCell : (params) => {
            return <div>{appDateFormat(params.value)}</div>
        }
    },
    {
        field: 'action',
        headerName: 'Action',
        width: 150,
        headerAlign: 'center',
        align : 'center',
    }
]


export const REGISTERED_USERS_COLUMNS = [
    {
        field: 'firstname',
        headerName: 'First Name',
        width: 110,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'lastname',
        headerName: 'Last name',
        width: 150,
        headerAlign: 'center',
        align : 'center'
    },
    {
        flex: 1,
        field: 'emailid',
        headerName: 'Email',
        width: 110,
        headerAlign: 'center',
        align : 'center'
    },
    {
        flex: 1,
        field: 'status',
        headerName: 'Status',
        width: 110,
        headerAlign: 'center',
        align : 'center',
        renderCell : (params)=>{
            let color = "";
            switch (params.value) {
                case "NEW":
                    color = "primary"
                    break;
                case "APPROVED":
                    color = "success"
                    break;
                default:
                    color = "error"
                    break;
            }
            return <Chip label={params.value} color={color} />
        }
    },
    {
        flex: 1,
        field: 'reject_reason',
        headerName: 'Reject Reason',
        width: 110,
        headerAlign: 'center',
        align : 'center',
        renderCell : (params) => {
            return <div>{params.value === null ? "-" : params.value}</div>
        }
    },
    {
        flex: 1,
        field: 'created_at',
        headerName: 'Created At',
        width: 110,
        headerAlign: 'center',
        align : 'center',
        cellType: 'date',
        renderCell : (params) => {
            return <div>{appDateFormat(params.value)}</div>
        }
    },
    {
        field: 'action',
        headerName: 'Action',
        width: 150,
        headerAlign: 'center',
        align : 'center',
    }
]