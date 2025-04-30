import toast from "react-hot-toast";
import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress, Tooltip } from "@mui/material";
import { Grid, Stack, TextField } from "@mui/material";
import { JobEntryValidationSchema } from "./validationSchema";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

// Components
import { OutlinedButton, ThemeButton } from "../../components/common/Button";
import DateTimeField from "../../components/common/DateTime/DateTimeField";
import CommonTabForm from "./TabForm";
import AddRateModal from "./RateModal";
import InputBox from "../../components/common/InputBox";
import EditIconForHeader from "../../components/common/commonIcons/EditIcons/EditIconForHeader";
import DocumentIcon from "../../components/common/commonIcons/DocumentIcons/DocumentIcon";
import AuditIcon from "../../components/common/commonIcons/AuditIcon/AuditIcon";
import SelectBox from "../../components/common/SelectBox";
import PopupAlert from "../../components/common/Alert/PopupAlert";
import CustomToast from "../../components/common/Toast/CustomToast";
import getFirstError from "../../components/common/FieldToastError";
import FormAutoCompleteWithLoader from "../../components/common/AutoComplete/FormAutoCompletewithLoader";

// API Function Helper
import { useGetOptionsSettingsQuery } from "../../store/api/settingsApi";
import {
  useAddJobEntryMutation,
  useUpdateJobEntryMutation,
} from "../../store/api/jobEntryApi";
import UploadFile from "../../components/UploadFile";
import { menuConfigUrl } from "../../store/menuConfigUrl";
import AuditTimeLine from "../../components/AuditTimeLine";
import ApiManager from "../../services/ApiManager";
import SelectShipment from "../../components/common/SelectShipment";

export default function JobEntryForm({
  initialValues,
  page,
  type = "notcopy",
  getUserId,
}) {
  const location = useLocation();

  const [addJobEntry, { isLoading }] = useAddJobEntryMutation();
  const [updateJobEntry, { isLoading: loadingUpdate }] =
    useUpdateJobEntryMutation();
  const [toggleRate, settoggleRate] = useState(false);
  const [dropdownData, setDropdownData] = useState({});
  const [rejectError, setRejectError] = useState(false);
  const [isSelectedShipmentTypeValid, setIsSelectedShipmentTypeValid] =
    useState(false);
  const nav = useNavigate();
  const shipmentTypeRef = useRef(null);
  const toastRef = useRef(null);
  const [value, setValue] = React.useState("1");
  const [loaderApprove, setLoaderApprove] = useState({
    approve: false,
    reject: false,
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [alertConfig, setAlertConfig] = useState({
    open: false,
    title: "",
    message: "",
    severity: "info",
    onConfirm: null,
    onClose: () => setAlertConfig({ ...alertConfig, open: false }),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: JobEntryValidationSchema(),
    onSubmit: async (values) => {
      if (isLoading) {
        return;
      }
      let hasError = false;
      if (isSelectedShipmentTypeValid) {
        toast.custom(
          <CustomToast
            message={"Please contact the administrator."}
            toast="error"
          />,
          { closeButton: false }
        );
        return;
      }
      if (!values.id || type == "copy") {
        let containerShipment = values.containerShipments.map((item) => {
          if (item.containerNo.length < 11) {
            // formik.setFieldError("containerNo", "Container No. is required");
            toast.custom(
              <CustomToast
                message="Container No. must be 11 characters"
                toast="error"
              />,
              {
                closeButton: false,
              }
            );
            hasError = true;
            return item; // Still return something to avoid undefined
          } else if (item.tflSealNo.length < 11) {
            // formik.setFieldError("sellno", "Sell No is required");
            toast.custom(
              <CustomToast
                message="Seal No must be 11 characters"
                toast="error"
              />,
              {
                closeButton: false,
              }
            );
            hasError = true;
            return item;
          } else {
            return item?.new ? { ...item, id: null, new: false } : item;
          }
        });
        if (hasError) return;

        let vehicleShipment = values.vehicleShipments.map((item) =>
          item?.new ? { ...item, id: null, new: false } : item
        );
        let looseCargo = values.looseCargoShipments.map((item) =>
          item?.new ? { ...item, id: null, new: false } : item
        );
        let notesData = values.notes.map((item) =>
          item?.new ? { ...item, id: null, new: false } : item
        );
        let rateData = {
          totalAmount: values.rate.totalAmount || 0,
          remarks: values.rate.remarks || "",
          id: values.rate.id || "",
          rateDetails: values.rate.rateDetails.map((item) =>
            item?.new ? { ...item, id: null, new: false } : item
          ),
        };

        try {
          delete values.id;
          values.statusCode = dropdownData?.approvalRequest ? 0 : 1;
          values.status = "";
          let response = await addJobEntry({
            ...values,
            containerShipments: containerShipment,
            vehicleShipments: vehicleShipment,
            looseCargoShipments: looseCargo,
            notes: notesData,
            rate: rateData,
          }).unwrap();
          const message = response.message;
          if (response.code == "SUCCESS") {
            toast.custom(<CustomToast message={message} toast="warn" />, {
              closeButton: false,
            });
            nav("/app/documentation/jobEntry");
          } else {
            toast.custom(<CustomToast message={message} toast="error" />, {
              duration: 1000, // 2 seconds
              closeButton: false,
            });
          }
        } catch (error) {
          if (error.status === 409) {
            const message = error.data.message;
            toast.custom(<CustomToast message={message} toast="error" />, {
              duration: 1000, // 2 seconds

              closeButton: false,
            });
          } else {
            toast.custom(
              <CustomToast
                message="An error occurred while submitting the form."
                toast="error"
              />,
              {
                duration: 2000, // 2 seconds

                closeButton: false,
              }
            );
          }
        }
      } else {
        //  console.log(values.containerShipments,"mmmm")
        // return;
        try {
          setRejectError(false);
          let containerShipment = values.containerShipments.map((item) => {
            if (item.containerNo.length < 11) {
              // formik.setFieldError("containerNo", "Container No. is required");
              toast.custom(
                <CustomToast
                  message="Container No. must be 11 characters"
                  toast="error"
                />,
                {
                  closeButton: false,
                }
              );
              hasError = true;
              return item; // Still return something to avoid undefined
            } else if (item.tflSealNo.length < 11) {
              // formik.setFieldError("sellno", "Sell No is required");
              toast.custom(
                <CustomToast
                  message="Seal No must be 11 characters"
                  toast="error"
                />,
                {
                  closeButton: false,
                }
              );
              hasError = true;
              return item;
            } else {
              return item?.new ? { ...item, id: null, new: false } : item;
            }
          });
          if (hasError) return;

          let vehicleShipment = values.vehicleShipments.map((item) =>
            item?.new ? { ...item, id: null, new: false } : item
          );
          let looseCargo = values.looseCargoShipments.map((item) =>
            item?.new ? { ...item, id: null, new: false } : item
          );
          let notesData = values.notes.map((item) =>
            item?.new ? { ...item, id: null, new: false } : item
          );
          let rateData = {
            totalAmount: values.rate.totalAmount || 0,
            remarks: values.rate.remarks || "",
            id: values.rate.id || "",
            rateDetails: values.rate.rateDetails.map((item) =>
              item?.new ? { ...item, id: null, new: false } : item
            ),
          };
          Boolean(values.status == "Active") && (values.statusCode = 1);
          Boolean(values.status == "Inactive") && (values.statusCode = -2);
          let response = await updateJobEntry({
            ...values,
            containerShipments: containerShipment,
            vehicleShipments: vehicleShipment,
            looseCargoShipments: looseCargo,
            notes: notesData,
            rate: rateData,
          }).unwrap();
          const message = response.message;
          if (response.code == "SUCCESS") {
            toast.custom(<CustomToast message={message} toast="success" />, {
              closeButton: false,
            });
            nav(-1);
          } else {
            toast.custom(<CustomToast message={message} toast="warn" />, {
              closeButton: false,
            });
          }
        } catch (error) {
          if (error.status === 409) {
            const message = error.data.message;
            toast.custom(
              <CustomToast message={message} toast="error" />,

              {
                closeButton: false,
              }
            );
          } else {
            toast.custom(
              <CustomToast
                message="An error occurred while submitting the form."
                toast="error"
              />,
              {
                closeButton: false,
              }
            );
          }
        }
      }
    },
  });

  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("common_settings");
  const { data: customerSettingsData } =
    useGetOptionsSettingsQuery("customer_settings");

  const { data: jobSettingData } = useGetOptionsSettingsQuery("job_settings");

  const validType = jobSettingData?.body?.jobPatternData?.map(
    (i) => i.shipmentType
  );

  useEffect(() => {
    if (
      optionsSettingsData?.body ||
      customerSettingsData?.body ||
      jobSettingData?.body
    ) {
      setDropdownData({
        ...optionsSettingsData?.body,
        ...customerSettingsData?.body,
        ...jobSettingData?.body,
      });
    }
  }, [optionsSettingsData, customerSettingsData]);

  const handleApproveRequest = async () => {
    setRejectError(false);
    try {
      setLoaderApprove((prevState) => ({
        ...prevState,
        approve: true,
      }));
      const response = await ApiManager.approveJobEntryRequest(
        initialValues.id,
        "JOB_DETAIL"
      );
      const message = response.message;
      nav("/app/documentation/jobEntry");
      toast.custom(<CustomToast message={message} toast="success" />, {
        closeButton: false,
      });
    } catch (error) {
      toast.custom(
        <CustomToast
          message="Error occurred while approve entry request"
          toast="error"
        />,
        {
          closeButton: false,
        }
      );
    }
    setLoaderApprove((prevState) => ({
      ...prevState,
      approve: false,
    }));
  };

  const handleRejectRequest = async () => {
    if (!formik.values.rejectRemarks) {
      setRejectError(true);
      toast.custom(
        <CustomToast message="Reject remarks to be filled!" toast="warn" />,
        {
          closeButton: false,
        }
      );
      return;
    }
    try {
      setLoaderApprove((prevState) => ({
        ...prevState,
        reject: true,
      }));
      const response = await ApiManager.rejectjobEntryApprove(
        initialValues.id,
        "JOB_DETAIL",
        formik.values.rejectRemarks
      );
      const message = response.message;
      nav("/app/documentation/jobEntry");

      toast.custom(<CustomToast message={message} toast="success" />, {
        closeButton: false,
      });
    } catch (error) {
      toast.custom(
        <CustomToast
          message="Error occurred while reject job entry request"
          toast="error"
        />,
        {
          closeButton: false,
        }
      );
    }
    setLoaderApprove((prevState) => ({
      ...prevState,
      reject: false,
    }));
  };
 console.log("formik.values.dateOfReceipt",formik.values.dateOfReceipt)
  const [isDisabled, setIsDisabled] = useState(false);
  const getPage = location?.pathname.split("/").slice(-1)[0];
  console.log("getPage",getPage)
  useEffect(() => {
    const shouldDisable =
      initialValues?.statusCode === -3 &&
      !(getPage === "newEntry" || getPage === "approveJobRequest");
    setIsDisabled(shouldDisable);
  }, [initialValues?.statusCode, getPage]);

  useEffect(() => {
    getFirstError(formik.errors);
  }, [formik.errors]);

  const customerNameRef = useRef(null);

  useEffect(() => {
    if (customerNameRef.current) {
      customerNameRef.current.focus();
    }
  }, []);

  const toggleRateModal = () => {
    settoggleRate((prev) => !prev);
  };

  const FieldRef = useRef(null);
  useEffect(() => {
    if (FieldRef.current) {
      FieldRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (shipmentTypeRef.current) {
      shipmentTypeRef.current.focus();
    }
  }, []);
  useEffect(() => {
    const selectedValue = formik.values.shipmentType;
    const jobPatternData = jobSettingData?.body?.jobPatternData || [];

    const validShipmentTypes = jobPatternData.map((i) => i.shipmentType);

    const generalCommonEntry = jobPatternData.find(
      (i) => i.shipmentType === "General/Common"
    );
    const generalCommonPattern = generalCommonEntry?.jobPattern;

    const isSelectedTypeValid = validShipmentTypes.includes(selectedValue);
    const isGeneralCommonMissing = !generalCommonEntry;
    const isGeneralCommonPatternEmpty = !generalCommonPattern;

    const shouldShowError =
      selectedValue &&
      !isSelectedTypeValid &&
      (isGeneralCommonMissing || isGeneralCommonPatternEmpty) &&
      getPage === "newEntry";

    if (shouldShowError) {
      // if (!toastRef.current) {
      setIsSelectedShipmentTypeValid(true);
      // toastRef.current =
      toast.custom(
        <CustomToast
          message={"Invalid shipment type selected."}
          toast="error"
        />,
        { closeButton: false }
      );
      // }
      formik.setFieldError("shipmentType", "Please contact the administrator.");
    } else {
      setIsSelectedShipmentTypeValid(false);
      formik.setFieldError("shipmentType", undefined);
    }
    // else {
    //   // Clear the error and dismiss toast if showing
    //   if (formik.errors.shipmentType === "Please contact the administrator.") {
    //     formik.setFieldError("shipmentType", undefined);

    //   }
    //   if (toastRef.current) {
    //     toast.dismiss(toastRef.current);
    //     toastRef.current = null;
    //   }
    // }
  }, [formik.values.shipmentType, jobSettingData]);
  console.log(page,"page")
  return (
    <>
      <Box sx={{ width: "100%", typography: "body1", margin: 0, padding: 0 }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            {type === "add" ? (
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab
                  label="Job Entry Details"
                  value="1"
                  sx={{
                    textTransform: "capitalize",
                    minHeight: "50px",
                  }}
                  icon={<EditIconForHeader />}
                  iconPosition="start"
                />
              </TabList>
            ) : (
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab
                  label="Job Entry Details"
                  value="1"
                  icon={<EditIconForHeader />}
                  iconPosition="start"
                  sx={{
                    textTransform: "capitalize",
                    minHeight: "50px",
                    fontSize: { xs: "0.8rem", sm: "1.125rem" },
                    padding: { xs: "5px", sm: "10px 16px"}
                  }}
                />

                <Tab
                  label="Document Details"
                  value="2"
                  icon={<DocumentIcon />}
                  iconPosition="start"
                  sx={{
                    textTransform: "capitalize",
                    minHeight: "50px",
                    fontSize: { xs: "0.8rem", sm: "1.125rem" },
                    padding: { xs: "5px", sm: "10px 16px"}
                  }}
                  disabled={isDisabled}
                />
                <Tab
                  label="Audit Logs"
                  value="3"
                  icon={<AuditIcon />}
                  iconPosition="start"
                  sx={{
                    textTransform: "capitalize",
                    minHeight: "50px",
                    fontSize: { xs: "0.8rem", sm: "1.125rem" },
                    padding: { xs: "5px", sm: "10px 16px"}
                  }}
                  disabled={isDisabled}
                />
              </TabList>
            )}
          </Box>

          <TabPanel value="1">
            <Grid container rowSpacing={2} columnSpacing={3}>
              <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
                <SelectShipment
                  label="Shipment Type*"
                  id="shipmentType"
                  options={optionsSettingsData?.body?.shipmentType}
                  value={formik.values.shipmentType}
                  error={formik.errors.shipmentType}
                  onChange={formik.handleChange}
                  disabled={getPage === "newEntry" ? false : true}
                  getPage={getPage}
                  inputRef={shipmentTypeRef}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
                <SelectBox
                  label="Move Type*"
                  id="moveType"
                  options={jobSettingData?.body.moveType}
                  value={formik.values.moveType}
                  error={formik.errors.moveType}
                  onChange={formik.handleChange}
                  disabled={getPage === "newEntry" ? false : true}
                  getPage={getPage}
                />
              </Grid>

                {(location?.pathname ===
                  "/app/documentation/jobEntry/newEntry" ||
                  location?.pathname ===
                    "/app/documentation/approveJobfile/approveJobRequest" ||
                  formik?.values?.createdBy === getUserId) && (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={6}
                    xl={2}
                    sx={{
                      display: "flex",
                      //justifyContent: "flex-end",
                      alignItems: "flex-start",
                    }}
                  >
                    <ThemeButton
                      onClick={() => toggleRateModal()}
                      sx={{
                        fontWeight: "500",
                        color: "white !important",
                        height: "44px",
                        padding: "5px 20px"
                      }}
                    >
                      Add Rate
                    </ThemeButton>
                  </Grid>
                )}

            </Grid>
            <Grid container rowSpacing={2} columnSpacing={3} marginTop={0}>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={2}
                xl={2}

              >
                <InputBox
                  label="MBL No.*"
                  id="mblNo"
                  value={formik.values.mblNo}
                  error={formik.errors.mblNo}
                  onChange={formik.handleChange}
                  disabled={isDisabled}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={2}
                xl={2}
              >
                <Tooltip
                  title={
                    !formik.values.customerName ? "Field is mandatory" : ""
                  }
                  arrow
                >
                  <FormAutoCompleteWithLoader
                    label="Customer Name*"
                    id="customerName"
                    value={formik.values.customerName}
                    error={formik.errors.customerName}
                    onChange={formik.handleChange}
                    inputRef={FieldRef}
                    suggestionName="customer_name"
                    disabled={isDisabled}
                  />
                </Tooltip>
              </Grid>
              <Grid
  item
  xs={12}
  sm={6}
  md={4}
  lg={2}
  xl={2}
>
  <FormAutoCompleteWithLoader
    label="PORT CODE*"
    id="portOfLoading"
    value={formik.values.portCode}
    error={formik.errors.portCode}
    onChange={formik.handleChange}
    suggestionName="port_code"
    disabled={page === "job-entry"}
  />
</Grid>
 <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={2}
                xl={2}

              >
                <DateTimeField
                  name="dateOfReceipt"
                  label="Date Of Receipt*"
                  id="dateOfReceipt"
                  value={formik.values.dateOfReceipt}
                  error={formik.errors.dateOfReceipt}
                  onChange={formik.setFieldValue}
                  inputRef={FieldRef}
                  disabled={isDisabled}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={2}
                xl={2}

              >
                <InputBox
                  label="HBL/SO NO."
                  id="hblNo"
                  value={formik.values.hblNo}
                  error={formik.errors.hblNo}
                  onChange={formik.handleChange}
                  disabled={isDisabled}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={2}
                xl={2}

              >
                <SelectBox
                  label="Cargo Type"
                  id="cargoType"
                  options={jobSettingData?.body.cargoType}
                  value={formik.values.cargoType}
                  error={formik.errors.cargoType}
                  onChange={formik.handleChange}
                  disabled={isDisabled}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={2}
                xl={2}

              >
                <InputBox
                  label="Customer Ref No."
                  id="customerRefNo"
                  value={formik.values.customerRefNo}
                  error={formik.errors.customerRefNo}
                  onChange={formik.handleChange}
                  disabled={isDisabled}
                />
              </Grid>

              {/* Select */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={2}
                xl={2}

              >
                <SelectBox
                  label="Type Of Cargo"
                  id="typeOfCargo"
                  options={jobSettingData?.body.typesOfCargo}
                  value={formik.values.typeOfCargo}
                  error={formik.errors.typeOfCargo}
                  onChange={formik.handleChange}
                  disabled={isDisabled}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={2}
                xl={2}

              >
                <InputBox
                  label="Invoice No."
                  id="invoiceNo"
                  value={formik.values.invoiceNo}
                  error={formik.errors.invoiceNo}
                  onChange={formik.handleChange}
                  disabled={isDisabled}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={2}
                xl={2}

              >
                <InputBox
                  label="Tansad No."
                  id="tansadNo"
                  value={formik.values.tansadNo}
                  error={formik.errors.tansadNo}
                  onChange={formik.handleChange}
                  disabled={isDisabled}
                />
              </Grid>

              {/* Date selection */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={2}
                xl={2}

              >
                <DateTimeField
                  name="entryTansadDate"
                  label="Entry/Tansad Date"
                  id="entryTansadDate"
                  value={formik.values.entryTansadDate}
                  error={formik.errors.entryTansadDate}
                  onChange={formik.setFieldValue}
                  inputRef={FieldRef}
                  disabled={isDisabled}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={2}
                xl={2}

              >
                <InputBox
                  label="Entry No."
                  id="entryNo"
                  value={formik.values.entryNo}
                  error={formik.errors.entryNo}
                  onChange={formik.handleChange}
                  disabled={isDisabled}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={2}
                xl={2}

              >
                <InputBox
                  label="Reference No."
                  id="refNo"
                  value={formik.values.refNo}
                  error={formik.errors.refNo}
                  onChange={formik.handleChange}
                  disabled={true}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={2}
                xl={2}

                display="flex"
                alignItems="center"
                gap={1}
              >
                <InputBox
                  label="File Manager"
                  id="fileManager"
                  value={formik.values.fileManager}
                  error={formik.errors.fileManager}
                  onChange={formik.handleChange}
                  disabled
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={2}
                xl={2}

              >
                <InputBox
                  label="Created By"
                  id="createdBy"
                  value={formik.values.createdBy}
                  error={formik.errors.createdBy}
                  onChange={formik.handleChange}
                  disabled
                />
              </Grid>

                {initialValues.statusCode == -2 ||
                initialValues.statusCode == 1 ? (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={2}
                  xl={2}

                >
                  <SelectBox
                    label="Status"
                    id="status"
                    options={optionsSettingsData?.body.status}
                    value={formik.values.status}
                    error={formik.errors.status}
                    onChange={formik.handleChange}
                  />
                </Grid>
              ) : (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={2}
                  xl={2}

                >
                  <InputBox
                    label="Status"
                    id="status"
                    disabled={true}
                    value={formik.values.status}
                    error={formik.errors.status}
                    onChange={formik.handleChange}
                  />
                </Grid>
              )}
{page === "job-entry" && formik.values.statusCode === -1 ? (
  <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
    <SelectBox
      label="Account Type*"
      id="accountType"
      options={optionsSettingsData?.body?.account_type}
      value={formik.values.accountType}
      error={formik.errors.accountType}
      onChange={formik.handleChange}
      disabled={true} 
    />
  </Grid>
) : (
  <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
    <SelectBox
      label="Account Type*"
      id="accountType"
      options={optionsSettingsData?.body?.account_type}
      value={formik.values.accountType}
      error={formik.errors.accountType}
      onChange={formik.handleChange}
    />
  </Grid>
)}



              <Grid item xs={12}>
                <Box
                  sx={{
                    borderBottom: 1,
                    border: "1px solid #0000001f",
                    borderRadius: "10px",
                    marginTop: "10px",
                  }}
                >
                  <CommonTabForm formik={formik} dropdownData={dropdownData} />
                </Box>
              </Grid>

              {formik?.values?.status?.toLowerCase() === "rejected" ||
              page == "jobApprove" ? (
                <Grid item xs={12} paddingLeft={1} paddingTop={1}>
                  <TextField
                    label="Reject Remarks"
                    name="rejectRemarks"
                    value={formik.values.rejectRemarks}
                    error={rejectError}
                    helperText={
                      rejectError
                        ? "Reject remarks are required when rejecting a customer*."
                        : formik.errors.rejectRemarks
                    }
                    onChange={formik.handleChange}
                    disabled={page === "job-entry" ? true : false}
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                      },
                    }}
                  />
                </Grid>
              ) : (
                <></>
              )}

              {/* Buttons */}
              {page == "job-entry" ? (
                <Grid item xs={12}>
                  <Stack
                    direction="row"
                    spacing={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" spacing={2}>
                      <OutlinedButton
                        sx={{ fontWeight: "500" }}
                        onClick={() => nav(-1)}
                      >
                        Close
                      </OutlinedButton>

                      {!initialValues?.id ? (
                        <ThemeButton
                          onClick={formik.handleSubmit}
                          sx={{
                            fontWeight: "500",
                            color: "white !important",
                          }}
                        >
                          {isLoading && (
                            <CircularProgress size={20} color="white" />
                          )}
                          Submit
                        </ThemeButton>
                      ) : (
                        <ThemeButton
                          onClick={formik.handleSubmit}
                          sx={{
                            fontWeight: "500",
                            color: "white !important",
                          }}
                          disabled={isDisabled}
                        >
                          {isLoading && (
                            <CircularProgress size={20} color="white" />
                          )}
                          Update
                        </ThemeButton>
                      )}

                      {/* Update Job Button */}
                    </Stack>
                  </Stack>
                </Grid>
              ) : (
                <Grid item xs={12} sx={{ margin: 1 }}>
                  <Stack
                    direction="row"
                    spacing={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" spacing={2}>
                      <OutlinedButton
                        sx={{ fontWeight: "500" }}
                        onClick={() => nav(-1)}
                      >
                        Close
                      </OutlinedButton>

                      <ThemeButton
                        onClick={formik.handleSubmit}
                        sx={{
                          fontWeight: "500",
                          color: "white !important",
                        }}
                      >
                        {isLoading && (
                          <CircularProgress size={20} color="white" />
                        )}
                        Update
                      </ThemeButton>

                      <ThemeButton
                        sx={{
                          fontWeight: "500",
                          backgroundColor: "red",
                          color: "white !important",
                        }}
                        onClick={() => handleRejectRequest()}
                      >
                        {loaderApprove.reject && (
                          <CircularProgress size={20} color="white" />
                        )}
                        Reject
                      </ThemeButton>
                      <ThemeButton
                        sx={{ fontWeight: "500", color: "white !important" }}
                        onClick={() => handleApproveRequest()}
                      >
                        {loaderApprove.approve && (
                          <CircularProgress size={20} color="white" />
                        )}
                        Approve
                      </ThemeButton>

                      {/* Update Job Button */}
                    </Stack>
                  </Stack>
                </Grid>
              )}

              <PopupAlert alertConfig={alertConfig} />
            </Grid>
          </TabPanel>

          <TabPanel value="2" sx={{ padding: "0px" }}>
            <UploadFile
              customer_id={initialValues.id}
              disabled={isDisabled}
              dropdownData={dropdownData.jobDocumentType}
              sourceType="JOB_DETAIL"
            />
          </TabPanel>

          <TabPanel value="3" sx={{ padding: "0px" }}>
            <AuditTimeLine
              id={initialValues.id}
              page="job-detail"
              service={menuConfigUrl.document}
            />
          </TabPanel>
        </TabContext>
      </Box >
      {toggleRate && (
      <AddRateModal
        formik={formik}
        toggleRate={toggleRate}
        toggleRateModal={toggleRateModal}
        disabled={isDisabled}
      />
      )}
    </>
  );
}
