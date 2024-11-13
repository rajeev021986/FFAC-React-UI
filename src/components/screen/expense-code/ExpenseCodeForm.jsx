import React from "react";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import InputBox from "../../common/InputBox";
import { useFormik } from "formik";
import AppDatePicker from "../../common/AppDatePicker";
import { OutlinedButton, ThemeButton } from "../../common/Button";
import { expenseCodeValidation } from "./validation";
import {
  useAddExpenseCodeMutation,
  useUpdateExpenseCodeMutation,
} from "../../../store/api/expenseCodeDataApi";
import toast from "react-hot-toast";
import ReusableRightDrawer from "../../common/CommonDrawer";
import { COMMON } from "../../../data/columns/audit";

export default function ExpenseCodeForm({ modal, setModal }) {
  const [addExpenseCode, { isLoading: isAECLoading }] =
    useAddExpenseCodeMutation();
  const [updateExpenseCode, { isLoading: isUECLoading }] =
    useUpdateExpenseCodeMutation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      tmc_code: modal.data.tmc_code || "",
      tmc_desc: modal.data.tmc_desc || "",
      spr_desc: modal.data.spr_desc || "",
      spr_code: modal.data.spr_code || "",
      memo4_ff_exp_code: modal.data.memo4_ff_exp_code || "",
      spr_gl_code: modal.data.spr_gl_code || "",
      gl_account: modal.data.gl_account || "",
      modified_by: modal.data.modified_by || "",
      modified_date: modal.data.modified_date || new Date(),
    },
    validationSchema: expenseCodeValidation,
    onSubmit: async (values) => {
      console.log(values);

      try {
        let response =
          modal.type === "edit"
            ? await updateExpenseCode({
                id: modal.data.serial_id,
                ...values,
              }).unwrap()
            : await addExpenseCode(values).unwrap();
        // handle errors and success with toast
        if (response.status === "success") {
          toast.success(response.message);
          setModal({ open: false, type: "", data: {} });
        }
      } catch (error) {
        toast.error(error.data.message);
      }
    },
  });
  const handleCloseModal = () => {
    setModal({ open: false, type: "", data: {} });
  };
  const handleAuditModal = () => {
    setDrawerOpen({ open: false, type: "", data: {} });
  };

  return (
    <Stack
      spacing={4}
      direction="column"
      useFlexGap
      flexWrap="wrap"
      p={2}
      width="100%"
      height="100%"
    >
      <Stack direction="row" spacing={2}>
        <InputBox
          label="TMC Code in IES"
          id="tmc_code"
          value={formik.values.tmc_code}
          error={formik.errors.tmc_code}
          onChange={formik.handleChange}
        />
        <InputBox
          label="TMC Description - IES"
          id="tmc_desc"
          value={formik.values.tmc_desc}
          error={formik.errors.tmc_desc}
          onChange={formik.handleChange}
        />
      </Stack>
      <Stack direction="row" spacing={2}>
        <InputBox
          label="SPR Description"
          id="spr_desc"
          value={formik.values.spr_desc}
          error={formik.errors.spr_desc}
          onChange={formik.handleChange}
          multiline
          rows={2}
        />
      </Stack>
      <Stack direction="row" spacing={2}>
        <InputBox
          label="SPR Expense Code"
          id="spr_code"
          value={formik.values.spr_code}
          error={formik.errors.spr_code}
          onChange={formik.handleChange}
        />
        <InputBox
          label="Memo4 FF Exp Code"
          id="memo4_ff_exp_code"
          value={formik.values.memo4_ff_exp_code}
          error={formik.errors.memo4_ff_exp_code}
          onChange={formik.handleChange}
        />
      </Stack>
      <Stack direction="row" spacing={2}>
        <InputBox
          label="SPR Gl Code"
          id="spr_gl_code"
          value={formik.values.spr_gl_code}
          error={formik.errors.spr_gl_code}
          onChange={formik.handleChange}
        />
        <InputBox
          label="Gl Account"
          id="gl_account"
          value={formik.values.gl_account}
          error={formik.errors.gl_account}
          onChange={formik.handleChange}
        />
      </Stack>
      <Stack direction="row" spacing={2}>
        <InputBox
          label="Modified By"
          id="modified_by"
          value={formik.values.modified_by}
          error={formik.errors.modified_by}
          onChange={formik.handleChange}
        />
        <AppDatePicker
          id="modified_date"
          label="Est. Cargo Ex-Factory"
          value={formik.values.modified_date}
          onChange={(value) => formik.setFieldValue("modified_date", value)}
          disabled={true}
          sx={{ marginTop: "16px", marginButtom: "8px" }}
        />
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        {/* Left-side Audit button */}
        {modal.type === "edit" && (
          <ThemeButton
            onClick={handleAuditModal}
            sx={{ fontWeight: "500" }}
            size="small"
          >
            Audit
          </ThemeButton>
        )}

        {/* Right-side buttons (Cancel and Save/Update) */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <OutlinedButton
            sx={{ fontWeight: "500" }}
            onClick={handleCloseModal}
            size="small"
          >
            Cancel
          </OutlinedButton>
          <ThemeButton
            onClick={formik.handleSubmit}
            sx={{ fontWeight: "500" }}
            size="small"
          >
            {isAECLoading ||
              (isUECLoading && <CircularProgress size={20} color="white" />)}
            {modal.type === "edit" ? "Update" : "Save"}
          </ThemeButton>
        </Stack>
      </Stack>

      {drawerOpen && (
        <ReusableRightDrawer
          open={drawerOpen}
          data={modal?.data?.serial_id}
          table={"EXPANSE_CODE"}
          column={COMMON}
          onClose={() => setDrawerOpen(false)}
          isFrontmost={true} // For the Audit Drawer
          // sx={{ zIndex: 2, position: "absolute" }}
        />
      )}
    </Stack>
  );
}
