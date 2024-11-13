import { appDateFormat } from "../../components/utils/date"


export const VENDOR_COLUMNS = [
    {
        field: 'party_id',
        headerName: 'Party Id',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'spr_vendor_id',
        headerName: 'Spr Vendor Id',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'name',
        headerName: 'Name',
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
        field: 'telephone',
        headerName: 'Telephone',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'fax',
        headerName: 'Fax',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'email',
        headerName: 'Email',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'contact_person',
        headerName: 'Contact Person',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'id_code',
        headerName: 'Id Code',
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