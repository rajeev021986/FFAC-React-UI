import React from "react";
import {
  Box,
  Grid,
  Checkbox,
  CardHeader,
  Card,
  IconButton,
  Avatar,
  Typography,
  Button,
  CardContent,
  CardActions,
  Badge,
} from "@mui/material";
import { MoreVert, VerifiedUserOutlined } from "@mui/icons-material";
import CardField from "./CardField";
import TMenu from "../TMenu";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { StatusChip } from "../../utils/statusChip";

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
  };

  return (
    <Card
      sx={{
        minWidth: "300px",
        maxWidth: "350px",
        margin: 2,
        borderRadius: 3,
        boxShadow: 5,
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      <CardContent
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Avatar
          sx={{
            width: 100,
            height: 100,
            marginBottom: 2,
            border: (theme) => `4px solid ${theme.palette.primary.main}`,
          }}
          src={item.profileimg}
          alt="Profile Image"
        />

        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: "bold", marginBottom: 1 }}
        >
          {item.firstName}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginBottom: 0.5 }}
        >
          {item.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.phone}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginTop: 2,
            padding: "5px 10px",
            borderRadius: "15px",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {StatusChip(item.status.toLowerCase(), "status")}
        </Box>
      </CardContent>

      <Box sx={{ display: "flex", justifyContent: "center", paddingBottom: 2 }}>
        <CardActions
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton
            color="primary"
            onClick={() => actions[0].onClick({ row: item })}
          >
            {actions[0].icon}
          </IconButton>

          <IconButton
            color="primary"
            onClick={() => actions[1].onClick({ row: item })}
          >
            {actions[1].icon}
          </IconButton>

          <IconButton
            color="error"
            onClick={() => actions[2].onClick({ row: item })}
          >
            {actions[2].icon}
          </IconButton>

          <IconButton
            color="primary"
            onClick={() => actions[3].onClick({ row: item })}
          >
            {actions[3].icon}
          </IconButton>
        </CardActions>
      </Box>
    </Card>
  );
}
