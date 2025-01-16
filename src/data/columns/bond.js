import { appDateFormat } from "../../components/utils/date"


export const BOND_COLUMNS = [
    {
        field: 'bondNumber',
        headerName: 'Bond Number',
        flex:1,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'bondType',
        headerName: 'Bond Type',
        flex:1,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'status',
        headerName: 'Status',
        flex:1,
        headerAlign: 'center',
        align: 'center'
    },
    {
        field: 'lastmodifieddate',
        headerName: 'Modified Date',
        flex:1,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => {
            return <div>{appDateFormat(params.value)}</div>
        }
    },
    {
        field: 'action',
        headerName: 'Action',
        flex:1,
        headerAlign: 'center',
        align: 'center',
    }
]