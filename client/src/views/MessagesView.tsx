import { useAppContext } from "../UniContext";
import { ChatClient, ChatThreadClient, ChatThreadItem } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import ChatBox from '../components/ChatBox'
import React, {useState} from 'react'
import {getAzure} from '../shared.js'
import { rejects } from "assert";

const endpointUrl = 'https://cw2comser.communication.azure.com/'


export default function MessagesView() {
  const [userAccessToken,newToken]  = useState('');
  const [globalState,dispatch] = useAppContext();
  const [currentChat,newChat] = useState(0);
  const [chatThreads, updateChatThreads] = useState([] as ChatThreadItem[]);
  const [cClient,clientUpdate] = useState()
  React.useEffect(() => {
    setUp();
  },[])

  async function setUp(){
    getChats(new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(await getToken())));
  }
  
  async function getToken(){
    let promise = new Promise((resolve, reject) => getAzure(resolve, '/api/gettoken?', {comID:globalState.user.communicationID}));
    let x = await promise as any
    console.log("token retrieved");
    return x.token
  }

  async function getChats(cli){
    console.log("retrieving chats")
    const threads = cli.listChatThreads();
    updateChatThreads([]);
    for await (const thread of threads) {
      updateChatThreads(chatThreads.concat(thread))
    }
    clientUpdate(cli);
  }
  
  console.log("checking chatThreads")
  if(chatThreads.length != 0){
    let chatThreadClient = ((cClient as unknown)as ChatClient).getChatThreadClient(chatThreads[currentChat].id);
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
