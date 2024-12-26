import { appDateFormat } from "../../components/utils/date"


export const SHIPPER_COLUMNS = [

    {
        field: 'name',
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
        field: 'email',
        headerName: 'Email ',
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