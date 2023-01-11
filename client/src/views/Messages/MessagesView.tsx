import { useAppContext } from '../../store/UniContext'
import { ChatClient, ChatThreadClient, ChatThreadItem } from '@azure/communication-chat'
import { AzureCommunicationTokenCredential } from '@azure/communication-common'
import ChatBox from './ChatBox'
import React, { useState } from 'react'
import { getAzure } from '../../store/helpers'
import { rejects } from 'assert'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'

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

  async function getOtherUser(ctc: ChatThreadClient) {
    console.log('getting participants')
    try {
      var participants = ctc.listParticipants()
      for await (const participant of participants) {
        console.log(participant.displayName)
        if (participant.displayName !== globalState.user.id && participant.displayName !== undefined) {
          return participant.displayName as string
        }
      }
    } catch (error) {
      console.log(error)
    }
    return 'unknown'
  }

  console.log('checking chatThreads')
  if (chatThreads.length !== 0) {
    let chatThreadClient = chatThreads[currentChat]
    // return (
    //   <>
    //
    // )
    return (
      <>
        <div>
          <div>
            <h2>Match Chats: </h2>
            <ul id="chats">{listChats}</ul>
          </div>
          <ChatBox chatTC={chatThreadClient}></ChatBox>
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
