import dayjs from "dayjs";
export const JOB_ENTRY_NEW_COLUMNS = [
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
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">
        {params.value?.trim() || "----"} {/* Show "N/A" if empty */}
      </div>
    ),
  },
  {
    flex: 1,
    field: "customerRefNo",
    headerName: "Customer Ref No",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">
        {params.value?.trim() || "----"} {/* Show "N/A" if empty */}
      </div>
    ),
  },
  {
    flex: 1,
    field: "customerName",
    headerName: "Customer Name",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">
        {params.value?.trim() || "----"} {/* Show "" if empty */}
      </div>
    ),
  },

  {
    flex: 1,
    field: "tansadNo",
    headerName: "Tansad No.",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => params.value?.trim() || "----",
  },
  {
    flex: 1,
    field: "mblNo",
    headerName: "MBl No.",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => params.value?.trim() || "----",
  },
  //   {
  //     flex: 1,
  //     field: "JobNo",
  //     headerName: "Job No.",
  //     width: 110,
  //     headerAlign: "center",
  //     align: "center",
  //     editable: false,
  //     renderCell: (params) => params.value?.trim() || "N/A",
  //   },
  {
    flex: 1,
    field: "dateOfReceipt",
    headerName: "Date of Receipt",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : "----"; // Format date
    },
  },
  {
    flex: 1,
    field: "createdBy",
    headerName: "Created By",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => params.value?.trim() || "----",
  },
  {
    flex: 1,
    field: "fileManager",
    headerName: "File Manager",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => params.value?.trim() || "----",
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
