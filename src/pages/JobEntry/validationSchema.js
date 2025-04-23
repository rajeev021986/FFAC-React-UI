import * as Yup from "yup";

export const JobEntryValidationSchema = () =>
  Yup.object({
    customerName: Yup.string().required("Customer Name is required"),
    shipmentType: Yup.string().required("Select Shipment type"),
    moveType: Yup.string().required("Select Move type"),
    dateOfReceipt: Yup.string().required("Date of Receipt is required"),
    mblNo: Yup.string().required("MBL/NO. is required"),
    // containerShipments: Yup.array().of(
    //   Yup.object().shape({
    //     containerNo: Yup.string()
    //       .required("Container No. must be exactly 11 characters")
    //       .length(11, "Container No. must be exactly 11 characters"),
    //     tflSealNo: Yup.string()
    //       .required("TFL Seal No. must be exactly 11 characters")
    //       .length(11, "TFL Seal No. must be exactly 11 characters"),
    //   })
    // ),

    // containerNo: Yup.string().required("Container No. is required"),
    // tflSealNo: Yup.string().required("TFL Seal No. is required"),
    //     CustomerName
    // Shipment type
    // Date of receipt

    // tinNo: Yup.number().nullable(),
    // vatNo: Yup.number().nullable(),
    // add1: Yup.string().required("Address is required"),
    // city: Yup.string().matches(
    //   /^[A-Za-z\s]+$/,
    //   "City must only contain letters"
    // ),

    // accountNo: Yup.number()
    //   .typeError("Account number must be a valid number")
    //   .positive("Account number must be positive"),
    // paymentType: Yup.string().required("Payment Type is required"),
    // creditDays: Yup.number().when("paymentType", {
    //   is: (value) => value === "credit",
    //   then: (schema) =>
    //     schema
    //       .required("Credit Days is required")
    //       .positive("Credit Days must be a positive number")
    //       .min(1, "Credit Days must be greater than or equal to 1"),
    //   otherwise: (schema) => schema,
    // }),

    // creditAmount: Yup.number().when("paymentType", {
    //   is: (value) => value === "credit",
    //   then: (schema) =>
    //     schema
    //       .required("Credit Amount is required")
    //       .positive("Credit Amount must be a positive number")
    //       .min(1, "Credit Amount must be greater than or equal to 1"),
    //   otherwise: (schema) => schema,
    // }),
    // customerEntityTariffs: Yup.array().of(
    //   Yup.object().shape({
    //     unitRate: Yup.number().min(0, "Unit Rate must be a positive number"),
    //   })
    // ),
    // customerEntityEmailsIds: Yup.array().of(
    //   Yup.object().shape({
    //     emailId: Yup.string().test(
    //       "multiple-emails",
    //       "Invalid email format",
    //       (value) => {
    //         if (!value) return false;
    //         const emails = value.split(",").map((email) => email.trim());
    //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //         return emails.every((email) => emailRegex.test(email));
    //       }
    //     ),
    //   })
    // ),
  });
