import { useState, useEffect, useCallback } from "react"
import { combineMergeObjects } from "Utils"
import { organiseFutureEpisodesByMonth } from "Components/CalendarPage/CalendarHelpers"
import merge from "deepmerge"

const SESSION_STORAGE_KEY_SHOWS = "userShows"

const useUserShows = firebase => {
  const [userShows, setUserShows] = useState([])
  const [userMovies, setUserMovies] = useState([])
  const [userWillAirEpisodes, setUserWillAirEpisodes] = useState([])
  const [loadingShows, setLoadingShows] = useState(true)
  const [loadingMovies, setLoadingMovies] = useState(true)

  const authUserListener = useCallback(() => {
    firebase.onAuthUserListener(
      authUser => {
        console.log("function run")
        firebase.userAllShows(authUser.uid).on("value", snapshot => {
          if (snapshot.val() === null) {
            setLoadingShows(false)
            return
          }

          console.log("listener on")

          const shows = Object.values(snapshot.val()).map(show => {
            return show
          })
          const userShowsSS = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY_SHOWS))
          const userShowsSSLength = userShowsSS.length

          if (userShowsSSLength === 0) {
            Promise.all(
              Object.values(snapshot.val()).map(show => {
                return firebase
                  .showInDatabase(show.status, show.id)
                  .once("value")
                  .then(snapshot => {
                    return {
                      ...show,
                      ...snapshot.val().info,
                      episodes: snapshot.val().episodes
                    }
                  })
              })
            ).then(showsDatabase => {
              const mergedShows = merge(shows, showsDatabase, {
                arrayMerge: combineMergeObjects
              })

              console.log(mergedShows)

              const willAirEpisodes = organiseFutureEpisodesByMonth(mergedShows)

              console.log("length 0")
              setUserShows(mergedShows)
              setUserWillAirEpisodes(willAirEpisodes)
              setLoadingShows(false)
            })
          } else if (userShowsSSLength < shows.length) {
            shows.forEach((show, index) => {
              if (userShowsSS.find(item => item.id === show.id)) return

              console.log("length less")

              firebase.showInDatabase(show.status, show.id).once("value", snapshot => {
                const mergedShow = { ...show, ...snapshot.val().info, episodes: snapshot.val().episodes }
                const updatedShows = userShowsSS.splice(index, 0, mergedShow)

                const willAirEpisodes = organiseFutureEpisodesByMonth(updatedShows)

                console.log(updatedShows)

                setUserShows(updatedShows)
                setUserWillAirEpisodes(willAirEpisodes)
                setLoadingShows(false)
              })
            })
          }
        })

        firebase.watchLaterMovies(authUser.uid).on("value", snapshot => {
          if (snapshot.val() === null) {
            setLoadingMovies(false)
            return
          }

          const movies = Object.values(snapshot.val()).map(movie => {
            return movie
          })

          setUserMovies(movies)
          setLoadingMovies(false)
        })
      },
      () => {
        setLoadingShows(false)
        setLoadingMovies(false)
        console.log("user is not logged in")
      }
    )
  }, [firebase])

  useEffect(() => {
    console.log("userShowsHook mounted")
    authUserListener()
    return () => {
      authUserListener()
    }
  }, [authUserListener])

  useEffect(() => {
    sessionStorage.setItem(SESSION_STORAGE_KEY_SHOWS, JSON.stringify(userShows))
    console.log("comp updated")
  }, [userShows])

  const handleUserShowsOnClient = ({ database, id }) => {
    const userShowsSS = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY_SHOWS))
    const updatedShows = userShowsSS.map(show => (show.id === id ? { ...show, database } : show))

    console.log("upd on client")

    setUserShows(updatedShows)
  }

  const handleUserMoviesOnClient = ({ id }) => {
    const updatedMovies = userMovies.filter(movie => movie.id !== id)

    console.log("upd on client movies")

    setUserMovies(updatedMovies)
  }

  return {
    userShows,
    userWillAirEpisodes,
    userMovies,
    loadingShows,
    loadingMovies,
    handleUserShowsOnClient,
    handleUserMoviesOnClient
  }
}

export default useUserShows
