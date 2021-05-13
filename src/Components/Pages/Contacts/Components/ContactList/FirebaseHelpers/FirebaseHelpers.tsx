import { FirebaseInterface } from "Components/Firebase/FirebaseContext"
import { ContactInfoInterface, MessageInterface } from "Components/Pages/Contacts/Types"
import { useContext } from "react"
import { AuthUserInterface } from "Utils/Interfaces/UserAuth"
import { ContactsContext, ContextInterface } from "../../Context/ContactsContext"

interface GetInitialInfoInfterface {
  firebase: FirebaseInterface
  contactsData: ContactInfoInterface[]
  authUser: AuthUserInterface | null
  context: ContextInterface | null
}

export const getInitialContactInfo = async ({
  firebase,
  contactsData,
  authUser,
  context
}: GetInitialInfoInfterface) => {
  return Promise.all(
    contactsData.map(async (contact) => {
      const chatKey =
        contact.key < authUser?.uid! ? `${contact.key}_${authUser?.uid}` : `${authUser?.uid}_${contact.key}`

      const [newContactsActivity, newContactsRequests, unreadMessagesAuthData, unreadMessagesContact, lastMessage]: [
        { val: () => boolean | null },
        { val: () => boolean | null },
        { val: () => { [key: string]: boolean } },
        { val: () => boolean | null },
        { val: () => MessageInterface | null }
      ] = await Promise.all([
        firebase.newContactsActivity({ uid: authUser?.uid! }).child(`${contact.key}`).once("value"),
        firebase.newContactsRequests({ uid: authUser?.uid! }).child(`${contact.key}`).once("value"),
        firebase.unreadMessages({ uid: authUser?.uid!, chatKey }).once("value"),
        firebase.unreadMessages({ uid: contact.key, chatKey }).orderByKey().limitToFirst(1).once("value"),
        firebase.messages({ chatKey }).orderByChild("timeStamp").limitToLast(1).once("value")
      ])

      const unreadMessagesAuth = !unreadMessagesAuthData.val() ? [] : Object.keys(unreadMessagesAuthData.val())
      context?.dispatch({
        type: "updateAuthUserUnreadMessages",
        payload: { chatKey, unreadMessages: unreadMessagesAuth }
      })

      return {
        ...contact,
        key: contact.key,
        newContactsActivity: !!newContactsActivity.val(),
        newContactsRequests: !!newContactsRequests.val(),
        unreadMessagesAuth: unreadMessagesAuth,
        unreadMessagesContact: !!unreadMessagesContact.val(),
        lastMessage: lastMessage.val() !== null ? Object.values(lastMessage.val()!).map((item) => item)[0] : {}
      }
    })
  )
}