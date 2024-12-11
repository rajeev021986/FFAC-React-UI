import React from "react";
import { Box, Grid, Checkbox, CardHeader, Card, IconButton, Avatar, Typography, Button } from "@mui/material";
import { MoreVert, VerifiedUserOutlined } from "@mui/icons-material";
import CardField from "./CardField";
import TMenu from "../TMenu";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";

export default function CardItemUser({
  item,
  columns,
  selectedBox,
  setSelectedBox,
  uniqueId,
  actions,
  icon,
  page,
}) {
  const avatar = () => {
    if (item.firstName) {
      return item.firstName.charAt(0);
    } else {
      return <Avatar src="/broken-image.jpg" />;
    }
  }

  return (
    <Card
      sx={{
        borderWidth: 1,
        borderColor: "border.main",
        borderRadius: "20px",
        padding: "10px",
        width: "20rem",
        height: "12rem",
        boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        margin: "5px",
      }}
    >
      <CardHeader
        sx={{ padding: "8px" }}
        action={
          <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <IconButton color="primary" onClick={() => actions[0].onClick({ row: item })}>
              {actions[0].icon}
            </IconButton>
            <IconButton color="primary" onClick={() => actions[1].onClick({ row: item })}>
              {actions[1].icon}
            </IconButton>
          </Box>
        }
      />
      <Box sx={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "3rem", height: "3rem", backgroundColor: "#f0f0f0", borderRadius: "50%" }}>
          {/* Replace this with an Avatar or Image */}
          <Typography variant="h6">{avatar || "A"}</Typography>
        </Box>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
          <Box>
            <Typography variant="h6" component="div">
              {item.firstName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.email}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography
              sx={{
                fontSize: "12px",
                padding: "5px 10px",
                borderRadius: "15px",
                backgroundColor: item.status === "Active" ? "green" : "red",
                color: "#fff",
              }}
            >
              {item.status}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{ borderRadius: "20px", textTransform: "unset" }}
              onClick={() => actions[2].onClick({ row: item })}
            >
              {actions[2].label}
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

const styles = {
  root_item: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "98%",
    padding: "10px",
    backgroundColor: "white.lightDark",
    boxShadow:
      "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
    margin: "auto",
    marginBottom: "16px",
    borderRadius: "10px",
  },
  card_left_box: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    padding: "10px",
    height: "100%",
  },
  card_right_box: {
    width: "calc(100% - 150px)",
    height: "100%",
    paddingBottom: "10px",
  },
  icon: {
    backgroundColor: "primary.light",
    borderRadius: "10px",
    padding: "10px",
  },
};
