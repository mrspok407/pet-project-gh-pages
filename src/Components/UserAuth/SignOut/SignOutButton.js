import React from "react"

import { withFirebase } from "Components/Firebase"

const SignOutButton = ({ firebase }) => (
  <button type="button" className="button" onClick={firebase.signOut}>
    Sign Out
  </button>
)

export default withFirebase(SignOutButton)
