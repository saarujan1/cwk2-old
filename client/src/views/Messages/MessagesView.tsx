import { useAppContext } from '../../store/UniContext'
import { ChatClient, ChatMessage, ChatThreadClient, ChatThreadItem } from '@azure/communication-chat'
import { AzureCommunicationTokenCredential } from '@azure/communication-common'
import ChatBox from './ChatBox'
import Message from '../../store/Message'
import React, { useState } from 'react'
import { getAzure } from '../../store/helpers'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import Panel from '../../components/Panels/Panel'
import { Loader } from '@chatscope/chat-ui-kit-react'

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
    console.log('threads: ', threads)
    updateChatThreads(theChatThreads)
  }

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

  const getLastMessage = () => {
    // const messages = chatThreads[currentChat].ThreadCli.listMessages()
    // const collection: ChatMessage[] = []
    // for await (const message of messages) {
    //   collection.push(message)
    // }
    // messages.at(-1)?.content
  }

  console.log('checking chatThreads')
  if (chatThreads.length !== 0) {
    let chatThreadClient = chatThreads[currentChat]

    return (
      <>
        <h2 className="c-heading text-light-white">Chats</h2>
        <div className="container-fluid h-100">
          <Panel padding={3} height="h95" color="bg-bg" shadow>
            <div className="row h-100">
              <div className="col-3 h-100 d-flex flex-column" style={{ overflowY: 'scroll' }}>
                {chatThreads.map((person, index) => (
                  <div
                    className="mb-3 p-4 rounded-4 bg-bdsg"
                    role="button"
                    onClick={() => {
                      newChat(index)
                    }}
                  >
                    <p className="text-light-white fw-bold m-0 fs-6">{person.ChatName}</p>
                    {/* <p>{messages.at(-1)?.content}</p> */}
                  </div>
                ))}
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
      <h3>No messages made yet...</h3>
    </>
  )
}
