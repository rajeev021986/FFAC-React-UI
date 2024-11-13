import { Collapse, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { ExpandLessOutlined, ExpandMoreOutlined, ControlPointOutlined, Brightness1Outlined } from '@mui/icons-material';
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { iconsMap } from "../../config/menu";

export const ExpandableListItems = ({ label, items, icon, hover }) => {
    const [open, setOpen] = useState(false);
    const {pathname} = useLocation()
    const handleClick = () => {
        setOpen(!open);
    };
    
    return (
        <>
            <ListItem button onClick={handleClick} sx={{"&:hover" : {backgroundColor : "background.light"},backgroundColor : items.find((item)=> (item.path === pathname)) !== undefined ? 'background.light': ''}} >
                <ListItemIcon sx={{color : "primary.main"}}>
                    {icon ? icon : <Brightness1Outlined  />}
                </ListItemIcon>
                <ListItemText primary={label} />
                {open ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
            </ListItem>
            <Collapse in={hover ? open : false} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {items.map((item) =>
                        item.items?.length > 0 ? (
                            // Recursively handle nested items
                            <ListItem sx={{flexDirection : 'column',"&:hover" : {backgroundColor : "background.light"}}} key={item.label}>
                                <ExpandableListItems
                                    label={item.label}
                                    items={item.items}
                                    icon={iconsMap[item.iconKey]}
                                    hover={hover}

                                />
                            </ListItem>
                        ) : (
                            <Link to={item.path} key={item.label}>
                                <ListItem button sx={{ pl: 4,"&:hover" : {backgroundColor : "background.light"},backgroundColor : pathname === item.path ? "background.light" : "" }} >
                                    <ListItemIcon sx={{color : "primary.main"}}>
                                        {item.iconKey ? iconsMap[item.iconKey] : <ControlPointOutlined />}
                                    </ListItemIcon>
                                    <ListItemText primary={item.label} />
                                </ListItem>
                            </Link>
                        )
                    )}
                </List>
            </Collapse>
        </>
    );
};

export const TListItem = ({ label, to, icon }) => {
    const {pathname} = useLocation()
    
    return (
        <Link to={to}>
            <ListItem button sx={{"&:hover" : {backgroundColor : "background.light"},backgroundColor : pathname === to ? "background.light" : ""}}>
                <ListItemIcon sx={{color : "primary.main"}} >{icon}</ListItemIcon>
                <ListItemText primary={label} />
            </ListItem>
        </Link>
    );
};
