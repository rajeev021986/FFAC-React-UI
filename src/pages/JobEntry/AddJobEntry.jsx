import { Box, Card, CardContent, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import ApiManager from "../../services/ApiManager";

// Components
import JobEntryForm from "./JobEntryForm";
import Loader from "../../components/common/Loader/Loader";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import CustomToast from "../../components/common/Toast/CustomToast";

export default function AddJobEntry({ page }) {
  const [loading, setLoading] = useState(true);
  const { state } = useLocation();
  const getUserId = localStorage.getItem("userId");
  const [initialValues, setInitialValues] = React.useState({
    rejectRemarks: "",
    shipmentType: "",
    moveType: "",
    customerId: "",
    customerName:"",
    hblNo: "",
    mblNo: null,
    customerRefNo: "",
    invoiceNo: "",
    dateOfReceipt: "",
    tansadNo: "",
    cargoType: "",
    typeOfCargo: "",
    entryTansadDate: "",
    entryNo: "",
    refNo: "",
    fileManager: getUserId,
    status: "",
    statusCode: "",

    // Shipper Details Key Start
    supplierId: "",
    supplierName:"",
    supplierAddress: "",
    consigneeId: "",
    consigneeName:"",
    consigneeAddress: "",
    notifyPartyName: "",
    notifyAddress: "",
    shipperStatus: "",

    // Line Vessel Details Key Start
    shippingLine: "",
    shippingLineId:"",
    eta: "",
    arrivalDate: "",
    voyage: "",
    berthingDate: "",
    loadingVessel: "",
    loadingVoyage: "",
    dischargeVoyage: "",
    dischargingVessel: "",
    vesselAgentId: "",
    vesselAgentName:"",
    type: "",
    vesselBerthedAt: "",
    icdName: "",
    icdTransferDate: "",

    // Shipment Details Key Start
    originPortId: "",
    originPortName:"",
    portOfLoading: "",
    portOfDischargeId: "",
    portOfDischargeName:"",
    placeOfDeliveryId: "",
    placeOfDeliveryName:"",
    icdDestination: "",
    totalNoOfPackages: "",
    totalGrWt: "",
    cbm: "",
    marks: "",
    description: "",
    poNo: "",
    currency: "",
    fobValue: "",
    preAssessmentDate: "",
    finalAssessmentDate: "",
    routeCode: "",
    loadingDateForAirShipment: "",

    containerShipments: [],
    vehicleShipments: [],
    looseCargoShipments: [],
    notes: [],
    rate: {
      totalAmount: 0,
      remarks: "",
      rateDetails: [],
    },
  });

  useEffect(() => {
    const fetchJobEntryDetails = async () => {
      try {
        const res = await ApiManager.getJobEntryDetails(
          state?.initialValues?.id
        );
        let status = "";
        if (res.body?.status) {
          status =
            res.body?.status.charAt(0).toUpperCase() +
            res.body?.status.slice(1).toLowerCase();
        }
        setInitialValues({
          ...initialValues,
          rateId: res.body?.rateId || "",
          status: res.body?.status || "",
          id: res.body?.id || "",
          statusCode: res.body?.statusCode,
          customerId: res.body?.customerId || "",
          customerName: res.body?.customerName || "",

          shipmentType: res.body?.shipmentType || "",
          moveType: res.body?.moveType || "",
          mblNo: res.body?.mblNo || null,
          dateOfReceipt: res.body?.dateOfReceipt || "",
          hblNo: res.body?.hblNo || "",
          cargoType: res.body?.cargoType || "",
          customerRefNo: res.body?.customerRefNo || "",
          typeOfCargo: res.body?.typeOfCargo || "",
          invoiceNo: res.body?.invoiceNo || "",
          tansadNo: res.body?.tansadNo || "",
          entryTansadDate: res.body?.entryTansadDate || "",
          entryNo: res.body?.entryNo || "",
          refNo: res.body?.jobNo || "",
          fileManager: res.body?.fileManager || getUserId,
          createdBy: res.body?.createdBy || "",
          supplierId: res.body?.supplierId || "",
          supplierName:res?.body?.supplierName|| "",
          supplierAddress: res.body?.supplierAddress || "",
          consigneeId: res.body?.consigneeId || "",
          consigneeName:res?.body?.consigneeName|| res?.body?.consignee,
          consigneeAddress: res.body?.consigneeAddress || "",
          notifyPartyName: res.body?.notifyPartyName || "",
          notifyAddress: res.body?.notifyAddress || "",
          shipperStatus: res.body?.shipperStatus || "",
          rejectRemarks: res.body?.rejectRemarks || "",
          shippingLine: res.body?.shippingLine || "",
          shippingLineId:res?.body?.shippingLineId || "",
          eta: res.body?.eta || "",
          arrivalDate: res.body?.arrivalDate || "",
          berthingDate: res.body?.berthingDate || "",
          loadingVessel: res.body?.loadingVessel || "",
          loadingVoyage: res.body?.loadingVoyage || "",
          voyage: res.body?.voyage || "",
          dischargingVessel: res.body?.dischargingVessel || "",
          dischargeVoyage: res.body?.dischargeVoyage || "",
          vesselAgent: res.body?.vesselAgent || "",
          vesselAgentName: res.body?.vesselAgentName || "",
          vesselAgentId: res.body?.vesselAgentId || "",
          type: res.body?.type || "",
          vesselBerthedAt: res.body?.vesselBerthedAt || "",
          icdName: res.body?.icdName || "",
          icdTransferDate: res.body?.icdTransferDate || "",
          originPortId: res.body?.originPortId || "",
          originPortName:res?.body?.originPortName || res?.body?.originCountry,
          portOfLoading: res.body?.portOfLoading || "",
          placeOfDeliveryId: res.body?.placeOfDeliveryId || "",
          placeOfDeliveryName:res?.body?.placeOfDelivery || "",
          portOfDischargeId: res.body?.portOfDischargeId || "",
          portOfDischargeName:res?.body?.portOfDischarge || "",
          icdDestination: res.body?.icdDestination || "",
          totalNoOfPackages: res.body?.totalNoOfPackages || "",
          totalGrWt: res.body?.totalGrWt || "",
          cbm: res.body?.cbm || "",
          marks: res.body?.marks || "",
          description: res.body?.description || "",
          poNo: res.body?.poNo || "",
          currency: res.body?.currency || "",
          fobValue: res.body?.fobValue || "",
          preAssessmentDate: res.body?.preAssessmentDate || "",
          finalAssessmentDate: res.body?.finalAssessmentDate || "",
          routeCode: res.body?.routeCode || "",
          loadingDateForAirShipment: res.body?.loadingDateForAirShipment || "",
          containerShipments: res.body?.containerShipments || [],
          vehicleShipments: res.body?.vehicleShipments || [],
          looseCargoShipments: res.body?.looseCargoShipments || [],
          notes: res.body?.notes || [],
          rate: res.body?.rate
            ? {
                id: res.body?.rate.id || 0,
                totalAmount: res.body?.rate.totalAmount || 0,
                remarks: res.body?.rate.remarks || "",
                rateDetails: res.body?.rate.rateDetails || [],
              }
            : { totalAmount: 0, remarks: "", rateDetails: [] },
        });
        setLoading(false);
      } catch (error) {
        toast.custom(
          <CustomToast
            message="Error occurred while loading form"
            toast="error"
          />,
          {
            closeButton: false,
          }
        );
      }
    };
    if (state?.initialValues?.id) {
      fetchJobEntryDetails();
    } else {
      setLoading(false);
    }
  }, [state?.initialValues?.id]);

  return (
    <Box sx={{ padding: 0, margin: 0 }}>
      <Stack>
        <ScreenToolbar
          leftComps={
            <div>
              <ThemedBreadcrumb />
            </div>
          }
          rightComps={<div></div>}
        />
      </Stack>

      {loading ? (
        <Loader />
      ) : (
        <Card
          sx={{ borderWidth: 1, borderColor: "border.main", padding: "0px" }}
        >
          <CardContent
            sx={{
              margin: "0px",
              padding: "0px ! important",
            }}
          >
            <JobEntryForm
              initialValues={initialValues}
              type={state?.formAction}
              page={page}
              getUserId={getUserId}
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
