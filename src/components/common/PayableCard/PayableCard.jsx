import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { Grid, TablePagination, Typography } from "@mui/material";
import CardItem from "../PayableCard/CardItem";

export default function PayableCardView({
  columns,
  count,
  handlePage,
  data,
  paginationModel,
  loading,
  actions,
  setSelectedBox,
  seletectBox,
  page,
  handleEditClick, 
  handleDeleteClick
}) {
  const handleCardPagination = (event, page) => {
    handlePage({
      page: page,
      pageSize: paginationModel.pageSize,
    });
  };
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
    <>
      <Box sx={{ padding: "15px", paddingTop: "0" }}>
        <Grid container spacing={2}>
          {gridData?.map((item, index) => (
            <Grid item lg={3} gap={2} sx={{}}>
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
                handleEditClick={handleEditClick} 
                handleDeleteClick={handleDeleteClick}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

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
    </>
  );
}
