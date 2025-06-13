import * as Yup from "yup";

export const payableValidationSchema = () =>
  Yup.object({
    // invoiceType: Yup.string().required("Invoice Type is required!"),
    // // vendorInvoiceNo: Yup.string().required("Vendor Invoice No. is required!"),
    // vendorName: Yup.string().required("Vendor Name is required!"),
    // invoiceDate: Yup.string().required("Invoice Date is required!"),
    // currency: Yup.string().required("Currency is required!"),
    // jobNo: Yup.string().required("Job No. is required!"),
    // exchangeRate: Yup.string().required("Exchange Rate is required!"),
  });
