import * as Yup from "yup";

const phoneRegExp = /^[0-9]{7,15}$/;
export const LooseCargoValidationSchema = () =>
  Yup.object({
    telNo: Yup.string()
    .matches(phoneRegExp, "Telephone must be between 7 to 15 digits"),

  clerkTelNo: Yup.string()
    .matches(phoneRegExp, "Clerk Telephone must be between 7 to 15 digits")
  });
