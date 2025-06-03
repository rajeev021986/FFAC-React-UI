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
    .test("valid-email", "Invalid email format", (value) => {
      if (!value) return true; // skip if empty
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) return false;
      if (value.includes("..")) return false;
      const domainPart = value.split('@')[1];
      if (domainPart && /\d+/.test(domainPart.split('.')[0])) {
        return false;
      }
      return true;
    }),

  tel_no: Yup.string()
    .matches(/^\d+$/, "Telephone must be a valid number")
    .test("len", "Telephone must be between 7 and 15 digits", (val) => {
      if (!val) return true; // skip if empty
      return val.length >= 7 && val.length <= 15;
    })
    .test("positive", "Telephone must be a positive number", (val) => {
      if (!val) return true;
      return !val.startsWith("-");
    }),

  mobile: Yup.string()
    .matches(/^\d+$/, "Mobile must be a valid number")
    .test("len", "Mobile must be between 10 and 15 digits", (val) => {
      if (!val) return true; // skip if empty
      return val.length >= 10 && val.length <= 15;
    })
    .test("positive", "Mobile must be a positive number", (val) => {
      if (!val) return true;
      return !val.startsWith("-");
    }),
});




