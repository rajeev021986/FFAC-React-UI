import dayjs from "dayjs";

export const PAYABLE_COLUMNS = [
  {
    flex: 1,
    field: "isDoc",
    headerName: "Document",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
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
    field: "invoiceType",
    headerName: "Invoice Type",
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
    field: "payableRefNo",
    headerName: "Payable Ref. No.",
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
    field: "invoiceDate",
    headerName: "Invoice Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return dayjs(params?.value)?.format("DD/MM/YYYY"); // Format date
    },
  },
  {
    flex: 1,
    field: "vendorName",
    headerName: "Vendor Name",
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
    field: "vendorInvoiceNo",
    headerName: "Vendor Invoice No.",
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
    field: "vendorInvoiceDate",
    headerName: "Vendor Invoice Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return dayjs(params?.value)?.format("DD/MM/YYYY"); // Format date
    },
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
    field: "exchangeRate",
    headerName: "Ex. Rate",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">{String(params?.value ?? "").trim()}</div>
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
