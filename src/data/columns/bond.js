import { appDateFormat } from "../../components/utils/date"


export const BOND_COLUMNS = [
    {
        field: 'bondNumber',
        headerName: 'Bond Number',
        width: 130,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'bondType',
        headerName: 'Bond Type',
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
        field: 'action',
        headerName: 'Action',
        width: 130,
        headerAlign: 'center',
        align: 'center',
    }
]