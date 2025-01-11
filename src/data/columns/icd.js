import { appDateFormat } from "../../components/utils/date"


export const ICD_COLUMNS = [

    {
        field: 'icdName',
        headerName: 'Name',
        width: 110,
        headerAlign: 'center',
        align : 'center',
        editable: true
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 110,
        headerAlign: 'center',
        align : 'center',
        editable: true
    },
    {
        field: 'icdCode',
        headerName: 'Code',
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
        field: 'contactPerson',
        headerName: 'Contact Person',
        width: 110,
        headerAlign: 'center',
        align : 'center',editable: true
    },
    {
        flex: 1,
        field: 'tel_No',
        headerName: 'Tel No.',
        width: 110,
        headerAlign: 'center',
        align : 'center',editable: true
    },
    {
        flex: 1,
        field: 'email',
        headerName: 'Email',
        width: 110,
        headerAlign: 'center',
        align : 'center',editable: true
    },
    {
        flex: 1,
        field: 'mobile',
        headerName: 'Mobile Number',
        width: 110,
        headerAlign: 'center',
        align : 'center',editable: true
    },
    {
        flex: 1,
        field: 'createdBy',
        headerName: 'Created By',
        width: 110,
        headerAlign: 'center',
        align : 'center',editable: true,
       
    },
    {
        flex: 1,
        field: 'modifiedBy',
        headerName: 'Modified By',
        width: 110,
        headerAlign: 'center',
        align : 'center',editable: true,
    },
    {
        flex: 1,
        field: 'createdDate',
        headerName: 'Created Date',
        width: 110,
        headerAlign: 'center',
        align : 'center',editable: true,
        renderCell: (params) => {
            return <div>{appDateFormat(params.value)}</div>
        }
    },
    {
        flex: 1,
        field: 'modifiedDate',
        headerName: 'Modified Date',
        width: 110,
        headerAlign: 'center',
        align : 'center',editable: true,
        renderCell: (params) => {
            return <div>{appDateFormat(params.value)}</div>
        }
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