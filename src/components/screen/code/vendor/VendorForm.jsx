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
import { Box, Card, Grid, Stack, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { OutlinedButton, ThemeButton } from "../../../common/Button";
import ScreenToolbar from "../../../common/ScreenToolbar";
import ThemedBreadcrumb from "../../../common/Breadcrumb";
import { useGetOptionsSettingsQuery } from "../../../../store/api/settingsApi";
import { useNavigate } from "react-router-dom";
import AuditTimeLine from "../../../AuditTimeLine";
import EditIcon from "@mui/icons-material/Edit";
import DescriptionIcon from "@mui/icons-material/Description";
import HistoryIcon from "@mui/icons-material/History";
import CustomToast from "../../../common/Toast/CustomToast";
import { menuConfigUrl } from "../../../../store/menuConfigUrl";
import EditIconForHeader from "../../../common/commonIcons/EditIcons/EditIconForHeader";
import DocumentIcon from "../../../common/commonIcons/DocumentIcons/DocumentIcon";
import AuditIcon from "../../../common/commonIcons/AuditIcon/AuditIcon";

export default function VendorForm({ page = "vendor" }) {
  const [value, setValue] = React.useState(1);
  const nav = useNavigate();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const tabs = [
    {
      label: "Vendor Details",
      value: 1,
      icon: <EditIconForHeader />,
    },
    { label: "Document Details", value: 2, icon: <DocumentIcon /> },
    { label: "Audit logs", value: 3, icon: <AuditIcon /> },
  ];
  const location = useLocation();
  const { id, type } = location.state;
  Boolean(type == "copy" || type == "new") && tabs.splice(1, 2);
  const [addVendor, { isLoading: loadingAdd }] = useAddVendorMutation();
  const [updateVendor, { isLoading: loadingUpdate }] =
    useUpdateVendorMutation();
  const [getVendor, { isLoading }] = useLazyGetVendorQuery();

  const validationSchema = Yup.object({
    vendorName: Yup.string().required("Vendor Name is required"),
    tinNo: Yup.number().nullable(),
    vrnNo: Yup.number().nullable(),
    type: Yup.string().required("Type is required"),
    add1: Yup.string().required("Address is required"),
    alias: Yup.string(),
    telephone1: Yup.string()
      // .required("Telephone 1 is required")
      .matches(/^\d+$/, "Mob number is  b/w 10 to 15 digits")
      .matches(/^\d{10,15}$/, "Mob number is  b/w 10 to 15 digits"),

    telephone2: Yup.string()
      // .required("Telephone 2 is required")
      .matches(/^\d+$/, "Mob number is  b/w 10 to 15 digits")
      .matches(/^\d{10,15}$/, "Mob number is  b/w 10 to 15 digits"),
    fax: Yup.string(),
    emailId: Yup.string()
      // .required("Email is required")
      .email("Invalid email format")
      .test("valid-email", "Invalid email format", (value) => {
        if (!value) return true; // Skip validation if email is empty

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) return false; // Basic email structure check

        if (value.includes("..")) return false; // Consecutive dots not allowed

        const domainPart = value.split("@")[1];
        const domainBeforeDot = domainPart?.split(".")[0];

        if (/\d/.test(domainBeforeDot)) {
          return false; // Disallow numbers in the domain before the first dot
        }

        return true;
      }),

    city: Yup.string().matches(
      /^[A-Za-z\s]+$/,
      "City must only contain letters"
    ),
    // countryId: Yup.string(),
    // country: Yup.string(),
    creditDays: Yup.number().min(0, "Credit Days cannot be negative"),
    province: Yup.string().matches(
      /^[A-Za-z\s]+$/,
      "Province must only contain letters"
    ),
    poNo: Yup.number(),
    contactPerson: Yup.string().matches(
      /^[A-Za-z\s]+$/,
      "Contact Person must only contain letters"
    ),
    vendorEntityTariffs: Yup.array().of(
      Yup.object().shape({
        unitRate: Yup.number()
          .positive("Unit Rate must be a positive number")
          .min(0.01, "Unit Rate must be greater than 0"),
      })
    ),
    vendorEntityEmails: Yup.array().of(
      Yup.object().shape({
        emailId: Yup.string()
          .email("Invalid email format")
          .test("valid-email", "Invalid email format", (value) => {
            if (!value) return true; // Skip validation if email is empty
            const emailRegex =
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(value)) return false; // Basic email structure check
            if (value.includes("..")) return false; // Consecutive dots not allowed

            // Check if there are numbers in the domain part before the first dot
            const domainPart = value.split("@")[1];
            if (domainPart && /\d+/.test(domainPart.split(".")[0])) {
              return false; // Numbers in the domain part before the first dot
            }

            return true;
          }),
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
    vendorEntityTariffs: Yup.array(
      Yup.object({
        chargeId: Yup.string().required("Charge Name is required"),
      })
    ),
    vendorEntityFreeDays: Yup.array(
      Yup.object({
        id: Yup.number(),
        country: Yup.string(),
        noOfFreeDays: Yup.number().min(
          0,
          "Number of Free Days cannot be negative"
        ),
      })
    ),
    bankDetails: Yup.array(
      Yup.object({
        id: Yup.number(),
        bankName: Yup.string().matches(
          /^[A-Za-z\s]+$/,
          "Bank name must only contain letters"
        ),
        bankAddress: Yup.string(),
        currency: Yup.string().matches(
          /^[A-Za-z\s]+$/,
          "Currency must only contain letters"
        ),
        swiftCode: Yup.string(),
      })
    ),
  });

  const { data: optionsSettingsData, isLoading: dropLoadco } =
    useGetOptionsSettingsQuery("common_settings");
  const { data: vendorSettingsData, isLoading: dropLoadven } =
    useGetOptionsSettingsQuery("vendor_settings");

  useEffect(() => {
    const handleFetchVendor = async () => {
      try {
        const response = await getVendor({ id });
        if (response?.data) {
          if (type === "copy" || type === "new") {
            formik.setValues({
              ...response.data.body,
              status: "New",
              statusCode: !vendorSettingsData?.body?.approvalRequest,
            });
          } else {
            formik.setValues(response.data.body);
          }
        } else {
          toast.custom(
            <CustomToast message="Failed to fetch vendor data" toast="error" />,
            {
              closeButton: false,
            }
          );
        }
      } catch (error) {
        toast.custom(
          <CustomToast message="Error fetching vendor data" toast="error" />,
          {
            closeButton: false,
          }
        );
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
    countryId: "",
    countryName: "",
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
    bankDetails: [],
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
        bankDetails: values.bankDetails.map((s) =>
          s.new ? { ...s, new: null, id: null } : s
        ),
      };
      if (values.bankDetails.length > 0) {
        const { bankAddress, bankName, currency, swiftCode, accountNo } =
          values.bankDetails;

        if (values.bankDetails.length > 0) {
          const isAnyBankDetailIncomplete = values.bankDetails.some((bank) => {
            const { bankName, bankAddress, currency, accountNo, swiftCode } =
              bank;
            return (
              !bankName || !bankAddress || !currency || !accountNo || !swiftCode
            );
          });

          if (isAnyBankDetailIncomplete) {
            toast.custom(
              <CustomToast
                message="Please fill all bank details"
                toast="error"
              />,
              {
                closeButton: false,
              }
            );
            return;
          }
        }
      }

      if (type == "copy" || type == "new") {
        try {
          updatedValue.statusCode = vendorSettingsData?.body?.approvalRequest
            ? 0
            : 1;
          updatedValue.statusCode = vendorSettingsData?.body?.approvalRequest
            ? 0
            : 1;
          let res = await addVendor(updatedValue).unwrap();
          if (res.success) {
            toast.custom(<CustomToast message={res.message} toast="warn" />, {
              closeButton: false,
            });
            nav(-1);
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
          let res = await updateVendor(updatedValue).unwrap();
          if (res.success) {
            toast.custom(
              <CustomToast message={res.message} toast="success" />,
              {
                closeButton: false,
              }
            );
            nav(-1);
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
    },
  });

  return (
    <>
      <Box
        sx={{
          width: "100%",
          typography: "body1",
          padding: "0px",
          margin: "0px",
        }}
      >
        <Stack sx={{ padding: "8px 0px" }}>
          <ScreenToolbar leftComps={<ThemedBreadcrumb />} />
        </Stack>
        {isLoading || dropLoadven || dropLoadco ? (
          <Loader />
        ) : (
          <Card>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                  sx={{
                    padding: 0,
                  }}
                >
                  {tabs.map((a) => (
                    <Tab
                      sx={{
                        textTransform: "capitalize",
                        padding: "0px 12px",
                        minHeight: "50px",
                      }}
                      label={a.label}
                      value={a.value}
                      icon={a.icon}
                      iconPosition="start"
                    />
                  ))}
                </TabList>
              </Box>

              <TabPanel value={1} sx={{ padding: "0px" }}>
                <VendorFormInput
                  formik={formik}
                  type={type}
                  disabled={page == "vendorApproval"}
                  optionsSettingsData={optionsSettingsData}
                  vendorSettingsData={vendorSettingsData}
                  page={page}
                  loading={loadingAdd || loadingUpdate}
                />
              </TabPanel>
              <TabPanel value={2} sx={{ padding: "0px" }}>
                <UploadFile
                  customer_id={id}
                  sourceType="VENDOR"
                  page={page}
                  disabled={page == "vendorApproval"}
                  showDocmentType ='true'
                  dropdownData={vendorSettingsData?.body?.documentType}
                />
              </TabPanel>
              <TabPanel value={3} sx={{ padding: "0px" }}>
                <AuditTimeLine
                  id={id}
                  page="vendor"
                  service={menuConfigUrl.entity}
                />
              </TabPanel>
            </TabContext>
          </Card>
        )}
      </Box>
    </>
  );
}
