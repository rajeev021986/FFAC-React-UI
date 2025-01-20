import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import ShipperForm from "../../components/screen/code/Shipper/ShipperForm";
import { useFetchCustomerQuery } from "../../store/api/shipperDataApi";
import ApiManager from "../../services/ApiManager";
import Loader from "../../components/common/Loader/Loader";
import { useGetOptionsSettingsQuery } from "../../store/api/settingsApi";
export default function ShipperFormScreen({ page }) {
  const [shipperDatas, setshipperDatas] = useState({});
  const [loading, setLoading] = useState(true);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const { state } = useLocation();
  const [initialValues, setInitialValues] = React.useState({
    id: "",
    address1: "",
    address2: "",
    address3: "",
    city: "",
    name: "",
    status: "ACTIVE",
    statusCode: "",
    country: "",
    email: "",
    contactName: "",
    designation: "",
    tel_No: "",
    extn_No: "",
    fax_No: "",
    mobile: "",
    ieCode: "",
    created_by: "",
    modified_by: "",
    created_date: "",
    modified_date: "",
  });

  // Move settings queries to the top
  const { data: optionsSettingsData, isLoading: optionsLoading } =
    useGetOptionsSettingsQuery("common_settings");
  const { data: shipperSettingsData, isLoading: shipperSettingsLoading } =
    useGetOptionsSettingsQuery("shipper_settings");

  // First useEffect to handle settings loading
  // useEffect(() => {
  //   if (!optionsLoading && !shipperSettingsLoading) {
  //     setSettingsLoaded(true);
  //   }
  // }, [optionsLoading, shipperSettingsLoading]);

  // Only fetch customer details after settings are loaded
  useEffect(() => {
    const fetchShipperDetails = async () => {
      try {
        const res = await ApiManager.getShipperDeatils(
          state?.initialValues?.id
        );
        let status = "";
        if (res.body?.status) {
          status =
            res.body?.status.charAt(0).toUpperCase() +
            res.body?.status.slice(1).toLowerCase();
        }

        setshipperDatas(res.body);
        setInitialValues({
          id: res.body?.id || "",
          address1: res.body?.address1 || "",
          address2: res.body?.address2 || "",
          address3: res.body?.address3 || "",
          city: res.body?.city || "",
          name: res.body?.name || "",
          status: status || "",
          statusCode: res?.body?.statusCode || "",
          country: res.body?.country || "",
          email: res.body?.email || "",
          contactName: res.body?.contactName || "",
          designation: res.body?.designation || "",
          tel_No: res.body?.tel_No || "",
          extn_No: res.body?.extn_No || "",
          fax_No: res.body?.fax_No || "",
          mobile: res.body?.mobile || "",
          ieCode: res.body?.ieCode || "",
          created_by: res.body?.created_by || "",
          modified_by: res.body?.modified_by || "",
          created_date: res.body?.created_date || "",
          modified_date: res.body?.modified_date || "",
          // ctypelist: "SHIPPER",
          // files: [],
        });
        setLoading(false);
      } catch (error) {}
    };
    if (state?.initialValues?.id) {
      fetchShipperDetails();
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
      {loading || optionsLoading || shipperSettingsLoading ? (
        <Loader />
      ) : (
        <Card
          sx={{ borderWidth: 1, borderColor: "border.main", padding: "0px" }}
        >
          <CardContent
            sx={{ margin: "0px !important", padding: "0px !important" }}
          >
            <ShipperForm
              optionsSettingsData={optionsSettingsData}
              shipperSettingsData={shipperSettingsData}
              initialValues={initialValues}
              type={state?.type}
              page={page}
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
