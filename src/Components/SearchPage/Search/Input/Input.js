import React, { Component } from "react"
import debounce from "debounce"
import classNames from "classnames"
import "./Input.scss"
import Loader from "Components/Placeholders/Loader"
import { mediaTypesArr } from "Utils"

export default class Input extends Component {
  constructor(props) {
    super(props)

    this.state = {
      query: "",
      mediaType: { type: "Multi", icon: mediaTypesArr[0].icon },
      mediaTypesIsOpen: false
    }

    this.mediaTypeRef = React.createRef()
  }

  componentDidMount() {
    const windowWidth = window.innerWidth
    if (this.inputRef && windowWidth > 1000 && !this.props.navSearch) this.inputRef.focus()
    document.addEventListener("mousedown", this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside)
  }

  _runSearch = media => {
    this.props.onSearch(this.state.query, media)
  }

  runSearchDeb = debounce(() => this._runSearch(this.state.mediaType), 300)

  linkOnKeyPressDeb = debounce(() => {
    if (this.inputRef) this.inputRef.blur()
    this.props.linkOnKeyPress()
  }, 300)

  resetSearch = () => this.setState({ query: "" }, this._runSearch)

  handleKeyDown = e => {
    if (e.which === 27) this.resetSearch()
    if (e.which === 13) this.linkOnKeyPressDeb()
    if (e.which === 38 || e.which === 40) this.props.navigateSearchListByArrows(e.which)
  }

  handleChange = e => {
    this.setState({ query: e.target.value }, this.runSearchDeb)
  }

  handleClickOutside = e => {
    if (this.mediaTypeRef.current && !this.mediaTypeRef.current.contains(e.target)) {
      this.setState({
        mediaTypesIsOpen: false
      })
    }
  }

  render() {
    return (
      <>
        <div
          ref={this.mediaTypeRef}
          className={classNames("search__media-type", {
            "search__media-type--is-open": this.state.mediaTypesIsOpen
          })}
          style={{
            backgroundImage: `url(${this.state.mediaType.icon})`
          }}
        >
          <button
            type="button"
            onClick={() =>
              this.setState(prevState => ({
                mediaTypesIsOpen: !prevState.mediaTypesIsOpen
              }))
            }
            className="media-type__button media-type__selected-value"
          >
            <span>{this.state.mediaType.type === "Multi" ? "All" : this.state.mediaType.type}</span>
          </button>
          {this.state.mediaTypesIsOpen && (
            <div className="media-type__options">
              <ul className="media-type__list">
                {mediaTypesArr.map(item => {
                  const type = item.type === "Multi" ? "All" : item.type
                  return (
                    <li
                      key={item.id}
                      className={classNames("media-type__item", {
                        "media-type__item--selected": item.type === this.state.mediaType.type
                      })}
                      style={{ backgroundImage: `url(${item.icon})` }}
                    >
                      <button
                        type="button"
                        className="media-type__button"
                        value={item.type}
                        onClick={e => {
                          if (this.props.listIsOpen) {
                            this.inputRef.focus()
                          }
                          this.setState(
                            {
                              mediaType: {
                                type: e.target.value,
                                icon: item.icon
                              },
                              mediaTypesIsOpen: false
                            },
                            () => this._runSearch(this.state.mediaType)
                          )
                        }}
                      >
                        {type}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        <input
          ref={_input => {
            this.inputRef = _input
          }}
          className="search__input"
          type="text"
          placeholder="Search"
          value={this.state.query}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          onFocus={this.props.onFocus}
        />
        {this.props.isSearchingList && <Loader className="loader--small-pink" />}
        {this.state.query && (
          <button type="button" className="button--input-clear" onClick={this.resetSearch} />
        )}
      </>
    )
  }
}
