import { ChatThreadClient, ChatParticipant } from '@azure/communication-chat'
import React, { createRef } from 'react'
import { useAppContext } from '../../store/UniContext'
import Message from '../../store/Message'
import Panel from '../../components/Panels/Panel'
import { MainContainer, ChatContainer, MessageList, Message as MessageComp, MessageInput, ConversationHeader, MessageSeparator, Avatar } from '@chatscope/chat-ui-kit-react'
import PanelHeader from '../../components/Panels/PanelHeader'
const profileIcon = require('../../assets/icons/home.svg').default as string

export default function ChatBox(props) {
  const [globalState, dispatch] = useAppContext()
  let baseVal: Message[] = []
  /*const ms = [
    { sender: 'paty', time: new Date('2015-02-04'), content: 'ffrf' },
    { sender: 'me', time: new Date('2015-02-04'), content: 'cscmc' },
    { sender: 'paty', time: new Date('2015-02-05'), content: 'weffen' },
    { sender: 'me', time: new Date('2015-02-08'), content: 'vvvvv' },
    { sender: 'me', time: new Date('2015-02-08'), content: 'bj' },
    { sender: 'me', time: new Date('2015-02-08'), content: 'gjh' },
  ]*/
  const [messageToSend, setMessageToSend] = React.useState('') //message that will be sent
  const [messages, setMessages] = React.useState(baseVal) //current list of messages
  const [timerID, setTimerID] = React.useState(-1)

  React.useEffect(() => {
    updateMessages()
    let id = window.setInterval(() => {
      updateMessages()
    }, 1000)
    console.log('adding timer :' + id)
    setTimerID(id)

    return function cleanup() {
      console.log('unmounting chatbox')
      console.log(id.toString())
      clearInterval(id)
    }
  }, [props])

  const calcMinutesAgo = (m: Message) => Math.abs(Math.round((Date.now() - m.time.getTime()) / 60000)).toString() + ' mins ago'

  const calcMessagesDirection = (m: Message) => {
    // console.log('sender: ', m.sender)
    // console.log('global: ', globalState)
    return m.sender === globalState.user.id ? 'outgoing' : 'incoming'
  }

  async function sendMessage(c) {
    console.log('trying to send message: ', c)

    const sendMessageRequest = {
      content: c,
    }

    let sendMessageOptions = {
      senderDisplayName: globalState.user.id,
      type: 'text',
    }

    props.chatTC.ThreadCli.sendMessage(sendMessageRequest, sendMessageOptions)
    setMessageToSend('')
    updateMessages()
  }

  async function updateMessages() {
    console.log('updating messages')
    let messages = props.chatTC.ThreadCli.listMessages()
    let newMessages: Message[] = []
    let mCount = 0
    let messageLimit = 10

    for await (const message of messages) {
      if (message.type === 'text') {
        newMessages.push({
          sender: message.senderDisplayName,
          time: new Date(message.createdOn.getFullYear(), message.createdOn.getMonth(), message.createdOn.getDate(), message.createdOn.getHours(), message.createdOn.getMinutes(), message.createdOn.getSeconds(), 0),
          content: message.content.message,
        })
        mCount++
      } //could add sender here
      if (mCount === messageLimit) {
        break
      }
    }

    // for (let i = messageLimit; i >= mCount; i--) {
    //   newMessages.push({ sender: '', time: new Date(0), content: '' })
    // }
    setMessages(newMessages.reverse())
  }

  const listMessages = messages.map((m, index, array) => {
    let showMessageSeparator = true
    const currentDate = m.time
    if (index !== 0) {
      const prevDate = array[index - 1].time.getTime()
      const diff = Math.round((((currentDate.getTime() - prevDate) / (1000 * 3600 * 24)) * 100) / 100)
      showMessageSeparator = diff > 0 ? true : false
    }
    return (
      <>
        {showMessageSeparator ? <MessageSeparator>{currentDate.toLocaleString('default', { month: 'long' }) + ' ' + currentDate.getDate() + ', ' + currentDate.getFullYear()}</MessageSeparator> : ''}
        <MessageComp
          model={{
            message: m.content,
            sentTime: calcMinutesAgo(m),
            sender: m.sender,
            direction: calcMessagesDirection(m),
            position: 'normal',
          }}
        ></MessageComp>
      </>
    )
  })

  return (
    <>
      <Panel innerPadding={3} color="bg-bdg" height="h-100" className="rounded-7">
        <PanelHeader color="bg-bdsg">
          <p className="fs-6 m-0">{props.chatTC.ChatName}</p>
        </PanelHeader>
        <Panel padding={3} className="h80">
          <MessageList>{listMessages}</MessageList>
        </Panel>
        <div className="h10">
          <MessageInput attachButton={false} placeholder="Type..." defaultValue="" value={messageToSend} onChange={(e, c, i, n) => setMessageToSend(c)} onSend={(e, c, i, n) => sendMessage(c)} sendOnReturnDisabled={false} className="form-input fixed-bottom" />
        </div>
      </Panel>
    </>
  )
}
