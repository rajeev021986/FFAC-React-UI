import { Box, Card, CardContent, Stack } from "@mui/material";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { VesselVoyageForm } from "./VesselVoyageForm";
import ApiManager from "../../services/ApiManager";
import Loader from "../../components/common/Loader/Loader";
import toast from "react-hot-toast";
import CustomToast from "../../components/common/Toast/CustomToast";

export function VesselVoyageFormScreen() {
  const { state } = useLocation();

  const [loading, setLoading] = useState(true);

  const [initialValues, setInitialValues] = React.useState({
    id: "",
    status: "",
    vessel: "",
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
        let status = "";
        if (response.body?.status) {
          status =
            response.body?.status.charAt(0).toUpperCase() +
            response.body?.status.slice(1).toLowerCase();
        }
        setInitialValues({
          id: response?.body?.id || "",
          status: status || "",
          vessel: response?.body?.vessel || "",
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
      fetchVoyageDetails();
    } else {
      setLoading(false);
    }
  }, [state?.initialValues?.id]);

  return (
    <Box sx={{ padding: 0, margin: 0 }}>
      <Stack sx={{ padding: "8px 0px" }}>
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
            sx={{ margin: "0px !important", padding: "0px !important" }}
          >
            <VesselVoyageForm
              initialValues={initialValues}
              type={state?.formAction}
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
