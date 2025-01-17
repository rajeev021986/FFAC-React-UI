import { useFormik } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";
import BondValue from "./BondValue";
import { useGetOptionsSettingsQuery } from "../../../../store/api/settingsApi";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Stack, Tab } from "@mui/material";
import ScreenToolbar from "../../../common/ScreenToolbar";
import ThemedBreadcrumb from "../../../common/Breadcrumb";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Loader from "../../../common/Loader/Loader";
import UploadFile from "../../../UploadFile";
import {
  useAddbondMutation,
  useLazyGetbondQuery,
  useUpdatebondMutation,
  useLazyGetbondAuditQuery,
} from "../../../../store/api/bondDataApi";
import toast from "react-hot-toast";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import AuditTimeLine from "../../../AuditTimeLine";
export default function BondForm() {
  const [value, setValue] = React.useState(1);
  const location = useLocation();
  const nav = useNavigate();
  const { id, type } = location.state;
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [getBond, { isLoading: isFetchingPort }] = useLazyGetbondQuery();
  const [addBond, isLoading] = useAddbondMutation();
  const [updateBond] = useUpdatebondMutation();
  const tabs =
    type == "new"
      ? [{ label: "Bond Details", value: 1, icon: EditIcon }]
      : [
          { label: "Bond Details", value: 1, icon: EditIcon },
          { label: "Audit Logs", value: 2, icon: HistoryIcon },
        ];
  const { data: StatusDropdown } =
    useGetOptionsSettingsQuery("common_settings");
  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("customer_settings");
  useEffect(() => {
    if (id && optionsSettingsData) {
      handleFetchBond();
    }
  }, [optionsSettingsData]);
  const handleFetchBond = async () => {
    try {
      const response = await getBond({ id });
      if (response?.data) {
        if (type === "copy" || type === "new") {
          formik.setValues({
            ...response.data.body,
            // isApproved: !customerSettingsData?.approvalRequest,
          });
        } else {
          formik.setValues(response.data.body);
        }
      } else {
        toast.error("Failed to fetch Bond data");
      }
    } catch (error) {
      toast.error("Error fetching Bond data");
    }
  };
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      bondNumber: "",
      bondType: "",
      openingBalance: "",
      status: "",
      remark: "",
      bondPurchaseDetailsEntities: [
        // {
        //   id: Date.now(),
        //   policyNo: "",
        //   date: "",
        //   amount: "",
        //   validUpToDate: "",
        // },
      ],
    },
    validationSchema: Yup.object({
      bondNumber: Yup.string().required("Bond Number is required"),
      bondType: Yup.string().required("Bond Type is required"),
      // openingBalance: Yup.number()
      //   .required("Opening Balance is required")
      //   .typeError("Opening Balance must be a number"),
      // status: Yup.string().required("Status is required"),
      // remark: Yup.string(),
      // bondPurchaseDetailsEntities: Yup.array().of(
      //   Yup.object({
      //     policyNo: Yup.string().required("Policy Number is required"),
      //     date: Yup.date().required("Date is required"),
      //     amount: Yup.number()
      //       .required("Amount is required")
      //       .typeError("Amount must be a number"),
      //     validUpToDate: Yup.date().required("Valid Up To Date is required"),
      //   })
      // ),
    }),
    onSubmit: async (values) => {
      if (type == "copy" || type == "new") {
        try {
          values.status = "";
          values.statusCode = 1;
          const result = await addBond({
            ...values,
            bondPurchaseDetailsEntities: values.bondPurchaseDetailsEntities.map(
              (a) => ({ ...a, id: null })
            ),
            id: null,
          }).unwrap();
        } catch (error) {}
      } else {
        try {
          Boolean(values.status == "Active") && (values.statusCode = 1);
          Boolean(values.status == "Inactive") && (values.statusCode = -2);
          const result = await updateBond({ ...values }).unwrap();
          toast.success(result.message);
        } catch (error) {
          toast.success(error.message);
        }
      }
      nav(-1);
    },
  });
  const [getbondAudit, { data: AuditData, isLoading: isLoadingAudit }] =
    useLazyGetbondAuditQuery();
  const fetchUserAudit = () => {
    getbondAudit({
      id: id,
    });
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
              <TabPanel value={1} sx={{ padding: 0, margin: 0 }}>
                {false ? (
                  <Loader />
                ) : (
                  <BondValue
                    formik={formik}
                    optionsSettingsData={StatusDropdown}
                    type={type}
                  />
                )}
              </TabPanel>
              <TabPanel value={2} sx={{ padding: 0, margin: 0 }}>
                <AuditTimeLine
                  auditDetails={AuditData}
                  reloadDataHandler={fetchUserAudit}
                  loading={isLoadingAudit}
                />
              </TabPanel>
            </TabContext>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
