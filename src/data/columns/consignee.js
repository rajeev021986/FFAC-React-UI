import { appDateFormat } from "../../components/utils/date"


export const CONSIGNEE_COLUMNS = [
    {
        flex: 1,
        field: 'status',
        headerName: 'Status',
        width: 110,
        headerAlign: 'center',
        align: 'center',
        editable: false
    },
    {
        flex: 1,
        field: 'isDoc',
        headerName: 'Document',
        width: 110,
        headerAlign: 'center',
        align: 'center',
        editable: false
    },

    {
        flex: 1,
        field: 'consignee_name',
        headerName: 'Name',
        width: 110,
        headerAlign: 'center',
        align: 'center',
        editable: false
    },

    {
        flex: 1,
        field: 'address1',
        headerName: 'Address',
        width: 110,
        headerAlign: 'center',
        align: 'center',
        editable: false
    },

    {
        flex: 1,
        field: 'standard_free_days',
        headerName: 'Standard Free Days',
        width: 110,
        headerAlign: 'center',
        align: 'center', editable: false
    },
    {
        flex: 1,
        field: 'standard_rate',
        headerName: 'Standard Rate',
        width: 110,
        headerAlign: 'center',
        align: 'center', editable: false
    },
    {
        flex: 1,
        field: 'createdBy',
        headerName: 'Created By',
        width: 110,
        headerAlign: 'center',
        align: 'center', editable: false
    },
    {
        flex: 1,
        field: 'modifiedBy',
        headerName: 'Modified By',
        width: 110,
        headerAlign: 'center',
        align: 'center', editable: false
    },
    {
        flex: 1,
        field: 'createdDate',
        headerName: 'Created Date',
        width: 110,
        headerAlign: 'center',
        align: 'center', editable: false

    },
    {
        flex: 1,
        field: 'modifiedDate',
        headerName: 'Modified Date',
        width: 110,
        headerAlign: 'center',
        align: 'center', editable: false
    },

    {
        flex: 1,
        field: 'action',
        headerName: 'Action',
        width: 110,
        headerAlign: 'center',
        align: 'center', editable: false
    }

]