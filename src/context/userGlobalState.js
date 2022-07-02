import { createContext, useState } from 'react'

export const UserContext = createContext()

const UserGlobalState = () => {
  const [globalState, setGlobalState] = useState(null)

  return (
    <UserContext.Provider value={globalState}>

    </UserContext.Provider>
  )
}

export default UserGlobalState