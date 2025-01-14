import toast from "react-hot-toast";

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
      return toast.error(errors[key]);
    }
  }
  return null;
};

export default getFirstError;
