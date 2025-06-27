import { Box, Card, CardContent, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import ApiManager from "../../services/ApiManager";

// Components
// import JobEntryForm from "./JobEntryForm";
import Loader from "../../components/common/Loader/Loader";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import CustomToast from "../../components/common/Toast/CustomToast";
import ReceiptsEntryForm from "./ReceiptsEntryForm";
import dayjs from "dayjs";

export default function AddReceiptsEntry({ page }) {
  const [loading, setLoading] = useState(true);
  const { state } = useLocation();
  const getUserId = localStorage.getItem("userId");
  const [initialValues, setInitialValues] = React.useState({
    id: "",
    receivablePartyName: "",
    receivablePartyId: "",
    currency: "",
    upTo: new Date(),
    exchangeRate: "",
    recOutstandingAmount: "",
    date: "",
    recAmount: "",
    chargeType: "",
    charge: "",
    withHoldingTaxRecov: "",
    mode: "",
    bankName: "",
    chequeNo: "",
    chequeDate: "",
    recPayAmount: "",
    remarks: "",
    details: [
      {
        id: "",
        uiId:"",
        refNo: "",
        receivableAmount: "",
        date: "",
        amount: "",
        withHoldingAmount: "",
      },
    ],
  });
  const todayLocalISO = dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS");
  useEffect(() => {
    const fetchReceivableReceipts = async () => {
      try {
        const res = await ApiManager.getReceivableReceiptsData(
          todayLocalISO,
          state?.initialValues?.id
        );

        setInitialValues({
          ...initialValues,
          id: res?.body?.id || "",
          receivablePartyName: res?.body?.receivablePartyName || "",
          receivablePartyId: res?.body?.receivablePartyId || "",
          currency: res?.body?.currency || "",
          upTo: res?.body?.upTo || new Date(),
          exchangeRate: res?.body?.exchangeRate || "",
          recOutstandingAmount: res?.body?.recOutstandingAmount || "",
          date: res?.body?.date || "",
          recAmount: res?.body?.recAmount || "",
          chargeType: res?.body?.chargeType || "",
          charge: res?.body?.charge || "",
          withHoldingTaxRecov: res?.body?.withHoldingTaxRecov || "",
          mode: res?.body?.mode || "",
          bankName: res?.body?.bankName || "",
          chequeNo: res?.body?.chequeNo || "",
          chequeDate: res?.body?.chequeDate || "",
          recPayAmount: res?.body?.recPayAmount || "",
          remarks: res?.body?.remarks || "",
          details:
            res?.body?.details?.map((item) => ({
              id: item.id ?? "",
              uiId:item.uiId ?? "",
              refNo: item.refNo ?? "",
              receivableAmount: item.receivableAmount ?? "",
              date: item.date ?? "",
              amount: item.amount ?? "",
              withHoldingAmount: item.withHoldingAmount ?? "",
            })) || [],
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
    if (state?.initialValues?.id) {
      fetchReceivableReceipts();
    } else {
      setLoading(false);
    }
  }, [state?.initialValues?.id]);
  console.log(initialValues, "initialValues");

  return (
    <Box sx={{ padding: 0, margin: 0 }}>
      <Stack>
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
            <ReceiptsEntryForm
              initialValues={initialValues}
              type={state?.formAction}
              page={page}
              getUserId={getUserId}
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
