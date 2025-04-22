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
    field: "lineName",
    headerName: "Line Name",
    width: 140,
    headerAlign: "center",
    minWidth: 100,
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">{params.value?.trim() || ""}</div>
    ),
  },
  {
    flex: 1,
    field: "Line Invoice No.",
    headerName: "line Invoice No",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">{params.value?.trim() || ""}</div>
    ),
  },
  {
    flex: 1,
    field: "lineInvoiceDate",
    headerName: "Line Invoice Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">{params.value?.trim() || ""}</div>
    ),
  },
  {
    flex: 1,
    field: "purchaseInvoiceNo.",
    headerName: "Purchase Inv. No.",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">{params.value?.trim() || ""}</div>
    ),
  },
  {
    flex: 1,
    field: "purchaseInvDate",
    headerName: "Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">{params.value?.trim() || ""}</div>
    ),
  },
  {
    flex: 1,
    field: "paymentVNO",
    headerName: "Payment VNO",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">{params.value?.trim() || ""}</div>
    ),
  },
  {
    flex: 1,
    field: "paymentDate",
    headerName: "Payment Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">{params.value?.trim() || ""}</div>
    ),
  },
  {
    flex: 1,
    field: "totalAmount",
    headerName: "Total Amount",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">{params.value?.trim() || ""}</div>
    ),
  },
  {
    flex: 1,
    field: "credit",
    headerName: "Credit",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">{params.value?.trim() || ""}</div>
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
