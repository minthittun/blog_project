import React from "react";
import { Button, Avatar } from "antd";
import moment from "moment";
import { DeleteFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AuthHelper from "../helper/AuthHelper";
import api from "../helper/RestApiHelper";

const CommentItem = ({ comment, refreshCommentList }) => {
  let navigate = useNavigate();
  const formattedDate = moment(comment.createdAt).fromNow();

  const deleteComment =async ()=> {
    try {
      const response = await api.delete("comments/" + comment.id, {
        headers: { requireToken: true },
      });

      refreshCommentList(true);
      
    } catch (error) {
      
      
    }
  }

  return (
    <div className="left-right-container">
      <table>
        <tbody>
          <tr>
            <td style={{ verticalAlign: "top" }}>
              <Avatar style={{ verticalAlign: "middle" }} size="small">
              {comment.User.fullName.charAt(0)}
              </Avatar>
            </td>
            <td>&nbsp;</td>
            <td>
              <span className="text-bold">{comment.User.fullName}</span> <br />
              <span className="text-small muted-text">{formattedDate}</span>

              <p>{comment.content}</p>
            </td>
          </tr>
        </tbody>
      </table>
      {
        AuthHelper.getAuth().userId == comment.userId &&
        <Button type="primary" danger size="small" onClick={deleteComment}><DeleteFilled /></Button>
      }
    </div>
  );
};

export default CommentItem;
