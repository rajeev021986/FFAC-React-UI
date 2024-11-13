import { appDateFormat } from "../../components/utils/date"


export const DESTINATION_COLUMNS = [
    {
        field: 'owner',
        headerName: 'Owner',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'code',
        headerName: 'Code',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'description',
        headerName: 'Description',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'location_type',
        headerName: 'Location Type',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'location_group',
        headerName: 'Location Group',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'address1',
        headerName: 'Address1',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'address2',
        headerName: 'Address2',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'city',
        headerName: 'City',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'state',
        headerName: 'State',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'postalcode',
        headerName: 'Postal Code',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'country',
        headerName: 'Country',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'lastmodifiedby',
        headerName: 'Modified By',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'lastmodifieddate',
        headerName: 'Modified Date',
        width: 130,
        headerAlign: 'center',
        align : 'center',
        renderCell : (params) => {
            return <div>{appDateFormat(params.value)}</div>
        }
    },
    {
        field: 'action',
        headerName: 'Action',
        width: 130,
        headerAlign: 'center',
        align : 'center',
    }
   
]