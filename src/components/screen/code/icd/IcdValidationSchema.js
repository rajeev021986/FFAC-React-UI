import * as Yup from "yup";
const phoneRegExp = /^[0-9]{7,15}$/;
const mobileRegExp = /^[0-9]{10,15}$/;
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
    tel_no: Yup.string().matches(
      phoneRegExp,
      "Telephone must be between 7 to 15 digits"
    ),
    mobile: Yup.string().matches(
      mobileRegExp,
      "Mobile must be between 10 to 15 digits"
    ),
  });
