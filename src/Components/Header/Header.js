/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { Component } from "react"
import { NavLink } from "react-router-dom"
import classNames from "classnames"
import logo from "assets/images/main-page-logo.png"
import Login from "./Login"
import * as ROUTES from "Utils/Constants/routes"
// import * as ROLES from "Utils/Constants/roles"
import { AuthUserContext } from "Components/UserAuth/Session/WithAuthentication"
import "./Header.scss"
import "../UserAuth/UserAuth.scss"
import Search from "Components/SearchPage/Search/Search"

export default class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      navMobileOpen: false
    }

    this.nav = React.createRef()
  }

  closeNavMobile = () => {
    this.setState({ navMobileOpen: false })
  }

  render() {
    const { isLogoVisible = true } = this.props
    const authUser = this.context

    return (
      <header className="header">
        <nav
          ref={this.nav}
          className={classNames("nav", {
            "nav--mobile-open": this.state.navMobileOpen === true
          })}
        >
          <ul className="nav__list">
            <NavLink
              exact
              to={ROUTES.HOME_PAGE}
              activeClassName="nav__item--active"
              className="nav__link--logo"
              onClick={() => this.closeNavMobile()}
            >
              <li className="nav__item nav__item--logo"></li>
            </NavLink>

            {authUser && (
              <>
                <NavLink
                  exact
                  to={ROUTES.CALENDAR}
                  className="nav__link"
                  activeClassName="nav__item--active"
                  onClick={() => this.closeNavMobile()}
                >
                  <li className="nav__item">Calendar</li>
                </NavLink>

                <NavLink
                  exact
                  to={ROUTES.TO_WATCH}
                  className="nav__link"
                  activeClassName="nav__item--active"
                  onClick={() => this.closeNavMobile()}
                >
                  <li className="nav__item">To Watch</li>
                </NavLink>
              </>
            )}

            <NavLink
              exact
              to={ROUTES.SHOWS}
              className="nav__link"
              activeClassName="nav__item--active"
              onClick={() => this.closeNavMobile()}
            >
              <li className="nav__item">Shows</li>
            </NavLink>

            <NavLink
              exact
              to={ROUTES.MOVIES}
              className="nav__link"
              activeClassName="nav__item--active"
              onClick={() => this.closeNavMobile()}
            >
              <li className="nav__item">Movies</li>
            </NavLink>

            {authUser ? (
              <>
                <NavLink exact to={ROUTES.PROFILE} className="nav__link">
                  <li className="nav__item" onClick={() => this.closeNavMobile()}>
                    Profile
                  </li>
                </NavLink>

                {/* {authUser.roles && !!authUser.roles[ROLES.ADMIN] && (
                  <NavLink exact to={ROUTES.ADMIN} className="nav__link">
                    <li className="nav__item" onClick={() => this.closeNavMobile()}>
                      Admin
                    </li>
                  </NavLink>
                )} */}
              </>
            ) : (
              <Login
                clearCurrentlyChosenContent={this.props.clearCurrentlyChosenContent}
                closeNavMobile={this.closeNavMobile}
              />
            )}

            <li className="nav__item nav__item--nav-search">
              <Search navSearch={true} navRef={this.nav} />
            </li>
          </ul>
        </nav>
        <button
          type="button"
          className={classNames("header__show-nav", {
            "header__show-nav--open": this.state.navMobileOpen
          })}
          onClick={() =>
            this.setState(prevState => ({
              navMobileOpen: !prevState.navMobileOpen
            }))
          }
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div
          className="logo"
          style={
            isLogoVisible
              ? {
                  display: "inherit"
                }
              : {
                  display: "none"
                }
          }
        >
          <img className="logo__img" src={logo} alt="logo" />
        </div>
      </header>
    )
  }
}

Header.contextType = AuthUserContext
