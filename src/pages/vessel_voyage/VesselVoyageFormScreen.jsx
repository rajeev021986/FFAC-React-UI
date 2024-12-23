import { Box, Card, CardContent } from "@mui/material";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { VesselVoyageForm } from "./VesselVoyageForm";
import ApiManager from "../../services/ApiManager";

export function VesselVoyageFormScreen() {
  const { state } = useLocation();
  console.log(state?.formAction, "state");

  const [loading, setLoading] = useState(true);
  const [voyageEditData, setVoyageEditData] = useState({});

  const [initialValues, setInitialValues] = React.useState({
    id: "",
    status: "",
    vesselVoyage: "",
    mode: "",
    voyageInBound: "",
    voyageOutBound: "",
    eta: "",
    sailingDateEtd: "",
    arrivalDatePilotStation: "",
    documentDeadLine: "",
    berthingDate: "",
    paymentCutOff: "",
    manifestReady_kra: "",
    manifestReady_invoice: "",
    gateStatus: "",
    vesselLast_SlingDate: "",
    portOperator: "",
  });

  useEffect(() => {
    const fetchVoyageDetails = async () => {
      try {
        const response = await ApiManager.fetchEditVoyage(
          state?.initialValues?.id
        );
        setVoyageEditData(response?.body);
        setInitialValues({
          id: response?.body?.id || "",
          status: response?.body?.status || "",
          vesselVoyage: response?.body?.vesselVoyage || "",
          mode: response?.body?.mode || "",
          voyageInBound: response?.body?.voyageInBound || "",
          voyageOutBound: response?.body?.voyageOutBound || "",
          eta: response?.body?.eta || "",
          sailingDateEtd: response?.body?.sailingDateEtd || "",
          arrivalDatePilotStation:
            response?.body?.arrivalDatePilotStation || "",
          documentDeadLine: response?.body?.documentDeadLine || "",
          berthingDate: response?.body?.berthingDate || "",
          paymentCutOff: response?.body?.paymentCutOff || "",
          manifestReady_kra: response?.body?.manifestReady_kra || "",
          manifestReady_invoice: response?.body?.manifestReady_invoice || "",
          gateStatus: response?.body?.gateStatus || "",
          vesselLast_SlingDate: response?.body?.vesselLast_SlingDate || "",
          portOperator: response?.body?.portOperator || "",
        });
        setLoading(false);
        console.log(response, "response");
      } catch (error) {
        console.error(error, "error");
      }
    };
    if (state?.initialValues?.id) {
      fetchVoyageDetails();
    } else {
      setLoading(false);
    }
  }, [state?.initialValues?.id]);

  return (
    <Box>
      <ScreenToolbar
        leftComps={
          <div>
            <ThemedBreadcrumb />
          </div>
        }
        rightComps={<div></div>}
      />
      <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
        <CardContent>
          <VesselVoyageForm
            initialValues={initialValues}
            type={state?.formAction}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
