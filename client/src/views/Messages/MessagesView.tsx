import { useAppContext } from '../../UniContext'
import { ChatClient, ChatThreadClient, ChatThreadItem } from '@azure/communication-chat'
import { AzureCommunicationTokenCredential } from '@azure/communication-common'
import ChatBox from './ChatBox'
import React, { useState } from 'react'
import { getAzure } from '../../shared.js'
import { rejects } from 'assert'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, ConversationHeader, MessageSeparator, Avatar } from '@chatscope/chat-ui-kit-react'
const profileIcon = require('../../assets/icons/profile.svg').default as string

const endpointURL = 'https://cw2comser.communication.azure.com/'

export default function MessagesView() {
  const [globalState, dispatch] = useAppContext()
  const [currentChat, newChat] = useState(0)
  const [chatThreads, updateChatThreads] = useState([] as chat[])
  React.useEffect(() => {
    setUp()
  }, [])

  type chat = {
    ThreadCli: ChatThreadClient
    ChatName: string
  }

  async function setUp() {
    getChats(new ChatClient(endpointURL, new AzureCommunicationTokenCredential(await getToken())))
  }

  const listChats = chatThreads.map((m, index) => (
    <li>
      <button
        type="button"
        onClick={() => {
          newChat(index)
        }}
        className="btn btn-info"
      >
        {m.ChatName}
      </button>
    </li>
  ))

  async function getToken() {
    let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/gettoken?', { comID: globalState.user.communicationID }))
    let x = (await promise) as any
    console.log('token retrieved')
    return x.token
  }

  async function getChats(cli) {
    console.log('retrieving chats')
    const threads = cli.listChatThreads()
    updateChatThreads([])
    var theChatThreads: chat[] = []

    for await (const thread of threads) {
      var ctc = cli.getChatThreadClient(thread.id)
      var c: chat = { ThreadCli: ctc, ChatName: await getOtherUser(ctc) }

      theChatThreads.push(c)
    }

    updateChatThreads(theChatThreads)
  }

  async function getOtherUser(ctc: ChatThreadClient) {
    console.log('getting participants')
    try {
      var participants = ctc.listParticipants()
      for await (const participant of participants) {
        console.log(participant.displayName)
        if (participant.displayName != globalState.user.id && participant.displayName != undefined) {
          return participant.displayName as string
        }
      }
    } catch (error) {
      console.log(error)
    }
    return 'unknown'
  }

  console.log('checking chatThreads')
  if (chatThreads.length != 0) {
    let chatThreadClient = chatThreads[currentChat]
    // return (
    //   <>
    //     <div>
    //       <h2>Match Chats: </h2>
    //       <ul id="chats">{listChats}</ul>
    //     </div>
    //     <ChatBox chatTC={chatThreadClient}></ChatBox>
    //   </>
    // )
    return (
      <>
        <div
          style={{
            height: '500px',
          }}
        >
          <ChatContainer>
            <ConversationHeader>
              <Avatar src={profileIcon} name="Emily" />
              <ConversationHeader.Content userName="Emily" info="Active 10 mins ago" />
            </ConversationHeader>
            <MessageList>
              <MessageSeparator>Saturday, 30 November 2019</MessageSeparator>

              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  sender: 'Emily',
                  direction: 'incoming',
                  position: 'single',
                }}
              >
                <Avatar src={profileIcon} name={'Emily'} />
              </Message>
              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  sender: 'ME',
                  direction: 'outgoing',
                  position: 'single',
                }}
              />
              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  sender: 'Emily',
                  direction: 'incoming',
                  position: 'first',
                }}
                avatarSpacer
              />
              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  sender: 'Emily',
                  direction: 'incoming',
                  position: 'normal',
                }}
                avatarSpacer
              />
              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  sender: 'Emily',
                  direction: 'incoming',
                  position: 'normal',
                }}
                avatarSpacer
              />
              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  sender: 'Emily',
                  direction: 'incoming',
                  position: 'last',
                }}
              >
                <Avatar src={profileIcon} name={'Emily'} />
              </Message>
              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  direction: 'outgoing',
                  position: 'first',
                }}
              />
              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  direction: 'outgoing',
                  position: 'normal',
                }}
              />
              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  direction: 'outgoing',
                  position: 'normal',
                }}
              />
              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  direction: 'outgoing',
                  position: 'last',
                }}
              />

              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  sender: 'Emily',
                  direction: 'incoming',
                  position: 'first',
                }}
                avatarSpacer
              />
              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  sender: 'Emily',
                  direction: 'incoming',
                  position: 'last',
                }}
              >
                <Avatar src={profileIcon} name={'Emily'} />
              </Message>

              <MessageSeparator>Saturday, 31 November 2019</MessageSeparator>

              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  sender: 'Emily',
                  direction: 'incoming',
                  position: 'single',
                }}
              >
                <Avatar src={profileIcon} name={'Emily'} />
              </Message>
              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  sender: 'ME',
                  direction: 'outgoing',
                  position: 'single',
                }}
              />
              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  sender: 'Emily',
                  direction: 'incoming',
                  position: 'first',
                }}
                avatarSpacer
              />
              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  sender: 'Emily',
                  direction: 'incoming',
                  position: 'normal',
                }}
                avatarSpacer
              />
              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  sender: 'Emily',
                  direction: 'incoming',
                  position: 'normal',
                }}
                avatarSpacer
              />
              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  sender: 'Emily',
                  direction: 'incoming',
                  position: 'last',
                }}
              >
                <Avatar src={profileIcon} name={'Emily'} />
              </Message>
              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  direction: 'outgoing',
                  position: 'first',
                }}
              />
              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  direction: 'outgoing',
                  position: 'normal',
                }}
              />
              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  direction: 'outgoing',
                  position: 'normal',
                }}
              />
              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  direction: 'outgoing',
                  position: 'last',
                }}
              />

              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  sender: 'Emily',
                  direction: 'incoming',
                  position: 'first',
                }}
                avatarSpacer
              />
              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: '15 mins ago',
                  sender: 'Emily',
                  direction: 'incoming',
                  position: 'last',
                }}
              >
                <Avatar src={profileIcon} name={'Emily'} />
              </Message>
            </MessageList>
            <MessageInput placeholder="Type message here" />
          </ChatContainer>
        </div>
      </>
    )
  }
  return (
    <>
      <div>No Matches made yet...</div>
    </>
  )
}
