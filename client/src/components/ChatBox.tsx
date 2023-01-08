import { ChatThreadClient } from '@azure/communication-chat'
import React, { createRef } from 'react'
import { useAppContext } from "../UniContext";

export default function ChatBox(props){
    const [globalState,dispatch] = useAppContext();
    var baseVal : string[] = []
    const [theM,settheM] = React.useState('') //message that will be sent 
    const [messages, setMessages] = React.useState(baseVal) //current list of messages

    //hook for clicking enter
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage()
        }
      }

    const onChange = (e) => {
        settheM(e.target.value)
    }

    const listItems = messages.map((m) =>
    <li>{m}</li>
    );

    updateMessages();

   
    async function sendMessage(){
        console.log('trying to send message')
        const sendMessageRequest =
        {
            content: theM
        };
        let sendMessageOptions =
        {
            senderDisplayName : globalState.user.id,
            type: 'text',
        };
        props.chatTC.sendMessage(sendMessageRequest, sendMessageOptions);
        settheM('');
        updateMessages();
    }

    async function updateMessages(){
        console.log('updating messages')
        var messages = props.chatTC.listMessages();
        var newMessages : string[] = [] 
        for await (const message of messages) { 
            if(message.type == 'text'){newMessages.push(message.content?.message as string)} //could add sender here
        }
        setMessages(newMessages);
    }

    return (<>
    <div>
        <h1>ChatID:{props.chatTC.threadId}</h1>
    </div>
    <div>
        <input value={theM} onChange={onChange} onKeyDown={handleKeyDown} placeholder="email"/> 
    </div>
    <div>
        <ul>{listItems}</ul>
    </div>
    
    </>)
}
