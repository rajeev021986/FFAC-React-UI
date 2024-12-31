import WarningIcon from "@mui/icons-material/Error";
import ErrorIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function CustomToast({ message, toast }) {
  console.log(toast, "toast");
  const toastStyle =
    toast === "warn"
      ? { ...styles.warn }
      : toast === "success"
      ? { ...styles.success }
      : { ...styles.error };
  return (
    <div
      style={{
        ...toastStyle,
        borderRadius: "10px",
        padding: "10px 20px",
        color: "black",
        fontSize: "16px",
        display: "flex",
        alignItems: "center",
      }}
    >
      {toast === "warn" ? (
        <WarningIcon
          style={{
            ...toastStyle,
            marginRight: "8px",
            color: "#f1c40f",
            fontSize: "20px",
          }}
        />
      ) : toast === "success" ? (
        <CheckCircleIcon
          style={{
            ...toastStyle,
            marginRight: "8px",
            color: "#27ae60",
            fontSize: "20px",
          }}
        />
      ) : (
        <ErrorIcon
          style={{
            toastStyle,
            marginRight: "8px",
            color: "#e74c3c",
            fontSize: "20px",
          }}
        />
      )}

      {message}
    </div>
  );
}

const styles = {
  warn: {
    backgroundColor: "#fef9e7",
    border: "1px solid #f1c40f",
  },
  error: {
    backgroundColor: "#fdedec",
    border: "1px solid #e74c3c",
  },
  success: {
    backgroundColor: "#e9f7ef",
    border: "1px solid #27ae60",
  },
};

export default CustomToast;
