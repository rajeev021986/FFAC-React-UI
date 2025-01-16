import * as Yup from "yup";

export const CustomerValidationSchema = () =>
  Yup.object({
    customerName: Yup.string().required("Name is required"),
    tinNo: Yup.string().nullable(),
    vatNo: Yup.string().nullable(),
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
    contactPerson: Yup.string().matches(
      /^[A-Za-z\s]+$/,
      "Contact Person must only contain letters"
    ),
    emailId: Yup.string().test(
      "valid-email",
      "Invalid email format",
      (value) => {
        if (!value) return true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      }
    ),
    telephone: Yup.number().typeError('Telephone must be a valid number')
      .positive('Telephone must be positive'),
    // fax: Yup.string().required("Fax is required"),
    bankName: Yup.string().matches(
      /^[A-Za-z\s]+$/,
      "Bank name must only contain letters"
    ),
    accountNo: Yup.number().typeError('Account number must be a valid number')
      .positive('Account number must be positive'),
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
        unitRate: Yup.number()
          .min(0, "Unit Rate must be a positive number")
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
