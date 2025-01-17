import { appDateFormat } from "../../components/utils/date"


export const BOND_COLUMNS = [
    {
        flex: 1,
        field: 'status',
        headerName: 'Status',
        flex: 1,
        headerAlign: 'center',
        align: 'center'
    },
    {
        flex: 1,
        field: 'bondNumber',
        headerName: 'Bond Number',
        flex: 1,
        headerAlign: 'center',
        align: 'center'
    },
    {
        flex: 1,
        field: 'bondType',
        headerName: 'Bond Type',
        flex: 1,
        headerAlign: 'center',
        align: 'center'
    },

    {
        flex: 1,
        field: 'createdBy',
        headerName: 'Created By',
        width: 110,
        headerAlign: 'center',
        align: 'center',
        editable: false
    },
    {
        flex: 1,
        field: 'createdDate',
        headerName: 'Created Date',
        width: 110,
        headerAlign: 'center',
        align: 'center',
        editable: false
    },
    {
        flex: 1,
        field: 'modifiedBy',
        headerName: 'Modified By',
        width: 110,
        headerAlign: 'center',
        align: 'center',
        editable: false
    },
    {
        flex: 1,
        field: 'modifiedDate',
        headerName: 'Modified Date',
        width: 110,
        headerAlign: 'center',
        align: 'center',
        editable: false
    },
    {
        flex: 1,
        field: 'action',
        headerName: 'Action',

        headerAlign: 'center',
        align: 'center',
    }
]