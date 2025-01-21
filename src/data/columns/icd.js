import { appDateFormat } from "../../components/utils/date"


export const ICD_COLUMNS = [
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
        field: 'icdName',
        headerName: 'Name',
        width: 110,
        headerAlign: 'center',
        align: 'center',
        editable: false
    },

    {
        flex: 1,
        field: 'icdCode',
        headerName: 'Code',
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