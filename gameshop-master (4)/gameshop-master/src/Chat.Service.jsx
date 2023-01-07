import { CometChat } from '@cometchat-pro/chat'
import { setGlobalState } from './store'

const CONSTANTS = {
  APP_ID: process.env.REACT_APP_COMET_CHAT_APP_ID,
  REGION: process.env.REACT_APP_COMET_CHAT_REGION,
  Auth_Key: process.env.REACT_APP_COMET_CHAT_AUTH_KEY,
}

const initCometChat = async () => {
  const appID = CONSTANTS.APP_ID
  const region = CONSTANTS.REGION

  const appSetting = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(region)
    .build()

  await CometChat.init(appID, appSetting)
    .then(() => console.log('Initialization completed successfully'))
    .catch((error) => error)
}

const loginWithCometChat = async (UID) => {
  const authKey = CONSTANTS.Auth_Key
  return await CometChat.login(UID, authKey)
    .then((user) => {
      setGlobalState('currentUser', user)
      return true
    })
    .catch((error) => error)
}

const signUpWithCometChat = async (UID, name) => {
  let authKey = CONSTANTS.Auth_Key
  const user = new CometChat.User(UID)
  user.setName(name)

  return await CometChat.createUser(user, authKey)
    .then((user) => {
      console.log('Signed In: ', user)
      return true
    })
    .catch((error) => error)
}

const logOutWithCometChat = async () => {
  return await CometChat.logout()
    .then(() => setGlobalState('currentUser', null))
    .catch((error) => error)
}

const isUserLoggedIn = async () => {
  await CometChat.getLoggedinUser()
    .then((user) => setGlobalState('currentUser', user))
    .catch((error) => console.log('error:', error))
}

const getUser = async (UID) => {
  return await CometChat.getUser(UID)
    .then((user) => user)
    .catch((error) => error)
}

const getMessages = async (UID) => {
  const limit = 30
  const messagesRequest = new CometChat.MessagesRequestBuilder()
    .setUID(UID)
    .setLimit(limit)
    .build()

  return await messagesRequest
    .fetchPrevious()
    .then((messages) => messages)
    .catch((error) => error)
}

const sendMessage = async (receiverID, messageText) => {
  const receiverType = CometChat.RECEIVER_TYPE.USER
  const textMessage = new CometChat.TextMessage(
    receiverID,
    messageText,
    receiverType,
  )

  return await CometChat.sendMessage(textMessage)
    .then((message) => message)
    .catch((error) => error)
}

const getConversations = async () => {
  const limit = 30
  const conversationsRequest = new CometChat.ConversationsRequestBuilder()
    .setLimit(limit)
    .build()

  return await conversationsRequest
    .fetchNext()
    .then((conversationList) => conversationList)
    .catch((error) => error)
}

export {
  initCometChat,
  loginWithCometChat,
  signUpWithCometChat,
  logOutWithCometChat,
  getMessages,
  sendMessage,
  getConversations,
  isUserLoggedIn,
  getUser,
  CometChat,
}
