import { Box, CircularProgress, TablePagination } from "@mui/material";
import React from "react";
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
}) {
  const handleCardPagination = (event, page) => {
    console.log(page);
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

  return (
    <Box
      sx={{
        maxWidth: "100%",
        borderRadius: "5px",
        height: "calc(100vh - 250px)",
        overflowY: "auto",
        position: "relative",
        pt: 2,
        backgroundColor: "#f7f7f7",
      }}
    >
      {data?.map((item, index) => (
        <CardItem
          item={item}
          key={index}
          columns={columns}
          uniqueId={uniqueId}
          actions={actions}
          icon={icon}
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

      {data?.length > 0 && (
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
            sx={{ mergin: "auto" }}
          />
        </Box>
      )}
    </Box>
  );
}

const styles = {
  pagination: {
    position: "sticky",
    bottom: -1,
    right: 0,
    backgroundColor: "white.main",
    borderTop: "1px solid #e0e0e0",
  },
};
