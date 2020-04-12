import React, { useContext } from "react"
import { listOfGenres } from "../../../Utils"
import { SelectedContentContext } from "../../Context/SelectedContentContext"
import "./ContentResults.scss"
import Loader from "../../Placeholders/Loader"

const todaysDate = new Date()
const todayDayOfTheMonth = todaysDate.getDate()

export default function ContentResults({
  contentType,
  contentArr,
  toggleContentArr,
  className = "",
  showsArr,
  moviesArr,
  getEpisodeInfo,
  loadingIds,
  detailedInfoShows,
  detailedInfoMovies
}) {
  const { selectedContent, toggleContent } = useContext(SelectedContentContext)

  function showLinksToAll() {
    contentArr.map(item =>
      getEpisodeInfo(item.id, item.original_title, item.release_date)
    )
  }
  console.log(moviesArr)
  return (
    <>
      {contentType !== "adv-search" && (
        <div className="content-results__button--clear-searched">
          <button
            className="button button--show-all-links"
            type="button"
            onClick={() => showLinksToAll()}
          >
            Show Links To All
          </button>
        </div>
      )}

      <div className={`content-results__wrapper ${className}`}>
        {contentArr.map(
          ({
            original_title,
            original_name,
            id,
            release_date,
            first_air_date,
            vote_average,
            genre_ids,
            overview,
            backdrop_path,
            poster_path,
            vote_count
          }) => {
            const filteredGenres = genre_ids.map(genreId =>
              listOfGenres.filter(item => item.id === genreId)
            )

            const title = original_title || original_name
            const date = release_date || first_air_date

            let movie
            let urlMovieTitle
            let movieHash1080p

            if (moviesArr) {
              movie = moviesArr.find(item => item.id === id)
            }

            if (movie) {
              movieHash1080p = movie.torrents.find(
                item => item.quality === "1080p"
              ).hash
              urlMovieTitle = movie.title.split(" ").join("+")
            }

            let tvShowDetails
            let nameInUrl
            let season
            let episode
            let lastAirDate

            if (showsArr) {
              tvShowDetails = showsArr.find(item => item.id === id)
            }

            if (tvShowDetails) {
              nameInUrl = tvShowDetails.name.split(" ").join("+")

              const airDateISO = new Date(
                tvShowDetails.last_air_date
              ).toISOString()
              const options = { month: "long", day: "numeric", year: "numeric" }
              const formatedDate = new Date(airDateISO)
              const airDateOfTheMonth = formatedDate.getDate()
              lastAirDate =
                airDateOfTheMonth === todayDayOfTheMonth
                  ? "Aired today"
                  : new Intl.DateTimeFormat("en-US", options).format(
                      formatedDate
                    )

              const {
                season_number,
                episode_number
              } = tvShowDetails.last_episode_to_air

              const seasonToString = season_number.toString()
              const episodeToString = episode_number.toString()

              season =
                seasonToString.length === 1
                  ? "s0".concat(seasonToString)
                  : "s".concat(seasonToString)
              episode =
                episodeToString.length === 1
                  ? "e0".concat(episodeToString)
                  : "e".concat(episodeToString)
            }

            // console.log(moviesArr)
            // console.log(detailedInfoMovies)
            // console.log(loadingIds)

            return (
              <div key={id} className="content-results__item">
                <div className="content-results__item-main-info">
                  <div className="content-results__item-title">
                    {!title ? "No title available" : title}
                  </div>
                  <div className="content-results__item-year">
                    ({!date ? "No data" : date.slice(0, 4)})
                  </div>
                  <div className="content-results__item-rating">
                    {vote_average}
                    <span>/10</span>
                    <span className="content-results__item-rating-vote-count">
                      ({vote_count})
                    </span>
                  </div>
                </div>
                <div className="content-results__item-genres">
                  {filteredGenres.map(item => (
                    <span key={item[0].id}>{item[0].name}</span>
                  ))}
                </div>
                <div className="content-results__item-overview">
                  <div className="content-results__item-poster">
                    <div
                      style={
                        backdrop_path !== null
                          ? {
                              backgroundImage: `url(https://image.tmdb.org/t/p/w500/${backdrop_path ||
                                poster_path})`
                            }
                          : {
                              backgroundImage: `url(https://homestaymatch.com/images/no-image-available.png)`
                            }
                      }
                    />
                  </div>
                  <div className="content-results__item-description">
                    {overview.length > 150
                      ? `${overview.substring(0, 150)}...`
                      : overview}
                  </div>
                </div>

                {contentType === "shows" && (
                  <div className="content-results__item-links">
                    {!detailedInfoShows.includes(id) ? (
                      <button
                        type="button"
                        className="button button--content-results button--show-links"
                        onClick={() => getEpisodeInfo(id)}
                      >
                        Show Last Episode Links
                      </button>
                    ) : (
                      loadingIds.includes(id) && (
                        <div>
                          <Loader className="loader--show-links" />
                        </div>
                      )
                    )}

                    {tvShowDetails && (
                      <div className="content-results__item-links-wrapper">
                        <div className="content-results__item-links-episode">
                          {`${season}${episode} ${lastAirDate}`}
                        </div>
                        <div className="content-results__item-links-torrents">
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://www.ettvdl.com/torrents-search.php?search=${nameInUrl}+${season}${episode}+1080p&cat=41`}
                          >
                            1080p
                          </a>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://www.ettvdl.com/torrents-search.php?search=${nameInUrl}+${season}${episode}+720p&cat=41`}
                          >
                            720p
                          </a>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://www.ettvdl.com/torrents-search.php?search=${nameInUrl}+${season}${episode}&cat=5`}
                          >
                            480p
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {contentType === "movies" && (
                  <div className="content-results__item-links">
                    {!detailedInfoMovies.includes(id) ? (
                      <button
                        type="button"
                        className="button button--content-results button--show-links"
                        onClick={() =>
                          getEpisodeInfo(id, original_title, release_date)
                        }
                      >
                        Show Links
                      </button>
                    ) : (
                      loadingIds.includes(id) && (
                        <div>
                          <Loader className="loader--show-links" />
                        </div>
                      )
                    )}

                    {movie && (
                      <div className="content-results__item-links-wrapper">
                        <div className="content-results__item-links-torrents">
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`magnet:?xt=urn:btih:${movieHash1080p}&dn=${urlMovieTitle}&xl=310660222&tr=udp%3A%2F%2Ftracker.coppersurfer.tk:6969/announce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org:6969/announce&tr=udp%3A%2F%2Ftracker.pirateparty.gr:6969/announce&tr=udp%3A%2F%2Fexodus.desync.com:6969/announce&tr=udp%3A%2F%2Ftracker.opentrackr.org:1337/announce&tr=udp%3A%2F%2Ftracker.internetwarriors.net:1337/announce&tr=udp%3A%2F%2Ftracker.torrent.eu.org:451&tr=udp%3A%2F%2Ftracker.cyberia.is:6969/announce&tr=udp%3A%2F%2Fopen.demonii.si:1337/announce&tr=udp%3A%2F%2Fopen.stealth.si:80/announce&tr=udp%3A%2F%2Ftracker.tiny-vps.com:6969/announce&tr=udp%3A%2F%2Ftracker.iamhansen.xyz:2000/announce&tr=udp%3A%2F%2Fexplodie.org:6969/announce&tr=udp%3A%2F%2Fdenis.stalker.upeer.me:6969/announce&tr=udp%3A%2F%2Fipv4.tracker.harry.lu:80/announce`}
                          >
                            1080p
                          </a>
                          {/* <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href=""
                          >
                            720p
                          </a> */}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedContent.some(e => e.id === id) ? (
                  <>
                    {contentType === "adv-search" ? (
                      <button
                        className="button button--content-results button--pressed"
                        onClick={() => toggleContent(id, toggleContentArr)}
                        type="button"
                      >
                        Remove {original_title ? "movie" : "show"}
                      </button>
                    ) : (
                      <button
                        className="button--del-content-results"
                        onClick={() => toggleContent(id, toggleContentArr)}
                        type="button"
                      />
                    )}
                  </>
                ) : (
                  <button
                    className="button button--content-results"
                    onClick={() => toggleContent(id, toggleContentArr)}
                    type="button"
                  >
                    Add {original_title ? "movie" : "show"}
                  </button>
                )}
              </div>
            )
          }
        )}
      </div>
    </>
  )
}
