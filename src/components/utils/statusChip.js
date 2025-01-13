export function StatusChip(status, field) {
    if (field === "document") {
        switch (status) {
            case false:
                return <div style={{ ...styles.chip, backgroundColor: "#fdf2e9", borderColor: "#e67e22", color: "#e67e22" }}>PENDING</div>
            case true:
                return <div style={{ ...styles.chip, backgroundColor: "#e9f7ef", borderColor: "#27ae60", color: "#27ae60" }}>AVAILABLE</div>
        }
    }
    else {
        switch (status) {
            case "active":
                return <div style={{ ...styles.chip, backgroundColor: "#e9f7ef", borderColor: "#27ae60", color: "#27ae60" }}>ACTIVE</div>
            case "new":
                return <div style={{ ...styles.chip, backgroundColor: "#ebf5fb", borderColor: "#3498db", color: "#3498db" }}>NEW</div>
            case "inactive":
                return <div style={{ ...styles.chip, backgroundColor: "#f9ebea", borderColor: "#c0392b", color: "#c0392b" }}>INACTIVE</div>
            case "pending_documents":
                return <div style={{ ...styles.chip, backgroundColor: "#fdf2e9", borderColor: "#e67e22", color: "#e67e22" }}>PENDING DOC</div>
            case "rejected":
                return <div style={{ ...styles.chip, backgroundColor: "#f9ebea", borderColor: "#c0392b", color: "#c0392b" }}>REJECTED</div>
            default:
                return

        }
    }
}

const styles = {
    chip: {
        fontSize: "12px",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "12px 0px",
        borderRadius: "16px",
        height: "20px",
        width: "94px",
        border: "1px solid"
    }
}