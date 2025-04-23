import React from "react";
import { Box, Grid, Checkbox } from "@mui/material";
import { MoreVert, VerifiedUserOutlined } from "@mui/icons-material";
import CardField from "../Cards/CardField";
import TMenu from "../TMenu";
import CardItemUser from "../Cards/CardItemUser";

export default function CardItem({
  item,
  columns,
  selectedBox,
  setSelectedBox,
  uniqueId,
  actions,
  icon,
  page,
}) {
  // Remove id and action columns
  columns = columns.filter(
    (column) => column.field !== "id" && column.field !== "action"
  );

  return page === "user_management" ? (
    <CardItemUser
      item={item}
      columns={columns}
      selectedBox={selectedBox}
      setSelectedBox={setSelectedBox}
      uniqueId={uniqueId}
      actions={actions}
      icon={icon}
      page={page}
    />
  ) : (
    <Box sx={styles.root_item}>
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
      {actions && (
        <Box>
          <TMenu
            buttonIcon={<MoreVert />}
            buttonProps={{ color: "text.secondary" }}
            menuItems={actions}
            params={{ row: item }}
            action={true}
          />
        </Box>
      )}
    </Box>
  );
}

const styles = {
  root_item: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "98.5%",
    padding: "12px",
    backgroundColor: "white.main",
    border: "1px solid #e5e5e5",
    boxShadow:
      "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
    // margin: "auto",
    marginBottom: "16px",
    marginLeft: "8px",
    borderRadius: "10px",
    height: "fit-content",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease", // Smooth transition for hover effect

    "&:hover": {
      border: "1px solid #BF77F6", // Change background color on hover
      backgroundColor: "#bf77f614",
    },
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
  },
  icon: {
    backgroundColor: "primary.light",
    borderRadius: "10px",
    padding: "10px",
  },
};
