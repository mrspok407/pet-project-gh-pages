import React, { useCallback, useContext, useEffect } from "react"
import { Helmet } from "react-helmet"
import * as ROUTES from "Utils/Constants/routes"
import UserAuthForm from "Components/UI/UserAuthForm/UserAuthForm"
import Header from "Components/UI/Header/Header"
import ScrollToTopOnMount from "Utils/ScrollToTopOnMount"
import Footer from "Components/UI/Footer/Footer"
import { FirebaseContext } from "Components/Firebase"
import { useHistory } from "react-router-dom"
import useAuthUser from "Components/UserAuth/Session/WithAuthentication/UseAuthUser"
import "./Login.scss"

const LoginPage = () => {
  const authUser = useAuthUser()
  const firebase = useContext(FirebaseContext)
  const history = useHistory()

  const authorizationListener = useCallback(() => {
    firebase.onAuthUserListener(
      (authUser) => {
        if (authUser !== null) {
          history.push(ROUTES.HOME_PAGE)
        }
      },
      () => {}
    )
  }, [firebase, history])

  useEffect(() => {
    authorizationListener()
    return () => {
      authorizationListener()
    }
  }, [authorizationListener])

  return (
    authUser === null && (
      <>
        <Helmet>
          <title>Login | TV Junkie</title>
        </Helmet>
        <Header isLogoVisible={false} hideLogin={true} />
        <div className="login-page">
          <UserAuthForm loginPage={true} activeSection="register" />
        </div>
        <Footer />
        <ScrollToTopOnMount />
      </>
    )
  )
}

export default LoginPage