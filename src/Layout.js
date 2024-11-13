import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import Main from './components/core/main'

export default function Layout() {
  return (
    <Main>
      <Outlet/>
    </Main>
  )
}
