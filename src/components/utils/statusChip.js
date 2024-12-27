export function StatusChip(status) {
    switch (status) {
        case "active":
            return <div style={{ ...styles.chip, backgroundColor: "#fef9e7", borderColor: "#f1c40f", color: "#f1c40f" }}>ACTIVE</div>
        case "new":
            return <div style={{ ...styles.chip, backgroundColor: "#ebf5fb", borderColor: "#3498db", color: "#3498db" }}>NEW</div>
        case "inactive":
            return <div style={{ ...styles.chip, backgroundColor: "#f8f9f9", borderColor: "#bdc3c7", color: "#bdc3c7" }}>INACTIVE</div>
        case "approve":
            return <div style={{ ...styles.chip, backgroundColor: "#e9f7ef", borderColor: "#27ae60", color: "#27ae60" }}>APPROVE</div>
        case "pending_documents":
            return <div style={{ ...styles.chip, backgroundColor: "#fdf2e9", borderColor: "#e67e22", color: "#e67e22" }}>PENDING</div>
        case "reject":
            return <div style={{ ...styles.chip, backgroundColor: "#f9ebea", borderColor: "#c0392b", color: "#c0392b" }}>REJECT</div>
        default:
            return <div style={{ ...styles.chip, backgroundColor: "#ebf5fb", borderColor: "#3498db", color: "#3498db" }}></div>

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
        width: "84px",
        border: "1px solid"
    }
}