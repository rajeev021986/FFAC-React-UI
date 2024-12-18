import { appDateFormat } from "../../components/utils/date"


export const VENDOR_COLUMNS = [
    {
        field: 'id',
        headerName: 'Party Id',
        width: 130,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 130,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'vendorName',
        headerName: 'Name',
        width: 130,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'address',
        headerName: 'Address',
        width: 130,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'bankName',
        headerName: 'Bank Name',
        width: 130,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'telephone1',
        headerName: 'Contact Number',
        width: 130,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'pinNo',
        headerName: 'Pin Code',
        width: 130,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'city',
        headerName: 'City',
        width: 130,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'country',
        headerName: 'Country',
        width: 130,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'lastmodifieddate',
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