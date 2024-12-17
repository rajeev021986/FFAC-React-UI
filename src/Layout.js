import React, { useEffect } from 'react'
import { Link, Outlet, useActionData } from 'react-router-dom'
import Main from './components/core/main';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSessionExpiredmodule } from './store/freatures/dashboardSlice';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import SessionExpired from './components/common/SessionExpired/SessionExpired';

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // useEffect(() => {
  //   const localUser = JSON.parse(localStorage.getItem("user"));
  //   const localToken = localStorage.getItem("token");
  //   if (localToken && localUser) {
  //     if (localUser.expiresIn < new Date().getTime()) {
  //       dispatch(setSessionExpiredmodule(true));
  //     }
  //   }
  // }, [])
  // const handleLogout = () => {
  //   dispatch(setSessionExpiredmodule(false));
  //   navigate("/")
  // }
  return (
    <Main>
      <SessionExpired/>
      <Outlet />
    </Main >
  )
}
