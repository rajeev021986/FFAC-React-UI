import React from "react";
import { Box, Card, IconButton } from "@mui/material";
import { Typography, CardContent, CardActions } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function CardItem({ item, columns, actions }) {
  columns = columns.filter(
    (column) => column.field !== "id" && column.field !== "action"
  );
  return (
    <>
      <Card
        sx={{
          minWidth: "275px",
          borderRadius: 2,
          boxShadow: 1,
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.01)",
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
            padding: "5px 10px",
            boxShadow: "0px 1px 4px 0px rgba(204,204,204,0.79)",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", fontSize: "16px" }}
          >
            {"Charge Name"}
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
            <IconButton>
              <DeleteForeverIcon sx={{ color: "red" }} />
            </IconButton>
          </Box>
        </Box>
        <CardContent
          sx={{ display: "flex", flexDirection: "column", alignItems: "left" }}
        >
          {[
            { label: "Unit Type", value: item.unitType },
            { label: "Unit Rate", value: item.unitRate },
            { label: "No of Units", value: item.noOfUnit },
            { label: "Amount", value: item.amount },
            { label: "VAT Amount", value: item.vatAmount },
          ].map((field, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "4px 0",
                borderBottom: "1px dashed #ccc",
              }}
            >
              <Typography fontWeight="bold">{field.label}</Typography>
              <Typography>{field.value || " "}</Typography>
            </Box>
          ))}
        </CardContent>

        <CardActions
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderTop: "1px solid #ccc",
            boxShadow: "1px 0px 4px 0px rgba(204,204,204,0.79)",
            padding: "12px 10px",
          }}
        >
          <Typography>
            <Box component="span" fontWeight="fontWeightBold">
              Total:
            </Box>{" "}
            {item.totalAmount || " "}{" "}
          </Typography>
        </CardActions>
      </Card>
    </>
  );
}
