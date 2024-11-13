import * as Yup from 'yup';

// export const PartyValidationSchema = () => Yup.object({
//     cname: Yup.string().required("Name is required"),
// });

export const PartyValidationSchema = () =>
    Yup.object({
      cname: Yup.string().required("Name is required"),
      atype: Yup.array()
        .min(1, "At least one option must be selected") // At least one checkbox required
        .required("This field is required"),
    });