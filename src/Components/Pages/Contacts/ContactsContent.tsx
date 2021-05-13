import classNames from "classnames"
import { FirebaseContext } from "Components/Firebase"
import React, { useContext, useEffect, useRef } from "react"
import ChatWindow from "./Components/ChatWindow/ChatWindow"
import ContactList from "./Components/ContactList/ContactList"
import ContactsContextHOC, { ContactsContext } from "./Components/Context/ContactsContext"
import { MessageInterface } from "./Types"
import { LoremIpsum } from "lorem-ipsum"
import { AppContext } from "Components/AppContext/AppContextHOC"

type Props = {}

const ContactsContent: React.FC<Props> = () => {
  const firebase = useContext(FirebaseContext)
  const context = useContext(ContactsContext)
  const { authUser } = useContext(AppContext)
  const { activeChat, contacts, messages } = context?.state!

  const messagesRef = useRef<{ [key: string]: MessageInterface[] }>()

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    return () => {
      console.log(messagesRef.current)
      if (!messagesRef.current) return
      Object.keys(messagesRef.current).forEach((chatKey) => {
        console.log(chatKey)
        let otherMemberKey: string
        if (authUser?.uid === chatKey.slice(0, authUser?.uid.length)) {
          otherMemberKey = chatKey.slice(authUser?.uid.length + 1)
        } else {
          otherMemberKey = chatKey.slice(0, -authUser?.uid.length! - 1)
        }

        firebase.messages({ chatKey }).off()
        firebase.chatMemberStatus({ chatKey, memberKey: otherMemberKey }).off()
      })
    }
  }, [authUser, firebase])

  const addNewMessageCurrent = async () => {
    const lorem = new LoremIpsum({
      sentencesPerParagraph: {
        max: 8,
        min: 4
      },
      wordsPerSentence: {
        max: 8,
        min: 4
      }
    })

    for (let i = 1; i <= 10; i++) {
      const userKey = activeChat.contactKey
      const chatKey = userKey < authUser?.uid! ? `${userKey}_${authUser?.uid}` : `${authUser?.uid}_${userKey}`

      const randomMessage = lorem.generateSentences(1)
      const timeStampEpoch = new Date().getTime()

      const pushNewMessage = await firebase
        .privateChats()
        .child(`${chatKey}/messages`)
        .push({
          sender: userKey,
          // sender: Math.random() > 0.5 ? userKey : authUser?.uid,
          message: randomMessage,
          timeStamp: timeStampEpoch * 2
        })

      const contactStatus = await firebase.chatMemberStatus({ chatKey, memberKey: authUser?.uid! }).once("value")

      console.log(contactStatus.val())

      if (!contactStatus.val().isOnline || !contactStatus.val().chatBottom) {
        firebase
          .privateChats()
          .child(`${chatKey}/members/${authUser?.uid}/unreadMessages/${pushNewMessage.key}`)
          .set(true)
      }
    }
  }

  const addNewMessageTopContact = async () => {
    const lorem = new LoremIpsum({
      sentencesPerParagraph: {
        max: 8,
        min: 4
      },
      wordsPerSentence: {
        max: 8,
        min: 4
      }
    })

    for (let i = 1; i <= 10; i++) {
      const userKey = Object.keys(contacts)[Object.keys(contacts).length - 1]
      const chatKey = userKey < authUser?.uid! ? `${userKey}_${authUser?.uid}` : `${authUser?.uid}_${userKey}`

      const randomMessage = lorem.generateSentences(1)
      const timeStampEpoch = new Date().getTime()

      const pushNewMessage = await firebase
        .privateChats()
        .child(`${chatKey}/messages`)
        .push({
          sender: userKey,
          // sender: Math.random() > 0.5 ? userKey : authUser?.uid,
          message: randomMessage,
          timeStamp: timeStampEpoch * 2
        })

      const contactStatus = await firebase.chatMemberStatus({ chatKey, memberKey: authUser?.uid! }).once("value")

      console.log(contactStatus.val())

      if (!contactStatus.val().isOnline || !contactStatus.val().chatBottom) {
        firebase
          .privateChats()
          .child(`${chatKey}/members/${authUser?.uid}/unreadMessages/${pushNewMessage.key}`)
          .set(true)
      }
    }
  }

  return (
    <>
      <button style={{ width: "400px" }} type="button" className="button" onClick={() => addNewMessageCurrent()}>
        Add new message current
      </button>
      <button style={{ width: "400px" }} type="button" className="button" onClick={() => addNewMessageTopContact()}>
        Add new message top
      </button>
      <div className="chat-container">
        <ContactList />

        {activeChat.chatKey === "" || !contacts[activeChat.contactKey] ? (
          !Object.keys(contacts)?.length ? (
            ""
          ) : (
            <div className="chat-window-container chat-window-container--no-active-chat">
              <div className="chat-window">Select a chat to start messaging</div>
            </div>
          )
        ) : (
          <ChatWindow />
        )}
      </div>
    </>
  )
}

export default ContactsContextHOC(ContactsContent)