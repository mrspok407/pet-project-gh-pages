import React, { createContext } from "react"
import useUserContentLocalStorage from "Components/UserContent/UserContentLocalStorageHook"
import useUserShows from "Components/UserContent/UserShowsHook"

const AppContext = createContext()

const AppContextHOC = Component =>
  function Comp(props) {
    const userContentLocalStorage = useUserContentLocalStorage()
    const userContent = useUserShows(props.firebase)

    return (
      <AppContext.Provider value={{ userContentLocalStorage, userContent }}>
        <Component {...props} />
      </AppContext.Provider>
    )
  }

export default AppContextHOC

export { AppContext }
