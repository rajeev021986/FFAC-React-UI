import { Box } from "@mui/material";
import React from "react";
import PLDetailsFormItem from "./PLDetailsFormItems";
import { useSelector } from "react-redux";

export default function PLDetailsForm({ data, onChange }) {
  const formErrors = useSelector((state) => state.sprblDetails.errors);

  return (
    <Box
      sx={{
        maxWidth: "100%",
        borderRadius: "5px",
        height: "80%",
        overflowY: "auto",
        position: "relative",
        backgroundColor: "#fff",
        padding: "16px", // Optional padding for the overall container
      }}
    >
      {data?.map((item, index) => {
        // Destructure sprBLIteamDetails from item
        const { sprBLIteamDetails, ...restItem } = item;

        return (
          <Box key={index} sx={{ mb: 2 }}> {/* Adding margin-bottom between items */}
            <PLDetailsFormItem
              index={index}
              item={restItem}
              sprBLIteamDetails={sprBLIteamDetails}
              onChange={(fieldName, value) => onChange(index, fieldName, value)}
              error={formErrors?.plData?.[index] || {}}
            />
          </Box>
        );
      })}
    </Box>
  );
}
