import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Stack } from "@mui/material";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import ApiManager from "../../../../services/ApiManager";

// Components
import ScreenToolbar from "../../../../components/common/ScreenToolbar";
import ThemedBreadcrumb from "../../../../components/common/Breadcrumb";
import CustomToast from "../../../../components/common/Toast/CustomToast";
import Loader from "../../../../components/common/Loader/Loader";
import LooseCargoForm from "./LooseCargoForm";

export default function LooseCargoParent({ page }) {
  const [loading, setLoading] = useState(true);
  const { state } = useLocation();

  const [initialValues, setInitialValues] = React.useState({
    transporter: "",
    truckTrailerNo: "",
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
    bondNumber: "",
    bondAmount: "",
    arrivalCustomerPlaceDate: "",
    remark: "",
  });

  const fetchContainerNumbers = async () => {
    try {
      const res = await ApiManager.getLooseCargoById(
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
        truckNo: res.body?.truckNo,
        transporter: res.body?.transporter,
        truckTrailerNo: res.body?.truckTrailerNo,
        driver: res.body?.driver,
        agreedRate: res.body?.agreedRate,
        telNo: res.body?.telNo,
        passportNo: res.body?.passportNo,
        licenceNo: res.body?.licenceNo,
        clerkName: res.body?.clerkName,
        clerkTelNo: res.body?.clerkTelNo,
        reportingPlace: res.body?.reportingPlace,
        reportingDate: res.body?.reportingDate,
        reportingTime: res.body?.reportingTime,
        transferDate: res.body?.transferDate,
        t1C1ReadyDate: res.body?.t1C1ReadyDate,
        loadingDate: res.body?.loadingDate,
        cancellationDate: res.body?.cancellationDate,
        arrivalBorderDate: res.body?.arrivalBorderDate,
        crossedBorderDate: res.body?.crossedBorderDate,
        arrivalICDDate: res.body?.arrivalICDDate,
        cargoReleaseDate: res.body?.cargoReleaseDate,
        departICDDate: res.body?.departICDDate,
        bondNumber: res.body?.bondNumber,
        bondAmount: res.body?.bondAmount,
        arrivalCustomerPlaceDate: res.body?.arrivalCustomerPlaceDate,
        remark: res.body?.remark,
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
      fetchContainerNumbers();
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
            <LooseCargoForm
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
