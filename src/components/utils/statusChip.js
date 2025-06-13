import VerifiedIcon from "@mui/icons-material/Verified";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

export function StatusChip(status, field) {
  if (field === "document") {
    switch (status) {
      case false:
        return (
          <div
            style={{
              ...styles.chip,
              backgroundColor: "#FFDA9D",
              color: "#DC8900",
            }}
          >
            <AssignmentLateIcon sx={styles.icon} />
            PENDING
          </div>
        );
      case true:
        return (
          <div
            style={{
              ...styles.chip,
              backgroundColor: "#ddeade",
              color: "#2e7d32",
            }}
          >
            <RadioButtonCheckedIcon sx={styles.icon} />
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
              backgroundColor: "#ddeade",
              color: "#2e7d32",
            }}
          >
            <RadioButtonCheckedIcon sx={styles.icon} />
            ACTIVE
          </div>
        );
      case "new":
        return (
          <div
            style={{
              ...styles.chip,
              backgroundColor: "#e6f4fb",
              color: "#0288d1",
            }}
          >
            <VerifiedIcon sx={styles.icon} />
            NEW
          </div>
        );
      case "inactive":
        return (
          <div
            style={{
              ...styles.chip,
              backgroundColor: "#FF999C",
              color: "#AA2F33",
            }}
          >
            <DoNotDisturbIcon sx={styles.icon} />
            INACTIVE
          </div>
        );
      case "pending_documents":
        return (
          <div
            style={{
              ...styles.chip,
              backgroundColor: "#FFDA9D",
              color: "#DC8900",
            }}
          >
            <AssignmentLateIcon sx={styles.icon} />
            PENDING DOC
          </div>
        );
      case "rejected":
        return (
          <div
            style={{
              ...styles.chip,
              backgroundColor: "#FF999C",
              color: "#FF474D",
            }}
          >
            <CancelIcon sx={styles.icon} />
            REJECTED
          </div>
        );
      case "unpaid":
        return (
          <div
            style={{
              ...styles.chip,
              backgroundColor: "#FF999C",
              color: "#AA2F33",
            }}
          >
            <ErrorOutlineIcon sx={styles.icon} />
            UNPAID
          </div>
        );
      case "paid":
        return (
          <div
            style={{
              ...styles.chip,
              backgroundColor: "#ddeade",
              color: "#2e7d32",
            }}
          >
            <DoneAllIcon sx={styles.icon} />
            PAID
          </div>
        );
      case "cancel":
        return (
          <div
            style={{
              ...styles.chip,
              backgroundColor: "#FFADB0",
              color: "#FF474D",
            }}
          >
            <CancelIcon sx={styles.icon} />
            CANCEL
          </div>
        );
      case "canceled":
        return (
          <div
            style={{
              ...styles.chip,
              backgroundColor: "#FFADB0",
              color: "#FF474D",
            }}
          >
            <CancelIcon sx={styles.icon} />
            CANCELED
          </div>
        );
      case "pending":
        return (
          <div
            style={{
              ...styles.chip,
              backgroundColor: "#FFDA9D",
              color: "#DC8900",
            }}
          >
            <HourglassEmptyIcon sx={styles.icon} />
            PENDING
          </div>
        );
      case "approved":
        return (
          <div
            style={{
              ...styles.chip,
              backgroundColor: "#27ae60",
              color: "#ffffff",
            }}
          >
            <RadioButtonCheckedIcon sx={styles.icon} />
            APPROVED
          </div>
        );
      default:
        return (
          <div
            style={{
              ...styles.chip,
              backgroundColor: "#7f8c8d",
              color: "#ffffff",
            }}
          >
            <RemoveCircleOutlineIcon sx={styles.icon} />
            {status?.toUpperCase?.() ?? "UNKNOWN"}
          </div>
        );
    }
  }
}

const styles = {
  chip: {
    fontSize: "11px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "12px 8px",
    borderRadius: "16px",
    fontWeight: "bold",
    height: "20px",
    width: "120px",
    border: "1px solid",
    gap: "4px",
  },
  icon: {
    fontSize: 16,
    marginRight: "4px",
  },
};
