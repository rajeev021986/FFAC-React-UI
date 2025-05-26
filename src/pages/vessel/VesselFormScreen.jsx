import { Box, Card, CardContent, Stack } from "@mui/material";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import { VesselForm } from "./VesselForm";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useFetchEditVesselQuery } from "../../store/api/vesselDataApi";
import ApiManager from "../../services/ApiManager";
import Loader from "../../components/common/Loader/Loader";
import CustomToast from "../../components/common/Toast/CustomToast";
import toast from "react-hot-toast";

export function VesselFormScreen() {
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = React.useState({
    id: "",
    status: "ACTIVE",
    statusCode: "",
    vesselMaster: "",
    mode: "",
    vesselName: "",
    lineId: "",
    vesselOwner: "",
    vesselLineEntities: [],
  });

  useEffect(() => {
    const fetchVesselDetails = async () => {
      try {
        const response = await ApiManager.fetchEditVessel(
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
          statusCode: response?.body?.statusCode || "",
          vesselMaster: response?.body?.vesselMaster || "",
          mode: response?.body?.mode || "",
          vesselName: response?.body?.vesselName || "",
          lineId: response?.body?.lineId || "",
          vesselOwner: response?.body?.vesselOwner || "",
          vesselLineEntities: response?.body?.vesselLineEntities || [],
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
      fetchVesselDetails();
    } else {
      setLoading(false);
    }
  }, [state?.initialValues?.id]);

  return (
    <Box sx={{ padding: 0, margin: 0, height: "calc(100vh - 65px)" }}>
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
            <VesselForm
              initialValues={initialValues}
              type={state?.formAction}
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
