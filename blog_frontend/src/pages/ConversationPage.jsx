import { Empty } from "antd";
import React, { useState, useEffect } from "react";
import ChatConversation from "../components/ChatConversation";
import ChatMessage from "../components/ChatMessage";
import io from "socket.io-client";
import AuthHelper from "../helper/AuthHelper";
import { CHAT_SERVICE_ENDPOINT } from "../helper/RestApiHelperChatService";

function ConversationPage() {

  const [socket, setSocket] = useState();
  const [conversation, setConversation] = useState("");
  const [realtimeMessage, setRealtimeMessage] = useState(null);

  const handleSelectConversation = (data) => {
    setConversation(data);
  };

  useEffect(() => {
    
    const socket = io(CHAT_SERVICE_ENDPOINT, {
      query: {
        user_id: AuthHelper.getAuth().userId,
      }
    });

    socket.on('connect', () => {
      setSocket(socket);
    });

    socket.on('chat message', (data) => {
      
      setRealtimeMessage(data);
      
    });

    return () => {
      socket.disconnect(); // Disconnect the socket when the component unmounts
    };
  }, []);

  return (
    <div className="chat-layout-wrapper">
      
      <ChatConversation selectConversation={handleSelectConversation} />

      {conversation ? (
        <ChatMessage conversation={conversation} realtimeMessage={realtimeMessage} socketInstance={socket} />
      ) : (
        <div style={{ width: "100%" }}>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <Empty />
        </div>
      )}
    </div>
  );
}

export default ConversationPage;
