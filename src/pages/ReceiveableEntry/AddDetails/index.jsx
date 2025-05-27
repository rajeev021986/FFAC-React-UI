import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Box, Card, CardContent, Stack } from "@mui/material";

import ScreenToolbar from "../../../components/common/ScreenToolbar";
import ThemedBreadcrumb from "../../../components/common/Breadcrumb";
import ApiManager from "../../../services/ApiManager";
import Loader from "../../../components/common/Loader/Loader";
import CustomToast from "../../../components/common/Toast/CustomToast";
import SubSections from "../SubSections/SubSection";

export default function ReceiveableEntryDetails({ page }) {
  const [loading, setLoading] = useState(true);
  const { state } = useLocation();

  const [initialValues, setInitialValues] = React.useState({
    consigneeName: "",
    creditCost: "",
    currency: "",
    customerName: "",
    debitCost: "",
    exRate: "",
    id: 289,
    jobId: 498,
    jobNo: "",
    netCost: "",
    paybleRefNo: "",
    profitLoss: "",
    totalRevenue: "",
    containerTypeDTO: [],
    paybleDetails: [],
  });

  const fetchPayableData = async () => {
    try {
      const res = await ApiManager.getReceivableEntryDeatils(
        state?.initialValues?.id
      );
      let status = "";
      if (res.body?.status) {
        status =
          res.body?.status.charAt(0).toUpperCase() +
          res.body?.status.slice(1).toLowerCase();
      }
      setInitialValues({
        id: res.body?.id || "",
        jobId: res.body?.jobId || "",
        consigneeName: res.body?.consigneeName || "",
        creditCost: res.body?.creditCost || "",
        currency: res.body?.currency || "",
        customerName: res.body?.customerName || "",
        debitCost: res.body?.debitCost || "",
        exRate: res.body?.exRate || "",
        jobNo: res.body?.jobNo || "",
        netCost: res.body?.netCost || "",
        paybleRefNo: res.body?.paybleRefNo || "",
        profitLoss: res.body?.profitLoss || "",
        totalRevenue: res.body?.totalRevenue || "",
        containerTypeDTO: res?.body?.containerTypeDTO || [],
        paybleDetails: res?.body?.paybleDetails || [],
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

  useEffect(() => {
    if (state?.initialValues?.id) {
      fetchPayableData();
    } else {
      setLoading(false);
    }
  }, [state?.initialValues?.id]);

  return (
    <Box sx={{ padding: 0, margin: 0 }}>
      <Stack sx={{ padding: "8px 0px" }}>
        <ScreenToolbar
          leftComps={
            <div>
              <ThemedBreadcrumb />
            </div>
          }
          rightComps={<div></div>}
        />
      </Stack>

      {loading ? (
        <Loader />
      ) : (
        <Card
          sx={{ borderWidth: 1, borderColor: "border.main", padding: "0px" }}
        >
          <CardContent
            sx={{
              margin: "0px",
              padding: "0px ! important",
            }}
          >
            <SubSections
              initialValues={initialValues}
              type={state?.formAction}
              page={page}
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
