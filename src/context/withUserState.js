import React from 'react'
import { UserContext } from './UserGlobalState'

const withUserState = ComposedComponent => props => {
  return (
    <UserContext.Consumer>
      {
        ({ user, roleAccess, setUserData, setUserDataFromLocalStorage }) => (
          <ComposedComponent
            user={user}
            setUser={setUserData}
            setUserFromStorage={setUserDataFromLocalStorage}
            roleAccess={roleAccess}
            { ...props }
          />
        )
      }
    </UserContext.Consumer>
  )
}

export default withUserState
