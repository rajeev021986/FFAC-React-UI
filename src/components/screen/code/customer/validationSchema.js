import * as Yup from 'yup';

export const CustomerValidationSchema = () => Yup.object({
  // iesclientcode: Yup.string().required("Client Code is required"),
  customerName: Yup.string().required("Name is required"),
  bankName: Yup.string().required("Bank Name is required"),
  add1: Yup.string().required("Address is required"),
  vatNo: Yup.string().required("VAT No is required"),
  zipCode: Yup.string().required("Zip Code is required"),
  customerEntityTariffs: Yup.array()
    .min(1, "At least one customer entity tariff is required")
    .of(
      Yup.object().shape({
        chargeName: Yup.string().required("Charge Name is required"),
        unitType: Yup.string().required("Unit Type is required"),
        currency: Yup.string().required("Currency is required"),
        shipmentType: Yup.string().required("Shipment Type is required"),
        unitRate: Yup.number()
          .required("Unit Rate is required")
          .positive("Unit Rate must be a positive number")
          .min(0.01, "Unit Rate must be greater than 0"),  // Enforce a minimum value of 0.01
      })
    )
    .required("Customer entity tariffs are required"),

  customerEntityEmailsIds: Yup.array()
    .min(1, "At least one Email and Designation is required")
    .of(
      Yup.object().shape({
        designation: Yup.string().required("Designation is required"),
        emailId: Yup.string().required("Email ID is required").email("Email ID must be valid"),
      })
    )
    .required("Customer entity emails are required"),
});
