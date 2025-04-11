import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import ApiManager from "../../services/ApiManager";

//  MUI Components
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";

//  Custom Components
import InputBox from "../../components/common/InputBox";
import SelectBox from "../../components/common/SelectBox";
import InputBoxForGrid from "../../components/common/InputBoxForGrid";
import { StyledDataGrid } from "../../components/common/Grid/styles";
import { useGetOptionsSettingsQuery } from "../../store/api/settingsApi";
import { ThemeButton } from "../../components/common/Button";
import toast from "react-hot-toast";
import CustomToast from "../../components/common/Toast/CustomToast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
};

export default function AddRateModalApprove({ sourceId, handleOpen, handleClose }) {
  const [loading, setLoading] = useState(false);
  const [rateDetails, setRateDetails] = useState([]);
  const { data: jobSettingData } = useGetOptionsSettingsQuery("job_settings");

  const formik = useFormik({
    initialValues: {
      id: 0,
      totalAmount: 0,
      remarks: "",
      rateDetails: [],
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const formattedRateDetails = rateDetails.map((row) => ({
          id: row.id || null, // Ensure new rows have `id: null`
          chargeHead: row.chargeHead || "",
          currency: row.currency || "",
          unitType: row.unitType || "",
          noOfUnits: row.noOfUnits || 0,
          rate: row.rate || 0,
          amount: row.amount || 0,
          createdBy: row.createdBy || "admin",
          modifiedBy: row.modifiedBy || "admin",
          createdDate: row.createdDate || new Date().toISOString(),
          modifiedDate: new Date().toISOString(),
        }));
  
        const payload = {
          id: values.id,
          totalAmount: values.totalAmount,
          remarks: values.remarks,
          rateDetails: formattedRateDetails,
        };
  
  
        const res = await ApiManager.updateAddRateDetails(payload);
        if (res.success) {
          const message = res.message;
            toast.custom(<CustomToast message={message} toast="success" />)
          handleClose(); // Close modal after successful update
        } else {
          console.error("Failed to update rate details:", res);
        }
      } catch (error) {
        toast.custom(
          <CustomToast message={"Something went wrong!"} toast="error" />
        );
      }
    },
  });
  
  

  useEffect(() => {
    const fetchAddRateDetails = async () => {
      if (!sourceId) return;
      setLoading(true);

      try {
        const res = await ApiManager.getAddRateDetails(sourceId);
        if (res?.success === true) {
          const data = res.body || {};

          formik.setValues({
            id: data.id || 0,
            totalAmount: data.totalAmount || 0,
            remarks: data.remarks || "",
            rateDetails: data.rateDetails || [],
          });

          setRateDetails(data.rateDetails || []);
        }
      } catch (error) {
        toast.custom(
          <CustomToast message={"Something went wrong!"} toast="error" />
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAddRateDetails();
  }, [sourceId]);

  const handleProcessRowUpdate = (newRow) => {
    setRateDetails((prevDetails) =>
      prevDetails.map((row) => (row.id === newRow.id ? newRow : row))
    );
    return newRow;
  };

  const addNewRow = () => {
    const newRow = {
      id: Date.now(), // Unique ID for tracking new rows
      chargeHead: "",
      currency: "",
      unitType: "",
      noOfUnits: 0,
      rate: 0,
      amount: 0,
    };
    setRateDetails([...rateDetails, newRow]);
  };
  

  const deleteRow = (id) => {
    setRateDetails(rateDetails.filter((row) => row.id !== id));
  };

  const columns = [
    {
      field: "chargeHead",
      headerName: "Charge Head",
      flex: 1,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderCell: (params) => <InputBoxForGrid {...params} type="number" />,
      renderEditCell: (params) => <InputBoxForGrid {...params} type="number" />,
    },
    {
      field: "currency",
      headerName: "Currency",
      flex: 1,
      headerAlign: "center",
      align: "center",
      editable: false,
      renderCell: (params) => (
        <SelectBox
          placeholder
          size="small"
          options={jobSettingData?.body?.currency}
          value={params.value}
          onChange={(e) => handleProcessRowUpdate({ ...params.row, currency: e.target.value })}
        />
      ),
    },
    {
      field: "unitType",
      headerName: "Unit Type",
      flex: 1,
      editable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <SelectBox
          placeholder
          size="small"
          options={jobSettingData?.body?.unitTypes}
          value={params.value}
          onChange={(e) => handleProcessRowUpdate({ ...params.row, unitType: e.target.value })}
        />
      ),
    },
    {
      field: "noOfUnits",
      headerName: "No of Units",
      flex: 1,
      editable: true,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <InputBoxForGrid {...params} type="number" />,
      renderEditCell: (params) => <InputBoxForGrid {...params} type="number" />,
    },
    {
      field: "rate",
      headerName: "Rate",
      flex: 1,
      headerAlign: "center",
      align: "center",
      editable: true,
      renderCell: (params) => <InputBoxForGrid {...params} type="number" />,
      renderEditCell: (params) => <InputBoxForGrid {...params} type="number" />,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      editable: true,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <InputBoxForGrid {...params} type="number" />,
      renderEditCell: (params) => <InputBoxForGrid {...params} type="number" />,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 0.5,
      renderHeader: () => (
        <IconButton color="white" onClick={addNewRow}>
          <AddCircleIcon />
        </IconButton>
      ),
      renderCell: (params) => (
        <IconButton color="error" onClick={() => deleteRow(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Modal keepMounted open={handleOpen} onClose={handleClose}>
      <Box sx={{ ...style, position: "relative" }}>
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8, color: "grey.600" }}
        >
          <CloseIcon />
        </IconButton>

        {/* Input Fields */}
        <Grid paddingLeft={1} marginTop={2} container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={2}>
            <InputBox
              label="Total Amount"
              id="totalAmount"
              value={formik.values.totalAmount}
              error={formik.errors.totalAmount}
              onChange={formik.handleChange}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={8} xl={2}>
            <InputBox
              label="Additional Remarks"
              id="remarks"
              value={formik.values.remarks}
              error={formik.errors.remarks}
              onChange={formik.handleChange}
              disabled={loading}
            />
          </Grid>
        </Grid>

        {/* Data Grid */}
        <Box sx={{ marginTop: 2 }}>
          <StyledDataGrid
            rows={rateDetails}
            columns={columns}
            disableSelectionOnClick
            processRowUpdate={handleProcessRowUpdate}
            experimentalFeatures={{ newEditingApi: true }}
            getRowId={(row) => row.id}
            disableColumnMenu
          />
        </Box>
        <br/>
        <ThemeButton
  onClick={async () => {
    await formik.submitForm();
  }}
  sx={{ fontWeight: "500", borderRadius: "12px", color: "white !important" }}
>
  Update
</ThemeButton>
      </Box>
      
    </Modal>
  );
}
