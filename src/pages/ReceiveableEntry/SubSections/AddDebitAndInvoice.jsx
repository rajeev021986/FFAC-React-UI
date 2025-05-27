import { useFormik } from "formik";
import { Stack, IconButton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ApiManager from "../../../services/ApiManager";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  useAddPaybleEntryMutation,
  useUpdatePaybleEntryMutation,
} from "../../../store/api/payableApi";

import { useNavigate } from "react-router-dom";
import { useGetOptionsSettingsQuery } from "../../../store/api/settingsApi";
import CustomToast from "../../../components/common/Toast/CustomToast";
import getFirstError from "../../../components/common/FieldToastError";
import EditIconForHeader from "../../../components/common/commonIcons/EditIcons/EditIconForHeader";
import PayableEntryList from "../AddDetails/DebitNoteList";
import { formView } from "../../../store/freatures/payableEntrySlice";
import { useDispatch, useSelector } from "react-redux";
import { dashboardSetPagination } from "../../../store/freatures/dashboardSlice";

import { Delete } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddPayableEntryModal from "../AddDetails/AddDebitInvoiceModal";
import { payableValidationSchema } from "../Actions/ValidationSchema";
import DebitNoteListData from "../AddDetails/DebitNoteList";

export default function AddDebitAndInvoce({
  initialValues,
  viewPage,
  type = "notcopy",
}) {
  //
  const invoiceTypeRef = useRef(null);
  const payableRef = useRef(null);
  const nav = useNavigate();

  const [addPaybleEntry, { isLoading }] = useAddPaybleEntryMutation();
  const [updatePaybleEntry, { isUpdateLoading }] =
    useUpdatePaybleEntryMutation();

  const { data: jobSettingData } = useGetOptionsSettingsQuery("job_settings");
  const [mergedCurrencyOptions, setMergedCurrencyOptions] = useState([]);
  const [showDefaultCurrency, setshowDefaultCurrency] = useState("");
  const actionsSelector = useSelector((s) => s?.payableAction);
  const [loaderApprove, setLoaderApprove] = useState({
    approve: false,
    reject: false,
  });

  const dispatch = useDispatch();
  const [dropdownData, setDropdownData] = useState({});
  const [rejectError, setRejectError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [chargesData, setChargesData] = useState([]);
  const [togglePayEntry, setToggleNotes] = useState(false);
  const [selectedPayEntry, setSelectedPayEntry] = useState(null);
  const [value, setValue] = React.useState("1");
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    title: "",
    message: "",
    severity: "info",
    onConfirm: null,
    onClose: () => setAlertConfig({ ...alertConfig, open: false }),
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (viewPage === "editForm") {
      return setIsDisabled(false);
    }
    if (
      viewPage === "view" ||
      formik?.values?.statusCode === -3 ||
      formik?.values?.statusCode === 1
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [viewPage]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: payableValidationSchema(),
    onSubmit: async (values) => {
      if (!values.id || type === "copy") {
        try {
          values.statusCode = dropdownData?.approvalRequest ? 0 : 1;
          values.status = "";
          let paybleDetailsData = values.paybleDetails.map((item) =>
            item?.new ? { ...item, id: null, new: false } : item
          );
          let response = await addPaybleEntry({
            ...values,
            paybleDetails: paybleDetailsData,
          }).unwrap();

          const message = response.message;
          if (response.code == "SUCCESS") {
            toast.custom(<CustomToast message={message} toast="warn" />, {
              closeButton: false,
            });
            nav("/app/documentation/paybleEntry");
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
      } else {
        // If there is an id, proceed with the update action
        try {
          setRejectError(false);
          let paybleDetailsData = values.paybleDetails.map((item) =>
            item?.new ? { ...item, id: null, new: false } : item
          );
          Boolean(values.status == "Active") && (values.statusCode = 1);
          Boolean(values.status == "Inactive") && (values.statusCode = -2);
          let response = await updatePaybleEntry({
            ...values,
            paybleDetails: paybleDetailsData,
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
      }
    },
  });

  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("common_settings");
  const { data: customerSettingsData } =
    useGetOptionsSettingsQuery("customer_settings");
  const { data: payableSettingData } =
    useGetOptionsSettingsQuery("payble_settings");

  useEffect(() => {
    if (
      optionsSettingsData?.body ||
      customerSettingsData?.body ||
      jobSettingData?.body ||
      payableSettingData?.body
    ) {
      setDropdownData({
        ...optionsSettingsData?.body,
        ...customerSettingsData?.body,
        ...jobSettingData?.body,
        ...payableSettingData?.body,
      });
    }
  }, [optionsSettingsData, customerSettingsData, payableSettingData]);

  useEffect(() => {
    if (formik.values?.currency !== "USD") {
      formik.setFieldValue("exchangeRate", 1);
    }
  }, [formik.values?.currency]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiManager.fetchAutoCompleteData(
          "",
          "COMPANY_CODE"
        );
        const backendData = await response.body;
        setshowDefaultCurrency(backendData?.[0]);
        formik.setFieldValue(
          "currency",
          initialValues.currency
            ? initialValues.currency
            : backendData?.[0].currency
        );
        const backendCurrencies = Array.from(
          new Set(
            (backendData || []).map((item) => item.currency).filter(Boolean)
          )
        ).map((curr) => ({ id: curr, value: curr }));
        // Get setting currencies safely
        const settingCurrencies = optionsSettingsData?.body?.currencyType || [];
        // Merge both arrays avoiding duplicates (based on `value`)
        const mergedCurrencies = [
          ...backendCurrencies,
          ...settingCurrencies.filter(
            (setting) =>
              !backendCurrencies.some((item) => item.value === setting.value)
          ),
        ];

        setMergedCurrencyOptions(mergedCurrencies);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [optionsSettingsData?.body?.currencyType]);

  useEffect(() => {
    getFirstError(formik.errors);
  }, [formik.errors]);

  useEffect(() => {
    if (payableRef?.current) {
      payableRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (invoiceTypeRef.current) {
      invoiceTypeRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (formik?.values?.currency !== "USD") {
      formik.setFieldValue("exchangeRate", 1);
    }
  }, [formik?.values?.currency]);

  const handleEditClick = (data) => {
    setSelectedPayEntry(data);
    setToggleNotes(true);
  };

  const handleTogglePayEntry = () => {
    setToggleNotes((prev) => !prev);
    if (togglePayEntry) {
      setSelectedPayEntry(null);
    }
  };

  const handleAddEntryforNote = (newNote) => {
    let updatedNotes;
    if (selectedPayEntry) {
      updatedNotes = chargesData.map((note) =>
        note.id === selectedPayEntry.id ? newNote : note
      );
    } else {
      updatedNotes = [...chargesData, newNote];
    }
    setChargesData(updatedNotes);
    formik.setFieldValue("paybleDetails", updatedNotes);
    setSelectedPayEntry(null);
  };

  const handleDeleteEntry = (id) => {
    const updatedNotes = chargesData.filter((note) => note.id !== id);
    setChargesData(updatedNotes);
    formik.setFieldValue("paybleDetails", updatedNotes);
    // localStorage.setItem("chargesData", JSON.stringify(updatedNotes));
  };

  const handleFetchPayable = () => {
    const apiPayableData = formik?.values?.paybleDetails || [];
    const appendData = [...apiPayableData].reduce((acc, pay) => {
      if (!acc.some((n) => n.id === pay.id)) {
        acc.push(pay);
      }
      return acc;
    }, []);
    setChargesData(appendData);
  };

  useEffect(() => {
    handleFetchPayable();
  }, [formik?.values?.chargesData]);

  const DEBIT_INVOICE_COLUMNS = [
    {
      flex: 1.5,
      field: "chargeName",
      headerName: "Charge Name",
      headerAlign: "center",
      align: "center",
      editable: false,
      renderCell: (params) => (
        <div className="word-wrap-cell">
          {params.value?.trim() || ""} {/* Show "N/A" if empty */}
        </div>
      ),
    },
    {
      flex: 1,
      field: "debitAmount",
      headerName: "Debit",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "Credit",
      headerName: "Credit",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "VAT",
      headerName: "vatRate",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 1,
      sortable: false,
      headerAlign: "center",
      renderHeader: () => (
        <IconButton
          disabled={isDisabled}
          color="white"
          onClick={handleTogglePayEntry}
        >
          <AddCircleIcon />
        </IconButton>
      ),
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <EditIcon
            style={{
              cursor: isDisabled ? "not-allowed" : "pointer",
              color: isDisabled ? "#ccc" : "#166ee0",
              opacity: isDisabled ? 0.5 : 1,
            }}
            onClick={() => {
              if (!isDisabled) handleEditClick(params.row);
            }}
          />
          <Delete
            style={{
              cursor: isDisabled ? "not-allowed" : "pointer",
              color: isDisabled ? "#ccc" : "red",
              opacity: isDisabled ? 0.5 : 1,
            }}
            onClick={() => {
              if (!isDisabled) handleDeleteEntry(params.row.id);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ width: "100%", padding: 0, margin: 0 }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab
                label="Tax Invoice/Debit Note Details"
                value="1"
                icon={<EditIconForHeader />}
                iconPosition="start"
                sx={{ textTransform: "capitalize", minHeight: "50px" }}
              />
            </TabList>
          </Box>

          <TabPanel value="1" sx={{ padding: 0 }}>
            <Box sx={{ width: "100%" }}>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  margin: "8px",
                }}
              >
                <DebitNoteListData
                  formik={formik}
                  dropdownData={dropdownData}
                  disabled={isDisabled}
                  chargesData={chargesData}
                  DEBIT_INVOICE_COLUMNS={DEBIT_INVOICE_COLUMNS}
                />
              </Box>
            </Box>
          </TabPanel>

          {/* <TabPanel value="2" sx={{ padding: "0px" }}>
            <UploadFile
              customer_id={initialValues.id}
              disabled={isDisabled}
              dropdownData={dropdownData.jobDocumentType}
              sourceType="PAYBLE_ENTRY"
            />
          </TabPanel> */}
        </TabContext>
      </Box>

      <AddPayableEntryModal
        togglePayEntry={togglePayEntry}
        handleTogglePayEntry={handleTogglePayEntry}
        formik={formik}
        onAddPayEntry={handleAddEntryforNote}
        selectedPayEntry={selectedPayEntry}
        setSelectedPayEntry={setSelectedPayEntry}
      />
    </>
  );
}
