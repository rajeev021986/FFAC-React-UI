import * as Yup from "yup";

export const VesselVoyageValidation = () =>
  Yup.object({
    // status: Yup.string().required('Status is required'),
    vesselId: Yup.string().required("Vessel is required"),
    voyageInBound: Yup.string().required("InBound is required"),
    voyageOutBound: Yup.string().required('OutBound is required'),
    // gateStatus: Yup.string().required('Gate Status is required'),
    // portOperator: Yup.string().required('Port Operator is required'),
  });
