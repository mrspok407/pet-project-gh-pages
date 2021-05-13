export interface ContactInfoInterface {
  status: boolean | string
  receiver: boolean
  userName: string
  timeStamp: number
  pinned_lastActivityTS: string
  key: string
  newContactsActivity: boolean | null
  newContactsRequests: boolean | null
  lastMessage: MessageInterface
  unreadMessagesAuth: string[]
  unreadMessagesContact: number
}

export const CONTACT_INFO_INITIAL_DATA = {
  status: [false, ""],
  receiver: false,
  userName: "",
  timeStamp: 0,
  pinned_lastActivityTS: ""
}

export interface ContactsInterface {
  [key: string]: ContactInfoInterface
}

export interface MessageInterface {
  message: string
  sender: string
  timeStamp: number
  key: string
}

export interface ContactStatusInterface {
  isOnline: boolean
  lastSeen: number | undefined
  chatBottom: boolean | undefined
}

export const MESSAGE_INITIAL_DATA = {
  message: "",
  sender: "",
  timeStamp: 0
}

export interface ContactsStateInterface {
  contactsUnreadMessages: {
    [key: string]: string[]
  }
  authUserUnreadMessages: {
    [key: string]: string[]
  }
  activeChat: {
    chatKey: string
    contactKey: string
  }
  messages: {
    [key: string]: MessageInterface[]
  }
  renderedMessages: {
    [key: string]: number | undefined
  }
  renderedMessagesList: {
    [key: string]: MessageInterface[]
  }
  contacts: {
    [key: string]: ContactInfoInterface
  }
  lastScrollPosition: {
    [key: string]: number | undefined
  }
  contactsStatus: {
    [key: string]: ContactStatusInterface
  }
  messagesListRef: any
  messagePopup: string
  contactPopup: string
}

export interface SnapshotStringBooleanInterface {
  val: () => { [key: string]: boolean | null } | null
  numChildren: () => number
}

export interface ContainerRectInterface {
  height: number
  scrollHeight: number
  scrollTop: number
  thresholdTopLoad: number
  thresholdTopRender: number
  thresholdBottomRender: number
}