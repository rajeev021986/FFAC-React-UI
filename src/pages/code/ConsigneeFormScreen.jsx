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
import ConsigneeForm from "../../components/screen/code/consignee/ConsigneeForm";
import { useFetchCustomerQuery } from "../../store/api/shipperDataApi";
import ApiManager from "../../services/ApiManager";
import Loader from "../../components/common/Loader/Loader";
import { useGetOptionsSettingsQuery } from "../../store/api/settingsApi";
export default function ConsigneeFormScreen({ page }) {
  const [consigneeDatas, setconsigneeDatas] = useState({});
  const [loading, setLoading] = useState(true);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const { state } = useLocation();
  const [initialValues, setInitialValues] = React.useState({
    id: "",
    address1: "",
    address2: "",
    address3: "",
    city: "",
    consigneeName: "",
    status: "ACTIVE",
    statusCode: "1",
    country: "",
    standardFreeDays: "",
    standardRate: "",
    createdBy: "",
    modifiedBy: "",
    createdDate: "",
    modifiedDate: "",
    consigneeEntityFreeDays: [],
  });

  // Move settings queries to the top
  const { data: optionsSettingsData, isLoading: optionsLoading } =
    useGetOptionsSettingsQuery("common_settings");
  const { data: consigneeSettingsData, isLoading: consigneeSettingsLoading } =
    useGetOptionsSettingsQuery("consignee_settings");

  // First useEffect to handle settings loading
  // useEffect(() => {
  //   if (!optionsLoading && !shipperSettingsLoading) {
  //     setSettingsLoaded(true);
  //   }
  // }, [optionsLoading, shipperSettingsLoading]);

  // Only fetch customer details after settings are loaded
  useEffect(() => {
    const fetchConsigneeDetails = async () => {
      try {
        const res = await ApiManager.getConsigneeDeatils(
          state?.initialValues?.id
        );
        let status = "";
        if (res.body?.status) {
          status =
            res.body?.status.charAt(0).toUpperCase() +
            res.body?.status.slice(1).toLowerCase();
        }

        setconsigneeDatas(res.body);
        setInitialValues({
          id: res.body?.id || "",
          address1: res.body?.address1 || "",
          address2: res.body?.address2 || "",
          address3: res.body?.address3 || "",
          city: res.body?.city || "",
          consigneeName: res.body?.consigneeName || "",
          status: status || "",
          statusCode: res?.body?.statusCode || "",
          country: res.body?.country || "",
          standardFreeDays: res.body?.standardFreeDays || "",
          standardRate: res.body?.standardRate || "",
          createdBy: res.body?.createdBy || "",
          modifiedBy: res.body?.modifiedBy || "",
          createdDate: res.body?.createdDate || "",
          modifiedDate: res.body?.modifiedDate || "",
          consigneeEntityFreeDays: res.body?.consigneeEntityFreeDays || [],
          // ctypelist: "CONSIGNEE",
          // files: [],
        });
        setLoading(false);
      } catch (error) {}
    };
    if (state?.initialValues?.id) {
      fetchConsigneeDetails();
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
      {loading || optionsLoading || consigneeSettingsLoading ? (
        <Loader />
      ) : (
        <Card
          sx={{ borderWidth: 1, borderColor: "border.main", padding: "0px" }}
        >
          <CardContent
            sx={{ margin: "0px !important", padding: "0px !important" }}
          >
            <ConsigneeForm
              optionsSettingsData={optionsSettingsData}
              consigneeSettingsData={consigneeSettingsData}
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
