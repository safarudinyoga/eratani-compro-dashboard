import React from 'react'
import { UserContext } from './userGlobalState'

const withUserState = ComposedComponent => props => {
  return (
    <UserContext.Consumer>
      {
        () => (
          <ComposedComponent
            // user={user}
            // setUser={setUserData}
            // setUserFromStorage={setUserDataFromLocalStorage}
            // roleAccess={roleAccess}
            { ...props }
          />
        )
      }
    </UserContext.Consumer>
  )
}

export default withUserState
