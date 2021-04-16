import { CONTEXT_INITIAL_STATE } from "Components/AppContext/AppContextHOC"
import React, { createContext } from "react"

export interface FirebaseInterface {
  [key: string]: any
  auth?: any
  app?: any
  user?: any
  showEpisodes?: any
  showInDatabase?: any
  timeStamp?: any
  callback?: any
  userAllShows?: any
  userEpisodes?: any
  userShow?: any
  userShowAllEpisodes?: any
  userShowAllEpisodesInfo?: any
  watchLaterMovies?: any
  onAuthUserListener?: any
  signInWithEmailAndPassword?: any
  signOut?: any
  createUserWithEmailAndPassword?: any
  sendEmailVerification?: any
  passwordReset?: any
  httpsCallable?: any
  messages: ({ chatKey }: { chatKey: string }) => any
  privateChat: () => any
  unreadMessages: ({ uid, chatKey }: { uid: string; chatKey: string }) => any
  newContactsRequests: ({ uid }: { uid: string | undefined }) => any
  newContactsActivity: ({ uid }: { uid: string | undefined }) => any
  contactsDatabase: ({ uid }: { uid: string | undefined }) => any
  contactsList: ({ uid }: { uid: string | undefined }) => any
  contact: ({ authUid, contactUid }: { authUid: string | undefined; contactUid: string }) => any
}

export const FIREBASE_INITIAL_STATE = {
  newContactsActivity: () => {},
  newContactsRequests: () => {},
  contactsDatabase: () => {},
  contactsList: () => {},
  contact: () => {},
  messages: () => {},
  privateChat: () => {},
  unreadMessages: () => {}
}

export const FirebaseContext = createContext<FirebaseInterface>(FIREBASE_INITIAL_STATE)
