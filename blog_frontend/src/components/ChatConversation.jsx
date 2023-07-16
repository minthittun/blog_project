import React, { useState, useEffect } from "react";
import { Avatar, Select, notification, Divider } from "antd";
import moment from "moment";
import apiChat from "../helper/RestApiHelperChatService";
import AuthHelper from "../helper/AuthHelper";

const { Option } = Select;

const ChatConversation = ({ selectConversation }) => {
  const [userList, setUserList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);

  const [selectedRow, setSelectedRow] = useState();

  useEffect(() => {
    fetchData();
    getUserDataList();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);

    try {
      const response = await apiChat.get(
        "conversations/all/" + AuthHelper.getAuth().userId
      );
      const data = response.data;
      setConversations(data);
    } catch (error) {
      setError("An error occurred while fetching data.");
    }

    setLoading(false);
  }

  async function getUserDataList() {
    try {
      const response = await apiChat.get("conversations/getAllUsers");
      const data = response.data;
      setUserList(data);
    } catch (error) {}
  }

  function getRecepientOnly(data) {
    const filteredData = data.filter(
      (item) => item.userId !== AuthHelper.getAuth().userId
    );
    return filteredData[0];
  }

  function getFormattedDate(d) {
    return moment(d).fromNow();
  }

  const selectConversationId = (conversation_id, recepient_id) => {
    setSelectedRow(conversation_id);
    selectConversation({
      conversation_id,
      recepient_id,
    });
  };

  const showNotification = (msg) => {
    notification.open({
      message: "Notification",
      description: msg,
      duration: 2,
    });
  };

  const handleSelectChange = async (value) => {
    try {
      const response = await apiChat.post("conversations/createConversation", {
        sender: AuthHelper.getAuth().userId,
        recipient: value,
      });
      const data = response.data;

      setConversations([]);
      fetchData();
      showNotification(
        "Successfully connected. You can start the conversation."
      );
    } catch (error) {}
  };

  return (
    <div className="chat-layout-left">
      <div style={{ padding: "10px 10px 0px 10px" }}>
        <div className="margin-default">
          <span className="text-bold text-small">Start New Chat:</span>
        </div>
        <Select
          style={{ width: "100%" }}
          onChange={handleSelectChange}
          placeholder="Select user to start new chat"
        >
          {userList.map((user) => (
            <Option key={user._id} value={user.userId}>
              {user.name}
            </Option>
          ))}
        </Select>
          <br /><br />
        <div className="margin-default">
          <span className="text-bold text-small">Conversation:</span>
        </div>
      </div>

      

      {conversations.map((conversation) => (
        <div
          key={conversation._id}
          className={
            selectedRow == conversation._id
              ? "conversation-list-item  active"
              : "conversation-list-item"
          }
          onClick={() =>
            selectConversationId(
              conversation._id,
              getRecepientOnly(conversation.participants).userId
            )
          }
        >
          <table>
            <tbody>
              <tr>
                <td
                  style={{
                    verticalAlign: "top",
                    width: 45,
                    textAlign: "center",
                    padding: "15px 5px 15px 15px",
                  }}
                >
                  <Avatar style={{ verticalAlign: "middle" }} size="large">
                    {getRecepientOnly(conversation.participants).name.charAt(0)}
                  </Avatar>
                </td>

                <td style={{ padding: "15px 15px 15px 5px" }}>
                  <div className="text-bold margin-default">
                    {getRecepientOnly(conversation.participants).name}
                  </div>

                  {conversation.recentMessage && (
                    <>
                      <span>{conversation.recentMessage.message}</span> <br />
                      <span className="muted-text text-small">
                        {getFormattedDate(conversation.recentMessage.timestamp)}
                      </span>
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ChatConversation;
