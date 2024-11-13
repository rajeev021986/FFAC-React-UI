import { Box, Drawer } from "@mui/material";
import DrawerContainer from "./drawer-container";
import React from "react";

export default function Sidebar({
  drawerWidth,
  expandedDrawerWidth,
  mobileOpen,
  handleDrawerToggle,
  hover,
  setHover,
}) {
  return (
    <Box
      component="nav"
      sx={{
        width: { sm: hover ? expandedDrawerWidth : drawerWidth },
        flexShrink: { sm: 0 },
        overflow: "hidden",
        // borderWidth : 2,
        // borderColor : "border.main"
      }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        <DrawerContainer hover={hover} />
      </Drawer>
      <Drawer
        variant="permanent"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: hover ? expandedDrawerWidth : drawerWidth,
            transition: "width 0.3s ease-in-out",
            borderRightWidth : 1,
            borderColor : "border.main",
          },
        }}
        open
      >
        <DrawerContainer hover={hover} />
      </Drawer>
    </Box>
  );
}
