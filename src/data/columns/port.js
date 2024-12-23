import { appDateFormat } from "../../components/utils/date"


export const PORT_COLUMNS = [
    {
        field: 'newPortName',
        headerName: 'Port Name',
        width: 130,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'countryName',
        headerName: 'Country Name',
        width: 130,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'region',
        headerName: 'Region',
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
        field: 'unCode',
        headerName: 'UN Code',
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