import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Card, CardContent, Stack, Tab } from "@mui/material";
import ScreenToolbar from "../../../common/ScreenToolbar";
import ThemedBreadcrumb from "../../../common/Breadcrumb";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Loader from "../../../common/Loader/Loader";
import PortValueForm from "./PortValueForm";
import {
  useAddPortMutation,
  useLazyGetPortAuditQuery,
  useLazyGetPortQuery,
  useUpdatePortMutation,
} from "../../../../store/api/portDataApi";
import toast from "react-hot-toast";
import UploadFile from "../../../UploadFile";
import { useLocation } from "react-router-dom";
import { useGetOptionsSettingsQuery } from "../../../../store/api/settingsApi";
import { useNavigate } from "react-router-dom";
import getFirstError from "../../../common/FieldToastError";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import AuditTimeLine from "../../../AuditTimeLine";
import CustomToast from "../../../common/Toast/CustomToast";
import ApiManager from "../../../../services/ApiManager";
function PortForm() {
  const [value, setValue] = React.useState(1);
  const [dropdownData, setDropdownData] = useState({});
  const location = useLocation();
  const nav = useNavigate();
  const [getPort, { isLoading: isFetchingPort }] = useLazyGetPortQuery();
  const [addPort, { isLoading: addLoading }] = useAddPortMutation();
  const [updatePort, { isLoading: updateLoading }] = useUpdatePortMutation();
  const { id, type } = location.state;
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const tabs =
    type == "new"
      ? [{ label: "Port Details", value: 1, icon: EditIcon }]
      : [
          { label: "Port Details", value: 1, icon: EditIcon },
          { label: "Audit logs", value: 2, icon: HistoryIcon },
        ];
  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("common_settings");
  const { data: portSettingsData } =
    useGetOptionsSettingsQuery("port_settings");

  useEffect(() => {
    if (optionsSettingsData?.body || portSettingsData?.body) {
      if (id) {
        handleFetchPort();
      }
      setDropdownData({
        ...optionsSettingsData?.body,
        ...portSettingsData?.body,
      });
    }
  }, [optionsSettingsData, portSettingsData]);

  const handleFetchPort = async () => {
    try {
      const response = await getPort({ id });
      if (response?.data) {
        if (type === "new") {
          formik.setValues({
            ...response.data.body,
            // isApproved: !customerSettingsData?.approvalRequest,
          });
        } else {
          formik.setValues(response.data.body);
        }
      }
    } catch (error) {
      toast.custom(
        <CustomToast message="Error fetching Port data" toast="error" />,
        {
          closeButton: false,
        }
      );
    }
  };
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      status: "",
      portDetails: "",
      unCode: "",
      customCode: "",
      newPortName: "",
      country: "",
      region: "",
      basePort: "",
      type: "",
      iotaCode: "",
    },
    validationSchema: Yup.object({
      newPortName: Yup.string().required("Port name is required"),
      type: Yup.string().required("Port type is required"),
      // status: Yup.string().nullable(),
      // portDetails: Yup.string().nullable(),
      // unCode: Yup.string().nullable(),
      // customCode: Yup.string().nullable(),
      // country: Yup.string().nullable(),
      // region: Yup.string().nullable(),
      // basePort: Yup.string().nullable(),
      // iotaCode: Yup.string().nullable(),
    }),
    onSubmit: async (values) => {
      if (type == "copy" || type == "new") {
        try {
          values.status = "";
          values.statusCode = 1;
          const result = await addPort({ ...values, id: null }).unwrap();
        } catch (error) {}
      } else {
        try {
          const result = await updatePort({
            ...values,
            statusCode:
              values.status === "Active"
                ? 1
                : values.status === "Inactive"
                ? -2
                : null,
          }).unwrap();
          toast.custom(
            <CustomToast message={result.message} toast="success" />,
            {
              closeButton: false,
            }
          );
        } catch (error) {
          toast.custom(<CustomToast message={error.message} toast="error" />, {
            closeButton: false,
          });
        }
      }
      nav(-1);
    },
  });

  const [auditDetails, setAuditDetails] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);

  const reloadDataHandler = async () => {
    try {
      setAuditLoading(true);
      const res = await ApiManager.getAuditDetails(
        id,
        "port",
        "master-service"
      );
      setAuditDetails(res);
      setAuditLoading(false);
    } catch (error) {
      setAuditLoading(false);
    }
  };
  return (
    <>
      <Box
        sx={{
          width: "100%",
          typography: "body1",
          height: "calc(100vh - 65px)",
        }}
      >
        <Stack sx={{ padding: "8px 0px" }}>
          <ScreenToolbar leftComps={<ThemedBreadcrumb />} />
        </Stack>

        <Card
          sx={{ borderWidth: 1, borderColor: "border.main", padding: "0px" }}
        >
          <CardContent
            sx={{ margin: "0px !important", padding: "0px !important" }}
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
                      icon={<a.icon />}
                      iconPosition="start"
                    />
                  ))}
                </TabList>
              </Box>

              <TabPanel value={1} sx={{ padding: "0px" }}>
                {isFetchingPort ? (
                  <Loader />
                ) : (
                  <PortValueForm
                    formik={formik}
                    type={type}
                    optionsSettingsData={optionsSettingsData}
                    loading={addLoading || updateLoading}
                  />
                )}
              </TabPanel>
              <TabPanel value={2} sx={{ padding: "0px" }}>
                <AuditTimeLine
                  auditDetails={auditDetails}
                  reloadDataHandler={reloadDataHandler}
                  loading={auditLoading}
                />
              </TabPanel>
            </TabContext>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default PortForm;
