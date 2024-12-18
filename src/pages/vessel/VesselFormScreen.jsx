import { Box, Card, CardContent } from "@mui/material";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import { VesselForm } from "./VesselForm";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useFetchEditVesselQuery } from "../../store/api/vesselDataApi";
import ApiManager from "../../services/ApiManager";

export function VesselFormScreen() {
  const { state } = useLocation();
  console.log(state.formAction, "state");

  const [loading, setLoading] = useState(true);
  const [vesselEditData, setVesselEditData] = useState({});
  const [initialValues, setInitialValues] = React.useState({
    id: "",
    status: "ACTIVE",
    vesselMaster: "",
    mode: "",
    vesselName: "",
    lineName: "",
    vesselOwner: "",
    vesselLineEntities: [],
  });

  useEffect(() => {
    const fetchVesselDetails = async () => {
      try {
        const response = await ApiManager.fetchEditVessel(
          state?.initialValues?.id
        );
        setVesselEditData(response?.body);
        setInitialValues({
          id: response?.body?.id || "",
          status: response?.body?.status || "",
          vesselMaster: response?.body?.vesselMaster || "",
          mode: response?.body?.mode || "",
          vesselName: response?.body?.vesselName || "",
          lineName: response?.body?.lineName || "",
          vesselOwner: response?.body?.vesselOwner || "",
          vesselLineEntities: response?.body?.vesselLineEntities || [],
        });
        setLoading(false);
        console.log(response, "response");
      } catch (error) {
        console.error(error, "error");
      }
    };
    if (state?.initialValues?.id) {
      fetchVesselDetails();
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
          <VesselForm initialValues={initialValues} type={state?.formAction} />
        </CardContent>
      </Card>
    </Box>
  );
}
