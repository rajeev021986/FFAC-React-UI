import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useGetOptionsSettingsQuery } from "../../../../store/api/settingsApi";
import {
  useAddExahangeRateMutation,
  useLazyGetExahangeRateQuery,
  useLazyGetExchangeRateAuditQuery,
  useUpdateExahangeRateMutation,
} from "../../../../store/api/exchangeRateDataApi";
import ExchangeInputs from "./ExchangeInputs";
import { Box, Card, CardContent, Stack, Tab } from "@mui/material";
import ScreenToolbar from "../../../common/ScreenToolbar";
import ThemedBreadcrumb from "../../../common/Breadcrumb";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Loader from "../../../common/Loader/Loader";
import UploadFile from "../../../UploadFile";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuditTimeLine from "../../../AuditTimeLine";

export default function Exchange() {
  const location = useLocation();
  const { id, type } = location.state;
  const nav = useNavigate();
  const [value, setValue] = React.useState(1);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const { data: ExchageSettingsData, isFetching } =
    useGetOptionsSettingsQuery("common_settings");
  const tabs = [
    { label: "Exchange Details", value: 1 },
    { label: "Audit Logs", value: 2 },
  ];
  Boolean(type == "copy" || type == "new") && tabs.splice(1, 1);
  const [getExahangeRate, { isLoading }] = useLazyGetExahangeRateQuery();
  const [addExahangeRate] = useAddExahangeRateMutation();
  const [updateExahangeRate] = useUpdateExahangeRateMutation();

  const onSubmit = async (values) => {
    if (type == "copy" || type == "new") {
      delete values.id;
      try {
        values.status = "";
        values.statusCode = 1;
        let res = await addExahangeRate(values).unwrap();
        if (res.success) {
          toast.success(res.message);
          nav(-1);
        }
      } catch (error) {
        toast.error(error.data.message);
      }
    } else {
      try {
        Boolean(values.status == "Active") && (values.statusCode = 1);
        Boolean(values.status == "Inactive") && (values.statusCode = -2);
        let res = await updateExahangeRate(values).unwrap();
        if (res.success) {
          toast.success(res.message);
          nav(-1);
        }
      } catch (error) {
        toast.error(error.data.message);
      }
    }
  };
  const handleFetchExchangeRate = async () => {
    try {
      const response = await getExahangeRate({ id });
      if (response?.data) {
        if (type === "copy" || type === "new") {
          formik.setValues({
            ...response.data.body,
            status: "New",
          });
        } else {
          formik.setValues(response.data.body);
        }
      } else {
        toast.error("Failed to fetch Charge data");
      }
    } catch (error) {
      toast.error("Error fetching ExchangeRate data");
    }
  };
  useEffect(() => {
    if (id && ExchageSettingsData) {
      handleFetchExchangeRate();
    }
  }, [ExchageSettingsData]);

  const initialValues = {
    id: "",
    fromDate: "",
    toDate: "",
    currency: "",
    status: "",
    statusCode: "",
    usdExchange: "",
    ugxExchange: "",
  };

  const validationSchema = Yup.object({
    currency: Yup.string().required("Currency is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: false,
    onSubmit,
  });

  const [getPortAudit, { data: AuditData, isLoading: isLoadingAudit }] =
    useLazyGetExchangeRateAuditQuery();
  const fetchUserAudit = () => {
    getPortAudit({
      id: id,
    });
  };

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

      {isLoading ? (
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
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  {tabs.map((a) => (
                    <Tab
                      label={a.label}
                      value={a.value}
                      sx={{
                        fontSize: "1rem",
                        textTransform: "capitalize",
                        minHeight: "50px",
                      }}
                    />
                  ))}
                </TabList>
              </Box>
              <TabPanel value={1} sx={{ margin: 0, padding: 0 }}>
                {isLoading || isFetching ? (
                  <Loader />
                ) : (
                  <ExchangeInputs
                    formik={formik}
                    nav={nav}
                    type={type}
                    ExchageSettingsData={ExchageSettingsData}
                  />
                )}
              </TabPanel>
              <TabPanel value={2} sx={{ margin: 0, padding: 0 }}>
                <AuditTimeLine
                  auditDetails={AuditData}
                  reloadDataHandler={fetchUserAudit}
                  loading={isLoadingAudit}
                />
              </TabPanel>
            </TabContext>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
