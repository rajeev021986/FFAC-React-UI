import { Box, Grid, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InputBox from "../../../components/common/InputBox";
import { ThemeButton } from "../../../components/common/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomToast from "../../../components/common/Toast/CustomToast";

import { useUpdateJobEntryMutation } from "../../../store/api/jobEntryApi";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SelectBox from "../../../components/common/SelectBox";
import {
  useAddVatAndHoldingTaxMutation,
  useVatAndHoldingTaxMutation,
} from "../../../store/api/settingAuditAPI";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
};

const AddEditFormModal = ({ modal, toggleModal, closeModal }) => {
  const navigate = useNavigate();

  const [addVatAndHoldingTax, { isLoading }] = useAddVatAndHoldingTaxMutation();
  const [vatAndHoldingTax, { loadingUpdate }] = useVatAndHoldingTaxMutation();

  const isEditMode = modal?.type === "edit";
  const initialValues = {
    id: modal?.data?.id || "",
    value: modal?.data?.value || "",
    setting_type: modal?.data?.type || "",
  };

  const SettingType = [
    { label: "VAT", value: "VAT" },
    { label: "Holding Tax", value: "HOLDING_TAX" },
  ];

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      value: Yup.string().required("VAT is required"),
    }),
    onSubmit: async (values) => {
      const payload = { ...values };
      if (!isEditMode) {
        try {
          const response = await addVatAndHoldingTax(payload).unwrap();
          toast.custom(
            <CustomToast
              message={response.message}
              toast={response.code === "SUCCESS" ? "warn" : "error"}
            />,
            { closeButton: false, duration: 2000 }
          );
          formik.resetForm();
          closeModal();
        } catch (error) {
          const message =
            error?.data?.message ||
            "An error occurred while submitting the form.";
          toast.custom(<CustomToast message={message} toast="error" />, {
            closeButton: false,
            duration: 2000,
          });
        }
      } else {
        try {
          const response = await vatAndHoldingTax(payload).unwrap();
          toast.custom(
            <CustomToast
              message={response.message}
              toast={response.code === "SUCCESS" ? "success" : "warn"}
            />,
            { closeButton: false }
          );
          if (response.code === "SUCCESS") {
            closeModal();
          }
        } catch (error) {
          const message =
            error?.data?.message ||
            "An error occurred while updating the form.";
          toast.custom(<CustomToast message={message} toast="error" />, {
            closeButton: false,
          });
        }
      }
    },
  });

  return (
    <Modal
      keepMounted
      open={modal?.open}
      onClose={toggleModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={{ ...modalStyle, position: "relative" }}>
        <IconButton
          onClick={closeModal}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "grey.600",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
          {isEditMode ? "Edit Settings" : "Add Settings"}
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <SelectBox
                label="Setting Type"
                id="setting_type"
                options={SettingType}
                value={formik.values.setting_type}
                error={formik.errors.setting_type}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <InputBox
                label={`${
                  formik?.values?.setting_type === "VAT"
                    ? "VAT"
                    : "With Holding Tax"
                }`}
                id="value"
                name="value"
                value={formik.values.value}
                onChange={formik.handleChange}
                error={formik.touched.value && formik.errors.value}
                helperText={formik.touched.value && formik.errors.value}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <ThemeButton
                type="submit"
                sx={{
                  fontWeight: "500",
                  borderRadius: "12px",
                  color: "white !important",
                }}
                disabled={isLoading || loadingUpdate}
              >
                {isEditMode ? "Update" : "Submit"}
              </ThemeButton>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default AddEditFormModal;
