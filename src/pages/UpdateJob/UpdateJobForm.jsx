import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  CircularProgress,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Stack, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Modal, Button } from "@mui/material";
import { useGetOptionsSettingsQuery } from "../../store/api/settingsApi";
import CustomToast from "../../components/common/Toast/CustomToast";
import getFirstError from "../../components/common/FieldToastError";
import EditIconForHeader from "../../components/common/commonIcons/EditIcons/EditIconForHeader";
import { useUpdateJobDetailsEntryMutation } from "../../store/api/jobEntryApi";

// Components
import { OutlinedButton, ThemeButton } from "../../components/common/Button";
import InputBox from "../../components/common/InputBox";
import PopupAlert from "../../components/common/Alert/PopupAlert";
import BondDetailsGridForm from "./UpdateJobEntryGrid";
import DateTimeField from "../../components/common/DateTime/DateTimeField";
import UploadFile from "../../components/UploadFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// Container Table
import ContainerShipmentView from "./ContainerShipmentTables/ShipmentContainer/ContainerShipmentView";
import VehicleShipmentView from "./ContainerShipmentTables/Vehicle/VehicleShipmentView";
import LooseShipmentView from "./ContainerShipmentTables/LooseCargo/LooseCargoShipmentView";

export default function UpdateForm({ initialValues, page, type = "notcopy" }) {
  const [updateJobDetailsEntry, { isLoading }] =
    useUpdateJobDetailsEntryMutation();
  const [dropdownData, setDropdownData] = useState({});
  const nav = useNavigate();
  const [detailTab, setdetailTab] = useState("1");
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setdetailTab(newValue);
    localStorage.setItem("tab", newValue);
  };

  const localTabValue = localStorage.getItem("tab");
  useEffect(() => {
    if (localTabValue) {
      setdetailTab(localTabValue);
    }
  }, [localTabValue]);

  const [open, setOpen] = useState(false);
  const [SourceType, setSourceType] = useState("");
  const handleOpen = (type) => {
    setSourceType(type);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
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
    onSubmit: async (values) => {
      if (isLoading) {
        return;
      }
      let bondData = values.bondDetails.map((item) =>
        item?.new ? { ...item, id: null, new: false } : item
      );
      try {
        values.statusCode = dropdownData?.approvalRequest ? 0 : 1;
        values.status = "";
        let response = await updateJobDetailsEntry({
          ...values,
          bondDetails: bondData,
        }).unwrap();
        const message = response.message;
        if (response.code == "SUCCESS") {
          toast.custom(<CustomToast message={message} toast="success" />, {
            closeButton: false,
          });
          nav("/app/documentation/update/job");
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
    if (optionsSettingsData?.body || customerSettingsData?.body) {
      setDropdownData({
        ...optionsSettingsData?.body,
        ...customerSettingsData?.body,
      });
    }
  }, [optionsSettingsData, customerSettingsData]);

  const disabled = page == "update-job" ? false : true;

  useEffect(() => {
    getFirstError(formik.errors);
  }, [formik.errors]);

  const customerNameRef = useRef(null);
  useEffect(() => {
    if (customerNameRef.current) {
      customerNameRef.current.focus();
    }
  }, []);

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

  const FieldRef = useRef(null);
  useEffect(() => {
    if (FieldRef.current) {
      FieldRef.current.focus();
    }
  }, []);

  return (
    <>
      <Box sx={{ width: "100%", typography: "body1", margin: 0, padding: 0 }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              // onChange={handleChange}
              aria-label="lab API tabs example"
              sx={{ paddingBottom: "20px" }}
            >
              <Tab
                label="Update Job Details"
                value="1"
                sx={{
                  textTransform: "capitalize",
                  minHeight: "50px",
                }}
                icon={<EditIconForHeader />}
                iconPosition="start"
              />
            </TabList>
          </Box>

          <TabPanel value="1" sx={{ padding: "0px" }}>
            <Grid container sx={{ margin: 0, padding: 0, paddingRight: 1 }}>
              <AppBar
                position="static"
                sx={{ minHeight: "40px", borderRadius: "5px" }}
              >
                <Toolbar
                  sx={{
                    minHeight: "40px !important",
                    px: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    borderRadius: "8px !important",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Typography variant="body1">
                      <strong>JOB NO: </strong> {formik.values.jobNo}
                    </Typography>
                    {/* <Typography variant="body1">
                      <strong>MBL NO: </strong> {formik.values.mblNo}
                    </Typography> */}
                    <Typography variant="body1">
                      <strong>Customer: </strong> {formik.values.customer}
                    </Typography>
                  </Box>
                </Toolbar>
              </AppBar>

              <Grid paddingLeft={1} marginTop={2} container spacing={2}>
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
                      label="Line DO Collection Doc"
                      name="shippingLineDOCollectionDate"
                      id="shippingLineDOCollectionDate"
                      value={formik.values.shippingLineDOCollectionDate}
                      error={formik.errors.shippingLineDOCollectionDate}
                      onChange={formik.setFieldValue}
                      inputRef={FieldRef}
                    />
                    <IconButton
                      color="primary"
                      aria-label="upload"
                      onClick={() =>
                        formik.values.shippingLineDOCollectionDate &&
                        handleOpen("shipping_Line")
                      }
                      style={{
                        cursor: formik.values.shippingLineDOCollectionDate
                          ? "pointer"
                          : "not-allowed",
                        color: formik.values.shippingLineDOCollectionDate
                          ? "#1976d2"
                          : "#999",
                        textDecoration: formik.values
                          .shippingLineDOCollectionDate
                          ? "underline"
                          : "none",
                        pointerEvents: formik.values
                          .shippingLineDOCollectionDate
                          ? "auto"
                          : "none",
                      }}
                    >
                      <CloudUploadIcon />
                    </IconButton>
                  </Box>
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
                      label="Custom Release Doc"
                      name="customReleaseDate"
                      id="customReleaseDate"
                      value={formik.values.customReleaseDate}
                      error={formik.errors.customReleaseDate}
                      onChange={formik.setFieldValue}
                      inputRef={FieldRef}
                    />
                    <IconButton
                      color="primary"
                      aria-label="upload"
                      onClick={() =>
                        formik.values.customReleaseDate &&
                        handleOpen("custom_ReleaseDate")
                      }
                      style={{
                        cursor: formik.values.customReleaseDate
                          ? "pointer"
                          : "not-allowed",
                        color: formik.values.customReleaseDate
                          ? "#1976d2"
                          : "#999",
                        textDecoration: formik.values.customReleaseDate
                          ? "underline"
                          : "none",
                        pointerEvents: formik.values.customReleaseDate
                          ? "auto"
                          : "none",
                      }}
                    >
                      <CloudUploadIcon />
                    </IconButton>
                  </Box>
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
                      label="TAX Exemption Certificate Doc"
                      name="taxExemptionCertificateDate"
                      id="taxExemptionCertificateDate"
                      value={formik.values.taxExemptionCertificateDate}
                      error={formik.errors.taxExemptionCertificateDate}
                      onChange={formik.setFieldValue}
                      inputRef={FieldRef}
                    />
                    <IconButton
                      color="primary"
                      aria-label="upload"
                      onClick={() =>
                        formik.values.taxExemptionCertificateDate &&
                        handleOpen("tax_Exemption_Certificate_Date")
                      }
                      style={{
                        cursor: formik.values.taxExemptionCertificateDate
                          ? "pointer"
                          : "not-allowed",
                        color: formik.values.taxExemptionCertificateDate
                          ? "#1976d2"
                          : "#999",
                        textDecoration: formik.values
                          .taxExemptionCertificateDate
                          ? "underline"
                          : "none",
                        pointerEvents: formik.values.taxExemptionCertificateDate
                          ? "auto"
                          : "none",
                      }}
                    >
                      <CloudUploadIcon />
                    </IconButton>
                  </Box>
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
                        border: "none",
                        borderRight: "1px solid #ccc",
                      },

                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#041238",
                      },

                      "& .MuiInputLabel-root": {
                        backgroundColor: "#fff",
                        paddingRight: "5px",
                        maxWidth: "calc(100% - 57px)",
                      },
                      "& .css-6gn99m-MuiFormControl-root-MuiTextField-root .MuiInputBase-root":
                        {
                          borderRadius: "0 !important",
                          height: "39px",
                        },
                    }}
                  >
                    <InputBox
                      label="Pick Up Order"
                      id="pickUpOrder"
                      value={formik.values.pickUpOrder}
                      error={formik.errors.pickUpOrder}
                      onChange={formik.handleChange}
                      disabled={disabled}
                    />
                    <IconButton
                      color="primary"
                      aria-label="upload"
                      onClick={() =>
                        formik.values.pickUpOrder && handleOpen("pickUpOrder")
                      }
                      style={{
                        cursor: formik.values.pickUpOrder
                          ? "pointer"
                          : "not-allowed",
                        color: formik.values.pickUpOrder ? "#1976d2" : "#999",
                        textDecoration: formik.values.pickUpOrder
                          ? "underline"
                          : "none",
                        pointerEvents: formik.values.pickUpOrder
                          ? "auto"
                          : "none",
                      }}
                    >
                      <CloudUploadIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>

              <Grid paddingLeft={1} marginTop={2} container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <InputBox
                    label="BT Number"
                    id="btNumber"
                    value={formik.values.btNumber}
                    error={formik.errors.btNumber}
                    onChange={formik.handleChange}
                    disabled={disabled}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <InputBox
                    label="IDF No."
                    id="idfNo"
                    value={formik.values.idfNo}
                    disabled={disabled}
                    error={formik.errors.idfNo}
                    onChange={formik.handleChange}
                    inputRef={customerNameRef}
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
                      label="IDF Doc"
                      name="idfDate"
                      id="idfDate"
                      value={formik.values.idfDate}
                      error={formik.errors.idfDate}
                      onChange={formik.setFieldValue}
                      inputRef={FieldRef}
                    />
                    <IconButton
                      color="primary"
                      aria-label="upload"
                      onClick={() =>
                        formik.values.idfDate && handleOpen("idf_Date")
                      }
                      style={{
                        cursor: formik.values.idfDate
                          ? "pointer"
                          : "not-allowed",
                        color: formik.values.idfDate ? "#1976d2" : "#999",
                        textDecoration: formik.values.idfDate
                          ? "underline"
                          : "none",
                        pointerEvents: formik.values.idfDate ? "auto" : "none",
                      }}
                    >
                      <CloudUploadIcon />
                    </IconButton>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <InputBox
                    label="Entry Loadged Ref."
                    id="entryLoadgedRef"
                    value={formik.values.entryLoadgedRef}
                    error={formik.errors.entryLoadgedRef}
                    onChange={formik.handleChange}
                    disabled={disabled}
                  />
                </Grid>
              </Grid>

              <Grid paddingLeft={1} marginTop={2} container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <DateTimeField
                    label="Entry Loadged Ref. Date"
                    name="entryLoadgedDate"
                    id="entryLoadgedDate"
                    value={formik.values.entryLoadgedDate}
                    error={formik.errors.entryLoadgedDate}
                    onChange={formik.setFieldValue}
                    inputRef={FieldRef}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <InputBox
                    label="Entry No."
                    id="entryNo"
                    value={formik.values.entryNo}
                    error={formik.errors.entryNo}
                    onChange={formik.handleChange}
                    disabled={disabled}
                    inputRef={customerNameRef}
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
                      label="Shipping Line DO Collection Doc"
                      name="entryDate"
                      id="entryDate"
                      value={formik.values.entryDate}
                      error={formik.errors.entryDate}
                      onChange={formik.setFieldValue}
                      inputRef={FieldRef}
                    />
                    <IconButton
                      color="primary"
                      aria-label="upload"
                      onClick={() =>
                        formik.values.entryDate && handleOpen("entry_Date")
                      }
                      style={{
                        cursor: formik.values.entryDate
                          ? "pointer"
                          : "not-allowed",
                        color: formik.values.entryDate ? "#1976d2" : "#999",
                        textDecoration: formik.values.entryDate
                          ? "underline"
                          : "none",
                        pointerEvents: formik.values.entryDate
                          ? "auto"
                          : "none",
                      }}
                    >
                      <CloudUploadIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
              <PopupAlert alertConfig={alertConfig} />
            </Grid>
          </TabPanel>
        </TabContext>

        <Grid container sx={{ margin: 0, paddingLeft: 1, paddingRight: 1 }}>
          <BondDetailsGridForm formik={formik} dropdownData={dropdownData} />
        </Grid>

        {page === "update-job" && (
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
                  {isLoading && <CircularProgress size={20} color="white" />}
                  Submit
                </ThemeButton>
              </Stack>
            </Stack>
          </Grid>
        )}

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
              customer_id={initialValues.id}
              isNotShowType={true}
              sourceType={"JOB_DETAIL"}
              type={SourceType}
            />
          </Box>
        </Modal>

        <hr />

        <TabContext value={detailTab}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", paddingTop: 2 }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab
                label="Container Details / Update Details"
                value="1"
                sx={{
                  textTransform: "capitalize",
                  width: "100%",
                  typography: "body1",
                  borderBottom: 1,
                  borderColor: "divider",
                  borderRadius: "10px",
                }}
              />
              <Tab
                label="Vehicle Shipment"
                value="2"
                sx={{
                  textTransform: "capitalize",
                  width: "100%",
                  typography: "body1",
                  borderBottom: 1,
                  borderColor: "divider",
                  borderRadius: "10px",
                }}
              />
              <Tab
                label="Loose Cargo Shipment"
                value="3"
                sx={{
                  textTransform: "capitalize",
                  width: "100%",
                  typography: "body1",
                  borderBottom: 1,
                  borderColor: "divider",
                  borderRadius: "10px",
                }}
              />
            </TabList>
          </Box>

          <TabPanel value="1" sx={{ paddingBottom: "15px" }}>
            <ContainerShipmentView
              customer_id={initialValues.id}
              page={"containerNo"}
            />
          </TabPanel>

          <TabPanel value="2" sx={{ paddingBottom: "15px" }}>
            <VehicleShipmentView
              customer_id={initialValues.id}
              page={"vehicleShipment"}
            />
          </TabPanel>

          <TabPanel value="3" sx={{ paddingBottom: "15px" }}>
            <LooseShipmentView
              customer_id={initialValues.id}
              page={"looseShipment"}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
}
