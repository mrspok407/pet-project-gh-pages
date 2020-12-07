import React, { useCallback, useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import ShowsEpisodes from "Components/UI/Templates/SeasonsAndEpisodes/ShowsEpisodes"
import { todayDate, combineMergeObjects, releasedEpisodesToOneArray } from "Utils"
import Loader from "Components/UI/Placeholders/Loader"
import PlaceholderNoToWatchEpisodes from "Components/UI/Placeholders/PlaceholderNoToWatchEpisodes"
import merge from "deepmerge"
import { AppContext } from "Components/AppContext/AppContextHOC"
import {
  SeasonEpisodesFromDatabaseInterface,
  SingleEpisodeInterface,
  UserShowsInterface
} from "Components/UserContent/UseUserShows/UseUserShows"

const ToWatchEpisodesContent: React.FC = () => {
  const [watchingShows, setWatchingShows] = useState<UserShowsInterface[]>([])
  const [initialLoading, setInitialLoading] = useState(true)

  const context = useContext(AppContext)

  const getContent = useCallback(() => {
    const watchingShows = context.userContent.userShows.filter(
      (show) => show.database === "watchingShows" && !show.allEpisodesWatched
    )
    let toWatchEpisodes: any =
      watchingShows.length !== 0 ? context.userContent.userToWatchShows.splice(0, watchingShows.length) : []

    // watchingShows.length === 0 ? (toWatchEpisodes = []) : toWatchEpisodes.splice(0, watchingShows.length)

    console.log({ watchingShows })
    console.log({ toWatchEpisodes })

    const watchingShowsModified = watchingShows.reduce((acc: UserShowsInterface[], show) => {
      if (toWatchEpisodes.find((item: any) => item.id === show.id)) {
        acc.push(show)
      }
      return acc
    }, [])

    // if (toWatchEpisodes.length !== watchingShows.length) {
    //   setWatchingShows((prevState) => [...prevState])
    //   return
    // }
    if (toWatchEpisodes.length === 0) {
      setWatchingShows([])
      if (!context.userContent.loadingNotFinishedShows && !context.userContent.loadingShows) {
        setInitialLoading(false)
      }
      return
    }

    const mergedShows = merge(watchingShowsModified, toWatchEpisodes, {
      arrayMerge: combineMergeObjects
    }).sort((a, b) => (a.first_air_date > b.first_air_date ? -1 : 1))

    setWatchingShows(mergedShows)
    setInitialLoading(false)
  }, [context.userContent])

  useEffect(() => {
    getContent()
  }, [getContent])

  return (
    <div className="content-results content-results--to-watch-page">
      {initialLoading || context.userContent.loadingShowsMerging ? (
        <Loader className="loader--pink" />
      ) : watchingShows.length === 0 ? (
        <PlaceholderNoToWatchEpisodes />
      ) : (
        <>
          {watchingShows.map((show) => {
            const toWatchEpisodes = show.episodes.reduce(
              (acc: SeasonEpisodesFromDatabaseInterface[], season) => {
                const seasonEpisodes = season.episodes.reduce((acc: SingleEpisodeInterface[], episode) => {
                  if (episode.air_date && new Date(episode.air_date).getTime() < todayDate.getTime()) {
                    acc.push(episode)
                  }
                  return acc
                }, [])

                seasonEpisodes.reverse()

                if (seasonEpisodes.length !== 0 && seasonEpisodes.some((item) => !item.watched)) {
                  acc.push({ ...season, episodes: seasonEpisodes })
                }

                return acc
              },
              []
            )
            console.log({ toWatchEpisodes })
            toWatchEpisodes.reverse()

            const releasedEpisodes: SingleEpisodeInterface[] = releasedEpisodesToOneArray({
              data: toWatchEpisodes
            })
            return (
              <div key={show.id} className="towatch__show">
                <Link className="towatch__show-name" to={`/show/${show.id}`}>
                  {show.name}
                </Link>
                <ShowsEpisodes
                  parentComponent="toWatchPage"
                  episodesData={toWatchEpisodes}
                  showTitle={show.name || show.original_name}
                  id={show.id}
                  showInfo={show}
                  episodesFromDatabase={show.episodes}
                  releasedEpisodes={releasedEpisodes}
                />
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

export default ToWatchEpisodesContent
