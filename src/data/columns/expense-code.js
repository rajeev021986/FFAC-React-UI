import { appDateFormat } from "../../components/utils/date"


export const EXPENSE_CODE_COLUMNS = [
    {
        field: 'tmc_code',
        headerName: 'TMC Code in IES',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        flex : 1,
        field: 'tmc_desc',
        headerName: 'TMC Description - IES',
        width: 250,
        headerAlign: 'center',
        align : 'center'
    },
    {
        flex : 1,
        field: 'spr_desc',
        headerName: 'SPR Description',
        width: 150,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'spr_code',
        headerName: 'SPR Expense Code',
        width: 150,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'memo4_ff_exp_code',
        headerName: 'Memo4 FF Exp Code',
        width: 150,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'spr_gl_code',
        headerName: 'SPR Gl Code',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'gl_account',
        headerName: 'Gl Account',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'modified_by',
        headerName: 'Modified By',
        width: 130,
        headerAlign: 'center',
        align : 'center'
    },
    {
        field: 'modified_date',
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