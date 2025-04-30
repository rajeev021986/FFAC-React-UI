import * as Yup from "yup";

export const payableValidationSchema = () =>
  Yup.object({
    vendorInvoiceNo: Yup.string().required("Vendor Invoice No. is required!"),
  });
