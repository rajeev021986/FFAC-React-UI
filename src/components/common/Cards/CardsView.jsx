import { Box, CircularProgress, Grid, TablePagination } from "@mui/material";
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
      width: "100%",
      height: "50px",
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
    };
  });

  return (
    <Grid
      sx={{
        maxWidth: "100%",
        borderRadius: "5px",
        height: "calc(100vh - 190px)",
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
            sx={{ mergin: "auto", backgroundColor: "white.main" }}
          />
        </Box>
      )}
    </Grid>
  );
}
