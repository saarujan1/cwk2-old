import { ChatThreadClient, ChatParticipant } from '@azure/communication-chat'
import React, { createRef } from 'react'
import { useAppContext } from "../UniContext";

export default function ChatBox(props){
    const [globalState,dispatch] = useAppContext();
    var baseVal : string[] = []
    const [theM,settheM] = React.useState('') //message that will be sent 
    const [messages, setMessages] = React.useState(baseVal) //current list of messages
    const [timerID,setTimerID] = React.useState(0)
    React.useEffect(() =>{
        updateMessages()
        setTimerID(window.setInterval(() =>{updateMessages()},1000))
        
        return function cleanup(){
            if(timerID != 0){
                clearInterval(timerID);
            }
        }
    },[props]);

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
        var mCount = 0
        var messageLimit = 10;

        for await (const message of messages) { 
            if(message.type == 'text'){
                newMessages.push(message.senderDisplayName + " <" + message.createdOn.getHours().toString() + ":" + message.createdOn.getHours().toString() + "> : "  + message.content.message);
                mCount++;
            } //could add sender here
            if(mCount == messageLimit){break;}
        }
        var finalMessagePush = []
        for (let i = messageLimit; i > mCount; i--) {
            newMessages.push('');
        }
        setMessages(newMessages);
    }

    
    

    return (<>
    <div>
        <h1>ChatID:{props.chatTC.threadId}</h1>
    </div>
    <div>
        <ul id="chat" list-style-type="none">{listItems}</ul>
    </div>
    <div>
        <input value={theM} onChange={onChange} onKeyDown={handleKeyDown} placeholder="message"/> 
    </div>
    
    
    </>)
}
