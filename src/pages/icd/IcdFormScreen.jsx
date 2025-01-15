import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import IcdForm from "../../components/screen/code/icd/IcdForm";
import { useFetchCustomerQuery } from "../../store/api/shipperDataApi";
import ApiManager from "../../services/ApiManager";
import Loader from "../../components/common/Loader/Loader";
import { useGetOptionsSettingsQuery } from "../../store/api/settingsApi";
export default function IcdFormScreen({ page }) {
  const [icdDatas, seticdDatas] = useState({});
  const [loading, setLoading] = useState(true);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const { state } = useLocation();
  const [initialValues, setInitialValues] = React.useState({
    id: "",
    icd_code: "",
    icd_name: "",
    status: "ACTIVE",
    statusCode: "",
    address1: "",
    address2: "",
    address3: "",
    contact_person: "",
    tel_no: "",
    email: "",
    mobile: "",
    created_by: "",
    modified_by: "",
    created_date: "",
    modified_date: ""
  });
  

  // Move settings queries to the top
  const { data: optionsSettingsData, isLoading: optionsLoading } =
    useGetOptionsSettingsQuery("common_settings");
  const { data: icdSettingsData, isLoading: icdSettingsLoading } =
    useGetOptionsSettingsQuery("icd_settings");

  // First useEffect to handle settings loading
  // useEffect(() => {
  //   if (!optionsLoading && !shipperSettingsLoading) {
  //     setSettingsLoaded(true);
  //   }
  // }, [optionsLoading, shipperSettingsLoading]);

  // Only fetch customer details after settings are loaded
  useEffect(() => {
    const fetchIcdDetails = async () => {
      try {
        const res = await ApiManager.getIcdDeatils(
          state?.initialValues?.id
        );
        let status = "";
        if (res.body?.status) {
          status =
            res.body?.status.charAt(0).toUpperCase() +
            res.body?.status.slice(1).toLowerCase();
        }

        seticdDatas(res.body);
        setInitialValues({
          id: res.body?.id || "",
          icd_code: res.body?.icd_code || "",
          icd_name:res.body?.icd_name || "",
          status: status || "",
          statusCode: res?.body?.statusCode || "",
          address1: res.body?.address1 || "",
          address2: res.body?.address2 || "",
          address3: res.body?.address3 || "",
          contact_person: res.body?.contact_person || "",
          tel_no: res.body?.tel_no || "",
          email: res.body?.email || "",
          mobile: res.body?.mobile || "",
          created_by: res.body?.created_by || "",
          modified_by: res.body?.modified_by || "",
          created_date: res.body?.created_date || "",
          modified_date: res.body?.modified_date || "",
          ctypelist: "ICD",
          files: [],
        });
        setLoading(false);
      } catch (error) {
      
      }
    };
    if (state?.initialValues?.id) {
      fetchIcdDetails();
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
      {loading || optionsLoading || icdSettingsLoading ? (
        <Loader />
      ) : (
        <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
          
          <CardContent>
            <IcdForm
              optionsSettingsData={optionsSettingsData}
              icdSettingsData={icdSettingsData}
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
