import { Chip } from "@mui/material"
import { appDateFormat } from "../../components/utils/date"
import { Button } from '@mui/material';


export const OTM_BOL_COLUMNS = [
    {
        field: 'bol',
        headerName: 'BOL',
        width: 170,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'supplier_name',
        headerName: 'Supplier Name',
        width: 250,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'pol',
        headerName: 'POL',
        width: 100,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'pod',
        headerName: 'pod',
        width: 100,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'pol_date',
        headerName: 'POL Date',
        width: 100,
        headerAlign: 'center',
        align : 'center',
        cellType: 'date',
        renderCell : (params) => {
            return <div>{appDateFormat(params.value)}</div>
        }
    },
    {
        field: 'pod_date',
        headerName: 'POD Date',
        width: 100,
        headerAlign: 'center',
        align : 'center',
        cellType: 'date',
        renderCell : (params) => {
            if(params.value){
                return  <div>{appDateFormat(params.value)}</div>
            }
            return '';
        }
    },
    {
        field: 'vessel',
        headerName: 'Vessel',
        width: 160,
        headerAlign: 'center',
        align : 'center',

    },
    {
        field: 'voyage',
        headerName: 'Voyage',
        width: 80,
        headerAlign: 'center',
        align : 'center',        
    },
    {
        field: 'common_key',
        headerName: 'Common Key',
        width: 170,
        headerAlign: 'center',
        align : 'center',
        cellType: 'date',
        renderCell : (params) => {
            if(params.value !== null){
                return params.value;
            }
            else {
                return "-"
            }
        }
    },
    {
        field: 'cng_xml_file_sent',
        headerName: 'CNG XML File Sent',
        width: 150,
        headerAlign: 'center',
        align : 'center',
        cellType: 'date',
    },
    {
        field: 'cng_xml_sent_date',
        headerName: 'CNG XML Sent Date',
        width: 150,
        headerAlign: 'center',
        align : 'center',
        cellType: 'date',
        renderCell : (params) => {
            return <div>{appDateFormat(params.value)}</div>
        }
    },
    {
        field: 'pl_no',
        headerName: 'PL No',
        width: 250,
        headerAlign: 'center',
        align : 'center',
    },
    {
        field: 'action',
        headerName: 'Action',
        width: 100,
        headerAlign: 'center',
        align : 'center',
    }
    
];