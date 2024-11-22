import React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box, Typography } from '@mui/material';

export default function TMenu({
    menuItems,
    buttonIcon,
    buttonProps,
    action = false,
    params,
}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMouseEnter = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMouseLeave = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (item) => {
        if (action) {
            item.onClick(params);
        } else {
            item.onClick();
        }
        handleMouseLeave();
    };

    return (
        <Box
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{ display: 'inline-block' }}
        >
            <IconButton
                id="hover-button"
                aria-label="menu-button"
                aria-controls={open ? 'hover-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{ color: 'white.main', ...buttonProps }}
            >
                {buttonIcon}
            </IconButton>
            <Menu
                id="hover-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMouseLeave}
                elevation={2}
                MenuListProps={{
                    'aria-labelledby': 'hover-button',
                    onMouseLeave: handleMouseLeave,
                }}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                PaperProps={{
                    style: {
                        transform: 'translateX(10px) translateY(40px)',
                    },
                }}
            >
                {menuItems.map((item) => (
                    <MenuItem
                        key={item.label}
                        onClick={() => handleMenuItemClick(item)}
                        sx={{
                            fontSize: '14px',
                            display: 'flex',
                            gap: '10px',
                            p: '2px 20px',
                            color: 'text.primary',
                        }}
                    >
                        <Box color="primary.main">{item.icon}</Box>
                        <Typography variant="body1">{item.label}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}
