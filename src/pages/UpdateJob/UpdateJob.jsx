import { Box, Card, CardContent, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import ApiManager from "../../services/ApiManager";
import Loader from "../../components/common/Loader/Loader";
import toast from "react-hot-toast";
import CustomToast from "../../components/common/Toast/CustomToast";
import UpdateForm from "./UpdateJobForm";

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
    pickUpOrder: "",
    btNumber: "",
    idfNo: "",
    idfDate: "",
    entryLoadgedRef: "",
    entryLoadgedDate: "",
    entryNo: "",
    entryDate: "",

    bondDetails: [
      {
        id: 0,
        bondNumber: "",
        balanceBondAmount: 0,
        bondAmount: 0,
        bondDate: "",
        runningBalance: 0,
      },
    ],
    containerDetails: [
      {
        containerNo: "",
        sizeType: "",
        sealNo: "",
        truckTrailerNo: "",
        transporter: "",
        truckTrailerNoTransporter: "",
        driver: "",
        agreedRate: "",
        telNo: "",
        passportNo: "",
        licenceNo: "",
        clerkName: "",
        clerkTelNo: "",
        reportingPlace: "",
        reportingDate: "",
        reportingTime: "",
        transferDate: "",
        t1C1ReadyDate: "",
        loadingDate: "",
        cancellationDate: "",
        arrivalBorderDate: "",
        crossedBorderDate: "",
        arrivalICDDate: "",
        cargoReleaseDate: "",
        departICDDate: "",
        arrivalCustomerPlaceDate: "",
        emptyReleasedDate: "",
        emptyReturnPlace: "",
        podNo: "",
        podDate: "",
        emptyReturnDate: "",
        certificateOfExportDate: "",
        portGateInDate: "",
        nominationDate: "",
        remark: "",
      },
    ],
  });

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const res = await ApiManager.getCustomerDeatils(
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
          customerName: res.body?.customerName || "",
          tinNo: res.body?.tinNo || "",
          vatNo: res.body?.vatNo || "",
          status: status,
          add1: res.body?.add1 || "",
          add2: res.body?.add2 || "",
          add3: res.body?.add3 || "",
          poNo: res.body?.poNo || "",
          city: res.body?.city || "",
          country: res.body?.country || "",
          province: res.body?.province || "",
          contactPerson: res.body?.contactPerson || "",
          emailId: res.body?.emailId || "",
          telephone: res.body?.telephone || "",
          fax: res.body?.fax || "",
          bankName: res.body?.bankName || "",
          accountNo: res.body?.accountNo || "",
          customerType: res.body?.customerType || "",
          companyCode: res.body?.companyCode || "",
          paymentType: res.body?.paymentType || "cash",
          creditDays: res.body?.creditDays || "",
          creditAmount: res.body?.creditAmount || "",
          rejectRemarks: res.body?.rejectRemarks || "",
          statusCode: res.body?.statusCode,
          agreementExpiryDate: res.body?.agreementExpiryDate || "",
          customerEntityTariffs: res.body?.customerEntityTariffs || [],
          customerEntityEmailsIds: res.body?.customerEntityEmailsIds || [],
          bankDetails: res.body?.bankDetails || [],
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
