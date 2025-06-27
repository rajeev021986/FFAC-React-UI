import {
  Box,
  CircularProgress,
  Grid,
  TablePagination,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CardItem from "./CardItem";

export default function CardsView({
  columns,
  count,
  handlePage,
  data,
  paginationModel,
  loading,
  uniqueId,
  actions,
  icon,
  setSelectedBox,
  seletectBox,
  page,
}) {
  const handleCardPagination = (event, page) => {
    handlePage({
      page: page,
      pageSize: paginationModel.pageSize,
    });
  };
  // const [seletectBox, setSelectedBox] = useState([]);

  const handleChangeRowPerPage = (event) => {
    handlePage({
      page: paginationModel.page,
      pageSize: parseInt(event.target.value, 10),
    });
  };
  var styles = {
    pagination: {
      position: "sticky",
      bottom: -1,
      right: 0,
      backgroundColor: "white.main",
      borderTop: "1px solid #e0e0e0",
      borderBottom: "1px solid #e0e0e0",
      width: "100%",
      // height: "50px",
      marginTop: "auto",
    },
  };
  Boolean(page === "user_management") &&
    (styles = {
      ...styles,
      grid: { display: "flex", flexWrap: "wrap", gap: "10px" },
    });

  const handleDate = (date) => {
    return date.split("T")[0];
  };

  const gridData = data?.map((obj) => {
    return {
      ...obj,
      modifiedDate: obj.modifiedDate
        ? handleDate(obj.modifiedDate)
        : obj.modifiedDate,
      createdDate: obj.createdDate
        ? handleDate(obj.createdDate)
        : obj.createdDate,
      invoiceDate: obj.invoiceDate
        ? handleDate(obj.invoiceDate)
        : obj.invoiceDate,
      vendorInvoiceDate: obj.vendorInvoiceDate
        ? handleDate(obj.vendorInvoiceDate)
        : obj.vendorInvoiceDate,
      vendorInvDate: obj.vendorInvDate
        ? handleDate(obj.vendorInvDate)
        : obj.vendorInvDate,
      jobCreatedDate: obj.jobCreatedDate
        ? handleDate(obj.jobCreatedDate)
        : obj.jobCreatedDate,
      paybleCreatedDate: obj.paybleCreatedDate
        ? handleDate(obj.paybleCreatedDate)
        : obj.paybleCreatedDate,
      reportingDate: obj.reportingDate
        ? handleDate(obj.reportingDate)
        : obj.reportingDate,
      transferDate: obj.transferDate
        ? handleDate(obj.transferDate)
        : obj.transferDate,
      t1C1ReadyDate: obj.t1C1ReadyDate
        ? handleDate(obj.t1C1ReadyDate)
        : obj.t1C1ReadyDate,
      loadingDate: obj.loadingDate
        ? handleDate(obj.loadingDate)
        : obj.loadingDate,
      cancellationDate: obj.cancellationDate
        ? handleDate(obj.cancellationDate)
        : obj.cancellationDate,
      arrivalBorderDate: obj.arrivalBorderDate
        ? handleDate(obj.arrivalBorderDate)
        : obj.arrivalBorderDate,
      crossedBorderDate: obj.crossedBorderDate
        ? handleDate(obj.crossedBorderDate)
        : obj.crossedBorderDate,
      arrivalICDDate: obj.arrivalICDDate
        ? handleDate(obj.arrivalICDDate)
        : obj.arrivalICDDate,
         cargoReleaseDate: obj.cargoReleaseDate
        ? handleDate(obj.cargoReleaseDate)
        : obj.cargoReleaseDate,
          departICDDate: obj.departICDDate
        ? handleDate(obj.departICDDate)
        : obj.departICDDate,
         departICDDate: obj.departICDDate
        ? handleDate(obj.departICDDate)
        : obj.departICDDate,
        arrivalCustomerPlaceDate :  obj.arrivalCustomerPlaceDate
        ? handleDate(obj.arrivalCustomerPlaceDate)
        : obj.arrivalCustomerPlaceDate,
         emptyReleasedDate :  obj.emptyReleasedDate
        ? handleDate(obj.emptyReleasedDate)
        : obj.emptyReleasedDate,
         podDate :  obj.podDate
        ? handleDate(obj.podDate)
        : obj.podDate,
         emptyReturnDate :  obj.emptyReturnDate
        ? handleDate(obj.emptyReturnDate)
        : obj.emptyReturnDate,
         certificateOfExportDate :  obj.certificateOfExportDate
        ? handleDate(obj.certificateOfExportDate)
        : obj.certificateOfExportDate,
         portGateInDate :  obj.portGateInDate
        ? handleDate(obj.portGateInDate)
        : obj.portGateInDate,
         nominationDate :  obj.nominationDate
        ? handleDate(obj.nominationDate)
        : obj.nominationDate,
      type: obj.type ? obj.type.replace(/_/g, " ").trim() : obj.type,
    };
  });
  return (
    <Grid
      sx={{
        maxWidth: "100%",
        borderRadius: "5px",
        // height: "calc(100vh - 250px)",
        overflowY: "auto",
        position: "relative",
        pt: 1,
        backgroundColor: "white.main",
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      <Grid width="100%" gap={2} sx={styles.grid}>
        {gridData?.map((item, index) => (
          <CardItem
            key={item.id}
            item={item}
            columns={columns}
            selectedBox={seletectBox}
            setSelectedBox={setSelectedBox}
            uniqueId={item.id}
            actions={actions}
            icon={null}
            page={page}
          />
        ))}

        {gridData?.length === 0 && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50px"
            width="100%"
          >
            <Typography className="text-center">No Data Found!!</Typography>
          </Box>
        )}

        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        )}
      </Grid>

      {gridData?.length > 0 && (
        <Box sx={styles.pagination}>
          <TablePagination
            component="div"
            count={count || 0}
            page={paginationModel.page}
            onPageChange={handleCardPagination}
            onRowsPerPageChange={handleChangeRowPerPage}
            rowsPerPage={paginationModel.pageSize}
            rowsPerPageOptions={[10, 20, 50, 100]}
            color="primary"
            size="small"
            sx={{ margin: "auto", backgroundColor: "white.main" }}
          />
        </Box>
      )}
    </Grid>
  );
}
