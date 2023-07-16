import React, { useState, useEffect, useRef } from "react";
import { Input, Button, notification } from "antd";
import apiChat from "../helper/RestApiHelperChatService";
import AuthHelper from "../helper/AuthHelper";
import ChatBubble from "./ChatBubble";


const ChatMessage = ({conversation, realtimeMessage, socketInstance }) => {


  const chatContainerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);

  const [message, setMessage] = useState('');

  const showNotification = (msg) => {
    notification.open({
      message: msg.sender.name,
      description: msg.message,
      duration: 2,
    });
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let msg = {
      message: message,
      sender: {
        userId: AuthHelper.getAuth().userId
      }
    }
    

    setMessages([...messages, msg]);

    // send socket 
    socketInstance.emit('chat message', { message: message, recipient: conversation.recepient_id, sender: AuthHelper.getAuth().userId});

    setMessage('');

  };

  useEffect(() => {
    
    // Scroll to the bottom of the chat container after rendering messages
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    fetchData();
  }, [conversation]);

  useEffect(() => {
    
    if(realtimeMessage) {
      
      if(conversation.conversation_id === realtimeMessage.conversationId){
        setMessages([...messages, realtimeMessage]);
      } else {
        showNotification(realtimeMessage);
      }
      
    }

  }, [realtimeMessage]);

  async function fetchData() {
    setLoading(true);
    setError(null);

    try {
      const response = await apiChat.get(
        "conversations/messages/" + conversation.conversation_id
      );
      const data = response.data;
      setMessages(data);


    } catch (error) {
      setError("An error occurred while fetching data.");
    }

    setLoading(false);

    
  }
  

  return (
    <div className="chat-layout-right">
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <div style={{ flex: "1", overflowY: "auto", padding: 20 }} >
        
          {messages.map((message, index) =>
            message.sender.userId == AuthHelper.getAuth().userId ? (
              <ChatBubble
                isSentByMe={true}
                key={index}
                message={message}
              />
            ) : (
              <ChatBubble
                isSentByMe={false}
                key={index}
                message={message}
              />
            )
          )}

          <div style={{clear: 'both'}}></div>
          <div ref={chatContainerRef}></div>
          
        </div>
        <div style={{ flex: "0 0 auto", padding: 10, background: "#fff", borderTop: 'solid 1px #ddd' }}>
          <form onSubmit={handleSubmit} style={{ display: "flex" }}>
            <Input
              type="text"
              value={message}
              onChange={handleInputChange}
              placeholder="Type your message"
              style={{ flex: 1, marginRight: "10px" }}
            />
            <Button type="primary" htmlType="submit">
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
