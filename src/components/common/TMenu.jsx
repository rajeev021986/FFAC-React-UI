import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box, Typography } from '@mui/material';



export default function TMenu(
    {
        menuItems,
        buttonIcon,
        buttonProps,
        action = false,
        params
    }
) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{ color: 'white.main', ...buttonProps }}
            >
                {buttonIcon}
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                elevation={2}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
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
                    }
                }}
               
            >
                {!action ? menuItems.map(item => (
                    <MenuItem key={item.label} onClick={item.onClick} sx={{
                        fontSize: '14px',
                        display: 'flex',
                        gap: '10px',
                        p : '2px 20px',
                        color : 'text.primary',
                    }}>
                      <Box color="primary.main" >{item.icon}</Box>  <Typography variant="p">{item.label}</Typography>
                    </MenuItem>
                )) : 
                menuItems.map(item => (
                    <MenuItem key={item.label} onClick={() => {
                        item.onClick(params);
                        handleClose();
                      }} sx={{
                        fontSize: '14px',
                        display: 'flex',
                        gap: '10px',
                        p : '2px 20px',
                        color : 'text.primary',
                    }}>
                      <Box color="primary.main" >{item.icon}</Box>  <Typography variant="p">{item.label}</Typography>
                    </MenuItem>
                ))
                }
            </Menu>
        </>
    );
}