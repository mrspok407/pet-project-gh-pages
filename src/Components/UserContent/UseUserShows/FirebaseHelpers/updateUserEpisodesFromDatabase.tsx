import { combineMergeObjects, releasedEpisodesToOneArray } from "Utils"
import merge from "deepmerge"
import { FirebaseInterface } from "Components/Firebase/FirebaseContext"
import { AuthUserInterface } from "Utils/Interfaces/UserAuth"
import {
  SeasonEpisodesFromDatabaseInterface,
  SingleEpisodeInterface,
  UserShowsInterface
} from "../UseUserShows"

interface Arguments {
  firebase: FirebaseInterface
  authUser: AuthUserInterface
  showsFullInfo: UserShowsInterface[]
}

const updateUserEpisodesFromDatabase = ({ firebase, authUser, showsFullInfo }: Arguments) => {
  return firebase
    .userEpisodes(authUser.uid)
    .once("value", (snapshot: { val: () => { key: UserShowsInterface } }) => {
      if (snapshot.val() === null) return
      const userShowsEpisodes = Object.values(snapshot.val()).map((show) => {
        return show
      })

      if (showsFullInfo.length !== userShowsEpisodes.length) return

      const mergedShowsEpisodes: UserShowsInterface[] = merge(showsFullInfo, userShowsEpisodes, {
        arrayMerge: combineMergeObjects
      })

      mergedShowsEpisodes.forEach((show) => {
        const seasons = show.episodes.reduce((acc: SeasonEpisodesFromDatabaseInterface[], season) => {
          const episodes = season.episodes.reduce((acc: SingleEpisodeInterface[], episode) => {
            acc.push({
              userRating: episode.userRating || 0,
              watched: episode.watched || false,
              air_date: episode.air_date || ""
            })
            return acc
          }, [])
          acc.push({
            episodes,
            name: season.name,
            season_number: season.season_number,
            userRating: season.userRating || 0,
            id: season.id
          })
          return acc
        }, [])

        const statusDatabase = show.status === "Ended" || show.status === "Canceled" ? "ended" : "ongoing"

        const releasedEpisodes: SingleEpisodeInterface[] = releasedEpisodesToOneArray({ data: show.episodes })
        const allEpisodes = seasons.reduce((acc: SingleEpisodeInterface[], item) => {
          acc.push(...item.episodes)
          return acc
        }, [])
        allEpisodes.splice(releasedEpisodes.length)

        const allEpisodesWatched = !allEpisodes.some((episode) => !episode.watched)
        const finished = statusDatabase === "ended" && allEpisodesWatched ? true : false

        firebase.userShowAllEpisodes(authUser.uid, show.id).set(seasons)

        firebase.userShowAllEpisodesInfo(authUser.uid, show.id).update({
          allEpisodesWatched,
          finished,
          isAllWatched_database: `${allEpisodesWatched}_${show.database}`
        })

        firebase.userShow({ uid: authUser.uid, key: show.id }).update({ finished, allEpisodesWatched })
      })
    })
}

export default updateUserEpisodesFromDatabase