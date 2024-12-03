import React, { useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Grid,
  Button,
  IconButton,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const UserRole = ({ user }) => {
  const cards = [
    { avatar: "H", title: "Work", subheader: "Dev" },
    { avatar: "H", title: "Work", subheader: "Dev" },
    { avatar: "H", title: "Work", subheader: "Dev" },
    { avatar: "H", title: "Work", subheader: "Dev" },
    { avatar: "H", title: "Work", subheader: "Dev" },
    { avatar: "H", title: "Work", subheader: "Dev" },
    { avatar: "H", title: "Work", subheader: "Dev" },
    { avatar: "H", title: "Work", subheader: "Dev" },
    { avatar: "H", title: "Work", subheader: "Dev" },
    { avatar: "H", title: "Work", subheader: "Dev" },
    { avatar: "H", title: "Work", subheader: "Dev" },
    { avatar: "H", title: "Work", subheader: "Dev" },
  ];

  const [isActive, setIsActive] = useState(true);

  //   const handleChangeRowPerPage = (event) => {
  //     handlePage({
  //       page: paginationModel.page,
  //       pageSize: parseInt(event.target.value, 10),
  //     });
  //   };

  return (
    <Box sx={{ backgroundColor: "white.main" }}>
      <CardContent>
        <Grid container spacing={2} style={{ width: "100%" }}>
          {cards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  borderWidth: 1,
                  borderColor: "border.main",
                  borderRadius: "20px",
                  padding: "0px",
                }}
              >
                <CardHeader
                  action={
                    <IconButton color="primary" sx={{ margin: "8px 10px 0 0" }}>
                      <EditIcon sx={{ fontSize: "17px" }} />
                    </IconButton>
                  }
                  avatar={
                    <IconButton color="primary" sx={{ margin: "3px 0px 0 0" }}>
                      <DeleteIcon sx={{ fontSize: "17px" }} />
                    </IconButton>
                  }
                  sx={{ padding: "0px" }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ padding: "70%" }}>{card.avatar}</Avatar>
                  </Box>
                  <div
                    style={{
                      width: "70%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    <div>
                      <Typography variant="h6" component="div">
                        {card.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {card.subheader}
                      </Typography>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          fontSize: "12px",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "20px",
                          padding: "5px 9px",
                          backgroundColor: "green",
                          color: "#fff",
                          cursor: "pointer",
                          textAlign: "center",
                        }}
                        onClick={() => setIsActive(!isActive)}
                      >
                        Active
                      </div>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ borderRadius: "20px", textTransform: "unset" }}
                      >
                        Reset Pass
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
      <Box sx={styles.pagination}>
        <TablePagination
          component="div"
          //   count={count || 0}
          //   page={paginationModel.page}
          //   onPageChange={handleCardPagination}
          // onRowsPerPageChange={handleChangeRowPerPage}
          //   rowsPerPage={paginationModel.pageSize}
          rowsPerPageOptions={[10, 20, 50, 100]}
          color="primary"
          size="small"
          sx={{ mergin: "auto", backgroundColor: "white.main" }}
        />
      </Box>
    </Box>
  );
};

const styles = {
  pagination: {
    position: "sticky",
    bottom: -1,
    right: 0,
    backgroundColor: "white.main",
    borderTop: "1px solid #e0e0e0",
  },
};

export default UserRole;
