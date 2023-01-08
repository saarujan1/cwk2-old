import { useAppContext } from "../UniContext";
import { ChatClient, ChatThreadClient, ChatThreadItem } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import ChatBox from '../components/ChatBox'
import {useState} from 'react'
import {getAzure} from '../shared.js'
import { rejects } from "assert";

const endpointUrl = ''


export default function MessagesView() {
  const [userAccessToken,newToken]  = useState('');
  const [globalState,dispatch] = useAppContext();
  const [currentChat,newChat] = useState(0);
  const [chatThreads, updateChatThreads] = useState([] as ChatThreadItem[]);
  var cClient ;
  setUp()
  async function setUp(){
    newToken(await getToken());
    cClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userAccessToken));
    getChats();
  }
  
  async function getToken(){
    let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/gettoken?', {id:globalState.user.communicationID}));
    let x = await promise as any
    console.log("token retrieved");
    return x
  }

  async function getChats(){
    const threads = cClient.listChatThreads();
    updateChatThreads([]);
    for await (const thread of threads) {
      updateChatThreads(chatThreads.concat(thread))
    }
  }
  

  if(chatThreads.length != 0){
    let chatThreadClient = cClient.getChatThreadClient(chatThreads[currentChat].id);
    return (
      <ChatBox chatTC={chatThreadClient}></ChatBox>
    )
  }
  return(
    <>
    <div>
      
    </div>
    </>
  )
  
}
