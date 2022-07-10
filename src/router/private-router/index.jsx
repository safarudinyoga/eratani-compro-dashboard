import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { COOKIES, SITE_COOKIES } from '../../utils/cookies'

const PrivateRoute = () => {
  const auth = COOKIES.get(SITE_COOKIES.ACCESSTOKEN)

   // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return auth ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute
