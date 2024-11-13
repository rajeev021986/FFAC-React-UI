import * as Yup from 'yup';

export const expenseCodeValidation = Yup.object({
    tmc_code: Yup.string().required("TMC Code is required"),
    tmc_desc: Yup.string().required("TMC Description is required"),
    spr_desc: Yup.string().required("SPR Description is required"),
    spr_code: Yup.string().required("SPR Expense Code is required"),
    memo4_ff_exp_code: Yup.string().required("Memo4 FF Exp Code is required"),
    spr_gl_code: Yup.number().typeError("Must be a number").required("SPR Gl Code is required"),
    gl_account: Yup.string().required("Gl Account is required"),
    modified_by: Yup.string().required("Modified By is required"),
});