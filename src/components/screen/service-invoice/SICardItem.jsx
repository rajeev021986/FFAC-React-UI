import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { ReceiptOutlined, ExpandMore } from "@mui/icons-material";
import CardField from "../../common/Cards/CardField";
import SIInvoiceForm from "./SIInvoiceForm";
import SICardFields from "./SICardFields";
import { useFormik } from "formik";
import moment from "moment";
import { SIActions } from "./action";
import { useSaveServiceInvoiceMutation } from "../../../store/api/serviceInvoiceApi";
import { DATE_FORMAT } from "../../utils/date";
import { TRM_STATUS } from "../../../data/enums";

const TRM_STATUS_COLOR = {
  Verified: "success",
  "Not Verified": "error",
  "Sent to SPR": "warning",
};

export default function SICardItem({ item, columns, uniqueId, icon }) {
  const [expanded, setExpanded] = useState(false);
  const [saveServiceInvoice, { isLoading: isSaveLoading }] =
    useSaveServiceInvoiceMutation();

  const handleExpandClick = (event) => {
    event.stopPropagation(); // Prevent click event propagation to AccordionSummary
    setExpanded(!expanded);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      serial_id: item?.serial_id,
      invoice_date: moment(item?.invoice_date).format(DATE_FORMAT),
      mbl_no: item?.bl_no,
      bl_no: item?.bl_no,
      discharge_point: item?.discharge_point,
      fob_point: item?.fob_point,
      numbr1: item?.numbr1,
      numbr2: item?.numbr2,
      numbr3: item?.numbr3,
      numbr4: item?.numbr4,
      ship_date: moment(item?.ship_date).format(DATE_FORMAT),
      batch_run_date: moment(item?.batch_run_date).format(DATE_FORMAT),
      xml_file_generated_date: item?.xml_file_generated_date
        ? moment(item?.xml_file_generated_date).format(DATE_FORMAT)
        : "",
      serviceInvoiceDetails: [],
      trm_status: item?.trm_status,
    },
    onSubmit: (values) => {
      SIActions.save(values, saveServiceInvoice);
    },
  });

  return (
    <Accordion defaultExpanded={false} expanded={expanded}>
      <AccordionSummary
        // expandIcon={<ExpandMore />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Box sx={styles.summary_root}>
          <Avatar sx={{ backgroundColor: "primary.light" }}>
            <ReceiptOutlined color="primary" />
          </Avatar>
        </Box>
        <Grid container spacing={3} alignItems={"center"}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <CardField title="Invoice No" subtitle={item.invoice_no} />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <SICardFields
              title="Invoice Date"
              id="invoice_date"
              value={formik.values.invoice_date}
              onChange={(value) => formik.setFieldValue("invoice_date", value)}
              type={
                item.trm_status === TRM_STATUS.NotVerified ? "date" : "text"
              }
              onMouseDown={(event) => event.stopPropagation()}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <CardField title="Due Date" subtitle={item.terms_net_due_date} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <CardField
              title="TRM Status"
              subtitle={
                <Chip
                  label={item.trm_status}
                  color={TRM_STATUS_COLOR[item.trm_status]}
                  variant="outlined"
                />
              }
            />
          </Grid>
        </Grid>
        <Box>
          <IconButton
            onClick={handleExpandClick} // Only expand/collapse on clicking this button
          >
            <ExpandMore />
          </IconButton>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Divider />
        <SIInvoiceForm
          item={item}
          formik={formik}
          isSaveLoading={isSaveLoading}
        />
      </AccordionDetails>
    </Accordion>
  );
}

const styles = {
  summary_root: {
    py: "5px",
    paddingRight: "20px",
    paddingLeft: "10px",
  },
  icon: {
    backgroundColor: "primary.light",
    borderRadius: "10px",
  },
};
