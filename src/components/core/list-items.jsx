import {
  Avatar,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  ExpandLessOutlined,
  ExpandMoreOutlined,
  ControlPointOutlined,
  Brightness1Outlined,
} from "@mui/icons-material";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { iconsMap } from "../../config/menu";
import IconComponent from "../common/IconComponent";

export const ExpandableListItems = ({ label, items, icon, hover,  openItem,
  setOpenItem, }) => {
  const [open, setOpen] = useState(false);
  const isOpen = openItem === label; // Compare with current open item
  const { pathname } = useLocation();
  const handleClick = () => {
    setOpenItem(isOpen ? null : label); // Toggle open state
  };
  return (
    <>
      <ListItem
        button
        onClick={handleClick}
        sx={{
          "&:hover": { backgroundColor: "background.light" },
          backgroundColor:
            items.find((item) => item.path === pathname) !== undefined
              ? "background.light"
              : "",
        }}
      >
        <ListItemIcon sx={{ color: "primary.main" }}>
          {icon ? (
            // <Avatar sx={{ width: "30px", height: "30px" }} src={icon} />
            <IconComponent iconName={icon} sx={style.icon} />
          ) : (
            <Brightness1Outlined />
          )}
        </ListItemIcon>
        <ListItemText primary={label} />
        {isOpen  ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
      </ListItem>
      <Collapse in={hover ? isOpen  : false} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items.map((item) => {
            return item.items?.length > 0 ? (
              // Recursively handle nested items
              <ListItem
                sx={{
                  flexDirection: "column",
                  "&:hover": { backgroundColor: "background.light" },
                }}
                key={item.label}
              >
                <ExpandableListItems
                  label={item.label}
                  items={item.items}
                  icon={iconsMap[item.iconKey]}
                  hover={hover}
                  openItem={openItem}
                  setOpenItem={setOpenItem}
                />
              </ListItem>
            ) : (
              <Link to={item.path} key={item.label}>
                <ListItem
                  button
                  sx={{
                    pl: 4,
                    "&:hover": { backgroundColor: "background.light" },
                    backgroundColor:
                      pathname === item.path ? "background.light" : "",
                  }}
                >
                  <ListItemIcon sx={{ color: "primary.main" }}>
                    {item.iconKey ? (
                      // <Avatar
                      //   src={item.iconKey}
                      //   sx={{ width: "30px", height: "30px" }}
                      // />
                      <IconComponent iconName={item.iconKey} sx={style.icon} />
                    ) : (
                      <ControlPointOutlined />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              </Link>
            );
          })}
        </List>
      </Collapse>
    </>
  );
};

export const TListItem = ({ label, to, icon }) => {
  const { pathname } = useLocation();

  return (
    <Link to={to}>
      <ListItem
        button
        sx={{
          "&:hover": { backgroundColor: "background.light" },
          backgroundColor: pathname === to ? "background.light" : "",
        }}
      >
        <ListItemIcon sx={{ color: "primary.main" }}>
          {/* {<Avatar src={icon} sx={{ width: "30px", height: "30px" }} />} */}
          <IconComponent iconName={icon} sx={style.icon} />
        </ListItemIcon>
        <ListItemText
          primary={label}
          sx={{
            fontSize: "14px",
            "& .MuiListItemText-root .MuiTypography-root": {
              fontSize: "14px !important",
            },
          }}
        />
      </ListItem>
    </Link>
  );
};

const style = {
  icon: { fontSize: "1.8rem" },
};
