import { Grid, Stack, Box, CircularProgress } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { OutlinedButton, ThemeButton } from "../../common/Button";
import ThemedModal from "../../common/ThemedModal";
import AddVesselForm from "./AddVesselForm";
import ApiManager from "../../../services/ApiManager";
import PopupAlert from "../../common/Alert/PopupAlert";
import toast from "react-hot-toast";
import PLDetailsForm from "../../../components/screen/packing-list/PLDetailsForm";
import HBLForm from "./HBLForm";
import { validateBOLForm } from "./validation";
import { useAddSPRBLSaveMutation } from "../../../store/api/packingListDataApi";
import {
  updateBolDataInput,
  setFormErrors,
  clearFormErrors,
} from "../../../store/freatures/sprblDataSlice";
import { useDispatch, useSelector } from "react-redux";
import ThemeTabs from "../../common/Tab/ThemeTab";
import BLDetailsFields from "./bol-form";
import { useDropzone } from "react-dropzone";
import FileScreen from "./fileShowGrid";
import { useNavigate } from "react-router-dom";

export default function BOLForm({
  initialValues,
  tableData,
  loading,
  openVesselModal,
  setOpenVesselModal,
}) {
  const [options, setOptions] = useState([]);
  const [addSPRBLSave] = useAddSPRBLSaveMutation();
  const [plData, setPlDetailsData] = useState(
    initialValues?.sprBLPLDetails || []
  );
  const [fileData, setfileData] = useState(
    initialValues?.sprBLDetails[0]?.files || []
  );
  const [loader, setLoader] = React.useState(false);
  const [hblData, sethblDetailsData] = useState(initialValues?.details_hbl);
  const updateInitialValue = useSelector((state) => state.sprblDetails.bolData);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    const initialBolValue = {
      serialIdBL: initialValues?.sprBLDetails[0]?.serialIdBL || "",
      blno: initialValues?.sprBLDetails[0]?.blno || "",
      bookingNo: initialValues?.sprBLDetails[0]?.bookingNo || "",
      vessel: initialValues?.sprBLDetails[0]?.vessel || "",
      voyage: initialValues?.sprBLDetails[0]?.voyage || "",
      shipper: initialValues?.sprBLDetails[0]?.shipper || "",
      blStatus: initialValues?.sprBLDetails[0]?.blStatus || "",
      pol: initialValues?.sprBLDetails[0]?.pol || "",
      pod: initialValues?.sprBLDetails[0]?.pod || "",
      finalDest: initialValues?.sprBLDetails[0]?.finalDest || "",
      polDate: initialValues?.sprBLDetails[0]?.polDate || null,
      podDate: initialValues?.sprBLDetails[0]?.podDate || null,
      etaFinalDest: initialValues?.sprBLDetails[0]?.etaFinalDest || null,
      pieces: initialValues?.sprBLDetails[0]?.pieces || "",
      cbm: initialValues?.cbm || "",
      weights: initialValues?.weights || "",
      console_bl: initialValues?.sprBLDetails[0]?.consoleBL || "",
      dateForClearance:
        initialValues?.sprBLDetails[0]?.dateForClearance || null,
    };
    Object.entries(initialBolValue).forEach(([field, value]) => {
      dispatch(updateBolDataInput({ field, value }));
    });
  }, [initialValues, dispatch]);

  const [alertConfig, setAlertConfig] = useState({
    open: false,
    title: "",
    message: "",
    severity: "info",
    onConfirm: null,
    onClose: () => setAlertConfig({ ...alertConfig, open: false }),
  });

  const handleVesselOptionChange = async (query) => {
    ApiManager.getVesselOptions(query)
      .then((response) => {
        setOptions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePlDetailsChange = (index, fieldName, value) => {
    const updatedPlDetails = [...plData];
    updatedPlDetails[index] = {
      ...updatedPlDetails[index],
      [fieldName]: value,
    };
    setPlDetailsData(updatedPlDetails);
  };

  const handleHblDataChange = (newHblData) => {
    sethblDetailsData(newHblData);
  };

  const handleDrop = useCallback((acceptedFiles) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
  
    const oversizedFiles = acceptedFiles.filter((file) => file.size > MAX_FILE_SIZE);
    const validFiles = acceptedFiles.filter((file) => file.size <= MAX_FILE_SIZE);
  
    if (oversizedFiles.length > 0) {
      setAlertConfig({
        open: true,
        title: "File Size Error",
        message: "Files must be less than 5 MB. Please select smaller files.",
        severity: "error",
        confirmText: "Close",
        onConfirm: () => setAlertConfig({ ...alertConfig, open: false }),
        onClose: () => setAlertConfig({ ...alertConfig, open: false }),
      });
    }
 
    if (validFiles.length > 0) {
      setUploadedFiles((prevFiles) => [...prevFiles, ...validFiles]);
    }
  }, [alertConfig]);
  

  const handleFileClick = (file) => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
  };

  const handleSubmit = async () => {
    setLoader(true);
  
    const formData = new FormData();
  
    // Prepare the data by removing unwanted fields from plData
    const updatedPlData = plData.map(({ sprBLIteamDetails, ...restItem }) => restItem);
  
    const completeFormValues = {
      ...updateInitialValue,
      plData: updatedPlData,
      hbllist: hblData,
    };
  
    // Append form fields to FormData
    for (const [key, value] of Object.entries(completeFormValues)) {
      if (Array.isArray(value)) {
        // For plData or hbllist, append as JSON string
        if (key === 'plData' || key === 'hbllist') {
          formData.append(key, JSON.stringify(value));
        } else {
          // For any other arrays, append as individual items
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, JSON.stringify(item));
          });
        }
      } else {
        // Append non-array values directly
        formData.append(key, value);
      }
    }
  
    uploadedFiles.forEach((file) => {
      formData.append('files', file); // Append all files under the same key 'files'
    });
  
    const showAlert = (message) => {
      setAlertConfig({
        open: true,
        title: "Error",
        message,
        severity: "error",
        confirmText: "Close",
        cancelText: "",
        onConfirm: () => setAlertConfig({ ...alertConfig, open: false }),
        onClose: () => setAlertConfig({ ...alertConfig, open: false }),
      });
    };
  
    try {
      if (completeFormValues.polDate > completeFormValues.podDate) {
        setLoader(false);
        return showAlert("POD date must be greater than POL date !!");
      }
      if (completeFormValues.pol === completeFormValues.pod) {
        setLoader(false);
        return showAlert("POL and POD cannot be the same location !!");
      }
      if (completeFormValues.pol === completeFormValues.finalDest) {
        setLoader(false);
        return showAlert("POL and Final Destination cannot be the same location !!");
      }
  
      const errors = validateBOLForm(completeFormValues);
      if (Object.keys(errors).length > 0) {
        setLoader(false);
        dispatch(setFormErrors(errors));
        return;
      } else {
        dispatch(clearFormErrors());
      }
  
      const res = await addSPRBLSave(formData);
  
      if (res?.error?.status === 400) {
        setLoader(false);
        return showAlert(res.error.data.message);
      } else {
        toast.success(res?.data?.message);
        navigate("/app/spr/packing_list");
      }
    } catch (err) {
      console.error("Error", err);
      toast.error(err.message);
    } finally {
      setLoader(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <BLDetailsFields
          initialValues={initialValues}
          options={options}
          handleVesselOptionChange={handleVesselOptionChange}
        />
      </Grid>
      {/* File Upload Section */}
      <Grid item xs={12}>
        <Box
          sx={{
            padding: 2,
            border: "1px dashed gray",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <p>Drag & drop files here, or click to select files</p>
          <ThemeButton>Upload Files</ThemeButton>
        </Box>
        <Box sx={{ marginTop: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {uploadedFiles.map((file, index) => (
            <ThemeButton
              key={index}
              onClick={() => handleFileClick(file)}
              size="small"
            >
              {file.name}
            </ThemeButton>
          ))}
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 2 }}>
          <ThemeTabs
            tabData={[
              { label: "PL Details", value: "1", disable: false },
              { label: "HBL", value: "2", disable: false },
              { label: "Files", value: "3", disable: false },
            ]}
          >
            <PLDetailsForm data={plData} onChange={handlePlDetailsChange} />
            <HBLForm data={hblData} onChange={handleHblDataChange} />
            <FileScreen data ={fileData}/>
          </ThemeTabs>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={2} justifyContent={"flex-end"}>
          <OutlinedButton
            sx={{ fontWeight: "500" }}
            onClick={() => navigate("/app/spr/packing_list")}
          >
            Cancel
          </OutlinedButton>
          <ThemeButton onClick={handleSubmit} sx={{ fontWeight: "500" }}>
            {loader && <CircularProgress size={20} color="white" />} Save
          </ThemeButton>
        </Stack>
      </Grid>

      {openVesselModal && (
        <ThemedModal
          open={openVesselModal}
          setOpen={setOpenVesselModal}
          modalTitle="Add Vessel"
        >
          <AddVesselForm setOpen={setOpenVesselModal} />
        </ThemedModal>
      )}

      {alertConfig.open && <PopupAlert alertConfig={alertConfig} />}
    </Grid>
  );
}
