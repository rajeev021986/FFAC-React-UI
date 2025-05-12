import * as Yup from "yup";

export const CustomerValidationSchema = () =>
  Yup.object({
    customerName: Yup.string()
  .matches(/^[A-Za-z\s]+$/, "Customer name is not valid")
  .required("Name is required"),


    tinNo: Yup.number().nullable(),
    vatNo: Yup.number().nullable(),
    // status: Yup.string().required("Status is required"),
    add1: Yup.string().required("Address is required"),
    // add2: Yup.string().required("Address is required"),
    // add3: Yup.string().required("Address is required"),
    // poNo: Yup.string().required("Po number is requir ed"),
    city: Yup.string().matches(
      /^[A-Za-z\s]+$/,
      "City must only contain letters"
    ),
    // country: Yup.string().required("Country is required"),
    province: Yup.string().matches(
      /^[A-Za-z\s]+$/,
      "Province must only contain letters"
    ),
    contactPerson: Yup.string()
  .matches(/^[A-Za-z\s]+$/, "Contact Person is not valid")
  .required("Contact Person is required"),
   
    emailId: Yup.string()
    .required("Email is required")
    .email("Invalid email format")
    .matches(
      /^[a-zA-Z0-9._%+-]+@(?!gmail\d)(gmail|yahoo|outlook)\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    ),
    telephone: Yup.string()
    .required("Telephone is required")
    .matches(/^\d+$/, "Telephone must be a valid number")
    .test(
      "len",
      "Telephone must be between 10 and 15 digits",
      (val) => val && val.length >= 10 && val.length <= 15
    )
    .test(
      "positive",
      "Telephone must be a positive number",
      (val) => val && !val.startsWith("-")
    ),
    accountNo: Yup.number()
      .typeError("Account number must be a valid number")
      .positive("Account number must be positive"),
    // customerType: Yup.string().required("Customer Type is required"),
    // companyCode: Yup.string().required("Company Code is required"),
    paymentType: Yup.string().required("Payment Type is required"),
    creditDays: Yup.number().when("paymentType", {
      is: (value) => value === "credit",
      then: (schema) =>
        schema
          .required("Credit Days is required")
          .positive("Credit Days must be a positive number")
          .min(1, "Credit Days must be greater than or equal to 1"),
      otherwise: (schema) => schema,
    }),

    creditAmount: Yup.number().when("paymentType", {
      is: (value) => value === "credit",
      then: (schema) =>
        schema
          .required("Credit Amount is required")
          .positive("Credit Amount must be a positive number")
          .min(1, "Credit Amount must be greater than or equal to 1"),
      otherwise: (schema) => schema,
    }),
    // rejectRemarks: Yup.string().required("Reject remarks is required"),
    customerEntityTariffs: Yup.array().of(
      Yup.object().shape({
        unitRate: Yup.number().min(0, "Unit Rate must be a positive number"),
      })
    ),

    customerEntityEmailsIds: Yup.array().of(
      Yup.object().shape({
        emailId: Yup.string().test(
          "multiple-emails",
          "Invalid email format",
          (value) => {
            if (!value) return false;
            const emails = value.split(",").map((email) => email.trim());
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emails.every((email) => emailRegex.test(email));
          }
        ),
      })
    ),
  });
