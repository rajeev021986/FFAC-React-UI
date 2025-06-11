import { Tooltip } from "@mui/material";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
export const JOB_ENTRY_COLUMNS = [
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
        {params.value?.trim() || ""} {/* Show "N/A" if empty */}
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
        {params.value?.trim() || ""} {/* Show "N/A" if empty */}
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
        {params.value?.trim() || ""} {/* Show "N/A" if empty */}
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
        {params.value?.trim() || ""} {/* Show "N/A" if empty */}
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
        {params.value?.trim() || ""} {/* Show "N/A" if empty */}
      </div>
    ),
  },
  {
    flex: 1,
    field: "placeOfDelivery",
    headerName: "Port Of Delivery",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <div className="word-wrap-cell">
        {params.value?.trim() || ""} {/* Show "N/A" if empty */}
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
        {params.value?.trim() || ""} {/* Show "N/A" if empty */}
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
        {params.value?.trim() || ""} {/* Show "N/A" if empty */}
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
    renderCell: (params) => params.value?.trim() || "",
  },
  {
    flex: 1,
    field: "fileManager",
    headerName: "File Manager",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => params.value?.trim() || "",
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
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
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

export const CONTAINER_COLUMNS = (onContainerClick) => [
  {
    flex: 1,
    field: "containerNo",
    headerName: "Container No.",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => (
      <Tooltip title={`${params.value}`} arrow>
        <div className="word-wrap-cell">
          <Link
            href="#"
            underline="always"
            style={{
              color: "black",
              textDecoration: "underline", // enforce underline
              "&:hover": {
                textDecoration: "underline", // ensure hover underline still works
              },
            }}
            onClick={(event) => {
              event.preventDefault();
              onContainerClick(params.row);
            }}
          >
            {params.value}
          </Link>
        </div>
      </Tooltip>
    ),
  },
  {
    flex: 1,
    field: "sizeType",
    headerName: "Size Type",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "sealNo",
    headerName: "Seal No.",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "driver",
    headerName: "Driver",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "truckTrailerNo",
    headerName: "Truck Trailer No.",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "transporter",
    headerName: "Transporter",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "truckTrailerNoTransporter",
    headerName: "Truck TrailerNo. Transporter",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "agreedRate",
    headerName: "Agreed Rate",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "telNo",
    headerName: "Tel No.",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "passportNo",
    headerName: "Passport No.",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "licenceNo",
    headerName: "License No.",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "clerkName",
    headerName: "Clerk Name",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "clerkTelNo",
    headerName: "Clerk Tel no.",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "reportingPlace",
    headerName: "Reporting Place",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "reportingDate",
    headerName: "Reporting Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "transferDate",
    headerName: "Transfer Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "t1C1ReadyDate",
    headerName: "T1C1Ready Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "loadingDate",
    headerName: "Loading Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "cancellationDate",
    headerName: "Cancellation Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "arrivalBorderDate",
    headerName: "Arrival Border Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "crossedBorderDate",
    headerName: "Crossed Border Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "arrivalICDDate",
    headerName: "Arrival ICD Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "cargoReleaseDate",
    headerName: "Cargo Release Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "departICDDate",
    headerName: "Depart ICD Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "bondNumber",
    headerName: "Bond Number",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "bondAmount",
    headerName: "Bond Amount",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "arrivalCustomerPlaceDate",
    headerName: "Arrival Customer Place Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "emptyReleasedDate",
    headerName: "Empty Released Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "emptyReturnPlace",
    headerName: "Empty Return Place",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "podNo",
    headerName: "Pod No",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "podDate",
    headerName: "POD Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  // {
  //   flex: 1,
  //   field: "emptyReturnDate",
  //   headerName: "Empty Return Date",
  //   width: 110,
  //   headerAlign: "center",
  //   align: "center",
  //      renderCell: (params) => {
  //     return dayjs(params?.value)?.format("DD/MM/YYYY"); // Format date
  //   },
  //   editable: false,
  // },
  {
    flex: 1,
    field: "certificateOfExportDate",
    headerName: "Certificate Of Export Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "portGateInDate",
    headerName: "Port Gate In Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "nominationDate",
    headerName: "Nomination Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "remark",
    headerName: "Remark",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  // {
  //   flex: 1,
  //   field: "action",
  //   headerName: "Action",
  //   width: 110,
  //   headerAlign: "center",
  //   align: "center",
  //   editable: false,
  // },
];

export const VEHICLE_COLUMNS = [
  {
    flex: 1,
    field: "chasisNo",
    headerName: "Chasis No.",
    width: 130,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "engineCapacity",
    headerName: "Engine Capacity",
    width: 140,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "driverCellNo",
    headerName: "Driver Cell No.",
    width: 140,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "clerkName",
    headerName: "Clerk Name",
    width: 130,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "clerkTelNo",
    headerName: "Clerk Tel No.",
    width: 130,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "reportingPlace",
    headerName: "Reporting Place",
    width: 150,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "reportingDate",
    headerName: "Reporting Date",
    width: 150,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "transferDate",
    headerName: "Transfer Date",
    width: 140,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "t1C1ReadyDate",
    headerName: "T1/C1 Ready Date",
    width: 160,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "loadingDate",
    headerName: "Loading Date",
    width: 140,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "cancellationDate",
    headerName: "Cancellation Date",
    width: 160,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "arrivalBorderDate",
    headerName: "Arrival Border Date",
    width: 160,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "crossedBorderDate",
    headerName: "Crossed Border Date",
    width: 160,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "arrivalICDDate",
    headerName: "Arrival ICD Date",
    width: 150,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "cargoReleaseDate",
    headerName: "Cargo Release Date",
    width: 160,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "departICDDate",
    headerName: "Depart ICD Date",
    width: 150,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "bondNumber",
    headerName: "Bond Number",
    width: 130,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "bondAmount",
    headerName: "Bond Amount",
    width: 130,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "arrivalCustomerPlaceDate",
    headerName: "Arrival Customer Place",
    width: 190,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "remark",
    headerName: "Remark",
    width: 180,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "action",
    headerName: "Action",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
];

export const LOOSECARGO_COLUMNS = [
  {
    flex: 1,
    field: "truckNo",
    headerName: "Truck No.",
    width: 130,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "packageType",
    headerName: "Package Type",
    width: 130,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "trailerNo",
    headerName: "Trailer No.",
    width: 130,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "transporter",
    headerName: "Transporter",
    width: 150,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "transporterId",
    headerName: "Transporter ID",
    width: 130,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "truckTrailerNo",
    headerName: "Truck/Trailer No.",
    width: 160,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "driver",
    headerName: "Driver",
    width: 130,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "agreedRate",
    headerName: "Agreed Rate",
    width: 130,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "telNo",
    headerName: "Tel No.",
    width: 120,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "passportNo",
    headerName: "Passport No.",
    width: 140,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "licenceNo",
    headerName: "Licence No.",
    width: 130,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "clerkName",
    headerName: "Clerk Name",
    width: 130,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "clerkId",
    headerName: "Clerk ID",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "clerkTelNo",
    headerName: "Clerk Tel No.",
    width: 130,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "reportingPlace",
    headerName: "Reporting Place",
    width: 150,
    headerAlign: "center",
    align: "center",
    editable: false,
  },

  {
    flex: 1,
    field: "reportingDate",
    headerName: "Reporting Date",
    width: 150,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },

  {
    flex: 1,
    field: "transferDate",
    headerName: "Transfer Date",
    width: 140,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "t1C1ReadyDate",
    headerName: "T1/C1 Ready Date",
    width: 160,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "loadingDate",
    headerName: "Loading Date",
    width: 140,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "cancellationDate",
    headerName: "Cancellation Date",
    width: 160,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "arrivalBorderDate",
    headerName: "Arrival Border Date",
    width: 160,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "crossedBorderDate",
    headerName: "Crossed Border Date",
    width: 160,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "arrivalICDDate",
    headerName: "Arrival ICD Date",
    width: 150,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "cargoReleaseDate",
    headerName: "Cargo Release Date",
    width: 160,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "departICDDate",
    headerName: "Depart ICD Date",
    width: 150,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "bondNumber",
    headerName: "Bond Number",
    width: 130,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "bondAmount",
    headerName: "Bond Amount",
    width: 130,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "arrivalCustomerPlaceDate",
    headerName: "Arrival Customer Place",
    width: 190,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return params?.value ? dayjs(params?.value)?.format("DD/MM/YYYY") : ""; // Format date
    },
  },
  {
    flex: 1,
    field: "remark",
    headerName: "Remark",
    width: 180,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "action",
    headerName: "Action",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
];
