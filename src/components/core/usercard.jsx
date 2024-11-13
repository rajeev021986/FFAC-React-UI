import { Avatar, Badge, Box, IconButton } from '@mui/material'
import React, { useEffect } from 'react'
import TMenu from '../common/TMenu'
import { LogoutOutlined, NotificationsOutlined, PersonOutlined, SettingsOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/freatures/authSlice';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const styles = {
    avater: {
        backgroundColor: "primary.main",
        width: 35,
        height: 35,
    }
}


export default function UserCard() {
    const { logout:auth0Logout } = useAuth0();
    const dispatch = useDispatch();
    const nav = useNavigate();
    const userInfo = useSelector(state => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        if(localStorage.getItem("authtype") === "auth0") auth0Logout()
        nav('/');
    }
    const MENU_ITEMS = [
        {
            label: 'Logout',
            onClick: handleLogout,
            icon: <LogoutOutlined />
        },
        {
            label: 'Profile',
            onClick: () => { },
            icon: <PersonOutlined />
        }
    ]

    useEffect(()=>{
        
            MENU_ITEMS.push({
                label: 'Settings',
                onClick: () => {nav('/app/settings')},
                icon: <SettingsOutlined />
            })
        
    },[userInfo,MENU_ITEMS])


    return (
        <Box display="flex" gap={3}>
            <IconButton>
                <Badge color="error" overlap="circular" variant="dot">
                    <NotificationsOutlined />
                </Badge>
            </IconButton>
            <TMenu
                // buttonIcon={<Avatar alt="Remy Sharp" sx={styles.avater}>
                //     {userInfo ? userInfo?.firstname[0] : 'A'}
                // </Avatar>}
                buttonProps={{ p: 0 }}
                menuItems={MENU_ITEMS}
            />
        </Box>
    )
}


