import { appDateFormat } from "../../components/utils/date"


export const CONSIGNEE_COLUMNS = [

    {
        field: 'consignee_name',
        headerName: 'Name',
        width: 110,
        headerAlign: 'center',
        align : 'center',
        editable: true
    },
    {
        field: 'address1',
        headerName: 'Address',
        width: 110,
        headerAlign: 'center',
        align : 'center',
        editable: true
    },
    {
        field: 'city',
        headerName: 'City',
        width: 110,
        headerAlign: 'center',
        align : 'center',editable: true
    },
    {
        flex: 1,
        field: 'country',
        headerName: 'Country',
        width: 110,
        headerAlign: 'center',
        align : 'center',editable: true
    },
    {
        flex: 1,
        field: 'standard_free_days',
        headerName: 'Standard Free Days',
        width: 110,
        headerAlign: 'center',
        align : 'center',editable: true
    },
    {
        flex: 1,
        field: 'standard_rate',
        headerName: 'Standard Rate',
        width: 110,
        headerAlign: 'center',
        align : 'center',editable: true
    },
    {
        flex: 1,
        field: 'created_by',
        headerName: 'Created By',
        width: 110,
        headerAlign: 'center',
        align : 'center',editable: true
    },
    {
        flex: 1,
        field: 'modified_by',
        headerName: 'Modified By',
        width: 110,
        headerAlign: 'center',
        align : 'center',editable: true
    },
    
    {
        flex: 1,
        field: 'action',
        headerName: 'Action',
        width: 110,
        headerAlign: 'center',
        align : 'center',editable: true
    }
  
]