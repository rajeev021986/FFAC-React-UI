import { appDateFormat } from "../../components/utils/date"


export const VENDOR_COLUMNS = [
    {
        field: 'status',
        headerName: 'Status',
        width: 130,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'isDoc',
        headerName: 'Document',
        width: 110,
        headerAlign: 'center',
        align: 'center',
        editable: false
    },
    {
        field: 'vendorName',
        headerName: 'Vendor Name',
        width: 130,
        headerAlign: 'center',
        align: 'center'
    },

    {
        field: 'tinNo',
        headerName: 'TIN No',
        width: 130,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'vrnNo',
        headerName: 'VRN No',
        width: 130,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'type',
        headerName: 'Type',
        width: 130,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'createdBy',
        headerName: 'Created By',
        width: 130,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'createdDate',
        headerName: 'Created Date',
        width: 130,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => {
            return <div>{appDateFormat(params.value)}</div>
        }
    },
    {
        field: 'modifiedBy',
        headerName: 'Modified By',
        width: 130,
        headerAlign: 'center',
        align: 'center'
    },

    {
        field: 'modifiedDate',
        headerName: 'Modified Date',
        width: 130,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => {
            return <div>{appDateFormat(params.value)}</div>
        }
    },
    {
        field: 'action',
        headerName: 'Action',
        width: 130,
        headerAlign: 'center',
        align: 'center',
    }
]