import { ChatThreadClient, ChatParticipant } from '@azure/communication-chat'
import React, { createRef } from 'react'
import { useAppContext } from "../UniContext";

export default function ChatBox(props){
    const [globalState,dispatch] = useAppContext();
    var baseVal : string[] = []
    const [theM,settheM] = React.useState('') //message that will be sent 
    const [messages, setMessages] = React.useState(baseVal) //current list of messages
    const [timerID,setTimerID] = React.useState(-1)
    React.useEffect(() =>{
        updateMessages()
        var id = window.setInterval(() =>{updateMessages()},1000)
        console.log("adding timer :" + id)
        setTimerID(id)
        
        return function cleanup(){
            console.log("unmounting chatbox");
            console.log(id.toString());
            clearInterval(id);
        }
    },[props]);

    const submitStyle = {
        padding : "5px 5px"
      };
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
        props.chatTC.ThreadCli.sendMessage(sendMessageRequest, sendMessageOptions);
        settheM('');
        updateMessages();
    }

    async function updateMessages(){
        console.log('updating messages')
        var messages = props.chatTC.ThreadCli.listMessages();
        var newMessages : string[] = [] 
        var mCount = 0
        var messageLimit = 10;

        for await (const message of messages) { 
            if(message.type == 'text'){
                newMessages.push(message.senderDisplayName + " <" + message.createdOn.getHours().toString() + ":" + message.createdOn.getMinutes().toString() + "> : "  + message.content.message);
                mCount++;
            } //could add sender here
            if(mCount == messageLimit){break;}
        }
        for (let i = messageLimit; i > mCount; i--) {
            newMessages.push('');
        }
        setMessages(newMessages);
    }

    
    

    return (
    <>
    <div>
        <h1>Chatting with {props.chatTC.ChatName}</h1>
    </div>
    <div>
        <ul id="chat" >{listItems}</ul>
    </div>
    <div >
        <input  value={theM} onChange={onChange} onKeyDown={handleKeyDown} placeholder="message"/> 
    </div>
    
    
    </>)
}
