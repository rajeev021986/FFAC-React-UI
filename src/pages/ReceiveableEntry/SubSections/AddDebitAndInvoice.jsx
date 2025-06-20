// import { useFormik } from "formik";
import { IconButton, Tooltip } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useGetOptionsSettingsQuery } from "../../../store/api/settingsApi";
import getFirstError from "../../../components/common/FieldToastError";
import EditIconForHeader from "../../../components/common/commonIcons/EditIcons/EditIconForHeader";

import { Delete } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddPayableEntryModal from "../AddDetails/AddDebitInvoiceModal";
import DebitNoteListData from "../AddDetails/DebitNoteList";

export default function AddDebitAndInvoice({ formik }) {
  const invoiceTypeRef = useRef(null);
  const payableRef = useRef(null);
  const { data: jobSettingData } = useGetOptionsSettingsQuery("job_settings");
  const [dropdownData, setDropdownData] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [chargesData, setChargesData] = useState(formik.values.details || []);
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
      formik.setFieldValue("exchangeRate", "1");
    }
  }, [formik.values?.currency]);

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
    formik.setFieldValue("details", updatedNotes);
    setSelectedPayEntry(null);
  };

  const handleDeleteEntry = (id) => {
    const updatedNotes = chargesData.filter((note) => note.id !== id);
    formik.setFieldValue("details", updatedNotes);
  };

  const handleFetchPayable = () => {
    const apiPayableData = formik?.values?.details || [];
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
  }, [formik?.values?.details]);
  const DEBIT_INVOICE_COLUMNS = [
    {
      field: "chargeName",
      headerName: "Charge Name",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        const value = params.value || "";
        const truncatedValue =
          value.length > 25 ? value.slice(0, 25) + "..." : value;

        return (
          <Tooltip title={value} arrow>
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
              }}
            >
              {truncatedValue}
            </div>
          </Tooltip>
        );
      },
      headerAlign: "center",
      align: "center",
    },
    {
      flex: 1,
      field: "unitType",
      headerName: "Unit Type",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "numOfUnits",
      headerName: "No. of units",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "unitRate",
      headerName: "Unit Rate",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "receivableAmount",
      headerName: "Amount",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "vatApplicable",
      headerName: "Vat Applicable",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "vat",
      headerName: "Vat Amount",
      headerAlign: "center",
      align: "center",
      editable: false,
    },
    {
      flex: 1,
      field: "totalAmount",
      headerName: "Total Amount",
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
          disabled={
            (!formik.values?.jobNo && !formik.values.exchangeRate) ||
            !formik.values?.currency
          }
          color="white"
          onClick={handleTogglePayEntry}
        >
          <AddCircleIcon />
        </IconButton>
      ),
      renderCell: (params) => {
        const row = params.row;
        const isEditDisabled = row.paybleDetailId === null;

        return (
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
                cursor: !isEditDisabled ? "not-allowed" : "pointer",
                color: !isEditDisabled ? "#ccc" : "#166ee0",
                opacity: !isEditDisabled ? 0.5 : 1,
              }}
              onClick={() => {
                if (isEditDisabled) handleEditClick(row);
              }}
            />
            <Delete
              style={{
                cursor: "pointer",
                color: "red",
              }}
              onClick={() => {
                handleDeleteEntry(row.id);
              }}
            />
          </div>
        );
      },
    },
  ];
  return (
    <>
      <Box sx={{ width: "100%", padding: 0, margin: 0 }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", margin: 2 }}>
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
