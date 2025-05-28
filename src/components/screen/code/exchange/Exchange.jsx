import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useGetOptionsSettingsQuery } from "../../../../store/api/settingsApi";
import {
  useAddExahangeRateMutation,
  useLazyGetExahangeRateQuery,
  useUpdateExahangeRateMutation,
} from "../../../../store/api/exchangeRateDataApi";
import ExchangeInputs from "./ExchangeInputs";
import { Box, Card, CardContent, Stack, Tab } from "@mui/material";
import ScreenToolbar from "../../../common/ScreenToolbar";
import ThemedBreadcrumb from "../../../common/Breadcrumb";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Loader from "../../../common/Loader/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuditTimeLine from "../../../AuditTimeLine";
import CustomToast from "../../../common/Toast/CustomToast";

import { menuConfigUrl } from "../../../../store/menuConfigUrl";
import EditIconForHeader from "../../../common/commonIcons/EditIcons/EditIconForHeader";
import AuditIcon from "../../../common/commonIcons/AuditIcon/AuditIcon";
dayjs.extend(utc);

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
    {
      label: "Exchange Details",
      value: 1,
      icon: <EditIconForHeader />,
    },
    { label: "Audit Logs", value: 2, icon: <AuditIcon /> },
  ];
  Boolean(type == "copy" || type == "new") && tabs.splice(1, 1);
  const [getExahangeRate, { isLoading }] = useLazyGetExahangeRateQuery();
  const [addExahangeRate, { isLoading: loadingAdd }] =
    useAddExahangeRateMutation();
  const [updateExahangeRate, { isLoading: loadingUpdate }] =
    useUpdateExahangeRateMutation();

  const onSubmit = async (values) => {
    const utcFormattedValues = {
    ...values,
    fromDate: values.fromDate ? dayjs(values.fromDate).utc().format("YYYY-MM-DDTHH:mm:ss[Z]") : "",
    toDate: values.toDate ? dayjs(values.toDate).utc().format("YYYY-MM-DDTHH:mm:ss[Z]") : "",
  };
    if (type == "copy" || type == "new") {
      delete values.id;
      try {
        values.status = "";
        values.statusCode = 1;
        let res = await addExahangeRate(utcFormattedValues).unwrap();
        if (res.success) {
          toast.custom(<CustomToast message={res.message} toast="success" />, {
            closeButton: false,
          });
            nav("/app/admin/exchangeRate");
        }
      } catch (error) {
        toast.custom(
          <CustomToast message={error.data.message} toast="error" />,
          {
            closeButton: false,
          }
        );
      }
    } else {
      try {
        let res = await updateExahangeRate({
          ...utcFormattedValues,
          statusCode:
            values.status === "Active"
              ? 1
              : values.status === "Inactive"
              ? -2
              : values.statusCode,
        }).unwrap();
        if (res.success) {
          toast.custom(<CustomToast message={res.message} toast="success" />, {
            closeButton: false,
          });
          nav("/app/admin/exchangeRate");
        }
      } catch (error) {
        toast.custom(
          <CustomToast message={error.data.message} toast="error" />,
          {
            closeButton: false,
          }
        );
      }
    }
  };
 const handleFetchExchangeRate = async () => {
  try {
    const response = await getExahangeRate({ id });
    if (response?.data) {
      const data = response.data.body;

      // Convert UTC strings to local dayjs objects (or JS Date objects)
      const fromDateLocal = data.fromDate ? dayjs.utc(data.fromDate).local().toDate() : "";
      const toDateLocal = data.toDate ? dayjs.utc(data.toDate).local().toDate() : "";

      const formValues = {
        ...data,
        fromDate: fromDateLocal,
        toDate: toDateLocal,
      };

      if (type === "copy" || type === "new") {
        formik.setValues({
          ...formValues,
          status: "New",
        });
      } else {
        formik.setValues(formValues);
      }
    } else {
      toast.custom(
        <CustomToast message="Failed to fetch Exchange data" toast="error" />,
        {
          closeButton: false,
        }
      );
    }
  } catch (error) {
    toast.custom(
      <CustomToast message="Error fetching ExchangeRate data" toast="error" />,
      {
        closeButton: false,
      }
    );
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
    fromDate:Yup.date().required("From Date is required"),
    toDate:Yup.date().required("To Date is required"),
    usdExchange:Yup.string().required("Exchange rate is required"),
    ugxExchange: Yup.string().required("Inr Exchange is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: false,
    onSubmit,
  });

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
                        textTransform: "capitalize",
                        minHeight: "50px",
                      }}
                      icon={a.icon}
                      iconPosition="start"
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
                    loading={loadingAdd || loadingUpdate}
                  />
                )}
              </TabPanel>
              <TabPanel value={2} sx={{ margin: 0, padding: 0 }}>
                <AuditTimeLine
                  id={id}
                  page="exchange-rate"
                  service={menuConfigUrl.admin}
                />
              </TabPanel>
            </TabContext>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
