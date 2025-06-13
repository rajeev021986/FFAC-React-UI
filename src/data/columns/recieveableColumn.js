import dayjs from "dayjs";

export const RECIVEABLE_COLUMNS = [
  {
    flex: 1,
    field: "status",
    headerName: "Status",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "customerName",
    headerName: "Customer Name",
    width: 140,
    headerAlign: "center",
    minWidth: 100,
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">{params?.value?.trim() || ""}</div>
    ),
  },
  {
    flex: 1,
    field: "consigneeName",
    headerName: "Consignee Name",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">{params?.value?.trim() || ""}</div>
    ),
  },
  {
    flex: 1,
    field: "jobNo",
    headerName: "Job No.",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">{params?.value?.trim() || ""}</div>
    ),
  },
  {
    flex: 1,
    field: "receivableRefNo",
    headerName: "Receivable RefNo",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
   renderCell: (params) => (
      <div className="word-wrap-cell">{params?.value?.trim() || ""}</div>
    ),
  },
  {
    flex: 1,
    field: "type",
    headerName: "Type",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">
        {(params?.value || "").replace(/_/g, " ").trim()}
      </div>
    ),
  },
  {
    flex: 1,
    field: "currency",
    headerName: "Currency",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">{params?.value?.trim() || ""}</div>
    ),
  },
  {
    flex: 1,
    field: "action",
    headerName: "Action",
    width: 150,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
];
