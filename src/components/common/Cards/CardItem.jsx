import React from "react";
import { Box, Grid, Checkbox } from "@mui/material";
import { MoreVert, VerifiedUserOutlined } from "@mui/icons-material";
import CardField from "./CardField";
import TMenu from "../TMenu";

export default function CardItem({
  item,
  columns,
  selectedBox,
  setSelectedBox,
  uniqueId,
  actions,
  icon,
}) {
  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      setSelectedBox((prev) => {
        const updated = [...prev, uniqueId];
        console.log("Selected IDs after adding:", updated);
        return updated;
      });
    } else {
      setSelectedBox((prev) => {
        const updated = prev.filter((id) => id !== uniqueId);
        console.log("Selected IDs after removing:", updated);
        return updated;
      });
    }
  };
  // Remove id and action columns
  columns = columns.filter(
    (column) => column.field !== "id" && column.field !== "action"
  );

  return (
    <Box sx={styles.root_item}>
      {/* Checkbox at the start */}
      <Box sx={styles.card_left_box}>
        <Checkbox
          checked={selectedBox.includes(uniqueId)}
          onChange={handleCheckboxChange}
          color="primary"
        />
      </Box>

      {/* Icon and details */}
      <Box sx={styles.card_left_box}>
        <Box sx={styles.icon} elevation={1}>
          {icon ? icon : <VerifiedUserOutlined color="primary" />}
        </Box>
      </Box>

      <Grid container spacing={1} sx={styles.card_right_box}>
        {columns.map((column, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={index}>
            <CardField
              title={column.headerName}
              subtitle={item[column.field]}
            />
          </Grid>
        ))}
      </Grid>

      <Box>
        {/* action */}
        <TMenu
          buttonIcon={<MoreVert />}
          buttonProps={{ color: "text.secondary" }}
          menuItems={actions}
          params={{ row: item }}
          action={true}
        />
      </Box>
    </Box>
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
