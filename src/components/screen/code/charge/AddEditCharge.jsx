import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, useFormik } from "formik";
import * as Yup from "yup";
import { Box, Card, CardContent, Stack, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ScreenToolbar from "../../../common/ScreenToolbar";
import ThemedBreadcrumb from "../../../common/Breadcrumb";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetOptionsSettingsQuery } from "../../../../store/api/settingsApi";
import {
  useAddChargeMutation,
  useLazyGetChargeAuditQuery,
  useLazyGetChargeQuery,
  useUpdateChargeMutation,
} from "../../../../store/api/chargesDataApi";
import toast from "react-hot-toast";
import Loader from "../../../common/Loader/Loader";
import ChargeInputs from "./ChargeInputs";
import AuditTimeLine from "../../../AuditTimeLine";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import CustomToast from "../../../common/Toast/CustomToast";
import ApiManager from "../../../../services/ApiManager";
import { menuConfigUrl } from "../../../../store/menuConfigUrl";

const AddEditCharge = () => {
  const location = useLocation();
  const { id, type } = location.state;
  const nav = useNavigate();
  const [value, setValue] = React.useState(1);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const { data: ChargeSettingsData } =
    useGetOptionsSettingsQuery("common_settings");

  const tabs = [
    { label: "Charge Details", value: 1, icon: <EditIcon /> },
    { label: "Audit Logs", value: 2, icon: <HistoryIcon /> },
  ];
  Boolean(type == "copy" || type == "new") && tabs.splice(1, 1);

  const [getCharge, { isLoading }] = useLazyGetChargeQuery();
  const [addCharge, { isLoading: loadingAdd }] = useAddChargeMutation();
  const [updateCharge, { isLoading: loadingUpdate }] =
    useUpdateChargeMutation();

  const initialValues = {
    id: "",
    status: "",
    statusCode: "",
    chargeDetails: "",
    chargeFor: "",
    chargeName: "",
    mappedCharge: "",
    vatApplicable: "",
    chargeCode: "",
    mappingDetails: [],
  };

  const validationSchema = Yup.object({
    chargeName: Yup.string().required("Charge name is required"),
    //     status: Yup.string(),
    //     chargeDetails: Yup.string().required("Required"),
    //     chargeFor: Yup.string().required("Required"),
    //     mappedCharge: Yup.string().required("Required"),
    //     vatApplicable: Yup.string().required("Required"),
    //     chargeCode: Yup.string().required("Required"),
    //     mappingDetails: Yup.array().of(
    //       Yup.object({
    //         id: Yup.number().required(),
    //         directIncome: Yup.string().required("Required"),
    //         directExpense: Yup.string().required("Required"),
    //       })
    //     ),
  });

  const onSubmit = async (values) => {
    let updatedValue = {
      ...values,
      mappingDetails: values.mappingDetails.map((s) =>
        s.new ? { ...s, new: null, id: null } : s
      ),
    };
    if (type == "copy" || type == "new") {
      delete updatedValue.id;
      try {
        let res = await addCharge(updatedValue).unwrap();
        if (res.success) {
          toast.custom(<CustomToast message={res.message} toast="success" />, {
            closeButton: false,
          });
          nav("/app/admin/charges");
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
        Boolean(updatedValue.status == "Active") &&
          (updatedValue.statusCode = 1);
        Boolean(updatedValue.status == "Inactive") &&
          (updatedValue.statusCode = -2);
        let res = await updateCharge(updatedValue).unwrap();
        if (res.success) {
          toast.custom(<CustomToast message={res.message} toast="success" />, {
            closeButton: false,
          });
          nav("/app/admin/charges");
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

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: false,
    onSubmit,
  });

  const handleFetchCharge = async () => {
    try {
      const response = await getCharge({ id });
      if (response?.data) {
        formik.setValues({
          ...response.data.body,
        });
      } else {
        formik.setValues(initialValues);
      }
    } catch (error) {
      toast.custom(
        <CustomToast message="Error while fetching data" toast="error" />,
        {
          closeButton: false,
        }
      );
    }
  };
  useEffect(() => {
    if (id && ChargeSettingsData) {
      handleFetchCharge();
    }
  }, [ChargeSettingsData]);

  return (
    <>
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
                          textTransform: "capitalize",
                          minHeight: "50px",
                        }}
                        icon={a.icon}
                        iconPosition="start"
                      />
                    ))}
                  </TabList>
                </Box>
                <TabPanel
                  value={1}
                  sx={{ margin: "0px !important", padding: "0px !important" }}
                >
                  {isLoading ? (
                    <Loader />
                  ) : (
                    <ChargeInputs
                      formik={formik}
                      ChargeSettingsData={ChargeSettingsData}
                      nav={nav}
                      type={type}
                      value={value}
                      handleChange={handleChange}
                      loading={loadingAdd || loadingUpdate}
                    />
                  )}
                </TabPanel>
                <TabPanel
                  value={2}
                  sx={{ margin: "0px !important", padding: "0px !important" }}
                >
                  <AuditTimeLine
                    id={id}
                    page="charge"
                    service={menuConfigUrl.admin}
                  />
                </TabPanel>
              </TabContext>
            </CardContent>
          </Card>
        )}
      </Box>
    </>
  );
};

export default AddEditCharge;
