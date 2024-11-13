import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import CalculationTable from "./CalculationTable";
import { SERVICE_INVOICE_DETAILS_COLUMNS } from "../../../data/columns/service-invoice";
import SICardFields from "./SICardFields";
import { useFormik } from "formik";
import moment from "moment";
import { OutlinedButton } from "../../common/Button";
import { SIActions } from "./action";
import {
  useSaveServiceInvoiceMutation,
  useVerifyStatusMutation,
} from "../../../store/api/serviceInvoiceApi";
import PopupAlert from "../../common/Alert/PopupAlert";
import ThemedModal from "../../common/ThemedModal";
import * as Yup from "yup";
import NotVerifyForm from "./NotVerifyForm";
import ReusableRightDrawer from "../../common/CommonDrawer";
import { SERVICE_INVOICE } from "../../../data/columns/audit";
import { useFormat } from "../../../hooks/useFormat";

export default function SIInvoiceForm({ item, formik, isSaveLoading }) {
  const [verifyStatus, { isLoading: isVerifyLoading }] =
    useVerifyStatusMutation();
  const [editable, setEditable] = React.useState(false);
  const [openRejectModal, setOpenRejectModal] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { displayFormat } = useFormat()
  const [alertConfig, setAlertConfig] = React.useState({
    open: false,
    title: "",
    message: "",
    severity: "info",
    onConfirm: null,
    onClose: () => setAlertConfig({ ...alertConfig, open: false }),
  });

  const modalFormik = useFormik({
    initialValues: { reason: "" },
    validationSchema: Yup.object().shape({
      reason: Yup.string().required("Please enter the reason"),
    }),
    onSubmit: (values) => {
      SIActions.submitVerify(item, verifyStatus, "NO", values.reason);
      setOpenRejectModal(false);
    },
  });

  useEffect(() => {
    SIActions.isEditable(item.trm_status, setEditable);
  }, [item]);

  const handleRejectInvoice = () => {
    setOpenRejectModal(true);
  };
  const handleAuditModal = () => {
    setDrawerOpen({ open: false, type: "", data: {} });
  };

  return (
    <Stack width="100%" direction="row" pt={2}>
      <Stack width={"60%"}>
        <CalculationTable
          columns={SERVICE_INVOICE_DETAILS_COLUMNS}
          rows={item?.serviceInvoiceDetails}
          formik={formik}
          editable={editable}
        />
      </Stack>
      <Stack
        width={"40%"}
        direction={"column"}
        justifyContent={"space-between"}
        spacing={4}
      >
        <Grid container spacing={2} width={"100%"}>
          <Grid item xs={6}>
            <SICardFields
              title="MBL"
              id="mbl_no"
              value={formik.values.bl_no}
              onChange={formik.handleChange}
              type="text"
            />
          </Grid>
          <Grid item xs={6}>
            <SICardFields
              title="HBL"
              value={""}
              onChange={formik.handleChange}
              type="text"
            />
          </Grid>
          <Grid item xs={6}>
            <SICardFields
              title="FOB Point"
              value={formik.values.fob_point}
              onChange={formik.handleChange}
              type="text"
            />
          </Grid>
          <Grid item xs={6}>
            <SICardFields
              title="Discharge Point"
              value={formik.values.discharge_point}
              onChange={formik.handleChange}
              type="text"
            />
          </Grid>
          <Grid item xs={6}>
            <SICardFields
              title="Volume"
              id="numbr1"
              value={formik.values.numbr1}
              onChange={formik.handleChange}
              type={!editable ? "text" : null}
            />
          </Grid>
          <Grid item xs={6}>
            <SICardFields
              title="Pieces"
              id="numbr2"
              value={displayFormat('pieces',formik.values.numbr2)}
              onChange={formik.handleChange}
              type={!editable ? "text" : null}
            />
          </Grid>
          <Grid item xs={6}>
            <SICardFields
              title="Gross Wt"
              id="numbr3"
              value={displayFormat('gross_wt',formik.values.numbr3)}
              onChange={formik.handleChange}
              type={!editable ? "text" : null}
            />
          </Grid>
          <Grid item xs={6}>
            <SICardFields
              title="Chargeable Wt"
              id="numbr4"
              value={displayFormat('chargeable_wt',formik.values.numbr4)}
              onChange={formik.handleChange}
              type={!editable ? "text" : null}
            />
          </Grid>
          <Grid item xs={6}>
            <SICardFields
              title="Ship Date"
              value={formik.values.ship_date}
              onChange={formik.handleChange}
              type="text"
            />
          </Grid>
          <Grid item xs={6}>
            <SICardFields
              title="TRM Received Date"
              id="batch_run_date"
              value={formik.values.batch_run_date}
              onChange={(value) =>
                formik.setFieldValue("batch_run_date", value)
              }
              type={!editable ? "text" : "date"}
            />
          </Grid>
          <Grid item xs={6}>
            <SICardFields
              title="SPR Sent Date"
              value={formik.values.xml_file_generated_date}
              onChange={formik.handleChange}
              type="text"
            />
          </Grid>
        </Grid>

        <Stack spacing={2} width={"100%"}>
          <Stack
            spacing={2}
            direction={"row"}
            justifyContent={"end"}
            sx={styles.footer}
          >
            <OutlinedButton
              size="small"
              color="primary"
              onClick={handleAuditModal}
            >
              Audit
            </OutlinedButton>
            <OutlinedButton
              size="small"
              color="primary"
              onClick={formik.handleSubmit}
            >
              {isSaveLoading && <CircularProgress size={20} />} Save
            </OutlinedButton>
            <OutlinedButton
              size="small"
              color="secondary"
              onClick={() => {
                SIActions.viewPdf(item);
              }}
            >
              View PDF
            </OutlinedButton>
            <OutlinedButton
              size="small"
              color="success"
              onClick={() => {
                SIActions.handleVerify(
                  item,
                  verifyStatus,
                  "YES",
                  alertConfig,
                  setAlertConfig
                );
              }}
            >
              {isVerifyLoading && !modalFormik.values.reason && (
                <CircularProgress size={20} color="success" />
              )}{" "}
              Verified
            </OutlinedButton>
            <OutlinedButton
              size="small"
              color="error"
              onClick={handleRejectInvoice}
            >
              {isVerifyLoading && modalFormik.values.reason && (
                <CircularProgress size={20} color="error" />
              )}{" "}
              Not Verified
            </OutlinedButton>
          </Stack>
          <Stack direction={"column"} pl={2}>
            {item?.note_text !== "" && (
              <Alert severity="info" sx={styles.alert}>
                <AlertTitle>Notes:</AlertTitle>
                {item?.note_text}
              </Alert>
            )}
          </Stack>
          {/* **** Modal & Alerts **** */}
          <PopupAlert alertConfig={alertConfig} />
        </Stack>
      </Stack>
      <ThemedModal
        open={openRejectModal}
        setOpen={setOpenRejectModal}
        modalTitle="Confirm Rejection"
        width="50%"
      >
        <NotVerifyForm modalFormik={modalFormik} />
      </ThemedModal>
      {drawerOpen && (
        <ReusableRightDrawer
          open={drawerOpen}
          data={item?.serial_id}
          table={"SERVICE_INVOICE"}
          column={SERVICE_INVOICE}
          onClose={() => setDrawerOpen(false)}
          isFrontmost={true}
        />
      )}
    </Stack>
  );
}

const styles = {
  footer: {},
  alert: {
    wrap: "wrap",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    overflow: "hidden",
  },
};
