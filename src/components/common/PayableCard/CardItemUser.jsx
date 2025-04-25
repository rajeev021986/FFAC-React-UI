import React from "react";
import { Box, Card, IconButton } from "@mui/material";
import { Typography, CardContent, CardActions } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function CardItemUser({ item, actions }) {
  return (
    <Card
      sx={{
        minWidth: "275px",
        maxWidth: "350px",
        // margin: 2,
        borderRadius: 3,
        boxShadow: 5,
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          borderBottom: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: "bold", fontSize: "16px" }}
        >
          {"Charge Name"}: Test
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            color="primary"
            onClick={() => actions[0].onClick({ row: item })}
          >
            {actions[0].icon}
          </IconButton>

          <DeleteForeverIcon sx={{ color: "red" }} />
        </Box>
      </Box>
      <CardContent
        sx={{ display: "flex", flexDirection: "column", alignItems: "left" }}
      >
        <Typography>
          {"Unit Type:"} {"Flat"}
        </Typography>
        <Typography>
          {"Unit Rate:"} {"4"}
        </Typography>
        <Typography>
          {"Amount:"} {"345674"}
        </Typography>
        <Typography>
          {"Vat Amount:"} {"13674"}
        </Typography>
      </CardContent>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: 2,
          borderTop: "1px solid #ccc",
        }}
      >
        <CardActions
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography>Total: 23456789</Typography>
        </CardActions>
      </Box>
    </Card>
  );
}
