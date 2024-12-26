import * as Yup from 'yup';

export const CustomerValidationSchema = () => Yup.object({
  customerName: Yup.string().required("Name is required"),
  tinNo: Yup.string().required("TIN No is required"),
  vatNo: Yup.string().required("VAT No is required"),
  // status: Yup.string().required("Status is required"),
  bankName: Yup.string().required("Bank Name is required"),
  add1: Yup.string().required("Address is required"),
  // add2: Yup.string().required("Address is required"),
  // add3: Yup.string().required("Address is required"),
  poNo: Yup.string().required("Post is required"),
  city: Yup.string().required("City is required"),
  country: Yup.string().required("Country is required"),
  province: Yup.string().required("Province is required"),
  contactPerson: Yup.string().required("Person is required"),
  emailId: Yup.string().required("Email is required"),
  telephone: Yup.string().required("Telephone is required"),
  fax: Yup.string().required("Fax is required"),
  bankName: Yup.string().required("Bank is required"),
  accountNo: Yup.string().required("Account Number is required"),
  customerType: Yup.string().required("Customer Type is required"),
  // companyCode: Yup.string().required("Company Code is required"),
  // paymentType: Yup.string().required("Payment Type is required"),
  // creditDays: Yup.string().required("Credit Days is required"),
  // creditAmount: Yup.string().required("Credit Amount is required"),
  // rejectRemarks: Yup.string().required("Remarks is required"),
  // customerEntityTariffs: Yup.array()
  //   .min(1, "At least one customer entity tariff is required")
  //   .of(
  //     Yup.object().shape({
  //       chargeName: Yup.string().required("Charge Name is required"),
  //       unitType: Yup.string().required("Unit Type is required"),
  //       currency: Yup.string().required("Currency is required"),
  //       shipmentType: Yup.string().required("Shipment Type is required"),
  //       unitRate: Yup.number()
  //         .required("Unit Rate is required")
  //         .positive("Unit Rate must be a positive number")
  //         .min(0.01, "Unit Rate must be greater than 0"),  // Enforce a minimum value of 0.01
  //     })
  //   )
  //   .required("Customer entity tariffs are required"),

  // customerEntityEmailsIds: Yup.array()
  //   .min(1, "At least one Email and Designation is required")
  //   .of(
  //     Yup.object().shape({
  //       designation: Yup.string().required("Designation is required"),
  //       emailId: Yup.string().required("Email ID is required").email("Email ID must be valid"),
  //     })
  //   )
  //   .required("Customer entity emails are required"),
});
