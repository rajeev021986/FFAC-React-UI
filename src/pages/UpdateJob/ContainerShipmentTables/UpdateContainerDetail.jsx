import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Stack } from "@mui/material";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import ApiManager from "../../../services/ApiManager";

// Components
import ScreenToolbar from "../../../components/common/ScreenToolbar";
import ScreenToolbar from "../../../components/common/ScreenToolbar";
import ThemedBreadcrumb from "../../../components/common/Breadcrumb";
import CustomToast from "../../../components/common/Toast/CustomToast";
import Loader from "../../../components/common/Loader/Loader";
import UpdateForm from "../UpdateJobForm";

export default function UpdateJobDetails({ page }) {
  const [loading, setLoading] = useState(true);
  const { state } = useLocation();

  const [initialValues, setInitialValues] = React.useState({
    rejectRemarks: "",
    jobNo: "",
    blNo: "",
    customer: "",
    sct: "",
    urgent: "",
    shippingLineDOCollectionDate: "",
    customReleaseDate: "",
    taxExemptionCertificateDate: "",
    btNumber: "",
    pickUpOrder: "",
    idfNo: "",
    idfDate: "",
    entryLoadgedRef: "",
    entryLoadgedDate: "",
    entryNo: "",
    entryDate: "",
    bondDetails: [],
    containerDetails: [],
  });

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const res = await ApiManager.getUpdateJobEntryDetails(
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
          status: status,
          rejectRemarks: res.body?.rejectRemarks || "",
          jobNo: res.body?.jobNo || "",
          blNo: res.body?.blNo || "",
          customer: res.body?.customer || "",
          sct: res.body?.sct || "NO",
          urgent: res.body?.urgent || "NO",
          shippingLineDOCollectionDate:
            res.body?.shippingLineDOCollection1Date || "",
          customReleaseDate: res.body?.customReleaseDate || "",
          taxExemptionCertificateDate:
            res.body?.taxExemptionCertificateDate || "",
          pickUpOrder: res.body?.pickUpOrder || "",
          btNumber: res.body?.btNumber || "",
          idfNo: res.body?.idfNo || "",
          idfDate: res.body?.idfDate || "",
          entryLoadgedRef: res.body?.entryLoadgedRef || "",
          entryLoadgedDate: res.body?.entryLoadgedDate || "",
          entryNo: res.body?.entryNo || "",
          entryDate: res.body?.entryDate || "",
          bondDetails: res.body?.bondDetails || [],
          containerDetails: res.body?.containerDetails || [],
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
      fetchCustomerDetails();
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
            <UpdateForm
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
