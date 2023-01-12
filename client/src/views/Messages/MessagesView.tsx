import { useAppContext } from '../../store/UniContext'
import { ChatClient, ChatMessage, ChatThreadClient, ChatThreadItem } from '@azure/communication-chat'
import { AzureCommunicationTokenCredential } from '@azure/communication-common'
import ChatBox from './ChatBox'
import React, { useState } from 'react'
import { getAzure } from '../../store/helpers'
import { rejects } from 'assert'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import Panel from '../../components/Panels/Panel'

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
    let promise = new Promise((resolve, reject) =>
      getAzure(resolve, '/api/gettoken?', {
        comID: globalState.user.communicationID,
      })
    )
    let x = (await promise) as any
    console.log('token retrieved')
    return x.token
  }

  async function getChats(cli) {
    console.log('retrieving chats')
    const threads = cli.listChatThreads()
    updateChatThreads([])
    let theChatThreads: chat[] = []

    for await (const thread of threads) {
      let ctc = cli.getChatThreadClient(thread.id)
      let c: chat = { ThreadCli: ctc, ChatName: await getOtherUser(ctc) }

      theChatThreads.push(c)
    }

    updateChatThreads(theChatThreads)
  }

  async function getLastMessage(cli) {
    const messages = cli.listMessages()
    const collection: ChatMessage[] = []
    for await (const message of messages) {
      collection.push(message)
    }
    return collection.at(-1)?.content?.message
  }

  const listChats = (cli) =>
    chatThreads.map(async (m, index) => (
      <div
        className="p-3"
        onClick={() => {
          newChat(index)
        }}
      >
        <p className="text-light-white fw-bold m-0 fs-6">kef</p>
        <p className="text-gray fs-8">(+1) 34567890987</p>
        <p>{await getLastMessage(cli)}</p>
        <p>{m.ChatName}</p>
      </div>
    ))

  async function getOtherUser(ctc: ChatThreadClient) {
    console.log('getting participants')
    try {
      let participants = ctc.listParticipants()
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
        <h2 className="c-heading text-light-white">Matched</h2>
        <div className="container-fluid h-100">
          <Panel padding={3} height="h95" color="bg-bg" shadow>
            <div className="row h-100">
              <div className="col-3 h-100">
                <>{listChats(chatThreadClient.ThreadCli)}</>
              </div>
              <div className="col-9 h-100">
                <ChatBox chatTC={chatThreadClient}></ChatBox>
              </div>
            </div>
          </Panel>
        </div>
      </>
    )
  }
  return (
    <>
      <h1 className="pageTitle"> Your matches</h1>
      <h3>No Matches made yet...</h3>
    </>
  )
}
