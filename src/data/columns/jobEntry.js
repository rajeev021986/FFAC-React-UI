import dayjs from "dayjs";
export const JOB_ENTRY_COLUMNS = [
  // {
  //   flex: 1,
  //   field: "isapprove",
  //   headerName: "Approve",
  //   width: 110,
  //   headerAlign: "center",
  //   align: "center",
  //   editable: false,
  // },
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
    field: "jobNo",
    headerName: "Job No.",
    width: 110,
    headerAlign: "center",
    align: "center",
    minWidth: 100,

    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">
        {params.value?.trim() || "N/A"} {/* Show "N/A" if empty */}
      </div>
    ),
  },

  {
    flex: 1,
    field: "customerName",
    headerName: "Customer",
    width: 140,
    headerAlign: "center",
    minWidth: 100,

    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">
        {params.value?.trim() || "N/A"} {/* Show "N/A" if empty */}
      </div>
    ),
  },
  {
    flex: 1,
    field: "supplierName",
    headerName: "Shipper",
    width: 110,
    minWidth: 100,

    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">
        {params.value?.trim() || "N/A"} {/* Show "N/A" if empty */}
      </div>
    ),
  },
  {
    flex: 1,
    field: "consigneeName",
    headerName: "Consignee",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">
        {params.value?.trim() || "N/A"} {/* Show "N/A" if empty */}
      </div>
    ),
  },
  {
    flex: 1,
    field: "portOfLoading",
    headerName: "Port Of Loading",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">
        {params.value?.trim() || "N/A"} {/* Show "N/A" if empty */}
      </div>
    ),
  },
  {
    flex: 1,
    field: "portOfDelivery",
    headerName: "Port Of Delivery",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">
        {params.value?.trim() || "N/A"} {/* Show "N/A" if empty */}
      </div>
    ),
  },
  {
    flex: 1,
    field: "customerRefNo",
    headerName: "Customer Ref.",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">
        {params.value?.trim() || "N/A"} {/* Show "N/A" if empty */}
      </div>
    ),
  },
  // {
  //   flex: 1,
  //   field: "tansadNo",
  //   headerName: "Tansad No.",
  //   width: 110,
  //   headerAlign: "center",
  //   align: "center",
  //   editable: false,
  //   renderCell: (params) => params.value?.trim() || "N/A",
  // },
  // {
  //   flex: 1,
  //   field: "hblNo",
  //   headerName: "Bl No.",
  //   width: 110,
  //   headerAlign: "center",
  //   align: "center",
  //   editable: false,
  //   renderCell: (params) => params.value?.trim() || "N/A",
  // },
  {
    flex: 1,
    field: "shipmentType",
    headerName: "Type",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">
        {params.value?.trim() || "N/A"} {/* Show "N/A" if empty */}
      </div>
    ),
  },
  {
    flex: 1,
    field: "createdBy",
    headerName: "Created By",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => params.value?.trim() || "N/A",
  },
  {
    flex: 1,
    field: "fileManager",
    headerName: "File Manager",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => params.value?.trim() || "N/A",
  },
  {
    flex: 1,
    field: "dateOfReceipt",
    headerName: "Date of Receipt",
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
    field: "action",
    headerName: "Action",
    width: 150,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
];
