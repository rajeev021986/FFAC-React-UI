import * as Yup from "yup";

export const IcdValidationSchema = () =>
  Yup.object({
    icd_name: Yup.string().required("Name is required"),
    address1: Yup.string().required("Address is required"),
    contact_person: Yup.string().matches(
      /^[A-Za-z\s]+$/,
      "Contact Person must only contain letters"
    ),
    email: Yup.string()
      .email("Invalid email format")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format"
      ),
    tel_no: Yup.number()
      .typeError("Telephone must be a valid number")
      .positive("Telephone must be positive"),
    mobile: Yup.number()
      .typeError("Mobile must be a valid number")
      .positive("Telephone must be positive"),
  });
