export function StatusChip(status, field) {
  if (field === "document") {
    switch (status) {
      case false:
        return (
          <div
            style={{
              ...styles.chip,
              backgroundColor: "#e67e22",
              borderColor: "#e67e22",
              color: "#ffffff",
            }}
          >
            PENDING
          </div>
        );
      case true:
        return (
          <div
            style={{
              ...styles.chip,
              backgroundColor: " #27ae60",
              borderColor: "#27ae60",
              color: "#ffffff",
            }}
          >
            AVAILABLE
          </div>
        );
    }
  } else {
    switch (status) {
      case "active":
        return (
          <div
            style={{
              ...styles.chip,
              backgroundColor: "#27ae60",
              borderColor: "#27ae60",
              color: "#ffffff",
            }}
          >
            ACTIVE
          </div>
        );
      case "new":
        return (
          <div
            style={{
              ...styles.chip,
              backgroundColor: "#3498db",
              borderColor: "#3498db",
              color: "#ffffff",
            }}
          >
            NEW
          </div>
        );
      case "inactive":
        return (
          <div
            style={{
              ...styles.chip,
              backgroundColor: "#c0392b",
              borderColor: "#c0392b",
              color: "#ffffff",
            }}
          >
            INACTIVE
          </div>
        );
      case "pending_documents":
        return (
          <div
            style={{
              ...styles.chip,
              backgroundColor: "#e67e22",
              borderColor: "#e67e22",
              color: "#ffffff",
            }}
          >
            PENDING DOC
          </div>
        );
      case "rejected":
        return (
          <div
            style={{
              ...styles.chip,
              backgroundColor: "#c0392b",
              borderColor: "#c0392b",
              color: "#ffffff",
            }}
          >
            REJECTED
          </div>
        );
      case "unpaid":
        return (
          <div
            style={{
              ...styles.chip,
              backgroundColor: "#c0392b",
              borderColor:"#c0392b",
              color: "#ffffff",
            }}
          >
            UNPAID
          </div>
        );
           case "paid":
        return (
          <div
            style={{
              ...styles.chip,
              backgroundColor:"#27ae60",
              borderColor:"#27ae60",
              color: "#ffffff",
            }}
          >
            PAID
          </div>
        );
      case "cancel":
        return (
          <div
            style={{
              ...styles.chip,
              backgroundColor: "#ff3336",
              borderColor: "#ff3336",
              color: "#ffffff",
            }}
          >
            CANCEL
          </div>
        );
      default:
        return;
    }
  }
}

const styles = {
  chip: {
    fontSize: "11px",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px 0px",
    borderRadius: "16px",
    fontWeight: "bold",
    height: "20px",
    width: "94px",
    border: "1px solid",
  },
};
