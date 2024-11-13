import { CircularProgress, Divider, Grid, Stack } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import InputBox from "../../common/InputBox";
import AppTable from "../../common/Table";
import { PACKING_LIST_LINE_ITEMS_COLUMNS } from "../../../data/columns/packing-list";
import { OutlinedButton, ThemeButton } from "../../common/Button";
import AppDatePicker from "../../common/AppDatePicker";
import ThemedModal from "../../common/ThemedModal";
import AddVesselForm from "./AddVesselForm";
import AppAutocomplete from "../../common/AppAutocomplete";
import ApiManager from "../../../services/ApiManager";
import PopupAlert from "../../common/Alert/PopupAlert";
import { useEditPLDetailsMutation } from "../../../store/api/packingListDataApi";
import toast from "react-hot-toast";
import ReusableRightDrawer from "../../common/CommonDrawer";
import { PACKING_LIST } from "../../../data/columns/audit";
import * as yup from "yup";
import { useFormat } from "../../../hooks/useFormat";

export default function PLForm({
  initialValues,
  tableData,
  loading,
  openVesselModal,
  setOpenVesselModal,
}) {
  const [options, setOptions] = useState([]);
  const [editPLDetails, { isLoading, isError, isSuccess, data, error }] =
    useEditPLDetailsMutation();
  const {displayFormat} = useFormat()
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    title: "",
    message: "",
    severity: "info",
    onConfirm: null,
    onClose: () => setAlertConfig({ ...alertConfig, open: false }),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: yup.object().shape({
      vessel: yup.string().required("Vessel is required"),
    }),
    onSubmit: async (values) => {
      if (values.pl_status === "SUBMIT" || values.pl_status === "BOOKED") {
        try {
          console.log("values", values);
          const response = await editPLDetails(values).unwrap();
          if (response.status === "success") {
            toast.success(response.message);
          }
        } catch (error) {
          toast.error(error.data?.message || "Something went wrong!");
        }
      } else {
        setAlertConfig({
          open: true,
          title: "Error",
          message: "You can update data only for PL Status : SUBMIT OR BOOKED",
          severity: "warning",
          onConfirm: () => {
            console.log("Confirmed!");
            setAlertConfig({ ...alertConfig, open: false });
          },
          onClose: () => setAlertConfig({ ...alertConfig, open: false }),
        });
      }
    },
  });

  const handleVesselOptionChange = async (query) => {
    console.log(query);
    ApiManager.getVesselOptions(query)
      .then((response) => {
        setOptions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleAuditModal = () => {
    setDrawerOpen({ open: false, type: "", data: {} });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Vendor"
          id="shipper_vendor"
          value={formik.values.shipper_vendor}
          error={formik.errors.shipper_vendor}
          disabled={true}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Vendor PL No"
          id="vendor_plno"
          value={formik.values.vendor_plno}
          error={formik.errors.vendor_plno}
          disabled={true}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Freight Forwarder"
          id="freight_forwarder"
          value={formik.values.freight_forwarder}
          error={formik.errors.freight_forwarder}
          disabled={true}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="FF Reference No"
          id="ff_reference_no"
          value={formik.values.ff_reference_no}
          error={formik.errors.ff_reference_no}
          disabled={true}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="FOB Port"
          id="fob_port"
          value={formik.values.fob_port}
          error={formik.errors.fob_port}
          disabled={true}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="PL Status"
          id="pl_status"
          value={formik.values.pl_status}
          error={formik.errors.pl_status}
          disabled={true}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Vendor Address"
          id="shipper_address"
          value={formik.values.shipper_address}
          error={formik.errors.shipper_address}
          disabled={true}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Destination/Ship To"
          id="destination_ship_to"
          value={formik.values.destination_ship_to}
          error={formik.errors.destination_ship_to}
          disabled={true}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <AppDatePicker
          id="est_cargo_ex_factory"
          label="Est. Cargo Ex-Factory"
          value={formik.values.est_cargo_ex_factory}
          onChange={(value) =>
            formik.setFieldValue("est_cargo_ex_factory", value)
          }
          disabled={true}
          sx={{ marginTop: "16px", marginButtom: "8px" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Trans Mode"
          id="trans_mode"
          value={formik.values.trans_mode}
          error={formik.errors.trans_mode}
          disabled={true}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Booking No"
          id="booking_no"
          value={formik.values.booking_no}
          error={formik.errors.booking_no}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <AppDatePicker
          id="booking_date"
          label="Booking Date"
          value={formik.values.booking_date}
          onChange={(value) => formik.setFieldValue("booking_date", value)}
          sx={{ marginTop: "16px", marginButtom: "8px" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Vendor Tel"
          id="shipper_telephone"
          value={formik.values.shipper_telephone}
          error={formik.errors.shipper_telephone}
          disabled={true}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <AppDatePicker
          id="submit_date"
          label="Submit Date"
          value={formik.values.submit_date}
          onChange={(value) => formik.setFieldValue("submit_date", value)}
          disabled={true}
          sx={{ marginTop: "16px", marginButtom: "8px" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <AppDatePicker
          label="Finalized Date"
          id="finalized_date"
          value={formik.values.finalized_date}
          onChange={(value) => formik.setFieldValue("finalized_date", value)}
          disabled={true}
          sx={{ marginTop: "16px", marginButtom: "8px" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Container No"
          id="container_no"
          value={formik.values.container_no}
          error={formik.errors.container_no}
          disabled={true}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <AppAutocomplete
          label="Vessel"
          id="vessel"
          value={formik.values.vessel}
          formik={formik}
          options={options}
          error={formik.errors.vessel}
          onChange={(value) => formik.setFieldValue("vessel", value)}
          handleOptionChange={handleVesselOptionChange}
          sx={{ marginTop: "16px", marginButtom: "8px" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Voyage/Flight No"
          id="voyage_flight_no"
          value={formik.values.voyage_flight_no}
          error={formik.errors.voyage_flight_no}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Vendor Fax"
          id="shipper_fax"
          value={formik.values.shipper_fax}
          error={formik.errors.shipper_fax}
          disabled={true}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Consignee/Buyer"
          id="consignee_buyer"
          value={formik.values.consignee_buyer}
          error={formik.errors.consignee_buyer}
          disabled={true}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="LCL"
          id="lcl"
          value={formik.values.lcl}
          error={formik.errors.lcl}
          disabled={true}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Total Gross Wgt"
          id="product_total_gross_wgt"
          value={formik.values.product_total_gross_wgt}
          error={formik.errors.product_total_gross_wgt}
          disabled={true}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Total Cubic Meters"
          id="product_total_cubic_meters"
          value={formik.values.product_total_cubic_meters}
          error={formik.errors.product_total_cubic_meters}
          disabled={true}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Total Master Cartons"
          id="total_master_cartons"
          value={formik.values.total_master_cartons}
          error={formik.errors.total_master_cartons}
          disabled={true}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Palletized"
          id="palletized"
          value={formik.values.palletized}
          error={formik.errors.palletized}
          disabled={true}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Pallet Weight"
          id="pallet_weight"
          value={formik.values.pallet_weight}
          error={formik.errors.pallet_weight}
          disabled={true}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Pallet CBM"
          id="pallet_cbm"
          value={formik.values.pallet_cbm}
          error={formik.errors.pallet_cbm}
          disabled={true}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="T360 Total Gross Weight"
          id="t360_weights"
          value={formik.values.t360_weights}
          error={formik.errors.t360_weights}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="T360 Total CBM"
          id="t360_cbm"
          value={formik.values.t360_cbm}
          error={formik.errors.t360_cbm}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="T360 Total Master Cartons"
          id="t360_pieces"
          value={formik.values.t360_pieces}
          error={formik.errors.t360_pieces}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Move Type"
          id="move_type"
          value={formik.values.move_type}
          error={formik.errors.move_type}
          disabled={true}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Equpment Type"
          id="equpment_type"
          value={formik.values.equpment_type}
          error={formik.errors.equpment_type}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <AppDatePicker
          id="si_cutoff"
          label="SI Cutoff"
          value={formik.values.si_cutoff}
          onChange={(value) => formik.setFieldValue("si_cutoff", value)}
          sx={{ marginTop: "16px", marginButtom: "8px" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <AppDatePicker
          id="cy_cutoff"
          label="CY Cutoff"
          value={formik.values.cy_cutoff}
          onChange={(value) => formik.setFieldValue("cy_cutoff", value)}
          sx={{ marginTop: "16px", marginButtom: "8px" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <AppDatePicker
          id="etd"
          label="ETD"
          value={formik.values.etd}
          onChange={(value) => formik.setFieldValue("etd", value)}
          sx={{ marginTop: "16px", marginButtom: "8px" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <AppDatePicker
          id="eta"
          label="ETA"
          value={formik.values.eta}
          onChange={(value) => formik.setFieldValue("eta", value)}
          sx={{ marginTop: "16px", marginButtom: "8px" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <AppDatePicker
          id="batch_run_date"
          label="PL Created Date"
          value={formik.values.batch_run_date}
          onChange={(value) => formik.setFieldValue("batch_run_date", value)}
          disabled={true}
          sx={{ marginTop: "16px", marginButtom: "8px" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <AppDatePicker
          id="booked_batch_run_date"
          label="PL Booked Date"
          value={formik.values.booked_batch_run_date}
          onChange={(value) =>
            formik.setFieldValue("booked_batch_run_date", value)
          }
          disabled={true}
          sx={{ marginTop: "16px", marginButtom: "8px" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <AppDatePicker
          id="final_batch_run_date"
          label="PL Final Date"
          value={formik.values.final_batch_run_date}
          onChange={(value) =>
            formik.setFieldValue("final_batch_run_date", value)
          }
          disabled={true}
          sx={{ marginTop: "16px", marginButtom: "8px" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <AppDatePicker
          id="bl_batch_run_date"
          label="BL Sent Date"
          value={formik.values.bl_batch_run_date}
          onChange={(value) => formik.setFieldValue("bl_batch_run_date", value)}
          disabled={true}
          sx={{ marginTop: "16px", marginButtom: "8px" }}
        />
      </Grid>
      <Grid item xs={12}>
        {/* gap */}
      </Grid>
      <Grid item xs={12}>
        <AppTable
          uniqueId="serial_id"
          data={tableData || []}
          columns={PACKING_LIST_LINE_ITEMS_COLUMNS(displayFormat)}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12}>
        <InputBox
          label="Additional Comments"
          id="comments"
          value={formik.values.comments}
          error={formik.errors.comments}
          onChange={formik.handleChange}
          disabled={true}
          fullWidth
          multiline
          rows={4}
        />
      </Grid>
      {/* <Grid item xs={12} >
                <Stack direction="row" spacing={2} justifyContent={"flex-end"}>
                    <OutlinedButton sx={{ fontWeight: '500' }} >Cancel</OutlinedButton>
                    <ThemeButton onClick={formik.handleSubmit} sx={{ fontWeight: '500' }}  >
                    {isLoading && <CircularProgress size={20} color="white" />} Save</ThemeButton>
                </Stack>
            </Grid> */}
      <Grid item xs={12}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          {/* Audit button on the left */}
          <ThemeButton onClick={handleAuditModal} sx={{ fontWeight: "500" }}>
            {isLoading && <CircularProgress size={20} color="white" />} Audit
          </ThemeButton>

          {/* Cancel and Save buttons on the right */}
          <Stack direction="row" spacing={2}>
            <OutlinedButton sx={{ fontWeight: "500" }}>Cancel</OutlinedButton>
            <ThemeButton
              onClick={formik.handleSubmit}
              sx={{ fontWeight: "500" }}
            >
              {isLoading && <CircularProgress size={20} color="white" />} Save
            </ThemeButton>
          </Stack>
        </Stack>
      </Grid>

      <ThemedModal
        open={openVesselModal}
        setOpen={setOpenVesselModal}
        modalTitle="Add Vessel"
      >
        <AddVesselForm setOpen={setOpenVesselModal} />
      </ThemedModal>

      <PopupAlert alertConfig={alertConfig} />
      {drawerOpen && (
        <ReusableRightDrawer
          open={drawerOpen}
          data={initialValues?.serial_id}
          table={"PACKING_LIST"}
          column={PACKING_LIST}
          onClose={() => setDrawerOpen(false)}
          sx={{ zIndex: 2, position: "absolute" }} // Higher zIndex for the drawer
        />
      )}
    </Grid>
  );
}
