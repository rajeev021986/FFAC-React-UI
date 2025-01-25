import toast from "react-hot-toast";
import CustomToast from "./Toast/CustomToast";

const getFirstError = (errors) => {
  for (const key in errors) {
    if (Array.isArray(errors[key])) {
      for (const item of errors[key]) {
        const nestedError = getFirstError(item);
        if (nestedError) return nestedError;
      }
    } else if (typeof errors[key] === "object") {
      const nestedError = getFirstError(errors[key]);
      if (nestedError) return nestedError;
    } else {
      return toast.custom(
        <CustomToast
          message={errors[key]}
          toast="error"
        />,
        {
          closeButton: false,
        }
      )
    }
  }
  return null;
};

export default getFirstError;
