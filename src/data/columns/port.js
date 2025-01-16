import { appDateFormat } from "../../components/utils/date"


export const PORT_COLUMNS = [
    {
        flex: 1,
        field: 'status',
        headerName: 'Status',
        width: 110,
        headerAlign: 'center',
        align: 'center'
    },
    {
        flex: 1,
        field: 'newPortName',
        headerName: 'Port Name',
        width: 110,
        headerAlign: 'center',
        align: 'center'
    },
    {
        flex: 1,
        field: 'basePort',
        headerName: 'Base Port',
        width: 110,
        headerAlign: 'center',
        align: 'center'
    },
    {
        flex: 1,
        field: 'countryName',
        headerName: 'Country Name',
        width: 110,
        headerAlign: 'center',
        align: 'center'
    },
    {
        flex: 1,
        field: 'region',
        headerName: 'Region',
        width: 110,
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
        width: 110,
        headerAlign: 'center',
        align: 'center',
    }
]