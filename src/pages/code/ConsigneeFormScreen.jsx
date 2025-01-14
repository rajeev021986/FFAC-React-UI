import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
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
    status: "",
    country: "",
    standardFreeDays: "",
    standardRate: "",
    createdBy: "",
    modifiedBy: "",
    createdDate: "",
    modifiedDate: "",
    consigneeMasterFreeDays: [],
    //ctypelist: 'CONSIGNEE',
    //files: []
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

        setconsigneeDatas(res.body);
        setInitialValues({
          id: res.body?.id || "",
          address1: res.body?.address1 || "",
          address2: res.body?.address2 || "",
          address3: res.body?.address3 || "",
          city: res.body?.city || "",
          consigneeName: res.body?.consigneeName || "",
          status: res.body?.status || "",
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
      } catch (error) {
      
      }
    };
    if (state?.initialValues?.id) {
      fetchConsigneeDetails();
    } else {
      setLoading(false);
    }
  }, [ state?.initialValues?.id]);

 
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
      {loading || optionsLoading || consigneeSettingsLoading ? (
        <Loader />
      ) : (
        <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
          
          <CardContent>
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
