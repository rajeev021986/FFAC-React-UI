import { Chip } from "@mui/material"
import { appDateFormat } from "../../components/utils/date"
import { Button } from '@mui/material';


export const PACKING_LIST_COLUMNS = (displayFormat) =>{
    return [
        {
            field: 'packing_list_no',
            headerName: 'Packing List No.',
            width: 130,
            headerAlign: 'center',
            align : 'center'
        },
        {
            field: 'bl_no',
            headerName: 'BL No.',
            width: 150,
            headerAlign: 'center',
            align : 'center'
        },
        {
            field: 'shipper_vendor_name',
            headerName: 'Vendor',
            width: 250,
            headerAlign: 'center',
            align : 'center'
        },
        {
            field: 'po_no',
            headerName: 'PO No.',
            width: 150,
            headerAlign: 'center',
            align : 'center'
        },
        {
            field: 'vendor_plno',
            headerName: 'Vendor PL No',
            width: 150,
            headerAlign: 'center',
            align : 'center'
        },
        {
            field: 'invoice_no',
            headerName: 'Invoice #',
            width: 180,
            headerAlign: 'center',
            align : 'center',
            renderCell : (params) => {
                if(params.value){
                    return <Chip label={params.value} color="primary" variant="outlined" />
                }
                return '';
            }
        },
        {
            field: 'invoice_date',
            headerName: 'Inv. Dt',
            width: 150,
            headerAlign: 'center',
            align : 'center',
            cellType: 'date',
            renderCell : (params) => {
                return <div>{appDateFormat(params.value)}</div>
            }
        },
        {
            field: 'est_cargo_ex_factory',
            headerName: 'Cargo Ready Date',
            width: 150,
            headerAlign: 'center',
            align : 'center',
            cellType: 'date',
            renderCell : (params) => {
                return <div>{appDateFormat(params.value)}</div>
            }
            
        },
        {
            field: 'batch_run_date',
            headerName: 'PL Created Date',
            width: 150,
            headerAlign: 'center',
            align : 'center',
            cellType: 'date',
            renderCell : (params) => {
                return <div>{appDateFormat(params.value)}</div>
            }
        },
        {
            field: 'submit_date',
            headerName: 'PL Submit Date',
            width: 150,
            headerAlign: 'center',
            align : 'center',
            cellType: 'date',
            renderCell : (params) => {
                return <div>{appDateFormat(params.value)}</div>
            }
        },
        {
            field: 'pl_status',
            headerName: 'PL Status',
            width: 150,
            headerAlign: 'center',
            align : 'center',
            renderCell : (params) => {
                if(params.value){
                    return <Chip label={params.value} color="warning" variant="outlined" />
                }
                return '';
            }
        },
        {
            field: 'fob_port',
            headerName: 'FOB Point',
            width: 150,
            headerAlign: 'center',
            align : 'center'
        },
        {
            field: 'destination',
            headerName: 'Dest./Ship To',
            width: 150,
            headerAlign: 'center',
            align : 'center',
        },
        {
            field: 'booking_no',
            headerName: 'Booking#',
            width: 150,
            headerAlign: 'center',
            align : 'center'
        },
        {
            field: 'booking_date',
            headerName: 'Booking Date',
            width: 150,
            headerAlign: 'center',
            align : 'center',
            cellType: 'date',
            renderCell : (params) => {
                return <div>{appDateFormat(params.value)}</div>
            }
        },
        {
            field: 'si_cutoff',
            headerName: 'SI Cutoff',
            width: 150,
            headerAlign: 'center',
            align : 'center',
            cellType: 'date',
            renderCell : (params) => {
                return <div>{appDateFormat(params.value)}</div>
            }
        },
        {
            field: 'cy_cutoff',
            headerName: 'CY Cutoff',
            width: 150,
            headerAlign: 'center',
            align : 'center',
            cellType: 'date',
            renderCell : (params) => {
                return <div>{appDateFormat(params.value)}</div>
            }
        },
        {
            field: 'etd',
            headerName: 'ETD',
            width: 150,
            headerAlign: 'center',
            align : 'center',
            cellType: 'date',
            renderCell : (params) => {
                return <div>{appDateFormat(params.value)}</div>
            }
        },
        {
            field: 'eta',
            headerName: 'ETA',
            width: 150,
            headerAlign: 'center',
            align : 'center',
            cellType: 'date',
            renderCell : (params) => {
                return <div>{appDateFormat(params.value)}</div>
            }
        },
        {
            field: 'booked_batch_run_date',
            headerName: 'Booking Confirm',
            width: 150,
            headerAlign: 'center',
            align : 'center',
            cellType: 'date',
            renderCell : (params) => {
                return <div>{appDateFormat(params.value)}</div>
            }
        },
        {
            field: 'bl_batch_run_date',
            headerName: 'BOL Sent',
            width: 150,
            headerAlign: 'center',
            align : 'center',
            cellType: 'date',
            renderCell : (params) => {
                return <div>{appDateFormat(params.value)}</div>
            }
        },
        {
            field: 'bol_no',
            headerName: 'BOL#',
            width: 150,
            headerAlign: 'center',
            align : 'center',
        },
        {
            field: 'container_no',
            headerName: 'Container#',
            width: 150,
            headerAlign: 'center',
            align : 'center',
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            headerAlign: 'center',
            align : 'center',
        }
        
    ]
}

export const BOL_CONFIRMSATION_COLUMN = (displayFormat)=>{
    return [
        {
            flex : 1,
            field: 'packing_list_no',
            headerName: 'Packing List No.',
            width: 110,
            headerAlign: 'center',
            align : 'center'
        },
        {
            flex : 1,
            field: 'po_no',
            headerName: 'PO No.',
            width: 150,
            headerAlign: 'center',
            align : 'center'
        }
    ]
}

export const PACKING_LIST_LINE_ITEMS_COLUMNS = (displayFormat)=>{
    return [
        {
            field: 'pallet_id',
            headerName: 'Pallet ID',
            width: 100,
            headerAlign: 'center',
            align : 'center'
        },
        {
            field: 'po_no',
            headerName: 'PO No',
            width: 120,
            headerAlign: 'center',
            align : 'center'
        },
        {
            field: 'line_no',
            headerName: 'Line No',
            width: 80,
            headerAlign: 'center',
            align : 'center'
        },
        {
            field: 'gpc_item_no',
            headerName: 'GPC Item No',
            width: 150,
            headerAlign: 'center',
            align : 'center'
        },
        {
            field: 'vendor_item_no',
            headerName: 'Vendor Item No',
            width: 150,
            headerAlign: 'center',
            align : 'center'
        },
        {
            flex : 1,
            field: 'description',
            headerName: 'Description',
            width: 250,
            headerAlign: 'center',
            align : 'center'
        },
        {
            field: 'qty',
            headerName: 'Qty',
            width: 50,
            headerAlign: 'center',
            align : 'center'
        },
        {
            field: 'qtyType',
            headerName: 'UOM',
            width: 100,
            headerAlign: 'center',
            align : 'center'
        },
        {
            field: 'qty_carton',
            headerName: 'Qty/Carton',
            width: 100,
            headerAlign: 'center',
            align : 'center'
        },
        {
            field: 'cartons',
            headerName: 'Cartons',
            width: 100,
            headerAlign: 'center',
            align : 'center'
        },
        {
            field: 'gross_wgt',
            headerName: 'Gross Wgt(kg)',
            width: 150,
            headerAlign: 'center',
            align : 'center'
        },
        {
            field: 'cbm',
            headerName: 'CBM',
            width: 100,
            headerAlign: 'center',
            align : 'center',
            renderCell : (params) =>{
                return <div>{displayFormat("cbm",params.value)}</div>
            }
        },
        {
            field: 'country_of_origin',
            headerName: 'Cntry of Origin',
            width: 150,
            headerAlign: 'center',
            align : 'center'
        },
        {
            field: 'hts',
            headerName: 'HTS',
            width: 120,
            headerAlign: 'center',
            align : 'center'
        }
    ]
}

export const PL_DETAILS_COULUM = (displayFormat) =>[
    {
        flex : 1,
        field: 'lineNo',
        headerName: 'Line #',
        width: 110,
        headerAlign: 'center',
        align : 'center'
    },
    {
        flex : 1,
        field: 'gpcItemNo',
        headerName: 'Item #',
        width: 150,
        headerAlign: 'center',
        align : 'center'
    },
    {
        flex : 1,
        field: 'qty',
        headerName: 'Ship Qty',
        width: 110,
        headerAlign: 'center',
        align : 'center'
    },
    {
        flex : 1,
        field: 'cbm',
        headerName: 'Volume',
        width: 150,
        headerAlign: 'center',
        align : 'center',
        renderCell : (value) =>{
            return <>{displayFormat("cbm",value)}</>
        }
    },
    {
        flex : 1,
        field: 'cbmType',
        headerName: 'Type',
        width: 110,
        headerAlign: 'center',
        align : 'center'
    },
    {
        flex : 1,
        field: 'grossWgt',
        headerName: 'Wgt',
        width: 150,
        headerAlign: 'center',
        align : 'center'
    },
    {
        flex : 1,
        field: 'grossWgtType',
        headerName: 'Type',
        width: 110,
        headerAlign: 'center',
        align : 'center'
    },
    {
        flex : 1,
        field: 'qtyCarton',
        headerName: 'No Pkgs',
        width: 150,
        headerAlign: 'center',
        align : 'center'
    },
    {
        flex : 1,
        field: 'description',
        headerName: 'Description',
        width: 150,
        headerAlign: 'center',
        align : 'center'
    },
    {
        flex : 1,
        field: 't360volume',
        headerName: 'T360 Volume',
        width: 110,
        headerAlign: 'center',
        align : 'center',
        renderCell : (value) =>{
            return <>{displayFormat("t360volume",value)}</>
        }
    },
    {
        flex : 1,
        field: 't360weight',
        headerName: 'T360 Weight',
        width: 150,
        headerAlign: 'center',
        align : 'center',
        renderCell : (value) =>{
            return <>{displayFormat("t360weight",value)}</>
        }
    },
    {
        flex : 1,
        field: 't360qty',
        headerName: 'T360 Qty',
        width: 150,
        headerAlign: 'center',
        align : 'center',
        renderCell : (value) =>{
            return <>{displayFormat("t360qty",value)}</>
        }
    }
    
]

export const FILE_COLUMN = (handleClick) =>[
    {
        flex : 1,
        field: 'originalname',
        headerName: 'File Name.',
        width: 150,
        headerAlign: 'center',
        align : 'center'
    },
    {
        flex: 1,
        field: 'filepath',
        headerName: 'Link',
        width: 150,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleClick(params.value)}
          >
            View
          </Button>
        ),
      },
]