import React, { useState } from "react";
import { useFormik } from "formik";
import ApiManager from "../../services/ApiManager";

//  MUI Components
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

//  Custom Components
import InputBox from "../../components/common/InputBox";
import { ThemeButton } from "../../components/common/Button";
import toast from "react-hot-toast";
import CustomToast from "../../components/common/Toast/CustomToast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
};

export default function AddRejectedRemarks({
  handleOpen,
  handleClose,
  rowId,
  type,
  label,
  refetch,
}) {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      id: 0,
      remarks: "",
    },
    enableReinitialize: true,
    validate: (values) => {
      const errors = {};
      if (!values.remarks?.trim()) {
        errors.remarks = "Remarks are required";
      }
      return errors;
    },
    onSubmit: async (values) => {
      setLoading(true);
      if (type === "accounts_payable") {
        try {
          const res = await ApiManager.rejectAccountsPayableId(
            rowId,
            "PAYBLE_ENTRY",
            values.remarks
          );
          if (res.success) {
            toast.custom(<CustomToast message={res.message} toast="success" />);
            handleClose();
            refetch();
          } else {
            console.error("Failed to reject:", res);
            toast.custom(
              <CustomToast
                message={res.message || "Failed to reject"}
                toast="error"
              />
            );
          }
        } catch (error) {
          toast.custom(
            <CustomToast message={"Something went wrong!"} toast="error" />
          );
        } finally {
          setLoading(false);
        }
      } else {
        try {
          const res = await ApiManager.rejectjobEntryApprove(
            rowId,
            type,
            values.remarks
          );
          if (res.success) {
            toast.custom(<CustomToast message={res.message} toast="success" />);
            handleClose();
          } else {
            console.error("Failed to reject:", res);
            toast.custom(
              <CustomToast
                message={res.message || "Failed to reject"}
                toast="error"
              />
            );
          }
        } catch (error) {
          toast.custom(
            <CustomToast message={"Something went wrong!"} toast="error" />
          );
        } finally {
          setLoading(false);
        }
      }
    },
  });

  return (
    <Modal keepMounted open={handleOpen} onClose={handleClose}>
      <Box sx={{ ...style, position: "relative" }}>
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8, color: "grey.600" }}
        >
          <CloseIcon />
        </IconButton>

        <Grid container spacing={2} mt={2}>
          <Grid item xs={12}>
            <InputBox
              fullWidth
              label={label || "Remarks"}
              id="remarks"
              name="remarks"
              value={formik.values.remarks}
              error={formik.touched.remarks && formik.errors.remarks}
              helperText={formik.touched.remarks && formik.errors.remarks}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <ThemeButton
              onClick={formik.handleSubmit}
              disabled={loading || !formik.values.remarks.trim()}
              sx={{
                backgroundColor: "red",
                color: "white !important",
                fontWeight: "500",
                borderRadius: "12px",
                minWidth: "120px",
              }}
            >
              {loading ? "Rejecting..." : "Rejected"}
            </ThemeButton>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
