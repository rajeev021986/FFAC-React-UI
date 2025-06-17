import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Modal,
  Tab,
  Typography,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useAddChargeMutation,
  useLazyGetChargeQuery,
  useUpdateChargeMutation,
} from "../../../../store/api/chargesDataApi";
import toast from "react-hot-toast";
import Loader from "../../../common/Loader/Loader";
import ChargeInputs from "./ChargeInputs";
import AuditTimeLine from "../../../AuditTimeLine";
import CustomToast from "../../../common/Toast/CustomToast";
import { menuConfigUrl } from "../../../../store/menuConfigUrl";
import EditIconForHeader from "../../../common/commonIcons/EditIcons/EditIconForHeader";
import AuditIcon from "../../../common/commonIcons/AuditIcon/AuditIcon";
import CloseIcon from "@mui/icons-material/Close";
import { useGetOptionsSettingsQuery } from "../../../../store/api/settingsApi";
import { useNavigate } from "react-router-dom";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
  maxHeight: "90vh",
  overflow: "auto",
};

const AddEditCharge = ({ onClose, id, type }) => {
  const [value, setValue] = useState(1);
  const nav = useNavigate();
  const handleChange = (event, newValue) => setValue(newValue);

  const { data: ChargeSettingsData } =
    useGetOptionsSettingsQuery("common_settings");

  const tabs = [
    {
      label: "Charge Details",
      value: 1,
      icon: <EditIconForHeader />,
    },
    // { label: "Audit Logs", value: 2, icon: <AuditIcon /> },
  ];
  Boolean(type === "copy" || type === "new") && tabs.splice(1, 1);

  const [getCharge, { isLoading }] = useLazyGetChargeQuery();
  const [addCharge, { isLoading: loadingAdd }] = useAddChargeMutation();
  const [updateCharge, { isLoading: loadingUpdate }] =
    useUpdateChargeMutation();

  const initialValues = {
    id: "",
    status: "",
    statusCode: "",
    chargeDetails: "",
    chargeFor: "",
    chargeName: "",
    mappedCharge: "",
    vatApplicable: "",
    chargeCode: "",
  };

  const validationSchema = Yup.object({
    chargeName: Yup.string().required("Charge name is required"),
    //     status: Yup.string(),
    //     chargeDetails: Yup.string().required("Required"),
    chargeFor: Yup.string().required("Charge For is required"),
    //     mappedCharge: Yup.string().required("Required"),
    //     vatApplicable: Yup.string().required("Required"),
    //     chargeCode: Yup.string().required("Required"),
    //     mappingDetails: Yup.array().of(
    //       Yup.object({
    //         id: Yup.number().required(),
    //         directIncome: Yup.string().required("Required"),
    //         directExpense: Yup.string().required("Required"),
    //       })
    //     ),
  });

  const onSubmit = async (values) => {
    let updatedValue = {
      ...values,
    };
    if (type == "copy" || type == "add") {
      delete updatedValue.id;
      try {
        let res = await addCharge(updatedValue).unwrap();
        if (res.success) {
          toast.custom(<CustomToast message={res.message} toast="success" />, {
            closeButton: false,
          });
          nav("/app/admin/charges");
          onClose();
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
        let res = await updateCharge(updatedValue).unwrap();
        if (res.success) {
          toast.custom(<CustomToast message={res.message} toast="success" />, {
            closeButton: false,
          });
          nav("/app/admin/charges");
          onClose();
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
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: false,
    onSubmit,
  });

  const handleFetchCharge = async () => {
    try {
      const response = await getCharge({ id });
      if (response?.data) {
        formik.setValues({
          ...response.data.body,
        });
      } else {
        formik.setValues(initialValues);
      }
    } catch (error) {
      toast.custom(
        <CustomToast message="Error while fetching data" toast="error" />,
        {
          closeButton: false,
        }
      );
    }
  };
  useEffect(() => {
    if (id && ChargeSettingsData) {
      handleFetchCharge();
    }
  }, [id, ChargeSettingsData]);

  return (
    <Modal open={true} onClose={onClose} keepMounted>
      <Box sx={modalStyle}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h6">
            {type === "add"
              ? "Add Charge"
              : type === "copy"
              ? "Copy Charge"
              : "Edit Charge"}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
          <ChargeInputs
            formik={formik}
            ChargeSettingsData={ChargeSettingsData}
            type={type}
            value={value}
            nav={nav}
            handleChange={handleChange}
            loading={loadingAdd || loadingUpdate}
            onClose = {onClose}
          />
      </Box>
    </Modal>
  );
};

export default AddEditCharge;
