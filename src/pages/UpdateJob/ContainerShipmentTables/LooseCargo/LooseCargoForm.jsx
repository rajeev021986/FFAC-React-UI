import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import toast from "react-hot-toast";

import { CircularProgress, Modal, Button, IconButton } from "@mui/material";
import { Stack, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CloseIcon from "@mui/icons-material/Close";

import { useGetOptionsSettingsQuery } from "../../../../store/api/settingsApi";
import CustomToast from "../../../../components/common/Toast/CustomToast";
import getFirstError from "../../../../components/common/FieldToastError";
import EditIconForHeader from "../../../../components/common/commonIcons/EditIcons/EditIconForHeader";

// API's
import { useUpdateLooseCargoNumberMutation } from "../../../../store/api/containerApi";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// Components
import {
  OutlinedButton,
  ThemeButton,
} from "../../../../components/common/Button";
import InputBox from "../../../../components/common/InputBox";
import DateTimeField from "../../../../components/common/DateTime/DateTimeField";
import UploadFile from "../../../../components/UploadFile";
import ApiManager from "../../../../services/ApiManager";
import FormAutoComplete from "../../../../components/common/AutoComplete/FormAutoComplete";
import { LooseCargoValidationSchema } from "./LooseCargoValidationSchema";
import SelectBox from "../../../../components/common/SelectBox";
import DocumentIcon from "../../../../components/common/commonIcons/DocumentIcons/DocumentIcon";
import AuditIcon from "../../../../components/common/commonIcons/AuditIcon/AuditIcon";
import AuditTimeLine from "../../../../components/AuditTimeLine";
import { menuConfigUrl } from "../../../../store/menuConfigUrl";

export default function LooseCargoForm({
  page,
  onCancel,
  onSubmit,
  looseCargoId,
  bondDetails,
}) {
  const [updateLooseCargoNumber, { isLoading }] =
    useUpdateLooseCargoNumberMutation();
  const { data: jobSettingData } = useGetOptionsSettingsQuery("job_settings");

  const [dropdownData, setDropdownData] = useState({});
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();
  const [value, setValue] = React.useState("1");

  const [alertConfig, setAlertConfig] = useState({
    open: false,
    title: "",
    message: "",
    severity: "info",
    onConfirm: null,
    onClose: () => setAlertConfig({ ...alertConfig, open: false }),
  });

  const [open, setOpen] = useState(false);
  const [SourceType, setSourceType] = useState("");
  const handleClose = () => setOpen(false);
  const handleOpen = (type) => {
    setSourceType(type);
    setOpen(true);
  };

  const [initialValues, setInitialValues] = React.useState({
    transporterId: "",
    transporter: "",
    truckTrailerNo: "",
    truckNo: "",
    driver: "",
    agreedRate: "",
    telNo: "",
    passportNo: "",
    licenceNo: "",
    clerkId: "",
    clerkName: "",
    clerkTelNo: "",
    reportingPlace: "",
    reportingDate: "",
    reportingTime: "",
    transferDate: "",
    t1C1ReadyDate: "",
    loadingDate: "",
    cancellationDate: "",
    arrivalBorderDate: "",
    crossedBorderDate: "",
    arrivalICDDate: "",
    cargoReleaseDate: "",
    departICDDate: "",
    bondNumber: "",
    bondAmount: "",
    arrivalCustomerPlaceDate: "",
    remark: "",
  });

  const fetchContainerNumbers = async () => {
    try {
      const res = await ApiManager.getLooseCargoById(looseCargoId);
      let status = "";
      if (res.body?.status) {
        status =
          res.body?.status.charAt(0).toUpperCase() +
          res.body?.status.slice(1).toLowerCase();
      }
      setInitialValues({
        id: res.body?.id || "",
        status: status,
        truckNo: res.body?.truckNo,
        transporterId: res.body?.transporterId,
        transporter: res?.body?.transporter || res?.body?.transporterName,
        truckTrailerNo: res.body?.truckTrailerNo,
        driver: res.body?.driver,
        agreedRate: res.body?.agreedRate,
        telNo: res.body?.telNo,
        passportNo: res.body?.passportNo,
        licenceNo: res.body?.licenceNo,
        clerkId: res.body?.clerkId,
        clerkName: res?.body?.clerkName,
        clerkTelNo: res.body?.clerkTelNo,
        reportingPlace: res.body?.reportingPlace,
        reportingDate: res.body?.reportingDate,
        reportingTime: res.body?.reportingTime,
        transferDate: res.body?.transferDate,
        t1C1ReadyDate: res.body?.t1C1ReadyDate,
        loadingDate: res.body?.loadingDate,
        cancellationDate: res.body?.cancellationDate,
        arrivalBorderDate: res.body?.arrivalBorderDate,
        crossedBorderDate: res.body?.crossedBorderDate,
        arrivalICDDate: res.body?.arrivalICDDate,
        cargoReleaseDate: res.body?.cargoReleaseDate,
        departICDDate: res.body?.departICDDate,
        bondNumber: res.body?.bondNumber,
        bondAmount: res.body?.bondAmount,
        arrivalCustomerPlaceDate: res.body?.arrivalCustomerPlaceDate,
        remark: res.body?.remark,
      });
      setLoading(false);
    } catch (error) {
      toast.custom(
        <CustomToast
          message="Error occurred while loading form"
          toast="error"
        />,
        {
          closeButton: false,
        }
      );
    }
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: LooseCargoValidationSchema(),
    onSubmit: async (values) => {
      try {
        values.statusCode = dropdownData?.approvalRequest ? 0 : 1;
        values.status = "";
        let response = await updateLooseCargoNumber({
          ...values,
        }).unwrap();
        const message = response.message;
        if (response.code === "SUCCESS") {
          toast.custom(<CustomToast message={message} toast="success" />, {
            closeButton: false,
          });
          if (onSubmit) {
            onSubmit();
          } else {
            nav(-1);
          }
        } else {
          toast.custom(<CustomToast message={message} toast="error" />, {
            closeButton: false,
          });
        }
      } catch (error) {
        if (error.status === 409) {
          const message = error.data.message;
          toast.custom(<CustomToast message={message} toast="error" />, {
            closeButton: false,
          });
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
    },
  });

  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("common_settings");
  const { data: customerSettingsData } =
    useGetOptionsSettingsQuery("customer_settings");

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

  const customerNameRef = useRef(null);
  useEffect(() => {
    if (customerNameRef.current) {
      customerNameRef.current.focus();
    }
  }, []);

  const FieldRef = useRef(null);
  useEffect(() => {
    if (FieldRef.current) {
      FieldRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (looseCargoId) {
      fetchContainerNumbers();
    } else {
      setLoading(false);
    }
  }, [looseCargoId]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1200,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Box sx={{ width: "100%", typography: "body1", margin: 0, padding: 0 }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={(event, newValue) => {
                setValue(newValue); // <-- this updates the tab
              }}
              aria-label="lab API tabs example"
              sx={{ paddingBottom: "20px" }}
            >
              <Tab
                label="Update Loose Cargo Details"
                value="1"
                sx={{
                  textTransform: "capitalize",
                  minHeight: "50px",
                }}
                icon={<EditIconForHeader />}
                iconPosition="start"
              />
              <Tab
                label="Document Details"
                value="2"
                icon={<DocumentIcon />}
                iconPosition="start"
                sx={{
                  textTransform: "capitalize",
                  minHeight: "50px",
                }}
              />
              <Tab
                label="Audit Logs"
                value="3"
                icon={<AuditIcon />}
                iconPosition="start"
                sx={{
                  textTransform: "capitalize",
                  minHeight: "50px",
                }}
              />
            </TabList>
          </Box>

          <TabPanel value="1" sx={{ padding: "0px" }}>
            <Grid container sx={{ marginTop: 3, padding: 0, paddingRight: 1 }}>
              <Grid paddingLeft={1} marginTop={2} container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <FormAutoComplete
                    label="Transporter"
                    id="transporter"
                    suggestionName="vendor_name"
                    idKey="transporterId"
                    nameKey="transporter"
                    // value={formik.values.transporterId}
                    value={{
                      transporterId: formik.values.transporterId,
                      transporter: formik.values.transporter,
                    }}
                    onChange={(selected) => {
                      // formik.setFieldValue(
                      //   "transporterId",
                      //   selected.transporterId
                      // );
                      formik.setFieldValue("transporter", selected.transporter);
                    }}
                    error={formik.errors.transporterId}
                    // onChange={formik.handleChange}
                  ></FormAutoComplete>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <InputBox
                    label="TruckTrailer No."
                    id="truckTrailerNo"
                    value={formik.values.truckTrailerNo}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <InputBox
                    label="Driver"
                    id="driver"
                    value={formik.values.driver}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <InputBox
                    label="AgreedRate"
                    id="agreedRate"
                    value={formik.values.agreedRate}
                    onChange={formik.handleChange}
                  />
                </Grid>
              </Grid>

              <Grid paddingLeft={1} marginTop={2} container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <InputBox
                    label="Tel No."
                    id="telNo"
                    value={formik.values.telNo}
                    error={formik.errors.telNo}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <InputBox
                    label="Passport No."
                    id="passportNo"
                    value={formik.values.passportNo}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <InputBox
                    label="License No."
                    id="licenceNo"
                    value={formik.values.licenceNo}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <FormAutoComplete
                    label="Clerk Name"
                    id="clerkId"
                    suggestionName="first_name"
                    // value={formik.values.clerkId}
                    value={{
                      clerkId: formik.values.clerkId,
                      clerkName: formik.values.clerkName,
                    }}
                    idKey="clerkId"
                    nameKey="clerkName"
                    error={formik.errors.clerkId}
                    // onChange={formik.handleChange}
                    onChange={(selected) => {
                      formik.setFieldValue("clerkId", selected.clerkId);
                      formik.setFieldValue("clerkName", selected.clerkName);
                    }}
                  />
                </Grid>
              </Grid>

              <Grid paddingLeft={1} marginTop={2} container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <InputBox
                    label="Clerk Tel No."
                    id="clerkTelNo"
                    value={formik.values.clerkTelNo}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <SelectBox
                    label="Reporting Place"
                    id="reportingPlace"
                    options={jobSettingData?.body.reportingPlace}
                    value={formik.values.reportingPlace}
                    error={formik.errors.reportingPlace}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <DateTimeField
                    label="Reporting Date"
                    name="reportingDate"
                    id="reportingDate"
                    value={formik.values.reportingDate}
                    error={formik.errors.reportingDate}
                    onChange={formik.setFieldValue}
                    inputRef={FieldRef}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <InputBox
                    label="TruckNo."
                    id="truckNo"
                    value={formik.values.truckNo}
                    onChange={formik.handleChange}
                    disabled
                  />
                </Grid>
              </Grid>

              <Grid paddingLeft={1} marginTop={2} container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <DateTimeField
                    label="Transfer Date"
                    name="transferDate"
                    id="transferDate"
                    value={formik.values.transferDate}
                    error={formik.errors.transferDate}
                    onChange={formik.setFieldValue}
                    inputRef={FieldRef}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      "&:hover": {
                        borderColor: "#000",
                      },
                      "&:focus-within": {
                        borderColor: " #166de0",
                        borderWidth: "2px",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none", // hides MUI default border
                        borderRight: "1px solid #ccc",
                      },

                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#041238", // border color on hover
                      },

                      "& .MuiInputLabel-root": {
                        backgroundColor: "#fff",
                        paddingRight: "5px",
                        maxWidth: "calc(100% - 57px)",
                      },
                      "& .css-1uf3ruz-MuiFormControl-root-MuiTextField-root .MuiInputBase-root":
                        {
                          borderRadius: "0",
                          height: "39px",
                        },
                    }}
                  >
                    <DateTimeField
                      label="T1/C1 Ready"
                      name="t1C1ReadyDate"
                      id="t1C1ReadyDate"
                      value={formik.values.t1C1ReadyDate}
                      error={formik.errors.t1C1ReadyDate}
                      onChange={formik.setFieldValue}
                      inputRef={FieldRef}
                    />
                    <IconButton
                      color="primary"
                      aria-label="upload"
                      onClick={() =>
                        formik.values.t1C1ReadyDate &&
                        handleOpen("t1C1Ready_Date")
                      }
                      style={{
                        cursor: formik.values.t1C1ReadyDate
                          ? "pointer"
                          : "not-allowed",
                        color: formik.values.t1C1ReadyDate ? "#1976d2" : "#999",
                        textDecoration: formik.values.t1C1ReadyDate
                          ? "underline"
                          : "none",
                        pointerEvents: formik.values.t1C1ReadyDate
                          ? "auto"
                          : "none",
                      }}
                    >
                      <CloudUploadIcon />
                    </IconButton>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <DateTimeField
                    label="Loading Date"
                    name="loadingDate"
                    id="loadingDate"
                    value={formik.values.loadingDate}
                    error={formik.errors.loadingDate}
                    onChange={formik.setFieldValue}
                    inputRef={FieldRef}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <InputBox
                    label="Bond Number"
                    id="bondNumber"
                    value={formik.values.bondNumber || ""}
                    onChange={formik.handleChange}
                  />
                </Grid>
              </Grid>

              <Grid paddingLeft={1} marginTop={2} container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <InputBox
                    label="Bond Amount"
                    id="bondAmount"
                    value={formik.values.bondAmount}
                    onChange={formik.handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <DateTimeField
                    label="Cancellation Date"
                    name="cancellationDate"
                    id="cancellationDate"
                    value={formik.values.cancellationDate}
                    error={formik.errors.cancellationDate}
                    onChange={formik.setFieldValue}
                    inputRef={FieldRef}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <DateTimeField
                    label="Arrival Border"
                    name="arrivalBorderDate"
                    id="arrivalBorderDate"
                    value={formik.values.arrivalBorderDate}
                    error={formik.errors.arrivalBorderDate}
                    onChange={formik.setFieldValue}
                    inputRef={FieldRef}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <DateTimeField
                    label="Crossed Border"
                    name="crossedBorderDate"
                    id="crossedBorderDate"
                    value={formik.values.crossedBorderDate}
                    error={formik.errors.crossedBorderDate}
                    onChange={formik.setFieldValue}
                    inputRef={FieldRef}
                  />
                </Grid>
              </Grid>

              <Grid paddingLeft={1} marginTop={2} container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <DateTimeField
                    label="Arrival ICD"
                    name="arrivalICDDate"
                    id="arrivalICDDate"
                    value={formik.values.arrivalICDDate}
                    error={formik.errors.arrivalICDDate}
                    onChange={formik.setFieldValue}
                    inputRef={FieldRef}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      "&:hover": {
                        borderColor: "#000",
                      },
                      "&:focus-within": {
                        borderColor: " #166de0",
                        borderWidth: "2px",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none", // hides MUI default border
                        borderRight: "1px solid #ccc",
                      },

                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#041238", // border color on hover
                      },

                      "& .MuiInputLabel-root": {
                        backgroundColor: "#fff",
                        paddingRight: "5px",
                        maxWidth: "calc(100% - 57px)",
                      },
                      "& .css-1uf3ruz-MuiFormControl-root-MuiTextField-root .MuiInputBase-root":
                        {
                          borderRadius: "0",
                          height: "39px",
                        },
                    }}
                  >
                    <DateTimeField
                      label="Cargo Release Date"
                      name="cargoReleaseDate"
                      id="cargoReleaseDate"
                      value={formik.values.cargoReleaseDate}
                      error={formik.errors.cargoReleaseDate}
                      onChange={formik.setFieldValue}
                      inputRef={FieldRef}
                    />
                    <IconButton
                      color="primary"
                      aria-label="upload"
                      onClick={() =>
                        formik.values.cargoReleaseDate &&
                        handleOpen("cargoRelease_Date")
                      }
                      style={{
                        cursor: formik.values.cargoReleaseDate
                          ? "pointer"
                          : "not-allowed",
                        color: formik.values.cargoReleaseDate
                          ? "#1976d2"
                          : "#999",
                        textDecoration: formik.values.cargoReleaseDate
                          ? "underline"
                          : "none",
                        pointerEvents: formik.values.cargoReleaseDate
                          ? "auto"
                          : "none",
                      }}
                    >
                      <CloudUploadIcon />
                    </IconButton>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <DateTimeField
                    label="Depart ICD"
                    name="departICDDate"
                    id="departICDDate"
                    value={formik.values.departICDDate}
                    error={formik.errors.departICDDate}
                    onChange={formik.setFieldValue}
                    inputRef={FieldRef}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <DateTimeField
                    label="Arrival Customer Place"
                    name="arrivalCustomerPlaceDate"
                    id="arrivalCustomerPlaceDate"
                    value={formik.values.arrivalCustomerPlaceDate}
                    error={formik.errors.arrivalCustomerPlaceDate}
                    onChange={formik.setFieldValue}
                    inputRef={FieldRef}
                  />
                </Grid>
              </Grid>

              <Grid paddingLeft={1} marginTop={2} container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                  <InputBox
                    label="Remarks"
                    id="remark"
                    multiline
                    minRows={4}
                    value={formik.values.remark}
                    onChange={formik.handleChange}
                  />
                </Grid>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value="2" sx={{ padding: "0px" }}>
            <UploadFile
              customer_id={looseCargoId}
              disabled={false}
              dropdownData={dropdownData.jobDocumentType}
              sourceType="JOB_LOOSE_CARGO"
              showDocmentType ='true'
              
            />
          </TabPanel>
          <TabPanel value="3" sx={{ padding: "0px" }}>
            <AuditTimeLine
              id={looseCargoId}
              page="job-update/loose-cargo"
              service={menuConfigUrl.document}
            />
          </TabPanel>
        </TabContext>

        {page === "looseShipment" && value == "1" && (
          <Grid
            paddingLeft={3}
            marginTop={2}
            marginBottom={2}
            container
            spacing={2}
          >
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
                  onClick={() => {
                    if (onCancel) {
                      onCancel();
                    } else {
                      nav(-1);
                    }
                  }}
                >
                  Close
                </OutlinedButton>
                <ThemeButton
                  onClick={async () => {
                    const errors = await formik.validateForm();

                    if (Object.keys(errors).length > 0) {
                      formik.setTouched(
                        Object.fromEntries(
                          Object.keys(errors).map((key) => [key, true])
                        ),
                        true
                      );
                      getFirstError(errors);
                    } else {
                      formik.handleSubmit();
                    }
                  }}
                  sx={{
                    fontWeight: "500",
                    color: "white !important",
                  }}
                >
                  {isLoading && <CircularProgress size={20} color="white" />}
                  Submit
                </ThemeButton>
              </Stack>
            </Stack>
          </Grid>
        )}
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Button
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 10,
              right: 8,
              color: "red",
              backgroundColor: "transparent",
            }}
          >
            <CloseIcon color="red" />
          </Button>
          <UploadFile
            customer_id={formik?.initialValues.id}
            isNotShowType={true}
            sourceType={"JOB_LOOSE_CARGO"}
            type={SourceType}
            disabled={false}
            showDocmentType ='true'
            
          />
        </Box>
      </Modal>
    </>
  );
}
