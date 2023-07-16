import React from 'react';
import moment from "moment";
import { Avatar } from 'antd';


const ChatBubble = ({ message, isSentByMe }) => {

    const formattedDate = moment(message.timestamp).fromNow();

  const bubbleWrapperStyle = {
    maxWidth: '80%',
    clear: 'both',
    marginBottom: '10px',
    float: isSentByMe ? 'right' : 'left',
  };

  const bubbleStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '10px',
    backgroundColor: isSentByMe ? '#DCF8C6' : '#F3F3F3',
    color: isSentByMe ? '#000' : '#333',
  };

  return (
    <div style={bubbleWrapperStyle}>
      <div style={bubbleStyle}>
        {isSentByMe ? "" : <><Avatar size="small">{message.sender.name.charAt(0)}</Avatar> &nbsp;</>}
         {message.message}
      </div>
      {
        isSentByMe ? "" : <span className='muted-text text-small'>{formattedDate}</span>
      }
    </div>
  );
};

export default ChatBubble;
