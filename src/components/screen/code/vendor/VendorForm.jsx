import { useFormik } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";
import VendorFormInput from "./VendorFormInput";
import {
  useAddVendorMutation,
  useLazyGetVendorAuditQuery,
  useLazyGetVendorQuery,
  useUpdateVendorMutation,
} from "../../../../store/api/vendorDataApi";
import toast from "react-hot-toast";
import Loader from "../../../common/Loader/Loader";
import { useLocation } from "react-router-dom";
import UploadFile from "../../../UploadFile";
import { Box, Grid, Stack, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { OutlinedButton, ThemeButton } from "../../../common/Button";
import ScreenToolbar from "../../../common/ScreenToolbar";
import ThemedBreadcrumb from "../../../common/Breadcrumb";
import { useGetOptionsSettingsQuery } from "../../../../store/api/settingsApi";
import { useNavigate } from "react-router-dom";
import AuditTimeLine from "../../../AuditTimeLine";

export default function VendorForm({ page = "vendor" }) {
  const [value, setValue] = React.useState(1);
  const nav = useNavigate();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const tabs = [
    { label: "Vendor Details", value: 1 },
    { label: "Document Details", value: 2 },
    { label: "Audit logs", value: 3 },
  ];
  const location = useLocation();
  const { id, type } = location.state;
  Boolean(type == "copy" || type == "new") && tabs.splice(1, 2);
  const [addVendor] = useAddVendorMutation();
  const [updateVendor] = useUpdateVendorMutation();
  const [getVendor, { isLoading }] = useLazyGetVendorQuery();
  const validationSchema = Yup.object({
    vendorName: Yup.string().required("Vendor Name is required"),
    tinNo: Yup.string().nullable(),
    vrnNo: Yup.string().nullable(),
    // status: Yup.string().required("Status is required"),
    type: Yup.string().required("Type is required"),
    add1: Yup.string().required("Address is required"),
    // add2: Yup.string().nullable(),
    // add3: Yup.string().nullable(),
    alias: Yup.string(),
    telephone1: Yup.string(),
    // telephone2: Yup.string().nullable(),
    fax: Yup.string(),
    emailId: Yup.string().email(),
    city: Yup.string(),
    country: Yup.string(),
    creditDays: Yup.number()
      .required("Credit Days is required")
      .min(0, "Credit Days cannot be negative"),
    province: Yup.string(),
    poNo: Yup.string(),
    contactPerson: Yup.string(),
    // companyCode: Yup.string().nullable(),
    // rejectRemarks: Yup.string().nullable(),
    vendorEntityTariffs: Yup.array().of(
      Yup.object().shape({
        unitRate: Yup.number()
          .positive("Unit Rate must be a positive number")
          .min(0.01, "Unit Rate must be greater than 0"),
      })
    ),
    vendorEntityEmails: Yup.array().of(
      Yup.object().shape({
        emailId: Yup.string().email(),
      })
    ),
    // vendorEntityDemurageTariffs: Yup.array(
    //   Yup.object({
    //     id: Yup.number().required("ID is required"),
    //     country: Yup.string().required("Country is required"),
    //     containerType: Yup.string().required("Container Type is required"),
    //     firstWeek: Yup.string().required("First Week is required"),
    //     secondWeek: Yup.string().required("Second Week is required"),
    //     thirdWeek: Yup.string().required("Third Week is required"),
    //   })
    // ).required("Vendor Entity Demurage Tariffs are required"),
    // vendorEntityFreeDays: Yup.array(
    //   Yup.object({
    //     id: Yup.number().required("ID is required"),
    //     country: Yup.string().required("Country is required"),
    //     noOfFreeDays: Yup.number()
    //       .required("Number of Free Days is required")
    //       .min(0, "Number of Free Days cannot be negative"),
    //   })
    // ).required("Vendor Entity Free Days are required"),

    // vendorBankDetails: Yup.array(
    //   Yup.object({
    //     id: Yup.number().required("ID is required"),
    //     bankName: Yup.string().required("Bank Name is required"),
    //     bankAddress: Yup.string().required("Bank Address is required"),
    //     currency: Yup.string().required("Currency is required"),
    //     swiftCode: Yup.string().required("SWIFT Code is required"),
    //   })
    // ).required("Vendor Bank Details are required"),
  });
  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("common_settings");
  const { data: vendorSettingsData } =
    useGetOptionsSettingsQuery("vendor_settings");
  const { data: customerSettingsData } =
    useGetOptionsSettingsQuery("customer_settings");

  useEffect(() => {
    const handleFetchVendor = async () => {
      try {
        const response = await getVendor({ id });
        if (response?.data) {
          if (type === "copy" || type === "new") {
            formik.setValues({
              ...response.data.body,
              status: "New",
              isApproved: !vendorSettingsData?.body?.approvalRequest,
            });
          } else {
            formik.setValues(response.data.body);
          }
        } else {
          toast.error("Failed to fetch vendor data");
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
        toast.error("Error fetching vendor data");
      }
    };

    if (id && vendorSettingsData) {
      handleFetchVendor();
    }
  }, [vendorSettingsData]);

  const initialValues = {
    vendorName: "",
    status: "",
    type: "",
    add1: "",
    add2: "",
    add3: "",
    alias: "",
    telephone1: "",
    telephone2: "",
    fax: "",
    emailId: "",
    tinNo: null,
    vrnNo: null,
    city: "",
    country: "",
    creditDays: 0,
    province: "",
    poNo: "",
    contactPerson: "",
    // companyCode: "",
    rejectRemarks: "",
    vendorEntityTariffs: [],
    vendorEntityDemurageTariffs: [],
    vendorEntityFreeDays: [],
    vendorEntityEmails: [],
    vendorBankDetails: [],
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      let updatedValue = {
        ...values,
        vendorEntityTariffs: values.vendorEntityTariffs.map((s) =>
          s.new ? { ...s, new: null, id: null } : s
        ),
        vendorEntityDemurageTariffs: values.vendorEntityDemurageTariffs.map(
          (s) => (s.new ? { ...s, new: null, id: null } : s)
        ),
        vendorEntityFreeDays: values.vendorEntityFreeDays.map((s) =>
          s.new ? { ...s, new: null, id: null } : s
        ),
        vendorEntityEmails: values.vendorEntityEmails.map((s) =>
          s.new ? { ...s, new: null, id: null } : s
        ),
        vendorBankDetails: values.vendorBankDetails.map((s) =>
          s.new ? { ...s, new: null, id: null } : s
        ),
      };
      if (type == "copy" || type == "new") {
        try {
          updatedValue.isApproved = vendorSettingsData?.body?.approvalRequest ? 0 : 1;
          let res = await addVendor(updatedValue).unwrap();
          if (res.success) {
            toast.success(res.message);
            nav(-1);
          }
        } catch (error) {
          toast.error(error.data.message);
        }
      } else {
        try {
          Boolean(updatedValue.status == "Active") && (updatedValue.isApproved = 1);
          Boolean(updatedValue.status == "Inactive") && (updatedValue.isApproved = -2);
          let res = await updateVendor(updatedValue).unwrap();
          console.log(res.success, "res.success");
          if (res.success) {
            toast.success(res.message);
            nav(-1);
          }
        } catch (error) {
          toast.error(error.data.message);
        }
      }
    },
  });
  const [getVendorAudit, { data: AuditData, isLoading: isLoadingAudit }] =
    useLazyGetVendorAuditQuery();
  const fetchUserAudit = () => {
    getVendorAudit({
      id: id,
    });
  };
  return (
    <>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <ScreenToolbar leftComps={<ThemedBreadcrumb />} />
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              {tabs.map((a) => (
                <Tab
                  sx={{ fontSize: "1rem", textTransform: "capitalize" }}
                  label={a.label}
                  value={a.value}
                />
              ))}
            </TabList>
          </Box>
          <TabPanel value={1} sx={{padding:"0px"}} >
            {isLoading ? (
              <Loader />
            ) : (
              <VendorFormInput
                formik={formik}
                type={type}
                disabled={page == "vendorApproval"}
                optionsSettingsData={optionsSettingsData}
                vendorSettingsData={vendorSettingsData}
                page={page}
              />
            )}
          </TabPanel>
          <TabPanel value={2} sx={{padding:"0px"}} >
            <UploadFile
              customer_id={id}
              sourceType="VENDOR"
              page={page}
              disabled={page == "vendorApproval"}
              dropdownData={vendorSettingsData?.body?.documentType}
            />
          </TabPanel>
          <TabPanel value={3}sx={{padding:"0px"}} >
            <AuditTimeLine
              auditDetails={AuditData}
              reloadDataHandler={fetchUserAudit}
              loading={isLoadingAudit}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
}
