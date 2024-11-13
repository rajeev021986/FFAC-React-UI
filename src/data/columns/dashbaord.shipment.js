import { Chip } from "@mui/material";
import { appDateFormat } from "../../components/utils/date"
import { SHIPMENT_STATUS_OBJ } from "../enums";


export const SHIPMENT_COLUMNS = [
    {
        field: 'fileno',
        headerName: 'File No',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'pol',
        headerName: 'POL',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'pod',
        headerName: 'POD',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'mblno',
        headerName: 'MBL No',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        flex : 1,
        field: 'shipper',
        headerName: 'Supplier',
        width: 250,
        minWidth: 250,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'account_name',
        headerName: 'Party',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 130,
        minWidth: 200,
        headerAlign: 'center',
        align : 'center',
    },
    {
        field: 'vessel',
        headerName: 'Vessel',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'voyage',
        headerName: 'Voyage',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'departure_date',
        headerName: 'ETD',
        width: 130,
        headerAlign: 'center',
        align : 'center',
        cellType : "date",
        renderCell : (params) => {
            return <div>{appDateFormat(params.value)}</div>
        }
    },
    {
        field: 't49_eta',
        headerName: 'ETA',
        width: 130,
        headerAlign: 'center',
        align : 'center',
        cellType : "date",
        renderCell : (params) => {
            return <div>{appDateFormat(params.value)}</div>
        }
    },
    {
        field: 'blno',
        headerName: 'BL',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 't49_vessel_actualdeparted_date',
        headerName: 'ATD',
        width: 130,
        headerAlign: 'center',
        align : 'center',
        cellType : "date",
        renderCell : (params) => {
            return <div>{appDateFormat(params.value)}</div>
        }
    },
    {
        field: 't49_vessel_actualarrived_date',
        headerName: 'ATA',
        width: 130,
        headerAlign: 'center',
        align : 'center',
        cellType : "date",
        renderCell : (params) => {
            return <div>{appDateFormat(params.value)}</div>
        }
    },
    {
        field: 'contno',
        headerName: 'Container',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'custrefno',
        headerName: 'PO#',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'action',
        headerName: 'Action',
        width: 130,
        headerAlign: 'center',
        align : 'center',
    }
   
]

