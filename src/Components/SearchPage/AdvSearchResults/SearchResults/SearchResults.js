import React, { Component } from "react"
import { Link } from "react-router-dom"
import { compose } from "recompose"
import { listOfGenres } from "Utils"
import { withUserContent } from "Components/UserContent"
import { UserContentLocalStorageContext } from "Components/UserContent/UserContentLocalStorageContext"
import Loader from "Components/Placeholders/Loader"
import "./SearchResults.scss"

class AdvSearchResults extends Component {
  render() {
    const maxColumns = 4
    const currentNumOfColumns =
      this.props.advancedSearchContent.length <= maxColumns - 1
        ? this.props.advancedSearchContent.length
        : maxColumns

    return (
      <>
        <div className="content-results">
          {this.props.advancedSearchContent.length > 0 && (
            <div className="content-results__button-top">
              <button type="button" className="button" onClick={() => this.props.clearAdvSearchMovies()}>
                Clear Searched
              </button>
            </div>
          )}

          <div
            className="content-results__wrapper"
            style={
              currentNumOfColumns <= 3
                ? {
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 350px))"
                  }
                : {
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))"
                  }
            }
          >
            {this.props.advancedSearchContent.map(
              ({
                title,
                original_title,
                name,
                original_name,
                id,
                release_date,
                first_air_date,
                vote_average,
                genre_ids = [],
                overview = "",
                backdrop_path,
                poster_path,
                vote_count
              }) => {
                const mediaType = original_title ? "movie" : "show"

                const filteredGenres = genre_ids.map(genreId =>
                  listOfGenres.filter(item => item.id === genreId)
                )

                const contentTitle = title || original_title || name || original_name
                const releaseDate = release_date || first_air_date

                return (
                  <div key={id} className="content-results__item">
                    <Link
                      to={{
                        pathname: `/${mediaType}/${id}`,
                        state: { logoDisable: true }
                      }}
                    >
                      <div className="content-results__item-main-info">
                        <div className="content-results__item-title">
                          {!contentTitle ? "No title available" : contentTitle}
                        </div>
                        <div className="content-results__item-year">
                          {!releaseDate ? "" : `(${releaseDate.slice(0, 4)})`}
                        </div>
                        {vote_average !== 0 && (
                          <div className="content-results__item-rating">
                            {vote_average}
                            <span>/10</span>
                            <span className="content-results__item-rating-vote-count">({vote_count})</span>
                          </div>
                        )}
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
                          {overview.length > 250 ? `${overview.substring(0, 250)}...` : overview}
                        </div>
                      </div>
                    </Link>

                    {/* <div className="content-results__item-links">
                      {mediaType === "movie" ? (
                        this.props.userContent.loadingContent ? (
                          <Loader className="loader--small-pink" />
                        ) : (
                          <button
                            className={classNames("button", {
                              "button--pressed": watchLaterMovies.find(item => item.id === id)
                            })}
                            onClick={() => {
                              if (this.props.authUser) {
                                this.props.toggleWatchLaterMovie({
                                  id: id,
                                  data: this.props.advancedSearchContent,
                                  userDatabase: "watchLaterMovies"
                                })
                              } else {
                                this.context.toggleMovieLS({
                                  id,
                                  data: this.props.advancedSearchContent
                                })
                              }

                              if (
                                !watchLaterMovies.find(item => item.id === id) ||
                                this.props.currentlyChosenContent.find(item => item.id === id)
                              ) {
                                this.props.toggleCurrentlyChosenContent(id, this.props.advancedSearchContent)
                              }
                            }}
                            type="button"
                          >
                            {watchLaterMovies.find(item => item.id === id) ? "Remove" : "Watch later"}
                          </button>
                        )
                      ) : (
                        <>
                          {this.props.userContent.loadingContent ? (
                            <Loader className="loader--small-pink" />
                          ) : watchingShows.find(e => e.id === id && e.userWatching === true) ? (
                            <button
                              className="button button--pressed"
                              onClick={() => {
                                if (this.props.authUser) {
                                  this.props.removeWatchingShow(id)
                                } else {
                                  this.context.removeShowLS({
                                    id
                                  })
                                }

                                if (this.props.currentlyChosenContent.find(item => item.id === id)) {
                                  this.props.toggleCurrentlyChosenContent(
                                    id,
                                    this.props.advancedSearchContent
                                  )
                                }
                              }}
                              type="button"
                            >
                              Not watching
                            </button>
                          ) : (
                            <>
                              <button
                                className="button"
                                onClick={() => {
                                  if (this.props.authUser) {
                                    this.props.handleShowInDatabases({
                                      id: id,
                                      data: this.props.advancedSearchContent,
                                      database: "watchingShows"
                                    })
                                  } else {
                                    this.context.addShowLS({
                                      id,
                                      data: this.props.advancedSearchContent
                                    })
                                  }
                                  this.props.toggleCurrentlyChosenContent(
                                    id,
                                    this.props.advancedSearchContent
                                  )
                                }}
                                type="button"
                              >
                                Watching
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div> */}
                  </div>
                )
              }
            )}
            {this.props.loadingNewPage && <Loader className="loader--new-page" />}
          </div>
        </div>
      </>
    )
  }
}

export default compose(withUserContent)(AdvSearchResults, "SearchResults")

AdvSearchResults.contextType = UserContentLocalStorageContext
