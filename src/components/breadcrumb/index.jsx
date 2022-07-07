import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { Breadcrumb } from 'antd'

import './breadcrumb.sass'

const BreadcrumbApp = ({ nav }) => {
  return (
    <div className='breadcrumb-wrapper'>
      <Breadcrumb>
        {nav.map(({ name, link, icon: Icon }) =>
          link === '' ? (
            <Breadcrumb.Item key={name}>
              {name}
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item key={name}>
              <NavLink
                to=""
                onClick={link.handleClick}
              >
                <Icon /> &nbsp;{name}
              </NavLink>
            </Breadcrumb.Item>
          )
        )}
      </Breadcrumb>
    </div>
  )
}

BreadcrumbApp.propTypes = {
  nav: PropTypes.array.isRequired
}

export default BreadcrumbApp