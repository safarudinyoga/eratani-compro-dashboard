import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
// import Cookies from 'universal-cookie'

// import { SITE_COOKIES, MENU } from '@config'

// const cookies = new Cookies()

const PrivateRouter = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      // cookies.get(SITE_COOKIES.TOKEN) || cookies.get(SITE_COOKIES.SESSIONID)
      true ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            // pathname: MENU.LOGIN,
            state: { from: props.location },
          }}
        />
      )
    }
  />
)

PrivateRouter.defaultProps = {
  location: null,
}

PrivateRouter.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object,
}

export default PrivateRouter
