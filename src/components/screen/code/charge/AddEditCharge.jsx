import React, { useEffect } from "react";
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
    { label: "Charge Details", value: 1 },
    { label: "Audit Logs", value: 2 },
  ];
  Boolean(type == "copy" || type == "new") && tabs.splice(1, 1);

  const [getCharge, { isLoading }] = useLazyGetChargeQuery();
  const [addCharge] = useAddChargeMutation();
  const [updateCharge] = useUpdateChargeMutation();

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
          toast.success(res.message);
          nav(-1);
        }
      } catch (error) {
        toast.error(error.data.message);
      }
    } else {
      try {
        Boolean(updatedValue.status == "Active") &&
          (updatedValue.statusCode = 1);
        Boolean(updatedValue.status == "Inactive") &&
          (updatedValue.statusCode = -2);
        let res = await updateCharge(updatedValue).unwrap();
        if (res.success) {
          toast.success(res.message);
          nav(-1);
        }
      } catch (error) {
        toast.error(error.data.message);
      }
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
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
      toast.error("Error while fetching data");
    }
  };
  useEffect(() => {
    if (id && ChargeSettingsData) {
      handleFetchCharge();
    }
  }, [ChargeSettingsData]);
  const [getChargeAudit, { data: AuditData, isLoading: isLoadingAudit }] =
    useLazyGetChargeAuditQuery();
  const fetchUserAudit = () => {
    getChargeAudit({
      id: id,
    });
  };
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
                      <Tab label={a.label} value={a.value} />
                    ))}
                  </TabList>
                </Box>
                <TabPanel value={1} sx={{ margin: 0, padding: 0 }}>
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
    </>
  );
};

export default AddEditCharge;
