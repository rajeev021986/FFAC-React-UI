import { Avatar, Badge, Box, IconButton, Typography } from '@mui/material'
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


export default function UserCard({ setDraweropen }) {
    const { logout: auth0Logout } = useAuth0();
    const dispatch = useDispatch();
    const nav = useNavigate();
    const userInfo = useSelector(state => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        if (localStorage.getItem("authtype") === "auth0") auth0Logout()
        nav('/');
    }
    const MENU_ITEMS = [
        {
            label: 'Profile',
            onClick: () => { nav("profile") },
            icon: <PersonOutlined />
        }
    ]

    useEffect(() => {   

        MENU_ITEMS.push({
            label: 'Settings',
            onClick: () => { setDraweropen(true) },
            icon: <SettingsOutlined />
        })

    }, [userInfo, MENU_ITEMS])


    return (
        <Box display="flex" gap={3} alignItems="center">
            <IconButton>
                <Badge color="error" overlap="circular" variant="dot">
                    <NotificationsOutlined />
                </Badge>
            </IconButton>
            <TMenu
                buttonIcon={<Avatar alt="Remy Sharp" sx={styles.avater}>
                    A
                </Avatar>}
                buttonProps={{ p: 0 }}
                menuItems={MENU_ITEMS}
            />
            <Typography variant="subtitle1" style={{ fontWeight: 500 }}>
                Gana
            </Typography>
            <IconButton onClick={() => handleLogout()}>
                <LogoutOutlined />

            </IconButton>

        </Box>
    )
}


