import { ChatThreadClient, ChatParticipant } from '@azure/communication-chat'
import React, { createRef } from 'react'
import { useAppContext } from '../../store/UniContext'
import Message from '../../store/Message'
import { MainContainer, ChatContainer, MessageList, Message as MessageComp, MessageInput, ConversationHeader, MessageSeparator, Avatar } from '@chatscope/chat-ui-kit-react'
const profileIcon = require('../../assets/icons/home.svg').default as string

export default function ChatBox(props) {
  const [globalState, dispatch] = useAppContext()
  var baseVal: Message[] = []
  const [messageToSend, setMessageToSend] = React.useState('') //message that will be sent
  const [messages, setMessages] = React.useState(baseVal) //current list of messages
  const [timerID, setTimerID] = React.useState(-1)

  React.useEffect(() => {
    updateMessages()
    var id = window.setInterval(() => {
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

  //hook for clicking enter
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage()
    }
  }

  const onChange = (e) => {
    setMessageToSend(e.target.value)
  }

  const calcMinutesAgo = (m: Message) => Math.abs(Math.round((Date.now() - m.time.getTime()) / 60000)).toString() + ' mins ago'

  const calcMessagesDirection = (m: Message) => (m.sender === globalState.user.name ? 'outgoing' : 'incoming')

  async function sendMessage() {
    console.log('trying to send message')

    const sendMessageRequest = {
      content: messageToSend,
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
    var messages = props.chatTC.ThreadCli.listMessages()
    var newMessages: Message[] = []
    var mCount = 0
    var messageLimit = 10

    for await (const message of messages) {
      if (message.type === 'text') {
        newMessages.push({ sender: message.senderDisplayName, time: new Date(message.createdOn.getYear(), message.createdOn.getMonth(), message.createdOn.getDay(), message.createdOn.getHours(), message.createdOn.getMinutes(), message.createdOn.getSeconds(), 0), content: message.content.message })
        mCount++
      } //could add sender here
      if (mCount === messageLimit) {
        break
      }
    }

    for (let i = messageLimit; i > mCount; i--) {
      newMessages.push({ sender: '', time: new Date(0), content: '' })
    }

    setMessages(newMessages)
  }

  const listMessages = messages.map((m) => (
    <>
      <MessageComp
        model={{
          message: m.content,
          sentTime: calcMinutesAgo(m),
          sender: m.sender,
          direction: calcMessagesDirection(m),
          position: 'normal',
        }}
      >
        <Avatar src={profileIcon} name={m.sender} />
      </MessageComp>
    </>
  ))

  return (
    <>
      <div>
        <h1>Chatting with {props.chatTC.ChatName}</h1>
      </div>
      <div>
        <ul id="chat">{listMessages}</ul>
      </div>
      <div>
        <input value={messageToSend} onChange={onChange} onKeyDown={handleKeyDown} placeholder="message" className="form-control" />
      </div>

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

            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Emily',
                direction: 'incoming',
                position: 'single',
              }}
            >
              <Avatar src={profileIcon} name={'Emily'} />
            </MessageComp>
            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'ME',
                direction: 'outgoing',
                position: 'single',
              }}
            />
            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Emily',
                direction: 'incoming',
                position: 'first',
              }}
              avatarSpacer
            />
            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Emily',
                direction: 'incoming',
                position: 'normal',
              }}
              avatarSpacer
            />
            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Emily',
                direction: 'incoming',
                position: 'normal',
              }}
              avatarSpacer
            />
            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Emily',
                direction: 'incoming',
                position: 'last',
              }}
            >
              <Avatar src={profileIcon} name={'Emily'} />
            </MessageComp>
            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                direction: 'outgoing',
                position: 'first',
              }}
            />
            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                direction: 'outgoing',
                position: 'normal',
              }}
            />
            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                direction: 'outgoing',
                position: 'normal',
              }}
            />
            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                direction: 'outgoing',
                position: 'last',
              }}
            />

            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Emily',
                direction: 'incoming',
                position: 'first',
              }}
              avatarSpacer
            />
            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Emily',
                direction: 'incoming',
                position: 'last',
              }}
            >
              <Avatar src={profileIcon} name={'Emily'} />
            </MessageComp>

            <MessageSeparator>Saturday, 31 November 2019</MessageSeparator>

            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Emily',
                direction: 'incoming',
                position: 'single',
              }}
            >
              <Avatar src={profileIcon} name={'Emily'} />
            </MessageComp>
            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'ME',
                direction: 'outgoing',
                position: 'single',
              }}
            />
            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Emily',
                direction: 'incoming',
                position: 'first',
              }}
              avatarSpacer
            />
            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Emily',
                direction: 'incoming',
                position: 'normal',
              }}
              avatarSpacer
            />
            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Emily',
                direction: 'incoming',
                position: 'normal',
              }}
              avatarSpacer
            />
            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Emily',
                direction: 'incoming',
                position: 'last',
              }}
            >
              <Avatar src={profileIcon} name={'Emily'} />
            </MessageComp>
            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                direction: 'outgoing',
                position: 'first',
              }}
            />
            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                direction: 'outgoing',
                position: 'normal',
              }}
            />
            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                direction: 'outgoing',
                position: 'normal',
              }}
            />
            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                direction: 'outgoing',
                position: 'last',
              }}
            />

            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Emily',
                direction: 'incoming',
                position: 'first',
              }}
              avatarSpacer
            />
            <MessageComp
              model={{
                message: 'Hello my friend',
                sentTime: '15 mins ago',
                sender: 'Emily',
                direction: 'incoming',
                position: 'last',
              }}
            >
              <Avatar src={profileIcon} name={'Emily'} />
            </MessageComp>
          </MessageList>
          <MessageInput placeholder="Type message here" />
        </ChatContainer>
      </div>
    </>
  )
}
