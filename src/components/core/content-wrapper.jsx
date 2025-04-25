import { Box, Toolbar, Typography } from "@mui/material";
import React from "react";

export default function ContentWrapper({
  children,
  hover,
  expandedDrawerWidth,
  drawerWidth,
}) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 2,
        width: {
          sm: `calc(100% - ${hover ? expandedDrawerWidth : drawerWidth}px)`,
        },
        transition: "width 0.3s ease-in-out",
        mt: "55px",
        backgroundColor: "white.main",
      }}
    >
      {children}
    </Box>
  );
}
