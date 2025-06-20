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
  const { state } = useLocation();
  const location = useLocation();

  const selectedRow = location.state?.selectedRow;
  const queryParams = new URLSearchParams(location.search);
  const job_number = queryParams.get("job_number");

  const [getDataFormParams, setgetDataFormParams] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = React.useState({
    consigneeName: selectedRow?.consigneeName || "",
    creditCost: "",
    currency: "",
    customerName: selectedRow?.customerName || "",
    customerId: selectedRow?.customerId || "",
    debitCost: "",
    exchangeRate: "",
    jobId: "",
    jobNo: selectedRow?.jobNo || "",
    netCost: "",
    paybleRefNo: "",
    profitLoss: "",
    totalRevenue: "",
    containerTypeDTO: [],
    paybleDetails: [],
    costDetails: [],
    totalAmount: 0,
    vatAmount: 0,
    totalAmount: 0,
    type: getDataFormParams?.type || "debit_note",
    status: "",
    statusCode: 0,
  });

  useEffect(() => {
    const mapResponseToInitialValues = (data = {}) => ({
      id: data.id || "",
      jobId: data.jobId || "",
      consigneeName: data.consigneeName || "",
      creditCost: data.creditCost || 0,
      currency: data.currency || "",
      customerName: data.customerName || "",
      customerId: data.customerId || "",
      debitCost: data.debitCost || 0,
      exchangeRate: data.exchangeRate || "",
      jobNo: data.jobNo || job_number,
      netCost: data.netCost || "",
      paybleRefNo: data.paybleRefNo || "",
      profitLoss: data.profitLoss || 0,
      totalRevenue: data.totalRevenue || 0,
      type: data.type || getDataFormParams?.type, 
      containerTypeDTO: data.containerTypeDTO || [],
      costDetails: data.costDetails || [],
      details: data?.receivableDetails || [],
      status: data?.status || "",
      statusCode: data?.statusCode || 0,
      amount: data?.amount || 0,
      vatAmount: data?.vatAmount || 0,
      totalAmount: data?.totalAmount || 0,
    });

    const init = async () => {
      try {
        setLoading(true);
        let response;
        if (
          job_number &&
          getDataFormParams?.currency &&
          getDataFormParams?.exchangeRate
        ) {
          response = await ApiManager.getReceivableData({
            job_number,
            currency: getDataFormParams.currency,
            exchangeRate: getDataFormParams.exchangeRate,
          });
        } else if (state?.initialValues?.id) {
          response = await ApiManager.getReceivableEntryDeatils(
            state.initialValues.id
          );
        }
        if (response?.body) {
          setInitialValues(mapResponseToInitialValues(response.body));
        }
      } catch (error) {
        toast.custom(<CustomToast message={error.message} toast="error" />, {
          closeButton: false,
        });
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [
    job_number,
    getDataFormParams?.currency,
    getDataFormParams?.exchangeRate,
    state?.initialValues?.id,
  ]);

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
              setgetDataFormParams={setgetDataFormParams}
              job_number={job_number}
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
