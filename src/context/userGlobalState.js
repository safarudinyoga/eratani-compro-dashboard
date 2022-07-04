import { createContext, useState } from 'react'

export const UserContext = createContext()

const UserGlobalState = ({ children }) => {
  const [globalState, setGlobalState] = useState(null)

  return (
    <UserContext.Provider value={globalState}>
      {children}
    </UserContext.Provider>
  )
}

export default UserGlobalState