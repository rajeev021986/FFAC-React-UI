

export const SERVICE_INVOICE_COLUMNS = [
    {
        field: 'invoice_no',
        headerName: 'Invoice#',
        width: 150
    },
    {
        field: 'invoice_date',
        headerName: 'Invoice Date',
        width: 150,
        cellType: 'date'
    },
    {
        field: 'terms_net_due_date',
        headerName: 'Due Date',
        width: 150,
        cellType: 'date'
    },
    {
        field: 'trm_status',
        headerName: 'Status',
        width: 150
    },
    {
        field: 'bl_no',
        headerName: 'BL#',
        width: 150
    },
    
    {
        field: 'fob_point',
        headerName: 'FOB Point',
        width: 150
    },
    {
        field: 'discharge_point',
        headerName: 'Discharge Point',
        width: 150
    },
    {
        field: 'numbr1',
        headerName: 'Volume',
        width: 150
    },
    {
        field: 'numbr2',
        headerName: 'Pieces',
        width: 150
    },
    {
        field: 'numbr3',
        headerName: 'Gross Wt',
        width: 150
    },
    {
        field: 'numbr4',
        headerName: 'Chargeable Wt',
        width: 150
    },
    {
        field: 'ship_date',
        headerName: 'Ship Date',
        width: 150,
        cellType: 'date'
    },
    {
        field: 'batch_run_date',
        headerName: 'TRM Received Date',
        width: 150,
        cellType: 'date'
    },
    {
        field: 'xml_file_generated_date',
        headerName: 'SPR Sent Date',
        width: 150,
        cellType: 'date'
    },
    {
        field: 'total_amount',
        headerName: 'Amount',
        width: 150
    },
    {
        field: 'note_text',
        headerName: 'Notes',
        width: 150
    }
]

export const SERVICE_INVOICE_DETAILS_COLUMNS = [
    {
        field: 'expense_code',
        headerName: 'Expense Code',
        width: 50,
        cellType : null
    },
    {
        field: 'description_of_charges',
        headerName: 'Description of Charges',
        width: 150,
        cellType : null
    },
    {
        field: 'extended_price',
        headerName: 'Amount',
        width: 20,
        cellType: 'text'
    }
]